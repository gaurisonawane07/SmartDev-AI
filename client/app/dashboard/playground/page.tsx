"use client";

import React, { useState } from "react";
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
import { useTheme } from "next-themes";

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
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme !== "light";

    const runCode = () => {
        setIsRunning(true);
        setOutput([]); 
        
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
                new Function(code)();
                setOutput(logs);
            } catch (err: any) {
                setOutput([{ type: "error", value: "Reference Error: " + err.message }]);
            }

            console.log = originalLog;
            console.error = originalError;
        } else {
            setTimeout(() => {
                setOutput([{ type: "log", value: `[System Notice] Local execution for ${language.toUpperCase()} currently in simulation mode.` }]);
            }, 500);
        }

        setTimeout(() => setIsRunning(false), 300);
    };

    const clearConsole = () => setOutput([]);

    if (!resolvedTheme) return null;

    return (
        <div className={cn(
            "flex h-screen flex-col overflow-hidden p-6 lg:p-8 transition-colors duration-500",
            isDarkMode ? "bg-black text-white" : "bg-[#f8fafc] text-[#111111]"
        )}>
            {/* Header / Toolbar */}
            <header className={cn(
                "flex h-20 shrink-0 items-center justify-between px-8 border rounded-t-4xl relative transition-colors",
                isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-slate-200 shadow-sm"
            )}>
                <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-50" />
                
                <div className="flex items-center gap-6">
                    <div className="h-10 w-10 flex items-center justify-center bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-xl shadow-primary/10">
                        <Terminal className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter italic">Neural<span className="text-primary">Playground</span></h1>
                        <p className={cn(
                            "text-[10px] font-bold uppercase tracking-widest mt-0.5",
                            isDarkMode ? "text-white/30" : "text-slate-400"
                        )}>Global IDE Instance • Node Primary</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 relative z-50">
                    {/* Language Selector */}
                    <div className="relative">
                        <button 
                            onClick={() => setLangMenuOpen(!langMenuOpen)}
                            className={cn(
                                "flex items-center gap-3 h-11 px-6 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all min-w-40 shadow-sm",
                                isDarkMode ? "bg-white/5 border-white/10 text-white/50" : "bg-slate-50 border-slate-200 text-slate-500"
                            )}
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
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={cn(
                                            "absolute right-0 top-14 w-48 border rounded-2xl p-2 shadow-2xl space-y-1 z-50",
                                            isDarkMode ? "bg-[#1A1A1A] border-white/10" : "bg-white border-slate-200"
                                        )}
                                    >
                                        {languages.map((l) => (
                                            <button
                                                key={l.value}
                                                onClick={() => {
                                                    setLanguage(l.value);
                                                    setLangMenuOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                    language === l.value 
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                                        : isDarkMode ? "text-white/40 hover:bg-white/5 hover:text-white" : "text-slate-400 hover:bg-slate-50 hover:text-foreground"
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
                        className="flex items-center gap-3 h-11 px-8 rounded-xl bg-primary text-white text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 active:scale-95 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Play className="h-4 w-4 fill-current" />}
                        <span>Execute</span>
                    </button>
                </div>
            </header>

            {/* Main Interactive Area */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                {/* Editor Container */}
                <div className={cn(
                    "flex-1 flex flex-col border-x border-b rounded-b-4xl overflow-hidden relative shadow-sm",
                    isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-slate-200"
                )}>
                    <div className="flex-1">
                        <Editor
                            height="100%"
                            theme={isDarkMode ? "vs-dark" : "light"}
                            language={language}
                            value={code}
                            onChange={(val) => setCode(val || "")}
                            options={{
                                minimap: { enabled: true },
                                fontSize: 13,
                                lineNumbers: "on",
                                automaticLayout: true,
                                padding: { top: 24 },
                                fontFamily: "var(--font-geist-mono), monospace",
                                cursorStyle: "block",
                                smoothScrolling: true,
                                wordWrap: "on"
                            }}
                        />
                    </div>
                </div>

                {/* System Output Console */}
                <div className="w-full lg:w-[35%] flex flex-col gap-6">
                    <div className={cn(
                        "flex-1 border rounded-4xl p-6 flex flex-col shadow-sm relative transition-all",
                        isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-slate-200"
                    )}>
                        <div className="flex items-center justify-between mb-8 shrink-0">
                            <div className="flex items-center gap-3">
                                <Zap className="h-4 w-4 text-primary" />
                                <h3 className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.2em]",
                                    isDarkMode ? "text-white/80" : "text-foreground"
                                )}>Output Stream</h3>
                            </div>
                            <button 
                                onClick={clearConsole}
                                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                            {output.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-4">
                                    <Terminal className={cn("h-10 w-10", isDarkMode ? "text-white" : "text-slate-400")} />
                                    <p className={cn("text-[10px] font-black uppercase tracking-[0.3em]", isDarkMode ? "text-white" : "text-slate-500")}>Neural Socket Idle</p>
                                </div>
                            ) : (
                                output.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex items-start gap-4 p-4 rounded-xl text-[12px] font-mono leading-relaxed border transition-all",
                                            log.type === "error" 
                                                ? (isDarkMode ? "bg-red-500/5 text-red-400 border-red-500/10" : "bg-red-50 text-red-600 border-red-100") 
                                                : (isDarkMode ? "bg-primary/5 text-primary border-primary/10 font-bold" : "bg-slate-50 text-slate-700 border-slate-100")
                                        )}
                                    >
                                        <div className="mt-1 shrink-0 opacity-50">
                                            {log.type === "error" ? <XCircle className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 rotate-45" />}
                                        </div>
                                        <span className="break-all whitespace-pre-wrap">{log.value}</span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Node Status */}
                    <div className={cn(
                        "h-32 border rounded-4xl p-6 flex flex-col justify-center gap-3",
                        isDarkMode ? "bg-[#0D0D0D] border-white/5" : "bg-white border-slate-200 shadow-sm"
                    )}>
                        <div className="flex items-center justify-between">
                            <span className={cn("text-[9px] font-black uppercase tracking-widest", isDarkMode ? "text-white/30" : "text-slate-400")}>Node Status</span>
                            <div className="flex items-center gap-1.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Nominal</span>
                            </div>
                        </div>
                        <div className={cn("h-1 w-full rounded-full overflow-hidden", isDarkMode ? "bg-white/5" : "bg-slate-100")}>
                            <motion.div className="h-full bg-primary shadow-lg shadow-primary/50" animate={{ width: ["20%", "85%", "45%", "100%", "30%"] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
                        </div>
                        <p className={cn("text-[10px] font-bold uppercase tracking-tight", isDarkMode ? "text-white/40" : "text-slate-400")}>Resource extraction verified. Sandbox ready.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
