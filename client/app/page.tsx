"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Workflow from "@/components/Workflow";
import KeyFeatures from "@/components/KeyFeatures";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-grid font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <Workflow />
        <KeyFeatures />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
