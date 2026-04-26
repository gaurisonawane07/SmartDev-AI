"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
    Send,
    Bot,
    User,
    Loader2,
    Plus,
    Save,
    ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/services/aiService";
import { noteService } from "@/lib/services/noteService";
import { clearAuthToken, getAuthToken } from "@/lib/authToken";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// External Components
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MessageSource = {
    noteId: string;
    chunkIndex: number;
    score: number;
    preview: string;
};

type ChatMessage = {
    role: "assistant" | "user" | "system";
    content: string;
    sources?: MessageSource[];
};

const initialMessages = [
    { role: "assistant", content: "Hello! I'm your AI Assistant. How can I help you with your code today?" },
] as ChatMessage[];

function ChatInterface() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlConversationId = searchParams.get("id");

    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const assistantMessageRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const shouldScrollToAnswerStartRef = useRef(false);
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme !== "light";

    // Sync with URL ID
    useEffect(() => {
        if (urlConversationId && urlConversationId !== conversationId) {
            handleLoadConversation(urlConversationId);
        } else if (!urlConversationId) {
            handleNewChat();
        }
    }, [urlConversationId]);

    // Keep the top of the new assistant answer in view instead of jumping to the end.
    useEffect(() => {
        if (!shouldScrollToAnswerStartRef.current) return;

        let lastAssistantIndex = -1;
        for (let i = messages.length - 1; i >= 0; i -= 1) {
            if (messages[i].role === "assistant") {
                lastAssistantIndex = i;
                break;
            }
        }

        if (lastAssistantIndex === -1) return;

        const container = scrollRef.current;
        const targetMessage = assistantMessageRefs.current[lastAssistantIndex];

        if (container && targetMessage) {
            const topOffset = targetMessage.offsetTop - container.offsetTop;
            container.scrollTo({
                top: Math.max(0, topOffset - 12),
                behavior: "smooth",
            });
            shouldScrollToAnswerStartRef.current = false;
        }
    }, [messages]);

    const handleLoadConversation = async (id: string) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await aiService.getConversation(id);
            if (res.success) {
                setMessages(res.data.messages);
                setConversationId(id);
            }
        } catch (error: any) {
            if (error?.status === 401 || error?.message?.toLowerCase().includes("not authorized")) {
                clearAuthToken();
                router.push("/login");
                return;
            }
            console.error("Failed to load conversation:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = () => {
        setMessages(initialMessages);
        setConversationId(null);
        setInput("");
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const token = getAuthToken();
        if (!token) {
            clearAuthToken();
            router.push("/login");
            return;
        }

        const userMessage = input.trim();
        const userChatMessage: ChatMessage = { role: "user", content: userMessage };
        const updatedMessages = [...messages, userChatMessage];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        shouldScrollToAnswerStartRef.current = true;

        try {
            const response = await aiService.sendMessage(userMessage, conversationId || undefined);

            if (response.success) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: response.data,
                    sources: response.sources || [],
                }]);

                if (!conversationId && response.conversationId) {
                    setConversationId(response.conversationId);
                    router.push(`/dashboard/ai?id=${response.conversationId}`);
                }
            }
        } catch (error: any) {
            if (error?.status === 401 || error?.message?.toLowerCase().includes("not authorized")) {
                clearAuthToken();
                router.push("/login");
                return;
            }

            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I encountered an error. " + (error.message || "Please try again later."),
                sources: [],
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAsNote = (content: string) => {
        try {
            noteService.create({
                title: "AI Snippet: " + new Date().toLocaleDateString(),
                content: content
            });
            alert("Successfully saved to your dev notes!");
        } catch (error) {
            alert("Failed to save snippet.");
        }
    };

    if (!resolvedTheme) return null;

    return (
        <div className={cn(
            "flex h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] overflow-hidden rounded-3xl md:m-4 border transition-colors duration-500",
            isDarkMode ? "bg-black text-white border-white/5" : "bg-background text-foreground border-border"
        )}>
            {/* AI Assistant (Chat) */}
            <div className="flex flex-1 flex-col relative z-10 bg-transparent">
                {/* Minimal Header */}
                <header className={cn(
                    "flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b shrink-0 backdrop-blur-md transition-colors",
                    isDarkMode ? "bg-black/80 border-white/5" : "bg-background/80 border-border"
                )}>
                    <div className="flex items-center gap-3">
                        <img 
                            src="/logo.png" 
                            alt="SmartDev AI Logo" 
                            className="h-20 w-auto object-contain"
                        />
                        <h1 className="text-[10px] md:text-sm font-black uppercase italic tracking-tighter">AI Help</h1>
                    </div>
                    
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handleNewChat}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all",
                                isDarkMode ? "bg-white/5 text-white/50 hover:text-white" : "bg-slate-50 text-slate-500 hover:text-foreground"
                            )}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">New Chat</span>
                        </button>
                    </div>
                </header>

                {/* Messages Panel */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-6 md:space-y-8 p-4 md:p-6 custom-scrollbar"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                ref={(el) => {
                                    if (msg.role === "assistant") {
                                        assistantMessageRefs.current[i] = el;
                                    }
                                }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full gap-3 md:gap-4",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                                    msg.role === "user"
                                        ? (isDarkMode ? "bg-white/5 border-white/10 text-white/20" : "bg-slate-50 border-slate-200 text-slate-400")
                                        : "bg-primary/10 border-primary/20 text-primary"
                                )}>
                                    {msg.role === "user" ? <User className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <img src="/logo.png" alt="AI" className="h-4 w-4 object-contain" />}
                                </div>

                                <div className={cn(
                                    "flex flex-col gap-1.5 max-w-[90%] md:max-w-[85%]",
                                    msg.role === "user" ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "text-[13px] md:text-[14px] leading-relaxed font-medium p-4 rounded-2xl transition-all",
                                        msg.role === "user" 
                                            ? (isDarkMode ? "bg-white/5 text-white/70 rounded-tr-none border border-white/5" : "bg-slate-50 text-slate-700 rounded-tr-none border border-slate-200") 
                                            : (isDarkMode ? "bg-[#111111] text-white/90 rounded-tl-none border border-white/5 shadow-2xl" : "bg-white text-foreground rounded-tl-none border border-border shadow-sm shadow-black/5")
                                    )}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <div className={cn(
                                                "prose max-w-none prose-p:leading-relaxed prose-code:text-primary prose-sm md:prose-base font-medium",
                                                isDarkMode ? "prose-invert" : "prose-slate"
                                            )}>
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            const codeValue = String(children).replace(/\n$/, "");

                                                            if (!inline && match) {
                                                                return (
                                                                    <div className={cn(
                                                                        "group/code relative my-4 rounded-xl overflow-hidden border transition-colors",
                                                                        isDarkMode ? "bg-black border-white/5" : "bg-[#0D0D0D] border-border"
                                                                    )}>
                                                                        <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border-b border-white/5">
                                                                            <span className="text-[8px] md:text-[9px] font-black uppercase text-primary tracking-widest">{match[1]}</span>
                                                                        </div>
                                                                        <div className="p-3 md:p-4 overflow-x-auto text-[11px] md:text-[13px] font-mono text-white/80 whitespace-pre">
                                                                            {codeValue}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <code className={cn("bg-primary/5 text-primary px-1.5 py-0.5 rounded font-mono text-[12px] md:text-[13px]", className)} {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        p: ({ children }) => <p className={cn("mb-3 md:mb-4 last:mb-0", isDarkMode ? "text-white/70" : "text-foreground/80")}>{children}</p>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>

                                                <div className={cn("mt-3 md:mt-4 flex items-center gap-3 pt-3 md:pt-4 border-t", isDarkMode ? "border-white/5" : "border-border")}>
                                                    <button
                                                        onClick={() => handleSaveAsNote(msg.content)}
                                                        className={cn(
                                                            "text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5",
                                                            isDarkMode ? "text-white/20 hover:text-primary" : "text-muted-foreground hover:text-primary"
                                                        )}
                                                    >
                                                        <Save className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                        Save To Notes
                                                    </button>
                                                </div>

                                                {!!msg.sources?.length && (
                                                    <div className={cn(
                                                        "mt-3 rounded-lg border p-2.5 md:p-3 transition-colors",
                                                        isDarkMode ? "bg-white/2 border-white/5" : "bg-slate-50/50 border-border"
                                                    )}>
                                                        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-primary mb-2">
                                                            Found Info
                                                        </p>
                                                        <div className="space-y-1.5">
                                                            {msg.sources.map((source, sourceIndex) => (
                                                                <div
                                                                    key={`${source.noteId}-${source.chunkIndex}-${sourceIndex}`}
                                                                    className={cn(
                                                                        "rounded-md border px-2 py-1.5 shadow-sm transition-colors",
                                                                        isDarkMode ? "bg-black border-white/5" : "bg-white border-border"
                                                                    )}
                                                                >
                                                                    <p className={cn(
                                                                        "text-[9px] md:text-[10px] font-semibold uppercase",
                                                                        isDarkMode ? "text-white/40" : "text-foreground/70"
                                                                    )}>
                                                                        Reference {sourceIndex + 1}
                                                                    </p>
                                                                    <p className={cn(
                                                                        "text-[10px] md:text-[11px] line-clamp-2",
                                                                        isDarkMode ? "text-white/20" : "text-muted-foreground"
                                                                    )}>
                                                                        {source.preview}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[7px] md:text-[8px] font-black uppercase tracking-widest px-1",
                                        isDarkMode ? "text-white/10" : "text-slate-300"
                                    )}>
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-3 md:gap-4"
                            >
                                <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
                                </div>
                                <div className="flex items-center gap-2 h-7 md:h-8">
                                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary animate-pulse italic">Thinking...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input Area */}
                <div className={cn("p-3 md:p-4 border-t transition-colors", isDarkMode ? "bg-black border-white/5" : "bg-background border-border")}>
                    <div className={cn(
                        "relative flex items-end gap-2 md:gap-3 rounded-2xl p-1.5 md:p-2 transition-all border",
                        isDarkMode 
                            ? "bg-white/2 border-white/5 focus-within:border-primary/40 focus-within:bg-white/4" 
                            : "bg-slate-50 border-border focus-within:border-primary focus-within:bg-white focus-within:shadow-xl focus-within:shadow-primary/5"
                    )}>
                        <textarea
                            rows={1}
                            placeholder="Type your message or code here..."
                            className={cn(
                                "flex-1 bg-transparent py-2 md:py-3 px-3 md:px-4 text-[12px] md:text-[13px] focus:outline-none resize-none max-h-32 custom-scrollbar font-medium transition-colors",
                                isDarkMode ? "text-white placeholder:text-white/10" : "text-foreground placeholder:text-muted-foreground/40"
                            )}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className={cn(
                                "flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl transition-all",
                                input.trim() && !loading
                                    ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95"
                                    : (isDarkMode ? "bg-white/5 text-white/10" : "bg-slate-200 text-slate-400 cursor-not-allowed")
                            )}
                        >
                            <Send className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AIChatPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <ChatInterface />
        </Suspense>
    );
}
