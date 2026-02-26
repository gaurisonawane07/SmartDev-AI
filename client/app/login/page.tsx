"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Input, Button } from "@/components/AuthUI";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement backend hit to /api/auth/login
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-6">
      <Link
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md rounded-[2.5rem] p-10"
      >
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary glow-primary">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
            SmartDev AI Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border bg-white/5" />
              Remember me
            </label>
            <Link href="#" className="font-semibold text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button loading={loading}>Sign In to Workspace</Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-white hover:text-primary transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
