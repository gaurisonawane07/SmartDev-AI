"use client";

import { Bot } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border/20 px-6 py-12 bg-black/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground text-xs md:text-sm font-medium">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-2 text-white">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="font-bold tracking-tight">SmartDev AI</span>
                    </div>
                    <span className="opacity-40">&copy; {new Date().getFullYear()} • Platform v1.0</span>
                </div>
                <div className="flex gap-8 uppercase tracking-widest text-[10px]">
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
