'use client';

import { useState } from "react";
import Menu from "@/components/Menu";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="landing">
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      {/* Background Image Layer */}
      <div className="landing__bg" />

      {/* Top Navigation */}
      <header className="landing__header">
        <div className="landing__brand">NISCHAY</div>

        <div className="landing__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12v-4" />
            <path d="M12 12l-2-2" />
            <path d="M12 12l2-2" />
            <path d="M8 18h8" />
          </svg>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="landing__menu-btn">
          + Menu
        </button>
      </header>

      {/* Hero Content */}
      <section className="landing__hero">
        <h1 className="landing__title">
          For Downtime<br />
          &amp; Inspiration
        </h1>
      </section>

      {/* Footer / Scroll Indicator */}
      <footer className="landing__footer">
        <div className="landing__scroll-text">
          Scroll to read magazine
        </div>
      </footer>
    </div>
  );
}
