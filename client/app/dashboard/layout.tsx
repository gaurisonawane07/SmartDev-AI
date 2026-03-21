"use client";

import React, { Suspense, useState, useCallback, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarWidth, setSidebarWidth] = useState(288); // Default 72 * 4 = 288px
    const [isResizing, setIsResizing] = useState(false);
    const router = useRouter();

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
        <div className={isResizing ? "cursor-col-resize select-none flex min-h-screen bg-background" : "flex min-h-screen bg-background"}>
            {/* Sidebar - fixed on desktop */}
            <Suspense fallback={<div className="h-screen bg-[#0D0D0D] border-r border-border animate-pulse" style={{ width: sidebarWidth }} />}>
                <Sidebar width={sidebarWidth} onResizeStart={startResizing} />
            </Suspense>

            {/* Main Content Area */}
            <main 
                className={cn("flex-1", !isResizing && "transition-all duration-300")}
                style={{ paddingLeft: sidebarWidth }}
            >
                <div className="h-full min-h-screen border-l border-border bg-background/30 backdrop-blur-sm">
                    {children}
                </div>
            </main>
...

            {/* Background Glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] left-[20%] h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[20%] h-100 w-100 rounded-full bg-purple-500/5 blur-[100px]" />
            </div>
        </div>
    );
}
