"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User as UserIcon, 
    Zap, 
    Save, 
    Loader2, 
    CheckCircle2, 
    AlertCircle,
    Hash,
    Pencil,
    X,
    Shield
} from "lucide-react";
import { userService } from "@/lib/services/userService";
import { cn } from "@/lib/utils";
import { Input, Button } from "@/components/AuthUI";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

    return (
        <div className="min-h-screen bg-background text-foreground p-8 lg:p-12 overflow-y-auto custom-scrollbar">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-12"
            >
                {/* Header Section */}
                <header className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-8 bg-primary rounded-full" />
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic">System Configuration</h1>
                    </div>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.3em] opacity-80 pl-11">Terminal & Identity Management</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Settings Panel */}
                    <div className="lg:col-span-12 space-y-10">
                        {/* Profile Section */}
                        <section className="bg-white border border-border rounded-[2rem] p-8 lg:p-10 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none text-primary">
                                <UserIcon className="h-32 w-32" />
                            </div>
                            
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                                        <UserIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-widest text-foreground">Public Identity</h2>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Manage your system credentials</p>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-border text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:border-primary hover:text-white transition-all active:scale-95 group/edit shadow-sm"
                                    >
                                        <Pencil className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                                        Update Details
                                    </button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {isEditing ? (
                                    <motion.form
                                        key="edit-mode"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        onSubmit={handleUpdateProfile}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                                    >
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="Enter system name..."
                                                className="w-full h-14 rounded-2xl bg-slate-50 border border-border px-6 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground pl-1">Email Interface</label>
                                            <input
                                                type="email"
                                                placeholder="Enter access email..."
                                                className="w-full h-14 rounded-2xl bg-slate-50 border border-border px-6 text-sm font-bold focus:outline-none focus:border-primary focus:bg-white transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="md:col-span-2 flex flex-col gap-6 mt-4 pt-8 border-t border-border">
                                            <div className="flex justify-end gap-4">
                                                <button
                                                    type="button"
                                                    onClick={cancelEditing}
                                                    className="px-8 h-14 rounded-2xl bg-slate-50 text-foreground text-[11px] font-black uppercase tracking-[0.2em] border border-border hover:bg-slate-100 transition-all flex items-center gap-2"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={saving}
                                                    className="min-w-[200px] h-14 rounded-2xl bg-primary hover:bg-sky-400 text-white shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 font-black text-[11px] uppercase tracking-widest"
                                                >
                                                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                                    <span>Save Changes</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="view-mode"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10"
                                    >
                                        <div className="space-y-1.5 px-6 py-4 rounded-2xl bg-slate-50 border border-border shadow-inner">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Full Name</span>
                                            <p className="text-base font-bold text-foreground">{user.name}</p>
                                        </div>
                                        <div className="space-y-1.5 px-6 py-4 rounded-2xl bg-slate-50 border border-border shadow-inner">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80">Email Interface</span>
                                            <p className="text-base font-bold text-foreground">{user.email}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={cn(
                                            "mt-8 rounded-2xl p-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider",
                                            message.type === "success" 
                                                ? "bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 font-black" 
                                                : "bg-red-500/5 border border-red-500/20 text-red-600 font-black"
                                        )}
                                    >
                                        {message.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        {message.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </section>

                        {/* Usage & Performance */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-white border border-border rounded-[2rem] p-8 space-y-8 shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
                                        <Zap className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-black uppercase tracking-widest text-foreground">Resource Monitor</h3>
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-80">Monthly Allocation State</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Usage Capacity</span>
                                        <span className={cn(
                                            "text-lg font-black italic tracking-tighter",
                                            usagePercentage > 90 ? "text-red-500" : "text-foreground"
                                        )}>
                                            {user?.aiUsageCount} / {user?.monthlyRequestLimit}
                                        </span>
                                    </div>

                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-border relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${usagePercentage}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={cn(
                                                "h-full rounded-full transition-all duration-1000 shadow-lg",
                                                usagePercentage > 90 ? "bg-red-500 shadow-red-500/20" : 
                                                usagePercentage > 60 ? "bg-amber-500 shadow-amber-500/20" : 
                                                "bg-primary shadow-primary/20"
                                            )}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Shield className="h-3 w-3 text-emerald-500" />
                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Limits Secured</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-border rounded-[2rem] p-8 flex flex-col justify-center space-y-6 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                                
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-border w-fit">
                                        <Hash className="h-3 w-3 text-primary" />
                                        <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">NODE_ID: {user?._id?.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] italic text-foreground">System Status: Nominal</h4>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed font-bold">Your instance is fully integrated with the network. Pro upgrades are currently enabled for enhanced compute limits.</p>
                                </div>

                                <button className="w-full h-12 rounded-xl bg-slate-50 border border-border text-[11px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 shadow-sm">
                                    System Upgrade
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
