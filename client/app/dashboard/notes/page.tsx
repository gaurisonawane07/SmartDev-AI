"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Filter,
    MoreVertical,
    FileText,
    Plus,
    Calendar,
    Tag,
    Save,
    Trash2,
    Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { noteService } from "@/lib/services/noteService";

import NoteEditor from "@/components/NoteEditor";

export default function NotesPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [showMobileList, setShowMobileList] = useState(true);

    // Fetch notes on mount
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const data = await noteService.getAll();
            const sortedData = Array.isArray(data) ? data : [];
            setNotes(sortedData);
            if (sortedData.length > 0 && !selectedNote) {
                // On desktop, select the first note by default
                if (window.innerWidth >= 768) {
                    handleSelectNote(sortedData[0]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectNote = (note: any) => {
        if (!note) return;
        setSelectedNote(note);
        setEditTitle(note.title || "");
        setEditContent(note.content || "");
        setShowMobileList(false);
    };

    const handleCreateNote = async () => {
        try {
            const newNote = await noteService.create({
                title: "Untitled Note",
                content: " " // Space to avoid strictly empty required field issues
            });
            setNotes(prev => [newNote, ...prev]);
            handleSelectNote(newNote);
        } catch (error) {
            console.error("Failed to create note:", error);
            alert("Could not create note. Please check your connection.");
        }
    };

    const handleSaveNote = async () => {
        const id = selectedNote?._id || selectedNote?.id;
        if (!id) {
            alert("Critical Error: Missing Note ID. Try refreshing.");
            return;
        }
        if (saving) return;
        
        setSaving(true);
        try {
            const updated = await noteService.update(id, {
                title: editTitle.trim() || "Untitled Note",
                content: editContent
            });
            
            setNotes(prev => prev.map(n => {
                const noteId = n._id || n.id;
                const updatedId = updated._id || updated.id;
                return noteId === updatedId ? updated : n;
            }));
            
            setSelectedNote(updated);
            alert("Note saved successfully!");
        } catch (error: any) {
            console.error("Failed to save note:", error);
            alert(`Failed to save: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!id || !confirm("Are you sure you want to delete this note?")) return;
        try {
            await noteService.delete(id);
            const updatedNotes = notes.filter(n => (n._id || n.id) !== id);
            setNotes(updatedNotes);
            
            const currentSelectedId = selectedNote?._id || selectedNote?.id;
            if (currentSelectedId === id) {
                if (updatedNotes.length > 0) {
                    handleSelectNote(updatedNotes[0]);
                } else {
                    setSelectedNote(null);
                    setEditTitle("");
                    setEditContent("");
                    setShowMobileList(true);
                }
            }
        } catch (error: any) {
            console.error("Failed to delete note:", error);
            alert(`Error: ${error.message || "Failed to delete"}`);
        }
    };

    const filteredNotes = notes.filter(note => {
        const title = note.title?.toLowerCase() || "";
        const content = note.content?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return title.includes(query) || content.includes(query);
    });

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] flex-col gap-4 md:gap-6 p-4 md:p-8">
            {/* Search & Actions Bar */}
            <div className={cn(
                "flex items-center justify-between gap-4",
                !showMobileList && "hidden md:flex"
            )}>
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className="w-full rounded-xl border border-border bg-card/30 py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleCreateNote}
                        className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 glow-primary shadow-lg shadow-primary/20"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">New Note</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden relative">
                {/* Note List Sidebar */}
                <div className={cn(
                    "w-full md:w-80 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar transition-all duration-300",
                    !showMobileList && "hidden md:flex"
                )}>
                    {filteredNotes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground px-6 text-center">
                            <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                              <FileText className="h-6 w-6 opacity-20" />
                            </div>
                            <p className="text-xs font-medium uppercase tracking-widest opacity-60">No artifacts found</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredNotes.map((note) => (
                                <motion.div
                                    key={note._id || note.id}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    onClick={() => handleSelectNote(note)}
                                    className={cn(
                                        "group cursor-pointer rounded-2xl border p-4 transition-all duration-300",
                                        selectedNote?._id === note._id
                                            ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/5"
                                            : "border-border bg-card/10 hover:border-white/10 hover:bg-white/5"
                                    )}
                                >
                                    <div className="mb-2 flex items-start justify-between">
                                        <h4 className={cn(
                                            "line-clamp-1 text-sm font-semibold transition-colors",
                                            selectedNote?._id === note._id ? "text-primary" : "text-white"
                                        )}>
                                            {note.title}
                                        </h4>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteNote(note._id || note.id);
                                            }}
                                            className="text-muted-foreground hover:text-destructive md:opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <p className="mb-4 line-clamp-2 text-[11px] text-muted-foreground/60 leading-relaxed font-medium">
                                        {note.content ? note.content.replace(/<[^>]*>/g, '').substring(0, 100) : "Blank artifact"}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                        <span>{new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Note Editor Area */}
                <div className={cn(
                    "flex-1 flex flex-col min-w-0 transition-all duration-300",
                    showMobileList && "hidden md:flex"
                )}>
                    {selectedNote ? (
                        <>
                            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between px-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setShowMobileList(true)}
                                        className="p-2 -ml-2 text-muted-foreground hover:text-white md:hidden"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Untitled Note"
                                        className="flex-1 bg-transparent text-xl md:text-2xl font-bold text-white focus:outline-none placeholder:text-white/10 min-w-0"
                                    />
                                </div>
                                <button 
                                    onClick={handleSaveNote}
                                    disabled={saving}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-500 hover:bg-emerald-500/20 transition-all disabled:opacity-50 active:scale-95 border border-emerald-500/20 w-full md:w-auto md:py-2"
                                >
                                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                                    Commit Changes
                                </button>
                            </div>
                            
                            <div className="flex-1 min-h-0 bg-card rounded-2xl overflow-hidden shadow-2xl">
                                <NoteEditor 
                                    content={editContent} 
                                    onChange={(newContent) => setEditContent(newContent)} 
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 glass-card rounded-3xl flex flex-col items-center justify-center text-muted-foreground shadow-2xl p-6">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center"
                            >
                                <FileText className="h-16 md:h-20 w-16 md:w-20 mb-6 opacity-10 mx-auto" />
                                <p className="text-lg md:text-xl font-bold text-white mb-2 tracking-tight">Technical Vault is Locked</p>
                                <p className="text-xs md:text-sm opacity-60 mb-8 max-w-[240px] md:max-w-none">Select an artifact from the list to begin documenting.</p>
                                <button 
                                    onClick={() => {
                                        if (typeof window !== 'undefined' && window.innerWidth < 768) setShowMobileList(true);
                                        else handleCreateNote();
                                    }}
                                    className="mx-auto block text-sm font-extrabold text-primary hover:text-primary/80 transition-all uppercase tracking-widest"
                                >
                                    {(typeof window !== 'undefined' && window.innerWidth < 768) ? "View Artifact List" : "Initialize New Artifact"}
                                </button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
