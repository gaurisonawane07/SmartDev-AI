"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    Zap,
    History,
    MoreVertical,
    Trash2,
    Search,
    Plus,
    Loader2,
    Terminal,
    X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { userService } from "@/lib/services/userService";
import { aiService } from "@/lib/services/aiService";
import { clearAuthToken, getAuthToken } from "@/lib/authToken";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: FileText, label: "My Notes", href: "/dashboard/notes" },
    { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/ai" },
    { icon: Terminal, label: "Playground", href: "/dashboard/playground" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];


export const Sidebar = ({
    width,
    onResizeStart,
    isOpen,
    setIsOpen
}: {
    width: number;
    onResizeStart: () => void;
    isOpen?: boolean;
    setIsOpen?: (val: boolean) => void;
}) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConvId = searchParams.get("id");

    const [user, setUser] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [menuOpen, setMenuOpen] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const token = getAuthToken();

        if (!token) {
            setHistoryLoading(false);
            router.push("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await userService.getProfile();
                setUser(res.user);
            } catch (error: any) {
                if (error?.status === 401 || error?.message?.toLowerCase().includes("not authorized")) {
                    clearAuthToken();
                    router.push("/login");
                    return;
                }
                console.error("Sidebar user fetch error:", error);
            }
        };

        const fetchChatHistory = async () => {
            try {
                const res = await aiService.getHistory();
                if (res.success) {
                    setHistory(res.data);
                }
            } catch (error: any) {
                if (error?.status === 401 || error?.message?.toLowerCase().includes("not authorized")) {
                    clearAuthToken();
                    router.push("/login");
                    return;
                }
                console.error("Sidebar history fetch error:", error);
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchUser();
        fetchChatHistory();
    }, [router]);

    const handleLogout = () => {
        clearAuthToken();
        router.push("/login");
    };

    const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(null);
        if (!confirm("Permanently delete this technical log?")) return;

        try {
            const res = await aiService.deleteConversation(id);
            if (res.success) {
                setHistory(prev => prev.filter(item => item._id !== id));
                if (activeConvId === id) {
                    router.push("/dashboard/ai");
                }
            }
        } catch (error) {
            console.error("Delete chat error:", error);
            alert("Could not delete log.");
        }
    };

    const filteredHistory = history.filter(chat =>
        (chat.title || "Technical Session").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentPath = mounted ? pathname : "";
    const currentConversationId = mounted ? activeConvId : null;

    return (
        <aside
            className="h-screen border-r border-border bg-background transition-all overflow-hidden shadow-2xl md:shadow-none"
            style={{ width }}
        >
            {/* Resize Handle */}
            <div
                className="absolute right-0 top-0 hidden h-full w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-50 md:block"
                onMouseDown={onResizeStart}
            />
            <div className="flex h-full flex-col px-4 py-6">
                {/* Brand & Close */}
                <div className="mb-8 flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary glow-primary/30 border border-primary/20">
                            <Zap className="h-6 w-6 fill-current" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-foreground italic uppercase">SmartDev<span className="text-primary">.OS</span></span>
                    </div>
                    {setIsOpen && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-lg p-2 text-muted-foreground hover:bg-black/5 md:hidden"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="space-y-1.5 mb-5">
                    <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Navigation</p>
                    {menuItems.map((item) => {
                        const isActive = currentPath === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen?.(false)}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold transition-all duration-300",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-none"
                                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary transition-colors")} />
                                {item.label}
                                {item.label === "AI Assistant" && (
                                    <span className="ml-auto text-[8px] font-black bg-black/5 px-1.5 py-0.5 rounded border border-black/5 opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-tighter shrink-0 text-foreground">Ctrl+L</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* History Section */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between px-3 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Memory Bank</p>
                        <Link href="/dashboard/ai" onClick={() => setIsOpen?.(false)} className="p-1 rounded-lg hover:bg-black/5 text-muted-foreground hover:text-primary transition-colors">
                            <Plus className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    <div className="px-3 mb-1">
                        <div className="relative group/search">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within/search:text-primary" />
                            <input
                                type="text"
                                placeholder="Filter logs..."
                                className="w-full bg-slate-50 border border-border rounded-xl py-2.5 pl-9 pr-4 text-[10px] text-foreground focus:outline-none focus:border-primary transition-all font-bold tracking-widest uppercase placeholder:text-muted-foreground/30 shadow-inner"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
                        {historyLoading ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="h-14 w-full rounded-xl bg-slate-100 animate-pulse border border-border/10" />
                            ))
                        ) : filteredHistory.length === 0 ? (
                            <div className="text-center py-6 text-[10px] font-black uppercase tracking-widest text-foreground/40">No Technical Logs Found</div>
                        ) : (
                            filteredHistory.map((chat) => (
                                <div key={chat._id} className="relative group">
                                    <Link
                                        href={`/dashboard/ai?id=${chat._id}`}
                                        onClick={() => setIsOpen?.(false)}
                                        className={cn(
                                            "flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-300 border",
                                            currentConversationId === chat._id
                                                ? "bg-slate-50 border-primary/20 text-primary shadow-sm"
                                                : "text-slate-600 hover:bg-black/5 border-transparent hover:border-border"
                                        )}
                                    >
                                        <MessageSquare className={cn("h-4 w-4 shrink-0", currentConversationId === chat._id ? "text-primary" : "text-slate-400")} />
                                        <span className={cn("truncate text-[13px] font-bold", currentConversationId === chat._id ? "text-foreground" : "text-slate-600")}>
                                            {chat.title || "New Chat"}
                                        </span>
                                    </Link>

                                    <div className="absolute right-2 top-1 -translate-y-1/2 z-10 flex">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setMenuOpen(menuOpen === chat._id ? null : chat._id);
                                            }}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-black/5 hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <MoreVertical className="h-3.5 w-3.5" />
                                        </button>

                                        <AnimatePresence>
                                            {menuOpen === chat._id && (
                                                <>
                                                    <div className="fixed inset-0 z-[100]" onClick={() => setMenuOpen(null)} />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, x: 5 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, x: 5 }}
                                                        className="absolute right-0 top-8 w-32 bg-white border border-border rounded-xl shadow-2xl z-[101] p-1 font-bold overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={(e) => handleDeleteChat(e, chat._id)}
                                                            className="w-full text-left px-3 py-2 text-[10px] text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors uppercase tracking-widest"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-8 border-t border-border pt-6 bg-background">
                    <div className="mb-4 flex items-center gap-3 px-3">
                        <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20 flex items-center justify-center text-[10px] font-black text-white">
                            {user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="truncate text-xs font-black text-foreground uppercase tracking-tighter">{user?.name || "User"}</span>
                            <span className="truncate text-[10px] text-muted-foreground/60 font-bold lowercase">{user?.email || "user@example.com"}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-bold text-muted-foreground transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 group"
                    >
                        <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Logout
                    </button>
                </div>

            </div>
        </aside>
    );
};

