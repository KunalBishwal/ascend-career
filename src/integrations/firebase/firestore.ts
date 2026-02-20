import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    type DocumentData,
    type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";

// ─── User Profile ──────────────────────────────────────────────────────────

export async function getUserProfile(userId: string) {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
}

export async function createUserProfile(userId: string, data: DocumentData) {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateUserProfile(userId: string, data: DocumentData) {
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

// ─── Resume Analysis ───────────────────────────────────────────────────────

export async function saveResumeAnalysis(userId: string, analysis: DocumentData) {
    const docRef = doc(collection(db, "users", userId, "resumeAnalyses"));
    await setDoc(docRef, { ...analysis, createdAt: serverTimestamp() });
    return docRef.id;
}

export async function getResumeAnalyses(userId: string) {
    const q = collection(db, "users", userId, "resumeAnalyses");
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── AI Mentor Chat History ────────────────────────────────────────────────

export interface ChatSession {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    messageCount: number;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    createdAt: Date;
}

/** Create a new blank chat session and return its id */
export async function createChatSession(userId: string, title: string): Promise<string> {
    const ref = await addDoc(collection(db, "users", userId, "mentorChats"), {
        title,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messageCount: 0,
    });
    return ref.id;
}

/** Update the session's title / updatedAt / messageCount */
export async function updateChatSession(
    userId: string,
    chatId: string,
    data: Partial<{ title: string; messageCount: number }>
) {
    const ref = doc(db, "users", userId, "mentorChats", chatId);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

/** Delete a session and ALL its messages */
export async function deleteChatSession(userId: string, chatId: string) {
    const msgSnap = await getDocs(
        collection(db, "users", userId, "mentorChats", chatId, "messages")
    );
    await Promise.all(msgSnap.docs.map((d) => deleteDoc(d.ref)));
    await deleteDoc(doc(db, "users", userId, "mentorChats", chatId));
}

/** Real-time listener for all sessions, ordered newest first */
export function subscribeToChatSessions(
    userId: string,
    callback: (sessions: ChatSession[]) => void
): Unsubscribe {
    const q = query(
        collection(db, "users", userId, "mentorChats"),
        orderBy("updatedAt", "desc")
    );
    return onSnapshot(q, (snap) => {
        const sessions: ChatSession[] = snap.docs.map((d) => {
            const data = d.data();
            return {
                id: d.id,
                title: data.title ?? "Untitled Chat",
                createdAt: data.createdAt?.toDate() ?? new Date(),
                updatedAt: data.updatedAt?.toDate() ?? new Date(),
                messageCount: data.messageCount ?? 0,
            };
        });
        callback(sessions);
    });
}

/** Add a message to a session and bump the session's updatedAt */
export async function addChatMessage(
    userId: string,
    chatId: string,
    role: "user" | "assistant",
    content: string
): Promise<string> {
    const ref = await addDoc(
        collection(db, "users", userId, "mentorChats", chatId, "messages"),
        { role, content, createdAt: serverTimestamp() }
    );
    // bump updatedAt on the session (fire-and-forget)
    updateDoc(doc(db, "users", userId, "mentorChats", chatId), {
        updatedAt: serverTimestamp(),
    }).catch(() => { });
    return ref.id;
}

/** Load all messages for a session, ordered by createdAt ascending */
export async function getChatMessages(userId: string, chatId: string): Promise<ChatMessage[]> {
    const q = query(
        collection(db, "users", userId, "mentorChats", chatId, "messages"),
        orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            role: data.role,
            content: data.content,
            createdAt: data.createdAt?.toDate() ?? new Date(),
        };
    });
}
