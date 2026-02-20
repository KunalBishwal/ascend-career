import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, Loader2, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientText } from "@/components/ui/gradient-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "What skills should I learn next?",
  "How can I prepare for a tech lead interview?",
  "What's the best career path for a frontend developer?",
  "Review my career progression plan",
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI Career Mentor. I'm here to help you navigate your professional journey with personalized advice, interview preparation, and career strategy. What would you like to discuss today?",
    timestamp: new Date(),
  },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-mentor`;

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessages: { role: string; content: string }[]) => {
    setIsLoading(true);
    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: userMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to get response: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add initial assistant message
      const assistantId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: new Date() },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: assistantContent } : m
                )
              );
            }
          } catch {
            /* ignore partial leftovers */
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get response";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `I'm sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Build message history for API (excluding the initial greeting)
    const apiMessages = [...messages.slice(1), userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    await streamChat(apiMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages(initialMessages);
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold">
                  <GradientText>AI Career Mentor</GradientText>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Powered by Gemini AI
                </p>
              </div>
            </div>
            <AnimatedButton variant="ghost" size="sm" onClick={resetChat}>
              <RefreshCw className="w-4 h-4 mr-2" />
              New Chat
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Chat Container */}
        <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-accent-foreground"
                        : "bg-accent"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-primary-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-sm leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && messages[messages.length - 1]?.content === "" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-accent rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-4">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="px-3 py-1.5 rounded-full bg-accent hover:bg-accent/80 text-sm transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your career..."
                  className="w-full min-h-[48px] max-h-32 px-4 py-3 rounded-xl bg-accent/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  rows={1}
                />
              </div>
              <AnimatedButton
                variant="hero"
                size="icon"
                className="w-12 h-12 rounded-xl"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="w-5 h-5" />
              </AnimatedButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
