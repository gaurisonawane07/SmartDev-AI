"use client";

import { Bot } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary p-1.5 glow-primary">
                        <Bot className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">SmartDev AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Sign In
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:glow-primary"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
