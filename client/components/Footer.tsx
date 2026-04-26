"use client";

import { Bot } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white px-6 py-20 md:py-32">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1">
                        <img 
                            src="/logo.png" 
                            alt="SmartDev AI Logo" 
                            className="h-32 w-auto object-contain -ml-4 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"
                        />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-loose">
                            Semantic Intelligence <br />
                            for Modern Engineers.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Workspace</h4>
                            <ul className="space-y-4 text-xs font-bold text-slate-500">
                                <li><a href="/dashboard" className="hover:text-sky-500 transition-colors">Overview</a></li>
                                <li><a href="/dashboard/notes" className="hover:text-sky-500 transition-colors">Memory Bank</a></li>
                                <li><a href="/dashboard/ai" className="hover:text-sky-500 transition-colors">AI Assistant</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Technical</h4>
                            <ul className="space-y-4 text-xs font-bold text-slate-500">
                                <li><a href="#" className="hover:text-sky-500 transition-colors">RAG Architecture</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">API Reference</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Security Audit</a></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Resources</h4>
                            <ul className="space-y-4 text-xs font-bold text-slate-500">
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Changelog</a></li>
                                <li><a href="#" className="hover:text-sky-500 transition-colors">Status</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-slate-50 pt-10 md:flex-row">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                        &copy; {new Date().getFullYear()} SmartDev AI &bull; Version 2.4.0-Stable
                    </p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                        <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="hover:text-slate-900 transition-colors">OSS</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
