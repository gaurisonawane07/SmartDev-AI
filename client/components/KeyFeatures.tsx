"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Search, Cpu, Globe, Layout } from "lucide-react";

const features = [
    {
        icon: <Zap className="h-6 w-6" />,
        title: "Real-time Sync",
        description: "Your workspace stays in sync across all devices and team members instantly."
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Enterprise Security",
        description: "Bank-grade encryption and granular permission controls for your sensitive data."
    },
    {
        icon: <Search className="h-6 w-6" />,
        title: "Global Search",
        description: "Find any snippet, note, or conversation in milliseconds with semantic search."
    },
    {
        icon: <Cpu className="h-6 w-6" />,
        title: "Neural Engine",
        description: "AI that understands your unique coding style and suggests relevant improvements."
    },
    {
        icon: <Globe className="h-6 w-6" />,
        title: "Remote First",
        description: "Built for distributed teams with collaborative tools and async workflows."
    },
    {
        icon: <Layout className="h-6 w-6" />,
        title: "Clean UI",
        description: "A clutter-free environment designed to help you maintain deep focus."
    }
];

export default function KeyFeatures() {
    return (
        <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {features.map((feature, idx) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group flex flex-col items-start gap-4"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-[#38bdf8] transition-colors group-hover:bg-[#38bdf8] group-hover:text-white">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-[#111111]">{feature.title}</h3>
                        <p className="text-slate-500 leading-relaxed">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
