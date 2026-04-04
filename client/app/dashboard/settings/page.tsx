"use client";

import React, { useState, useEffect } from "react";
import { 
    User as UserIcon, 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Pencil,
    X,
    Sun,
    Moon
} from "lucide-react";
import { userService } from "@/lib/services/userService";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const { resolvedTheme, setTheme } = useTheme();

    // Form states
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await userService.getProfile();
            setUser(res.user);
            setName(res.user.name);
            setEmail(res.user.email);
        } catch (error) {
            console.error("Failed to fetch settings profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await userService.updateProfile({ name, email });
            if (res.success) {
                setUser(res.user);
                setMessage({ type: "success", text: "Profile successfully synced across all systems." });
                setIsEditing(false); // Switch back to view mode on success
            }
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Integrity check failed: Check data format." });
        } finally {
            setSaving(false);
        }
    };

    const cancelEditing = () => {
        setName(user.name);
        setEmail(user.email);
        setIsEditing(false);
        setMessage(null);
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    const usagePercentage = Math.min(100, (user?.aiUsageCount / user?.monthlyRequestLimit) * 100);
    const isDarkMode = resolvedTheme === "dark";

    return (
        <div className="min-h-screen bg-background text-foreground p-5 md:p-8 overflow-y-auto custom-scrollbar">
            <div className="mx-auto max-w-4xl space-y-6">
                <header className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your appearance, profile, and account usage.</p>
                </header>

                <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
                    <h2 className="text-base font-semibold">Appearance</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Choose how the entire application looks.</p>

                    <div className="mt-4 inline-flex rounded-xl border border-border bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                !isDarkMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Sun className="h-4 w-4" />
                            Light
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={cn(
                                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                                isDarkMode ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Moon className="h-4 w-4" />
                            Dark
                        </button>
                    </div>
                </section>

                <section className="rounded-2xl border border-border bg-card p-5 md:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <UserIcon className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold">Profile</h2>
                                <p className="text-sm text-muted-foreground">Update your personal information.</p>
                            </div>
                        </div>

                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                            >
                                <Pencil className="h-4 w-4" />
                                Edit
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Full name</label>
                                <input
                                    type="text"
                                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 mt-1 flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={cancelEditing}
                                    className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-white hover:bg-sky-400 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-lg border border-border bg-background p-4">
                                <p className="text-xs text-muted-foreground">Full name</p>
                                <p className="mt-1 text-sm font-medium text-foreground">{user.name}</p>
                            </div>
                            <div className="rounded-lg border border-border bg-background p-4">
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="mt-1 text-sm font-medium text-foreground">{user.email}</p>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div
                            className={cn(
                                "mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm",
                                message.type === "success"
                                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                                    : "border-red-500/30 bg-red-500/10 text-red-600"
                            )}
                        >
                            {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            <span>{message.text}</span>
                        </div>
                    )}
                </section>

                <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                        <h3 className="text-base font-semibold">Usage</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Monthly AI request usage.</p>

                        <div className="mt-5 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Requests used</span>
                                <span className={cn("font-medium", usagePercentage > 90 ? "text-red-500" : "text-foreground")}>
                                    {user?.aiUsageCount} / {user?.monthlyRequestLimit}
                                </span>
                            </div>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                    style={{ width: `${usagePercentage}%` }}
                                    className={cn(
                                        "h-full rounded-full transition-all duration-700",
                                        usagePercentage > 90 ? "bg-red-500" : usagePercentage > 60 ? "bg-amber-500" : "bg-primary"
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 md:p-6">
                        <h3 className="text-base font-semibold">Account</h3>
                        <p className="mt-1 text-sm text-muted-foreground">General account status and options.</p>

                        <div className="mt-5 space-y-3">
                            <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                                <span className="text-muted-foreground">Node ID: </span>
                                <span className="font-medium text-foreground">{user?._id?.slice(-8).toUpperCase()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Your account is active and synced.</p>
                            <button className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-muted transition-colors">
                                Upgrade plan
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
