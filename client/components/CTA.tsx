"use client";

import Link from "next/link";

export default function CTA() {
    return (
        <section className="mx-auto max-w-5xl px-6 py-32 text-center">
            <div className="rounded-[3rem] border border-white/5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-primary/20 px-8 py-20 text-white shadow-2xl backdrop-blur-sm relative overflow-hidden group">
                {/* Decorative Background Glows */}
                <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/20 blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-500" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-purple-500/20 blur-[100px] pointer-events-none" />

                <div className="relative z-10">
                    <h2 className="text-4xl font-extrabold md:text-6xl tracking-tight">
                        Ready to elevate <br />
                        <span className="text-gradient">your workflow?</span>
                    </h2>
                    <p className="mt-6 text-lg text-zinc-400 max-w-xl mx-auto">
                        Join the developer platform built for the modern era. Experience the power of AI-assisted coding and effortless notes.
                    </p>
                    <div className="mt-10 flex justify-center gap-4">
                        <Link
                            href="/register"
                            className="rounded-full bg-primary px-8 py-4 text-lg font-bold text-white transition-all hover:bg-primary/90 glow-primary active:scale-95"
                        >
                            Sign Up for Free
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
