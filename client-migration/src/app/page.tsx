"use client";

import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWork";
import ProblemSolution from "@/components/landing/ProblemSolutions";
import Footer from "@/components/navigation/Footer";
import { Navbar } from "@/components/navigation/Navbar";
import { AuthRedirect } from "@/utils/AuthRedirect";

export default function Home() {
  return (
    <div className="font-sans min-h-screen w-full">
      <AuthRedirect />
      <Navbar />

      <main>
        <Hero />
        <Features />
        {/* <ProblemSolution /> */}
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
