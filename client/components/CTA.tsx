"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/authToken";

export default function CTA() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!getAuthToken());
    }, []);

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
                    <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                        <div className="flex-1 text-left text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Command Palette</div>
                        <div className="rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">ESC</div>
                    </div>

                    <div className="p-8 md:p-12">
                        <h2 className="text-3xl font-bold tracking-tight text-[#111111] md:text-5xl">
                            Initialize your <br />
                            <span className="text-sky-500 underline decoration-sky-100 underline-offset-8">technical workspace.</span>
                        </h2>

                        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            {isLoggedIn ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        className="group flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-500 active:scale-95 shadow-lg shadow-slate-900/10"
                                    >
                                        <Zap className="h-4 w-4 text-sky-400" />
                                        Open Dashboard
                                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                    </Link>
                                    <Link
                                        href="#features"
                                        className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-white"
                                    >
                                        Explore Features
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/register"
                                        className="group flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-500 active:scale-95 shadow-lg shadow-slate-900/10"
                                    >
                                        <Zap className="h-4 w-4 text-sky-400" />
                                        Start Free Session
                                    </Link>
                                    <Link
                                        href="/login"
                                        className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-white"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>

                        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-300">
                            Available for Individual &amp; Enterprise Teams
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
