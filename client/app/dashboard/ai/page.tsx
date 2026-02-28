"use client";

import React, { useState } from "react";
import {
    Send,
    Bot,
    User,
    Sparkles,
    Code,
    Terminal,
    Eraser
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const initialMessages = [
    { role: "assistant", content: "Hello! I'm your SmartDev AI Assistant. How can I help you optimize your code today?" },
];

export default function AIChatPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I've analyzed your request. To implement that efficiently in Next.js, I recommend using React Server Components for the data fetching layer."
            }]);
        }, 1000);
    };

    return (
        <div className="flex h-[calc(100vh-2rem)] flex-col p-8">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary glow-primary">
                        <Bot className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">SmartDev Assistant</h1>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-emerald-500" /> Online • Powered by SmartDev Logic
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setMessages(initialMessages)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-white transition-colors"
                >
                    <Eraser className="h-5 w-5" />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6 custom-scrollbar px-2">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                                "flex max-w-[80%] flex-col gap-2",
                                msg.role === "user" ? "ml-auto items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                msg.role === "user"
                                    ? "bg-primary text-white shadow-lg shadow-primary/10"
                                    : "bg-muted/30 border border-border text-white"
                            )}>
                                {msg.content}
                            </div>
                            <span className="text-[10px] text-muted-foreground px-1">
                                {msg.role === "user" ? "You" : "SmartDev AI"} • Just now
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="relative">
                <div className="glass-card rounded-2xl p-2 flex items-end gap-2 border border-border focus-within:border-primary/50 transition-colors">
                    <button className="p-3 text-muted-foreground hover:text-primary transition-colors">
                        <Code className="h-5 w-5" />
                    </button>
                    <textarea
                        rows={1}
                        placeholder="Ask anything about your code..."
                        className="flex-1 bg-transparent py-3 text-sm text-white focus:outline-none resize-none max-h-32"
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
                        disabled={!input.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-primary/90 glow-primary disabled:opacity-50 disabled:glow-none"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                <p className="mt-2 text-center text-[10px] text-muted-foreground">
                    SmartDev AI can make mistakes. Verify important code before deploying.
                </p>
            </div>
        </div>
    );
}
