"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center overflow-hidden md:pt-32">
            {/* Glow Effects */}
            <div className="absolute top-1/4 -z-10 h-[200px] w-[300px] rounded-full bg-primary/20 blur-[100px] md:h-[300px] md:w-[500px] md:blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary md:text-sm"
            >
                <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Next-Gen Developer Workspace
                </span>
            </motion.div>

            <motion.h1
                className="max-w-4xl text-4xl font-extrabold leading-[1.2] tracking-tight text-white md:text-7xl md:leading-[1.1]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Build Faster with <br />
                <span className="text-gradient">AI-Powered Intelligence</span>
            </motion.h1>

            <motion.p
                className="mt-6 max-w-2xl text-base text-muted-foreground md:text-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                An integrated platform for developers to chat with AI, save smart snippets,
                and manage architectural decisions—all in one place.
            </motion.p>

            <motion.div
                className="mt-10 flex w-full flex-col justify-center gap-4 sm:flex-row md:w-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <Link
                    href="/dashboard"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 glow-primary sm:w-auto md:rounded-full"
                >
                    Open Dashboard <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                    href="/register"
                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-black transition-all hover:bg-zinc-200 sm:w-auto md:rounded-full"
                >
                    Start Building
                </Link>
            </motion.div>
        </section>
    );
}
