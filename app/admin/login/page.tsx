'use client';

import Auth from "@/components/Auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/admin');
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-neutral-200 font-sans">
      {/* Background Image Layer - Same as Landing */}
      <div 
        className="absolute inset-0 z-0 grayscale"
        style={{
          backgroundImage: "url('/architectural-concrete-monument.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#d4d4d4'
        }}
      />

      {/* Top Navigation - Matching Landing */}
      <header className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start md:top-6 md:left-6 md:right-6 lg:top-8 lg:left-8 lg:right-8">
        <div className="text-sm tracking-[2px] text-black font-medium uppercase">
          NISCHAY
        </div>
        <div className="text-black">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12v-4M12 12l-2-2M12 12l2-2M8 18h8" />
          </svg>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="text-sm bg-transparent border-none text-black cursor-pointer hover:opacity-70 transition-opacity"
        >
          + Close
        </button>
      </header>

      {/* Hero Content Area - Centered Form */}
      <section className="absolute inset-0 z-5 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-[320px] text-center">
          <h1 className="font-serif text-[#E57373] text-2xl uppercase tracking-[0.2em] mb-12">
            Login
          </h1>
          <Auth />
        </div>
      </section>

      {/* Footer - Matching Landing */}
      <footer className="absolute bottom-6 w-full flex justify-center z-10">
        <div className="text-[10px] tracking-[2px] text-[#333333] uppercase">
          Administrative Access Only
        </div>
      </footer>
    </div>
  );
}
