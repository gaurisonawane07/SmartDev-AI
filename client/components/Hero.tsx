"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/authToken";

export default function Hero() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!getAuthToken());
    }, []);

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center overflow-hidden md:pt-32">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 -z-10 h-50 w-75 rounded-full bg-sky-300/10 blur-[100px] md:h-75 md:w-125 md:blur-[120px]" />
            <div className="absolute -bottom-1/4 left-0 -z-10 h-50 w-75 rounded-full bg-blue-300/5 blur-[100px]" />

            {/* Announcement Pill */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
            >
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                RAG-powered AI is now live
                <ArrowRight className="h-3 w-3 text-slate-400" />
            </motion.div>

            <motion.h1
                className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[#111111] md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Engineer Better with <br />
                <span className="text-gradient">Semantic Intelligence.</span>
            </motion.h1>

            <motion.p
                className="mt-6 max-w-xl text-base text-slate-500 md:text-lg font-normal leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                SmartDev indexes your entire repository to provide real-time RAG-powered
                insights, automated decision logs, and intelligent code synchronization.
            </motion.p>

            <motion.div
                className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row md:w-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {isLoggedIn ? (
                    <>
                        <Link
                            href="/dashboard"
                            className="group flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            Go to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                        <Link
                            href="#features"
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            What&apos;s New
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/register"
                            className="group flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >

                            Get Started Free
                        </Link>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                            Sign In
                        </Link>
                    </>
                )}
            </motion.div>

            {/* Social proof line */}
            <motion.p
                className="mt-4 text-xs text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
            >
                No credit card required · Free to start
            </motion.p>

            {/* Real UI Preview Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative mt-16 w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]"
            >
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100">
                    {/* Browser chrome bar */}
                    <div className="flex h-10 items-center gap-2 border-b border-slate-200 bg-white px-4">
                        <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                        </div>
                        <div className="mx-auto flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[10px] font-medium text-slate-400">smart-dev.ai / dashboard / ai</span>
                        </div>
                    </div>
                    <div className="flex h-[380px] md:h-[560px]">
                        {/* Mock Sidebar */}
                        <div className="hidden w-56 flex-shrink-0 border-r border-slate-200 bg-white p-4 md:block text-left">
                            <div className="mb-6 flex items-center gap-2">
                                <div className="h-6 w-6 rounded-lg bg-sky-500/20" />
                                <div className="h-3 w-20 rounded bg-slate-200" />
                            </div>
                            <div className="space-y-1">
                                {[
                                    { w: "w-28", active: false },
                                    { w: "w-20", active: true },
                                    { w: "w-24", active: false },
                                    { w: "w-16", active: false },
                                    { w: "w-22", active: false },
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${item.active ? "bg-sky-50" : "hover:bg-slate-50"}`}>
                                        <div className={`h-3.5 w-3.5 rounded ${item.active ? "bg-sky-400" : "bg-slate-200"}`} />
                                        <div className={`h-2.5 ${item.w} rounded ${item.active ? "bg-sky-200" : "bg-slate-100"}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 border-t border-slate-100 pt-4 space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-300 px-2 mb-2">Recent</div>
                                {["w-32", "w-24", "w-28"].map((w, i) => (
                                    <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                                        <div className="h-2 w-2 rounded-full bg-slate-200" />
                                        <div className={`h-2 ${w} rounded bg-slate-100`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mock Chat Area */}
                        <div className="flex-1 bg-grid p-6 text-left space-y-4 overflow-hidden flex flex-col justify-end">
                            <div className="max-w-sm rounded-2xl bg-white border border-slate-200 p-4 shadow-sm self-end">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-sky-500 mb-1.5">You</p>
                                <p className="text-xs text-slate-600">Explain the RAG implementation in our retrieval service.</p>
                            </div>
                            <div className="max-w-lg rounded-2xl bg-sky-500 p-4 shadow-lg shadow-sky-500/15">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-white/60 mb-1.5">SmartDev AI</p>
                                <p className="text-xs text-white leading-relaxed">
                                    The RAG system uses <span className="font-semibold underline decoration-white/30 underline-offset-2">local embeddings</span> to index your workspace.
                                    Found 3 relevant chunks in <span className="font-mono bg-white/15 px-1 rounded text-[10px]">retrieval.service.js</span> — lines 42–89 are most relevant.
                                </p>
                                <div className="mt-3 flex gap-1.5">
                                    <div className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-mono text-white/70">auth.service.js</div>
                                    <div className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-mono text-white/70">middleware.js</div>
                                </div>
                            </div>
                            {/* Input bar */}
                            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                                <div className="flex-1 h-2.5 w-32 rounded bg-slate-100" />
                                <div className="h-6 w-6 rounded-lg bg-sky-500 flex items-center justify-center">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-white/80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
