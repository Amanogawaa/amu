'use client';

import CTA from '@/components/landing/CTA';
import Features from '@/components/landing/Features';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWork';
import ProblemSolution from '@/components/landing/ProblemSolutions';
import Footer from '@/components/navigation/Footer';
import { Navbar } from '@/components/navigation/Navbar';

export default function Home() {
  return (
    <div className="font-sans min-h-screen w-full">
      <Navbar />
      {/* 
      <iframe
        src="https://codesandbox.io/embed/[sandbox-id]"
        style={{
          width: '100%',
          height: '500px',
          border: 0,
          borderRadius: '4px',
        }}
        title="Exercise"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      /> */}

      <main>
        <Hero />
        <Features />
        <ProblemSolution />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
