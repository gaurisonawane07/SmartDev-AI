"use client";

import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bot } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const startResizing = useCallback(() => {
        setIsResizing(true);
    }, []);

    const stopResizing = useCallback(() => {
        setIsResizing(false);
    }, []);

    const resize = useCallback((e: MouseEvent) => {
        if (isResizing) {
            const newWidth = e.clientX;
            if (newWidth > 200 && newWidth < 600) {
                setSidebarWidth(newWidth);
            }
        }
    }, [isResizing]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", resize);
            window.addEventListener("mouseup", stopResizing);
        } else {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        }
        return () => {
            window.removeEventListener("mousemove", resize);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing, resize, stopResizing]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                router.push("/dashboard/ai");
            }
        };

        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, [router]);

    return (
        <div className={cn(
            "flex min-h-screen bg-background",
            isResizing ? "cursor-col-resize select-none" : ""
        )}>
            {/* Mobile Sidebar & Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 z-60 md:relative md:translate-x-0"
                        >
                             <Suspense fallback={<div className="h-screen bg-background border-r border-border animate-pulse" style={{ width: 280 }} />}>
                                <Sidebar 
                                    width={sidebarWidth} 
                                    onResizeStart={startResizing} 
                                    isOpen={isMobileOpen} 
                                    setIsOpen={setIsMobileOpen} 
                                />
                            </Suspense>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (hidden on mobile when closed) */}
            {isDesktop && (
                <div className="hidden md:block">
                    <Suspense fallback={<div className="h-screen bg-background border-r border-border animate-pulse" style={{ width: sidebarWidth }} />}>
                        <Sidebar 
                            width={sidebarWidth} 
                            onResizeStart={startResizing} 
                            isOpen={isMobileOpen} 
                            setIsOpen={setIsMobileOpen} 
                        />
                    </Suspense>
                </div>
            )}

            {/* Main Content Area */}
            <main 
                className={cn("flex-1 w-full", !isResizing && "transition-all duration-300")}
            >
                <div className="h-full min-h-screen border-l border-border bg-background/30 backdrop-blur-sm">
                    {/* Mobile Header */}
                    {!isDesktop && (
                        <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
                            <Link href="/dashboard" className="flex items-center gap-2">
                                <img 
                                    src="/logo.png" 
                                    alt="SmartDev AI Logo" 
                                    className="h-20 w-auto object-contain"
                                />
                            </Link>
                            <button 
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                className="rounded-lg p-2 text-primary bg-primary/10 border border-primary/20 active:scale-90 transition-all shadow-lg shadow-primary/10"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {children}
                </div>
            </main>

            {/* Background Glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] left-[20%] h-500px w-500px rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[20%] h-400px w-400px rounded-full bg-purple-500/5 blur-[100px]" />
            </div>
        </div>
    );
}
