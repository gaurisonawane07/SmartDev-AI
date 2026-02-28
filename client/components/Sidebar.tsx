"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Zap,
    ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "My Notes", href: "/dashboard/notes" },
    { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/ai" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const res = await api.getProfile();
                    setUser(res.user);
                } else {
                    router.push("/login");
                }
            } catch (error: any) {
                console.error("Sidebar user fetch error:", error);
                if (error.message.includes("401")) {
                    localStorage.removeItem("token");
                    router.push("/login");
                }
            }
        };
        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };


    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl transition-transform">
            <div className="flex h-full flex-col px-4 py-6">
                {/* Brand */}
                <div className="mb-8 flex items-center gap-3 px-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary glow-primary">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">SmartDev <span className="text-primary">AI</span></span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-secondary hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-white")} />
                                {item.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="mt-auto border-t border-border pt-6">
                    <div className="mb-4 flex items-center gap-3 px-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500" />
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-sm font-medium text-white">{user?.name || "Developer User"}</span>
                            <span className="truncate text-xs text-muted-foreground">{user?.email || "dev@smartdev.ai"}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    );
};
