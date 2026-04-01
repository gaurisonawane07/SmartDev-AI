"use client";

import { Bot } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-[#e2e8f0] bg-white px-4 py-12 md:px-6">
            <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.4em]">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
                    <div className="flex items-center gap-2 text-[#111111]">
                        <Bot className="h-4 w-4 text-[#38bdf8]" />
                        <span className="font-black tracking-tighter italic">SmartDev<span className="text-[#38bdf8]">.OS</span></span>
                    </div>
                    <span>&copy; {new Date().getFullYear()} &bull; Ultra-Agile v5.0</span>
                </div>
                <div className="flex gap-10">
                    <a href="#" className="hover:text-[#38bdf8] transition-colors">Privacy</a>
                    <a href="#" className="hover:text-[#38bdf8] transition-colors">Terms</a>
                    <a href="#" className="hover:text-[#38bdf8] transition-colors">Architecture</a>
                    <a href="#" className="hover:text-[#38bdf8] transition-colors">Security</a>
                </div>
            </div>
        </footer>
    );
}
