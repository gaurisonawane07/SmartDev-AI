"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    FileText,
    Plus,
    Calendar,
    Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Mock data for initial UI
const mockNotes = [
    { id: 1, title: "Meeting with Frontend Team", content: "Discussing Tailwind v4 migration...", date: "2024-02-26", tags: ["work", "priority"] },
    { id: 2, title: "Groq API Setup Guide", content: "Steps to integrate Groq with Node.js...", date: "2024-02-25", tags: ["tech", "ai"] },
    { id: 3, title: "Shopping List", content: "Milk, Bread, Coffee, Energy Drinks...", date: "2024-02-24", tags: ["personal"] },
];

export default function NotesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNote, setSelectedNote] = useState(mockNotes[0]);

    return (
        <div className="flex h-[calc(100vh-2rem)] flex-col gap-6 p-8">
            {/* Search & Actions Bar */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notes, tags, or content..."
                        className="w-full rounded-xl border border-border bg-card/30 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 rounded-xl border border-border bg-card/30 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary hover:text-white">
                        <Filter className="h-4 w-4" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 glow-primary">
                        <Plus className="h-4 w-4" />
                        New Note
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Note List Sidebar */}
                <div className="w-80 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {mockNotes.map((note) => (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => setSelectedNote(note)}
                                className={cn(
                                    "group cursor-pointer rounded-2xl border p-4 transition-all duration-200",
                                    selectedNote.id === note.id
                                        ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/5"
                                        : "border-border bg-muted/20 hover:border-muted-foreground/50 hover:bg-muted/40"
                                )}
                            >
                                <div className="mb-2 flex items-start justify-between">
                                    <h4 className={cn(
                                        "line-clamp-1 text-sm font-semibold transition-colors",
                                        selectedNote.id === note.id ? "text-primary" : "text-white"
                                    )}>
                                        {note.title}
                                    </h4>
                                    <button className="text-muted-foreground hover:text-white">
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
                                    {note.content}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {note.tags.map(tag => (
                                            <span key={tag} className="rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60">{note.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Note Editor Preview Area */}
                <div className="flex-1 rounded-3xl border border-border bg-card/20 backdrop-blur-md p-8 flex flex-col">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Last edited: {selectedNote.date}</span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> {selectedNote.tags.join(", ")}</span>
                        </div>
                    </div>
                    <input
                        type="text"
                        value={selectedNote.title}
                        className="mb-4 bg-transparent text-4xl font-bold text-white focus:outline-none"
                        readOnly
                    />
                    <textarea
                        className="flex-1 bg-transparent text-lg text-muted-foreground focus:outline-none resize-none"
                        value={selectedNote.content}
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
}
