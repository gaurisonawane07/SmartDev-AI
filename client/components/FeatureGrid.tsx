"use client";

import { motion } from "framer-motion";
import { Terminal, Database, Zap, History } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

export default function FeatureGrid() {
    return (
        <section id="features" className="mx-auto max-w-7xl px-6 py-32">
            <div className="mb-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">Engineered for Efficiency</h2>
                <p className="mt-4 text-muted-foreground">Everything you need to ship high-quality code, faster.</p>
            </div>

            <motion.div
                className="grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {/* Main Chat Feature */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card md:col-span-2 flex flex-col justify-between overflow-hidden rounded-3xl p-8"
                >
                    <div>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Terminal className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Context-Aware AI Chat</h3>
                        <p className="mt-2 text-muted-foreground">
                            Our AI doesn&apos;t just answer questions; it remembers your project architecture
                            and previous messages to provide deep, contextual guidance.
                        </p>
                    </div>
                    <div className="mt-10 rounded-xl bg-black/40 p-4 border border-white/5 font-mono text-xs text-zinc-400">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                        </div>
                        <p className="text-primary italic">// AI Analysis in progress...</p>
                        <p>&gt; Suggested refactor for authMiddleware.js looks optimal.</p>
                        <p>&gt; Exporting to Snippets collection.</p>
                    </div>
                </motion.div>

                {/* Snippet Manager */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card flex flex-col justify-between rounded-3xl p-8"
                >
                    <div>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                            <Database className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">The Code Vault</h3>
                        <p className="mt-2 text-muted-foreground">
                            Instantly turn AI responses into reusable notes and code snippets.
                        </p>
                    </div>
                </motion.div>

                {/* Usage Analytics */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card flex flex-col justify-between rounded-3xl p-8"
                >
                    <div>
                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                            <Zap className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Real-time Usage</h3>
                        <p className="mt-2 text-muted-foreground">
                            Track your token consumption and request limits with precision charts.
                        </p>
                    </div>
                </motion.div>

                {/* History */}
                <motion.div
                    variants={itemVariants}
                    className="glass-card md:col-span-2 flex flex-col justify-center rounded-3xl p-8"
                >
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1">
                            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                                <History className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Deep Conversation History</h3>
                            <p className="mt-2 text-muted-foreground">
                                Never lose a breakthrough. Access your entire development history
                                across multiple chat sessions with powerful search.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 w-full max-w-50">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="h-12 rounded-lg bg-white/5 border border-white/5" />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
