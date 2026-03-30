"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components/AuthUI";
import { authService } from "@/lib/services/authService";
import { setAuthToken } from "@/lib/authToken";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const response = await authService.register({ name, email, password });
            setAuthToken(response.token);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed");
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
                className="glass-card w-full max-w-md rounded-4xl md:rounded-[2.5rem] p-8 md:p-10"
            >
                <div className="mb-8 md:mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-primary glow-primary">
                        <Bot className="h-7 w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">Create Account</h1>
                    <p className="mt-2 text-muted-foreground uppercase tracking-widest text-[9px] md:text-[10px] font-bold">
                        Join the SmartDev AI Community
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    {error && (
                        <div className="rounded-lg bg-destructive/10 p-3 text-xs font-medium text-destructive">
                            {error}
                        </div>
                    )}
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        By signing up, you agree to our <span className="text-white hover:underline cursor-pointer">Terms</span> and <span className="text-white hover:underline cursor-pointer">Privacy</span>.
                    </p>

                    <Button loading={loading}>Launch Your Workspace</Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-white hover:text-primary transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
