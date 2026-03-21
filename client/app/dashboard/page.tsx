"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { userService } from "@/lib/services/userService";
import { noteService } from "@/lib/services/noteService";
import { aiService } from "@/lib/services/aiService";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [aiHistory, setAIHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const [profileRes, notesRes, aiRes] = await Promise.all([
          userService.getProfile(),
          noteService.getAll(),
          aiService.getHistory()
        ]);
        
        setUser(profileRes.user);
        setNotes(Array.isArray(notesRes) ? notesRes : []);
        setAIHistory(aiRes.data || []);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        if (error.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const stats = [
    { 
        label: "Total Notes", 
        value: notes.length.toString(), 
        icon: FileText, 
        color: "text-blue-500", 
        bg: "bg-blue-500/10",
        detail: `${notes.filter(n => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} new this week`
    },
    { 
        label: "AI Suggestions", 
        value: (user?.aiUsageCount || 0).toString(), 
        icon: TrendingUp, 
        color: "text-emerald-500", 
        bg: "bg-emerald-500/10",
        detail: "Responses generated"
    },
    { 
        label: "Recent Chats", 
        value: aiHistory.length.toString(), 
        icon: MessageSquare, 
        color: "text-purple-500", 
        bg: "bg-purple-500/10",
        detail: "Conversations stored"
    },
    { 
        label: "Limit Remaining", 
        value: Math.max(0, (user?.monthlyRequestLimit || 50) - (user?.aiUsageCount || 0)).toString(), 
        icon: Clock, 
        color: "text-amber-500", 
        bg: "bg-amber-500/10",
        detail: `Next reset: Day 1`
    },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground animate-pulse font-medium">Synchronizing workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:px-8 md:py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold text-white tracking-tight leading-tight md:text-3xl">
            Welcome back, <span className="text-primary">{user?.name || "Developer"}</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-2 md:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Sync complete • Workspace active
          </p>
        </motion.div>
        <button 
            onClick={() => router.push("/dashboard/notes")}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 glow-primary active:scale-95 shadow-lg shadow-primary/20 sm:w-auto sm:py-2.5"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          Create New Note
        </button>
      </div>

      {/* Stats Grid */}
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card hover-glow rounded-2xl p-6 transition-all border border-white/5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-xl ${stat.bg} p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-extrabold text-white">{stat.value}</span>
              <span className="mt-1 text-[11px] text-muted-foreground font-medium uppercase tracking-tighter opacity-70">{stat.detail}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card rounded-2xl overflow-hidden min-h-[400px] border border-white/5 shadow-xl">
            <div className="border-b border-border bg-muted/30 px-6 py-5 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Recent Artifacts
              </h3>
              <button 
                onClick={() => router.push("/dashboard/notes")}
                className="text-[10px] font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors uppercase tracking-widest"
              >
                View Library <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-border/50">
              {notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted-foreground px-6 text-center">
                  <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                    <FileText className="h-8 w-8 opacity-20" />
                  </div>
                  <h4 className="text-white font-medium mb-1">No artifacts found in vault</h4>
                  <p className="text-sm max-w-[280px] mx-auto opacity-60">Synchronize your thoughts by creating your first technical note.</p>
                  <button 
                    onClick={() => router.push("/dashboard/notes")}
                    className="mt-8 rounded-lg border border-primary/20 bg-primary/5 px-6 py-2 text-sm font-bold text-primary hover:bg-primary/10 transition-all"
                  >
                    + Initialize First Note
                  </button>
                </div>
              ) : (
                notes.slice(0, 5).map((note) => (
                  <div 
                    key={note._id} 
                    onClick={() => router.push("/dashboard/notes")}
                    className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-white/5">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{note.title}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5 opacity-60">
                          Updated • {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <section className="glass-card rounded-2xl p-6 border-l-4 border-l-primary bg-linear-to-b from-primary/5 to-transparent border-white/5 shadow-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary shadow-inner shadow-primary/10">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white tracking-tight">System Insight</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground/80">
                {notes.length > 0 ? (
                    `Based on your focus on "${notes[0].title}", SmartDev AI recommends reviewing server-side caching patterns for this architecture.`
                ) : (
                    "Analyzing development patterns... Create notes to receive personalized architectural insights and ecosystem trends."
                )}
            </p>
            <button 
                onClick={() => router.push("/dashboard/ai")}
                className="mt-6 w-full rounded-xl bg-primary/10 py-3 text-center text-[11px] font-extrabold text-primary transition-all hover:bg-primary/20 active:scale-95 border border-primary/20 uppercase tracking-widest"
            >
              Consult Assistant
            </button>
          </section>

          <section className="glass-card rounded-2xl p-6 bg-linear-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-xl">
            <header className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-white text-[10px] uppercase tracking-widest text-indigo-400">Compute usage</h3>
                <span className="text-[10px] font-bold text-white bg-indigo-500/20 px-2 py-0.5 rounded-full">{Math.round(((user?.aiUsageCount || 0) / (user?.monthlyRequestLimit || 50)) * 100)}%</span>
            </header>
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden mb-4">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, ((user?.aiUsageCount || 0) / (user?.monthlyRequestLimit || 50)) * 100)}%` }}
                    className="h-full bg-linear-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                />
            </div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-tight opacity-60">
              {(user?.monthlyRequestLimit || 50) - (user?.aiUsageCount || 0)} operations remaining in current cycle.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

