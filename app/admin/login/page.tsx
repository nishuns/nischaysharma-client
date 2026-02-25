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
    <div className="login">
      <div className="login__bg" />

      <header className="login__header">
        <div className="login__brand">NISCHAY</div>
        <div className="login__logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 12v-4M12 12l-2-2M12 12l2-2M8 18h8" />
          </svg>
        </div>
        <button onClick={() => router.push('/')} className="login__close-btn">
          + Close
        </button>
      </header>

      <section className="login__content">
        <div className="login__box">
          <h1 className="login__title">Login</h1>
          <Auth />
        </div>
      </section>

      <footer className="login__footer">
        <div className="login__footer-text">
          Administrative Access Only
        </div>
      </footer>
    </div>
  );
}
