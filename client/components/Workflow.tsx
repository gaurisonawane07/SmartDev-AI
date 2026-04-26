"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const steps = [
    {
        id: "01",
        title: "Recursive RAG Indexing",
        description: "Our chunking engine breaks down your repository into semantic fragments, creating a high-dimensional vector map of your entire project.",
        points: ["OpenAI Embedding Integration", "Automated Code Chunking", "Real-time Index Updates"],
        terminal: {
            command: "$ smartdev index --all",
            status: "Parsing 142 files in workspace...",
            output: "✓ Vector Database Synchronized",
            subPoints: ["created 842 embeddings", "mapped 12 service layers", "indexed technical logs"]
        },
        reverse: false
    },
    {
        id: "02",
        title: "Context-Aware Retrieval",
        description: "The AI doesn't just guess. It retrieves relevant code snippets and documentation chunks to provide answers grounded in your reality.",
        points: ["Semantic Query Matching", "Cross-File Relationship Mapping", "Source-Cited AI Responses"],
        terminal: {
            command: "$ smartdev ask 'how does auth work?'",
            status: "Retrieving relevant context...",
            output: "✓ Context match found in auth.service.js",
            subPoints: ["retrieved chunk @L42-L89", "analyzed middleware dependencies", "generated technical summary"]
        },
        reverse: true
    },
    {
        id: "03",
        title: "Automated Knowledge Bank",
        description: "Every technical session is stored in the Memory Bank, allowing you to build a searchable corporate brain that evolves with your code.",
        points: ["Searchable Technical Logs", "Automated Decision Records", "Team Knowledge Sharing"],
        terminal: {
            command: "$ smartdev ship --log",
            status: "Capturing session metadata...",
            output: "✓ Session saved to Memory Bank",
            subPoints: ["archived 12 technical snippets", "generated ADR #42", "updated knowledge graph"]
        },
        reverse: false
    }
];

export default function Workflow() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-40">
            <div className="mb-24 text-center">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-block rounded-full bg-sky-50 px-5 py-2 text-[10px] font-black uppercase tracking-[0.4em] text-sky-500 border border-sky-100"
                >
                    Engineering Workflow
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 text-4xl font-black tracking-tight text-[#111111] md:text-6xl"
                >
                    From idea to <span className="text-[#38bdf8]">production</span>,<br />
                    without the chaos.
                </motion.h2>
            </div>

            <div className="space-y-16 md:space-y-32">
                {steps.map((step, idx) => (
                    <div 
                        key={step.id} 
                        className={`flex flex-col gap-8 md:flex-row md:items-center ${step.reverse ? 'md:flex-row-reverse' : ''}`}
                    >
                        {/* Text Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: step.reverse ? 20 : -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-6"
                        >
                            <span className="text-6xl font-black text-[#38bdf8]/20 md:text-8xl">{step.id}</span>
                            <h3 className="text-3xl font-black text-[#111111] md:text-4xl">{step.title}</h3>
                            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
                                {step.description}
                            </p>
                            <ul className="space-y-3">
                                {step.points.map((point) => (
                                    <li key={point} className="flex items-center gap-3 text-slate-700 font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-[#38bdf8]" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Terminal Mockup */}
                        <motion.div 
                            initial={{ opacity: 0, x: step.reverse ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-sky-100">
                                {/* Browser Dots */}
                                <div className="flex gap-1.5 border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                                </div>
                                
                                {/* Terminal Content */}
                                <div className="bg-grid p-8 font-mono text-sm md:text-base">
                                    <div className="space-y-2">
                                        <p className="text-sky-500">{step.terminal.command}</p>
                                        <p className="text-slate-400">→ {step.terminal.status}</p>
                                        <p className="text-sky-400 font-bold">{step.terminal.output}</p>
                                        <div className="pl-4 space-y-1">
                                            {step.terminal.subPoints.map(p => (
                                                <p key={p} className="text-slate-400">› {p}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Subtle Overlay Gradient */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    );
}
