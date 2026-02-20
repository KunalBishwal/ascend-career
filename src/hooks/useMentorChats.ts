import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    createChatSession,
    updateChatSession,
    deleteChatSession,
    subscribeToChatSessions,
    addChatMessage,
    getChatMessages,
    type ChatSession,
    type ChatMessage,
} from "@/integrations/firebase/firestore";
import { streamCareerMentorChat } from "@/integrations/firebase/gemini";

export interface MentorMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export const GREETING: MentorMessage = {
    id: "greeting",
    role: "assistant",
    content:
        "Hello! I'm your AI Career Mentor. I'm here to help you navigate your professional journey with personalized advice, interview preparation, and career strategy. What would you like to discuss today?",
    timestamp: new Date(),
};

function sessionTitleFromMessage(text: string): string {
    return text.trim().split(/\s+/).slice(0, 6).join(" ");
}

function firestoreToMentor(m: ChatMessage): MentorMessage {
    return { id: m.id, role: m.role, content: m.content, timestamp: m.createdAt };
}

export function useMentorChats() {
    const { user } = useAuth();
    const uid = user?.uid ?? null;

    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MentorMessage[]>([GREETING]);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionsLoading, setSessionsLoading] = useState(true);

    // Refs so async callbacks always read the latest values
    const messagesRef = useRef<MentorMessage[]>([GREETING]);
    const activeSessionIdRef = useRef<string | null>(null);
    const isLoadingRef = useRef(false);

    // Keep refs in sync
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { activeSessionIdRef.current = activeSessionId; }, [activeSessionId]);
    useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);

    // ── Subscribe to session list ──────────────────────────────────────────
    useEffect(() => {
        if (!uid) { setSessionsLoading(false); return; }
        const unsub = subscribeToChatSessions(uid, (list) => {
            setSessions(list);
            setSessionsLoading(false);
        });
        return unsub;
    }, [uid]);

    // ── Load messages when active session changes ──────────────────────────
    useEffect(() => {
        if (!uid || !activeSessionId) {
            setMessages([GREETING]);
            messagesRef.current = [GREETING];
            return;
        }
        let cancelled = false;
        setIsLoading(true);
        isLoadingRef.current = true;

        getChatMessages(uid, activeSessionId)
            .then((msgs) => {
                if (cancelled) return;
                const converted = msgs.length === 0 ? [GREETING] : msgs.map(firestoreToMentor);
                setMessages(converted);
                messagesRef.current = converted;
            })
            .catch((err) => {
                console.error("Failed to load messages:", err);
                if (!cancelled) {
                    setMessages([GREETING]);
                    messagesRef.current = [GREETING];
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setIsLoading(false);
                    isLoadingRef.current = false;
                }
            });

        return () => { cancelled = true; };
    }, [uid, activeSessionId]);

    // ── Start a fresh chat ─────────────────────────────────────────────────
    const startNewChat = useCallback(() => {
        setActiveSessionId(null);
        activeSessionIdRef.current = null;
        setMessages([GREETING]);
        messagesRef.current = [GREETING];
        setIsLoading(false);
        isLoadingRef.current = false;
    }, []);

    // ── Load a past session ────────────────────────────────────────────────
    const loadSession = useCallback((id: string) => {
        if (id === activeSessionIdRef.current) return;
        setActiveSessionId(id);
        activeSessionIdRef.current = id;
    }, []);

    // ── Delete a session ───────────────────────────────────────────────────
    const deleteSession = useCallback(async (id: string) => {
        if (!uid) return;
        try {
            await deleteChatSession(uid, id);
        } catch (err) {
            console.error("Failed to delete session:", err);
        }
        if (activeSessionIdRef.current === id) {
            startNewChat();
        }
    }, [uid, startNewChat]);

    // ── Send a message ─────────────────────────────────────────────────────
    const sendMessage = useCallback(async (text: string) => {
        if (!uid || !text.trim() || isLoadingRef.current) return;

        const userMsg: MentorMessage = {
            id: `u-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        // Build history BEFORE adding the new user message
        const priorHistory = messagesRef.current
            .filter((m) => m.id !== "greeting")
            .map((m) => ({ role: m.role as string, content: m.content }));

        // Full conversation for Gemini (prior + this new user turn)
        const historyForGemini = [...priorHistory, { role: "user", content: text }];

        // Optimistic UI — add user message
        const newMessages = [...messagesRef.current, userMsg];
        setMessages(newMessages);
        messagesRef.current = newMessages;
        setIsLoading(true);
        isLoadingRef.current = true;

        // ── Ensure a Firestore session exists ────────────────────────────────
        let sessionId = activeSessionIdRef.current;
        // Track whether this sendMessage created a brand-new session
        let newSessionCreated = false;
        try {
            if (!sessionId) {
                const title = sessionTitleFromMessage(text);
                sessionId = await createChatSession(uid, title);
                // ONLY update the ref now — do NOT call setActiveSessionId yet.
                // Calling setState here would trigger the load-messages useEffect
                // which wipes our streaming placeholder before the AI finishes.
                activeSessionIdRef.current = sessionId;
                newSessionCreated = true;
            }
            // Persist user message
            await addChatMessage(uid, sessionId, "user", text);
        } catch (err) {
            console.error("Firestore write error:", err);
            // Non-fatal: continue to get AI response even if Firestore fails
        }

        // ── Add empty assistant placeholder ──────────────────────────────────
        const assistantMsgId = `a-${Date.now()}`;
        const withPlaceholder = [
            ...messagesRef.current,
            { id: assistantMsgId, role: "assistant" as const, content: "", timestamp: new Date() },
        ];
        setMessages(withPlaceholder);
        messagesRef.current = withPlaceholder;

        let fullContent = "";
        const currentSessionId = sessionId; // capture for closure

        try {
            streamCareerMentorChat(
                historyForGemini,
                // onChunk
                (chunk: string) => {
                    fullContent += chunk;
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMsgId ? { ...m, content: fullContent } : m
                        )
                    );
                },
                // onDone — MUST be synchronous; do Firestore writes in background
                () => {
                    // Update the ref with final content
                    setMessages((prev) => {
                        const updated = prev.map((m) =>
                            m.id === assistantMsgId ? { ...m, content: fullContent } : m
                        );
                        messagesRef.current = updated;
                        return updated;
                    });
                    setIsLoading(false);
                    isLoadingRef.current = false;

                    // NOW it's safe to sync activeSessionId state — stream is done,
                    // so the load-messages effect won't clobber anything.
                    if (newSessionCreated && currentSessionId) {
                        setActiveSessionId(currentSessionId);
                    }

                    // Persist assistant response to Firestore (fire-and-forget)
                    if (currentSessionId && fullContent) {
                        addChatMessage(uid!, currentSessionId, "assistant", fullContent).catch((e) =>
                            console.error("Failed to save assistant msg:", e)
                        );
                        updateChatSession(uid!, currentSessionId, {}).catch(() => { });
                    }
                },
                // onError
                (error: Error) => {
                    console.error("Mentor stream error:", error);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantMsgId
                                ? { ...m, content: "Sorry, I couldn't generate a response. Please try again." }
                                : m
                        )
                    );
                    setIsLoading(false);
                    isLoadingRef.current = false;
                }
            );
        } catch (err) {
            // Catch sync errors from streamCareerMentorChat itself (e.g. missing API key)
            console.error("Stream init error:", err);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantMsgId
                        ? { ...m, content: "Sorry, I couldn't connect to the AI. Please check your API key." }
                        : m
                )
            );
            setIsLoading(false);
            isLoadingRef.current = false;
        }
    }, [uid]);

    return {
        sessions,
        sessionsLoading,
        activeSessionId,
        messages,
        isLoading,
        startNewChat,
        loadSession,
        deleteSession,
        sendMessage,
    };
}
