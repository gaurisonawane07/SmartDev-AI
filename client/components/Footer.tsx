"use client";

import { Bot } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border/50 px-6 py-12">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <span className="font-semibold text-foreground">SmartDev AI</span>
                    <span>&copy; {new Date().getFullYear()}</span>
                </div>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-foreground">Terms</a>
                    <a href="#" className="hover:text-foreground">Privacy</a>
                    <a href="#" className="hover:text-foreground">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
