"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
    Send,
    Bot,
    User,
    Loader2,
    Plus,
    Save,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/services/aiService";
import { noteService } from "@/lib/services/noteService";
import { useSearchParams, useRouter } from "next/navigation";

// External Components
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const initialMessages = [
    { role: "assistant", content: "Hello! I'm your AI Assistant. How can I help you with your code today?" },
];

function ChatInterface() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const urlConversationId = searchParams.get("id");

    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync with URL ID
    useEffect(() => {
        if (urlConversationId && urlConversationId !== conversationId) {
            handleLoadConversation(urlConversationId);
        } else if (!urlConversationId) {
            handleNewChat();
        }
    }, [urlConversationId]);

    // Auto scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleLoadConversation = async (id: string) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await aiService.getConversation(id);
            if (res.success) {
                setMessages(res.data.messages);
                setConversationId(id);
            }
        } catch (error) {
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

        const userMessage = input.trim();
        const updatedMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            const response = await aiService.sendMessage(userMessage, conversationId || undefined);

            if (response.success) {
                setMessages(prev => [...prev, {
                    role: "assistant",
                    content: response.data
                }]);
                
                if (!conversationId && response.conversationId) {
                    setConversationId(response.conversationId);
                    router.push(`/dashboard/ai?id=${response.conversationId}`);
                }
            }
        } catch (error: any) {
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "Sorry, I encountered an error. " + (error.message || "Please try again later.")
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

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] overflow-hidden bg-black text-white rounded-3xl md:m-4 border border-white/5">
            {/* AI Assistant (Chat) */}
            <div className="flex flex-1 flex-col relative z-10 glass-bg">
                {/* Minimal Header */}
                <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 md:h-9 md:w-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-lg shadow-primary/10">
                            <Bot className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <h1 className="text-[10px] md:text-sm font-black uppercase tracking-widest italic tracking-tighter">AI Assistant</h1>
                    </div>
                    <button
                        onClick={handleNewChat}
                        className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all group"
                        title="New Session"
                    >
                        <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 group-hover:rotate-90 transition-transform" />
                    </button>
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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full gap-3 md:gap-4",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                <div className={cn(
                                    "flex h-7 w-7 md:h-8 md:w-8 shrink-0 items-center justify-center rounded-lg border",
                                    msg.role === "user" 
                                        ? "bg-white/5 border-white/10 text-white/40" 
                                        : "bg-primary/20 border-primary/40 text-primary"
                                )}>
                                    {msg.role === "user" ? <User className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Bot className="h-3.5 w-3.5 md:h-4 md:w-4" />}
                                </div>

                                <div className={cn(
                                    "flex flex-col gap-1.5 max-w-[90%] md:max-w-[85%]",
                                    msg.role === "user" ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "text-[13px] md:text-[14px] leading-relaxed text-white/90 font-medium",
                                        msg.role === "user" ? "text-right" : "text-left"
                                    )}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-code:text-primary prose-sm md:prose-base">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            const codeValue = String(children).replace(/\n$/, "");
                                                            
                                                            if (!inline && match) {
                                                                return (
                                                                    <div className="group/code relative my-4 rounded-xl overflow-hidden border border-white/10 bg-[#0D0D0D]">
                                                                        <div className="flex items-center justify-between px-3 md:px-4 py-1.5 md:py-2 bg-white/5 border-b border-white/5">
                                                                            <span className="text-[8px] md:text-[9px] font-black uppercase text-primary/80 tracking-widest">{match[1]}</span>
                                                                        </div>
                                                                        <div className="p-3 md:p-4 overflow-x-auto text-[11px] md:text-[13px] font-mono opacity-80 whitespace-pre">
                                                                            {codeValue}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }
                                                            return (
                                                                <code className={cn("bg-white/5 text-primary px-1.5 py-0.5 rounded font-mono text-[12px] md:text-[13px]", className)} {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        p: ({ children }) => <p className="mb-3 md:mb-4 last:mb-0 opacity-80">{children}</p>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>
                                                
                                                <div className="mt-3 md:mt-4 flex items-center gap-3 pt-3 md:pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => handleSaveAsNote(msg.content)}
                                                        className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-primary transition-colors flex items-center gap-1.5"
                                                    >
                                                        <Save className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                                        Save To Notes
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[7px] md:text-[8px] font-black text-white/10 uppercase tracking-widest">
                                        {mounted && new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                <div className="p-3 md:p-4 bg-black/40 backdrop-blur-md border-t border-white/5">
                    <div className="relative flex items-end gap-2 md:gap-3 rounded-2xl bg-white/5 p-1.5 md:p-2 transition-all border border-transparent focus-within:border-primary/20">
                        <textarea
                            rows={1}
                            placeholder="Ask or code anything..."
                            className="flex-1 bg-transparent py-2 md:py-3 px-3 md:px-4 text-[12px] md:text-[13px] text-white focus:outline-none resize-none max-h-32 custom-scrollbar font-medium placeholder:text-white/20"
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
                                "flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl transition-all shadow-xl",
                                input.trim() && !loading
                                    ? "bg-primary text-white shadow-primary/20"
                                    : "bg-white/5 text-white/10 cursor-not-allowed"
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
