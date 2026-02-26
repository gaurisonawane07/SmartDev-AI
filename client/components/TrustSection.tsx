import { ShieldCheck, Code2, Zap } from "lucide-react";

export default function TrustSection() {
    return (
        <section className="bg-secondary/20 py-24 border-y border-border/50">
            <div className="mx-auto max-w-7xl px-6 text-center">
                <div className="flex justify-center gap-12 flex-wrap opacity-50 grayscale">
                    <div className="flex items-center gap-2 text-white"><ShieldCheck className="h-5 w-5" /> Security First</div>
                    <div className="flex items-center gap-2 text-white"><Code2 className="h-5 w-5" /> Open Architecture</div>
                    <div className="flex items-center gap-2 text-white"><Zap className="h-5 w-5" /> Extreme Speed</div>
                </div>
            </div>
        </section>
    );
}
