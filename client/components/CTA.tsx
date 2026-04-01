"use client";

import Link from "next/link";

export default function CTA() {
    return (
        <section className="bg-[#38bdf8] px-6 py-24 md:py-32 text-center overflow-hidden relative text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-grid opacity-10 pointer-events-none invert" />
            <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
                <h2 className="text-4xl font-black md:text-7xl tracking-tighter leading-[1.0]">
                    Deploy your <br /> next breakthrough.
                </h2>
                <p className="mt-8 text-lg md:text-xl text-sky-50 font-medium max-w-2xl mx-auto opacity-90">
                    Join the ecosystem where technical insights meet ultra-agile development patterns.
                </p>
                <div className="mt-12">
                    <Link
                        href="/register"
                        className="inline-flex rounded-lg bg-white px-12 py-6 text-xl font-black text-[#38bdf8] uppercase tracking-widest transition-all hover:bg-sky-50 hover:scale-105 active:scale-95 shadow-xl shadow-sky-900/10"
                    >
                        Initialize Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
