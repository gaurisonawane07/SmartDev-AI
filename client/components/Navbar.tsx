"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { getAuthToken } from "@/lib/authToken";

const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Workflow", href: "#workflow" },
    { name: "Docs", href: "#" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!getAuthToken());
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-all duration-200 ${scrolled ? "border-slate-200 shadow-sm shadow-slate-900/5" : "border-transparent"}`}>
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="SmartDev AI Logo"
                        className="h-20 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
                        >
                            Dashboard <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="rounded-lg bg-[#111111] px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition-colors"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-200 bg-white md:hidden"
                    >
                        <div className="flex flex-col gap-1 px-6 py-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
                                {isLoggedIn ? (
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-lg bg-[#111111] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/register"
                                            onClick={() => setIsOpen(false)}
                                            className="rounded-lg bg-[#111111] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                        >
                                            Get Started Free
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
