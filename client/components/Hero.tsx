"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center overflow-hidden md:pt-32">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 -z-10 h-50 w-75 rounded-full bg-sky-300/10 blur-[100px] md:h-75 md:w-125 md:blur-[120px]" />
            <div className="absolute -bottom-1/4 left-0 -z-10 h-50 w-75 rounded-full bg-blue-300/5 blur-[100px]" />

            <motion.h1
                className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-[#111111] md:text-8xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Engineer Better with <br />
                <span className="text-gradient">Semantic Intelligence.</span>
            </motion.h1>

            <motion.p
                className="mt-8 max-w-2xl text-base text-slate-500 md:text-xl font-medium tracking-tight leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                SmartDev indexes your entire repository to provide real-time RAG-powered 
                insights, automated decision logs, and intelligent code synchronization.
            </motion.p>

            <motion.div
                className="mt-12 flex w-full flex-col justify-center gap-4 sm:flex-row md:w-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Link
                    href="/dashboard"
                    className="group flex items-center justify-center gap-3 rounded-xl bg-[#111111] px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-white hover:bg-sky-500 transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                    Go to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                    href="/register"
                    className="group flex items-center justify-center gap-3 rounded-xl bg-white border border-[#e2e8f0] px-10 py-5 text-sm font-black uppercase tracking-[0.2em] text-[#111111] hover:bg-[#f8fafc] transition-all"
                >
                    Get Started
                </Link>
            </motion.div>

            {/* Real UI Preview Mockup */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative mt-24 w-full max-w-5xl rounded-[2rem] border border-slate-200 bg-white p-2 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)]"
            >
                <div className="overflow-hidden rounded-[1.5rem] bg-slate-50 border border-slate-100">
                    <div className="flex h-12 items-center gap-2 border-b border-slate-200 bg-white px-6">
                        <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                            <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                        </div>
                        <div className="mx-auto text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">SmartDev AI / Technical Session / Log_042</div>
                    </div>
                    <div className="flex h-[400px] md:h-[600px]">
                        {/* Mock Sidebar */}
                        <div className="hidden w-64 border-r border-slate-200 bg-white p-4 md:block text-left">
                            <div className="mb-8 h-8 w-32 rounded bg-slate-100" />
                            <div className="space-y-3">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50">
                                        <div className="h-4 w-4 rounded bg-slate-200" />
                                        <div className="h-3 w-24 rounded bg-slate-100" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Mock Chat Area */}
                        <div className="flex-1 bg-grid p-8 text-left space-y-6 overflow-hidden">
                            <div className="max-w-md rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-2">User</p>
                                <p className="text-sm text-slate-600 font-medium">Explain the RAG implementation in our retrieval service.</p>
                            </div>
                            <div className="max-w-xl rounded-2xl bg-sky-500 border border-sky-400 p-5 shadow-lg shadow-sky-500/10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-2">SmartDev AI</p>
                                <p className="text-sm text-white font-medium leading-relaxed">
                                    The RAG system uses <span className="underline decoration-white/30 underline-offset-4 font-black">OpenAI embeddings</span> to index your workspace. 
                                    I've found 3 relevant chunks in <span className="font-mono bg-white/10 px-1 rounded">retrieval.service.js</span>...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
