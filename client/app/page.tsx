"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import TrustSection from "@/components/TrustSection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-grid font-sans selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <TrustSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
