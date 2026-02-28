"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus
} from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

const stats = [
  { label: "Total Notes", value: "12", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "AI Suggestions", value: "48", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Recent Chats", value: "5", icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  { label: "Session Time", value: "2.4h", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
];

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
          api.getProfile(),
          api.getNotes(),
          api.getAIHistory()
        ]);
        setUser(profileRes.user);
        setNotes(notesRes);
        setAIHistory(aiRes.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        if (error.message.includes("401") || error.message.includes("unauthorized")) {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total Notes", value: notes.length.toString(), icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "AI Suggestions", value: (user?.aiUsageCount || 0).toString(), icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Recent Chats", value: aiHistory.length.toString(), icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Limit Remaining", value: ((user?.monthlyRequestLimit || 50) - (user?.aiUsageCount || 0)).toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {user?.name || "Developer"}</h1>
          <p className="mt-1 text-muted-foreground">Here's what's happening with your projects today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary/90 glow-primary active:scale-95">
          <Plus className="h-4 w-4" />
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
            className="glass-card rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`rounded-xl ${stat.bg} p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium text-emerald-500">+12%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card rounded-2xl overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-white">Recent Notes</h3>
              <button className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-border">
              {notes.length === 0 ? (
                <div className="px-6 py-10 text-center text-muted-foreground">
                  <p>No notes found. Create your first one!</p>
                </div>
              ) : (
                notes.slice(0, 3).map((note) => (
                  <div key={note._id} className="flex items-center justify-between px-6 py-4 hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{note.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(note.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* AI Quick Tips */}
        <div className="space-y-6">
          <section className="glass-card rounded-2xl p-6 border-l-4 border-l-primary">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-white">AI Insight</h3>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Based on your recent notes, you might be interested in exploring **Tailwind v4**'s new engine structure. It could optimize your build speeds by up to 40%.
            </p>
            <button className="mt-6 w-full rounded-xl bg-secondary py-2 text-center text-sm font-medium text-white transition-all hover:bg-secondary/80">
              Learn More
            </button>
          </section>

          <section className="glass-card rounded-2xl p-6 bg-linear-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
            <h3 className="mb-2 font-semibold text-white">Pro Tip</h3>
            <p className="text-xs text-muted-foreground">
              Use <kbd className="rounded bg-secondary px-1 py-0.5 text-white">Cmd + K</kbd> anywhere to trigger the AI command palette.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

