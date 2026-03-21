"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
    Terminal, 
    Play, 
    RefreshCw, 
    Settings, 
    ChevronDown, 
    Globe, 
    Zap,
    AlertCircle,
    XCircle,
    Copy,
    Save,
    Plus,
    Loader2
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const languages = [
    { label: "JavaScript", value: "javascript", icon: "js" },
    { label: "TypeScript", value: "typescript", icon: "ts" },
    { label: "Python", value: "python", icon: "py" },
    { label: "CSS", value: "css", icon: "css" },
    { label: "HTML", value: "html", icon: "html" },
];

export default function PlaygroundPage() {
    const [code, setCode] = useState("// SmartDev Console v1.0\n// Write your script here and click Run.\n\nconst greet = () => {\n  console.log('Synchronizing Neural Link...');\n  console.log('Hello, SmartDev User!');\n};\n\ngreet();");
    const [language, setLanguage] = useState("javascript");
    const [output, setOutput] = useState<any[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    const runCode = () => {
        setIsRunning(true);
        setOutput([]); // Clear previous logs
        
        // Custom Log Interceptor for JavaScript
        if (language === "javascript" || language === "typescript") {
            const logs: any[] = [];
            const originalLog = console.log;
            const originalError = console.error;

            console.log = (...args) => {
                logs.push({ type: 'log', value: args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ') });
            };
            console.error = (...args) => {
                logs.push({ type: 'error', value: args.map(arg => String(arg)).join(' ') });
            };

            try {
                // Using Function instead of eval for safer execution (still client-side restricted)
                new Function(code)();
                setOutput(logs);
            } catch (err: any) {
                setOutput([{ type: "error", value: "Reference Error: " + err.message }]);
            }

            // Restore original console
            console.log = originalLog;
            console.error = originalError;
        } else {
            // Simulation for other languages (Python/CSS/HTML)
            setTimeout(() => {
                setOutput([{ type: "log", value: `[System Notice] Local execution for ${language.toUpperCase()} currently in simulation mode. Output rendering not available yet.` }]);
            }, 500);
        }

        setTimeout(() => setIsRunning(false), 300);
    };

    const clearConsole = () => setOutput([]);

    return (
        <div className="flex h-screen flex-col bg-black text-white overflow-hidden p-6 lg:p-8">
            {/* Header / Toolbar */}
            <header className="flex h-20 shrink-0 items-center justify-between px-8 bg-[#0D0D0D] border border-white/5 rounded-t-[2.5rem] relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-xl shadow-primary/10">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter italic">Neural<span className="text-primary">Playground</span></h1>
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Global IDE Instance • Node Primary</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-50">
                    {/* Language Selector */}
                    <div className="relative">
                        <button 
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all min-w-[140px]"
                        >
                            <Globe className="h-3.5 w-3.5 text-primary" />
                            {languages.find(l => l.value === language)?.label}
                            <ChevronDown className={cn("h-3 w-3 ml-auto transition-transform", langMenuOpen ? "rotate-180" : "")} />
                        </button>

                        <AnimatePresence>
                            {langMenuOpen && (
                                <>
                                    <div className="fixed inset-0" onClick={() => setLangMenuOpen(false)} />
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-12 w-48 bg-[#1A1A1A] border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 z-50"
                                    >
                                        {languages.map((l) => (
                                            <button
                                                key={l.value}
                                                onClick={() => {
                                                    setLanguage(l.value);
                                                    setLangMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    language === l.value ? "bg-primary text-white" : "text-white/40 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                    <button 
                        onClick={runCode}
                        disabled={isRunning}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all group overflow-hidden relative"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
                        {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                        Execute
                    </button>

                    <button 
                        onClick={() => setCode("")}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-white/30 hover:text-white transition-all hover:bg-red-500/10 hover:border-red-500/20"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                </div>
            </header>

            {/* Main Interactive Area */}
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Editor Container */}
                <div className="flex-1 flex flex-col bg-[#0D0D0D] border-x border-b border-white/5 rounded-b-[2.5rem] overflow-hidden relative">
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme="vs-dark"
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 13,
                                lineNumbers: "on",
                                automaticLayout: true,
                                padding: { top: 20 },
                                fontFamily: "var(--font-geist-mono), monospace",
                                cursorStyle: "block",
                                smoothScrolling: true,
                                wordWrap: "on"
                            }}
                        />
                    </div>
                </div>

                {/* System Output Console */}
                <div className="w-[30%] flex flex-col gap-6">
                    <div className="flex-1 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] p-6 flex flex-col shadow-2xl relative">
                        <div className="flex items-center justify-between mb-6 shrink-0">
                            <div className="flex items-center gap-3">
                                <Zap className="h-4 w-4 text-emerald-500" />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-white/80">System Output</h3>
                            </div>
                            <button 
                                onClick={clearConsole}
                                className="text-[10px] font-bold text-white/20 hover:text-white transition-colors"
                            >
                                Clear
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            {output.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                                    <Terminal className="h-10 w-10 text-white" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Standby for Execution</p>
                                </div>
                            ) : (
                                output.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex items-start gap-3 p-3 rounded-xl text-[12px] font-mono leading-relaxed group",
                                            log.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/10" : "bg-white/5 text-emerald-400 border border-emerald-500/5"
                                        )}
                                    >
                                        <div className="mt-1 shrink-0">
                                            {log.type === "error" ? <XCircle className="h-3 w-3" /> : <ChevronDown className="h-3 w-3 rotate-270" />}
                                        </div>
                                        <span className="break-all whitespace-pre-wrap">{log.value}</span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Stats Widget */}
                    <div className="h-32 bg-[#0D0D0D] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-center gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Compiler status</span>
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-emerald-500" animate={{ width: ["20%", "80%", "50%", "100%", "40%"] }} transition={{ duration: 5, repeat: Infinity }} />
                        </div>
                        <p className="text-[11px] font-bold text-white/60">Node resources verified. Sandbox initialized.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
