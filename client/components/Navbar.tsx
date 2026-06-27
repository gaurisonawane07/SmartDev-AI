"use client";

import { useState } from "react";
import { Bot, Menu, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks: { name: string; href: string }[] = [];

    return (
        <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img 
                        src="/logo.png" 
                        alt="SmartDev AI Logo" 
                        className="h-28 w-auto object-contain -my-4"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name}
                            href={link.href} 
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link 
                        href="/login" 
                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-white/5 md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-border/50 bg-background md:hidden"
                    >
                        <div className="flex flex-col gap-4 px-6 py-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Login
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
