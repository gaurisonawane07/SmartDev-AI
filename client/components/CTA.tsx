"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function CTA() {
    return (
        <section className="relative mx-auto max-w-7xl px-6 py-24 md:py-40 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-grid opacity-20 pointer-events-none" />
            
            <div className="relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-2 shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)]"
                >
                    <div className="flex items-center gap-4 border-b border-slate-100 px-6 py-5">
                        <div className="h-3 w-3 rounded-full bg-slate-200" />
                        <div className="flex-1 text-left text-xs font-black uppercase tracking-[0.3em] text-slate-400">Command Palette</div>
                        <div className="rounded bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">ESC</div>
                    </div>
                    
                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-black tracking-tight text-[#111111] md:text-5xl lg:text-6xl">
                            Initialize your <br />
                            <span className="text-sky-500 underline decoration-sky-100 underline-offset-8">technical workspace.</span>
                        </h2>
                        
                        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/register"
                                className="group flex items-center justify-center gap-3 rounded-xl bg-[#111111] px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-sky-500 active:scale-95 shadow-2xl shadow-slate-900/20"
                            >
                                <Zap className="h-4 w-4 text-sky-400" /> Start Free Session
                            </Link>
                            <Link
                                href="/dashboard"
                                className="flex items-center justify-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-slate-600 transition-all hover:bg-white"
                            >
                                Browse Docs
                            </Link>
                        </div>
                        
                        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-300">
                            Available for Individual & Enterprise Teams
                        </p>
                    </div>
                </motion.div>
            </div>
            
            {/* Ambient Background Elements */}
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-sky-200/20 blur-[100px]" />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-200/10 blur-[100px]" />
        </section>
    );
}
