"use client";

import Link from "next/link";

export default function CTA() {
    return (
        <section className="mx-auto max-w-5xl px-6 py-32 text-center">
            <div className="rounded-[3rem] bg-primary px-8 py-20 text-white glow-primary">
                <h2 className="text-4xl font-extrabold md:text-6xl">Ready to elevate <br /> your workflow?</h2>
                <p className="mt-6 text-lg text-primary-foreground/80">
                    Join the developer platform built for the modern era.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link
                        href="/register"
                        className="rounded-full bg-white px-8 py-4 text-lg font-bold text-primary transition-all hover:bg-zinc-100"
                    >
                        Sign Up for Free
                    </Link>
                </div>
            </div>
        </section>
    );
}
