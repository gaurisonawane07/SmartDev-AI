"use client";

import { motion } from "framer-motion";

const stats = [
    { label: "Active Developers", value: "50k+" },
    { label: "Lines of Code Managed", value: "200M+" },
    { label: "AI Suggestions", value: "5M+" },
    { label: "Team Productivity", value: "40%+" }
];

export default function Stats() {
    return (
        <section className="border-y border-slate-100 bg-slate-50/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    {stats.map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl font-black text-[#111111] md:text-5xl">{stat.value}</div>
                            <div className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
