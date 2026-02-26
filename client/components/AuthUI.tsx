"use client";

import { motion } from "framer-motion";
import { Link } from "lucide-react";
import NextLink from "next/link";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function Input({ label, ...props }: InputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">{label}</label>
            <input
                {...props}
                className="w-full rounded-xl border border-border bg-white/5 py-3 px-4 text-white transition-all focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
        </div>
    );
}

export function Button({ children, loading, ...props }: { children: React.ReactNode, loading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-all hover:bg-primary/90 hover:glow-primary disabled:opacity-50"
        >
            {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
                children
            )}
        </button>
    );
}
