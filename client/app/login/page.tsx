"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/AuthUI";
import { authService } from "@/lib/services/authService";
import { setAuthToken } from "@/lib/authToken";
import { validators } from "@/lib/validators";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    // Validate fields
    const validation = validators.validateLogin({ email, password });

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setAuthToken(response.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center px-4 py-12 md:px-6">
      <Link
        href="/"
        className="absolute top-4 left-4 md:top-8 md:left-8 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back to home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10"
      >
        <div className="mb-8 md:mb-10 text-center">
          <img 
            src="/logo.png" 
            alt="SmartDev AI Logo" 
            className="mx-auto mb-4 h-48 w-auto object-contain"
          />
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">Welcome back</h1>
          <p className="mt-2 text-muted-foreground uppercase tracking-widest text-[9px] md:text-[10px] font-bold">
            SmartDev AI Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors({ ...fieldErrors, email: "" });
              }}
              required
            />
            {fieldErrors.email && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
            )}
          </div>
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFieldErrors({ ...fieldErrors, password: "" });
              }}
              required
            />
            {fieldErrors.password && (
              <p className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] md:text-xs">
            <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
              <input type="checkbox" className="rounded border-border bg-white/5" />
              Remember me
            </label>
            <Link href="#" className="font-semibold text-primary hover:underline">
              Forgot?
            </Link>
          </div>

          <Button loading={loading}>Sign In to Workspace</Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-primary hover:text-primary/80 transition-colors">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
