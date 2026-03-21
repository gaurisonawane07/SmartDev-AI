"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import {
    Send,
    Bot,
    User,
    Code,
    Loader2,
    Plus,
    Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { aiService } from "@/lib/services/aiService";
import { noteService } from "@/lib/services/noteService";
import { useSearchParams, useRouter } from "next/navigation";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

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
    const scrollRef = useRef<HTMLDivElement>(null);

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

    const handleSaveAsNote = async (content: string) => {
        try {
            await noteService.create({
                title: "AI Snippet: " + new Date().toLocaleDateString(),
                content: content
            });
            alert("Successfully saved to your technical vault!");
        } catch (error) {
            alert("Failed to save snippet.");
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-black">
            <main className="flex flex-1 flex-col p-6 min-w-0 relative">
                {/* Simplified Header */}
                <header className="mb-8 flex items-center justify-between px-4 py-3 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white tracking-tight">AI Assistant</h1>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]" />
                                <p className="text-[10px] font-medium text-emerald-500/80 uppercase tracking-widest">Online</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/dashboard/ai")}
                        className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        New Chat
                    </button>
                </header>

                {/* Messages Panel - No Cards, just text on black */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-12 pr-4 mb-6 custom-scrollbar px-6 relative z-10"
                >
                    <AnimatePresence initial={false}>
                        {messages.map((msg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={cn(
                                    "flex w-full gap-5",
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {/* Avatar */}
                                <div className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                                    msg.role === "user" 
                                        ? "bg-white/5 border-white/10 text-white" 
                                        : "bg-primary/10 border-primary/20 text-primary"
                                )}>
                                    {msg.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                </div>

                                {/* Content area - No card box */}
                                <div className={cn(
                                    "flex flex-col gap-2 max-w-[80%]",
                                    msg.role === "user" ? "items-end" : "items-start"
                                )}>
                                    <div className={cn(
                                        "text-[15px] leading-relaxed text-white/90 font-medium",
                                        msg.role === "user" ? "text-right" : "text-left"
                                    )}>
                                        {msg.role === "user" ? (
                                            msg.content
                                        ) : (
                                            <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-code:text-primary prose-strong:text-white">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        code({ node, inline, className, children, ...props }: any) {
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            return !inline && match ? (
                                                                <div className="relative group/code my-6">
                                                                    <div className="absolute right-3 top-3 z-20 opacity-0 group-hover/code:opacity-100 transition-opacity">
                                                                        <button
                                                                            onClick={() => navigator.clipboard.writeText(String(children))}
                                                                            className="p-2 rounded-lg bg-white/5 hover:bg-primary text-white transition-all border border-white/10 active:scale-90"
                                                                        >
                                                                            <Code className="h-3.5 w-3.5" />
                                                                        </button>
                                                                    </div>
                                                                    <SyntaxHighlighter
                                                                        style={atomDark}
                                                                        language={match[1]}
                                                                        PreTag="div"
                                                                        {...props}
                                                                        customStyle={{
                                                                            margin: 0,
                                                                            background: "#0D0D0D",
                                                                            padding: "1.5rem",
                                                                            borderRadius: "1rem",
                                                                            border: "1px solid rgba(255,255,255,0.05)",
                                                                            fontSize: "13px",
                                                                            lineHeight: "1.6"
                                                                        }}
                                                                    >
                                                                        {String(children).replace(/\n$/, "")}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            ) : (
                                                                <code className={cn("bg-white/5 text-primary px-1.5 py-0.5 rounded font-mono text-[13px]", className)} {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        p: ({ children }) => <p className="mb-4 last:mb-0 opacity-90">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc ml-6 mb-4 space-y-2 opacity-90">{children}</ul>,
                                                    }}
                                                >
                                                    {msg.content}
                                                </ReactMarkdown>

                                                <div className="mt-4 flex items-center gap-3 pt-4 border-t border-white/5">
                                                    <button
                                                        onClick={() => handleSaveAsNote(msg.content)}
                                                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:text-white transition-colors"
                                                    >
                                                        <Save className="h-3.5 w-3.5" />
                                                        Save to Notes
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-start gap-5"
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                                <div className="flex items-center gap-2 h-9 p-0">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse italic">Processing...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Slim Input Hub */}
                <div className="relative z-10 px-6 pb-6 mt-auto">
                    <div className="bg-[#0D0D0D] rounded-2xl flex items-center gap-3 border border-white/5 focus-within:border-primary/30 transition-all shadow-2xl relative p-2 pr-3">
                        <textarea
                            rows={1}
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent py-3 px-4 text-[14px] text-white focus:outline-none resize-none max-h-40 custom-scrollbar leading-relaxed placeholder:text-white/20 font-medium"
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
                                "flex h-10 w-10 items-center justify-center rounded-xl transition-all active:scale-95 shadow-lg",
                                input.trim() && !loading
                                    ? "bg-primary text-white"
                                    : "bg-white/5 text-white/10 cursor-not-allowed"
                            )}
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </main>
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
