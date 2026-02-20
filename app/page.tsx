'use client';

import { useState } from "react";
import Menu from "@/components/Menu";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-200">
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 grayscale"
        style={{
          backgroundImage: "url('/architectural-concrete-monument.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#d4d4d4'
        }}
      />

      {/* Top Navigation */}
      <header className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start md:top-6 md:left-6 md:right-6 lg:top-8 lg:left-8 lg:right-8">
        {/* Brand Name */}
        <div className="text-sm font-sans tracking-[2px] text-black font-medium uppercase">
          NISCHAY
        </div>

        {/* Center Logo */}
        <div className="text-black">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12v-4" />
            <path d="M12 12l-2-2" />
            <path d="M12 12l2-2" />
            <path d="M8 18h8" />
          </svg>
        </div>

        {/* Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="text-sm font-sans bg-transparent border-none text-black cursor-pointer hover:opacity-70 transition-opacity uppercase tracking-[1px]"
        >
          + Menu
        </button>
      </header>

      {/* Hero Content */}
      <section className="absolute top-0 left-0 w-full h-full z-5 flex justify-center items-center pointer-events-none">
        <h1 
          className="font-serif text-[#E57373] text-center uppercase tracking-[0.05em] leading-[1.1] mix-blend-multiply"
          style={{ fontSize: "clamp(3rem, 5vw, 6rem)" }}
        >
          For Downtime<br />
          &amp; Inspiration
        </h1>
      </section>

      {/* Footer / Scroll Indicator */}
      <footer className="absolute bottom-6 w-full flex justify-center z-10">
        <div className="text-[10px] font-sans tracking-[2px] text-[#333333] uppercase">
          Scroll to read magazine
        </div>
      </footer>
    </div>
  );
}
