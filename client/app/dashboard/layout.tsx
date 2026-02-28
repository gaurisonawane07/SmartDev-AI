import React from "react";
import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar - fixed on desktop */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 pl-64 transition-all duration-300">
                <div className="h-full min-h-screen border-l border-border bg-background/30 backdrop-blur-sm">
                    {children}
                </div>
            </main>

            {/* Background Glows */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-[10%] left-[20%] h-125 w-125 rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[10%] right-[20%] h-100 w-100 rounded-full bg-purple-500/5 blur-[100px]" />
            </div>
        </div>
    );
}
