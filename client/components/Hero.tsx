"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center overflow-hidden md:pt-32">
            {/* Ultra-Light Sky Blue Glows */}
            <div className="absolute top-1/4 -z-10 h-50 w-75 rounded-full bg-sky-300/10 blur-[100px] md:h-75 md:w-125 md:blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 rounded-lg border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-black text-[#38bdf8] md:text-sm uppercase tracking-widest"
            >
                <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#38bdf8]" /> Next-Gen Enterprise Workspace
                </span>
            </motion.div>

            <motion.h1
                className="max-w-4xl text-4xl font-black leading-[1.1] tracking-tighter text-[#111111] md:text-8xl md:leading-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Build Faster with <br />
                <span className="text-gradient">Ultra-Agile Insight</span>
            </motion.h1>

            <motion.p
                className="mt-8 max-w-2xl text-base text-slate-500 md:text-xl font-medium tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                Innovative integrated platform for agile developers. 
                Experience the precision of context-aware chat and automated decision records.
            </motion.p>

            <motion.div
                className="mt-12 flex w-full flex-col justify-center gap-4 sm:flex-row md:w-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Link
                    href="/dashboard"
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#38bdf8] px-10 py-5 text-lg font-black text-white hover:bg-sky-400 transition-all shadow-xl shadow-sky-400/20 active:scale-95 sm:w-auto"
                >
                    Deploy Workspace <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                    href="/register"
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-white border border-[#e2e8f0] px-10 py-5 text-lg font-black text-[#111111] hover:bg-[#f8fafc] transition-all sm:w-auto"
                >
                    Join Free
                </Link>
            </motion.div>
        </section>
    );
}
