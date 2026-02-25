'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- UI Components ---

const Card = ({ 
  children, 
  className = "", 
  variant = "light"
}: { 
  children: React.ReactNode, 
  className?: string, 
  variant?: "light" | "dark" | "glass" | "accent"
}) => {
  const variants = {
    light: "bg-white shadow-soft text-text-primary border border-white/40",
    dark: "bg-bg-card-dark text-white",
    glass: "bg-white/40 backdrop-blur-xl border border-white/40 shadow-soft text-text-primary",
    accent: "bg-accent-yellow-light text-text-primary border border-accent-yellow/20"
  };

  return (
    <div className={`rounded-[24px] p-8 transition-all duration-500 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const NavPill = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <button className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-tight transition-all duration-300 ${
    active 
      ? 'bg-bg-card-dark text-white shadow-lg scale-105' 
      : 'text-text-secondary hover:text-text-primary hover:bg-white/50'
  }`}>
    {children}
  </button>
);

const StatBadge = ({ label, value, trend }: { label: string, value: string, trend?: string }) => (
  <div className="flex flex-col gap-1 pr-10 border-r border-divider last:border-0">
    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-secondary mb-1">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold tracking-tight text-text-primary">{value}</span>
      {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
    </div>
  </div>
);

// --- Main Page ---

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/admin/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-bg-global p-6 md:p-10 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1440px] min-h-[85vh] rounded-[32px] overflow-hidden flex flex-col p-10 md:p-14 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] relative border border-white/20"
        style={{ background: 'linear-gradient(135deg, #fefaf3 0%, #fbedcc 100%)' }}
      >
        {/* Navigation */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bg-card-dark rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
              <span className="text-accent-yellow font-serif text-2xl font-bold">T</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight text-text-primary">TaughtCode</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-secondary opacity-60">Admin Portal</p>
            </div>
          </div>

          <nav className="hidden lg:flex bg-white/40 backdrop-blur-md p-1.5 rounded-full border border-white/40 shadow-sm">
            {['Overview', 'Articles', 'Students', 'Templates', 'Reports'].map((tab, i) => (
              <NavPill key={tab} active={i === 0}>{tab}</NavPill>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right mr-2 hidden sm:block">
              <p className="text-sm font-bold text-text-primary leading-none">{user?.displayName || 'Administrator'}</p>
              <p className="text-[10px] font-medium text-text-secondary mt-1">{user?.email}</p>
            </div>
            <button 
              onClick={() => signOut(auth)}
              className="w-12 h-12 rounded-2xl bg-white shadow-soft flex items-center justify-center hover:bg-bg-card-dark hover:text-white transition-all duration-300 group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-12 mb-12">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-serif text-6xl md:text-7xl text-text-primary leading-[1.1] tracking-tight mb-6"
            >
              Master <span className="italic font-light opacity-50">your</span> <br />
              Digital <span className="text-accent-yellow drop-shadow-sm font-bold">Presence.</span>
            </motion.h1>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-bg-card-dark text-white rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:scale-105 transition-transform">
                Generate Article
              </button>
              <button className="px-8 py-4 bg-white text-text-primary rounded-full text-xs font-bold uppercase tracking-[0.15em] border border-white/50 hover:bg-neutral-50 transition-colors">
                View Schedule
              </button>
            </div>
          </div>

          <Card variant="glass" className="flex flex-row gap-0 py-6 px-10">
            <StatBadge label="Total Reads" value="24.8k" trend="+12%" />
            <StatBadge label="Live Users" value="842" />
            <StatBadge label="Conversion" value="3.2%" trend="+0.4%" />
          </Card>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 flex-1">
          
          {/* Card 1: Content Hub */}
          <Card className="flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-secondary">Content Hub</h3>
              <div className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
            </div>
            <div className="space-y-6 flex-1">
              {[
                { title: 'The Future of AI', type: 'Technical', date: 'Oct 12' },
                { title: 'Quantum Computing 101', type: 'Deep-dive', date: 'Oct 10' },
                { title: 'Linguistic Recovery', type: 'Research', date: 'Oct 08' }
              ].map((item, i) => (
                <div key={i} className="group cursor-pointer">
                  <p className="text-sm font-bold text-text-primary group-hover:text-accent-yellow transition-colors">{item.title}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{item.type}</span>
                    <span className="text-[10px] text-text-secondary">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 text-[10px] font-bold uppercase tracking-[0.2em] text-text-primary border-b-2 border-accent-yellow w-fit pb-1">
              Go to Articles
            </button>
          </Card>

          {/* Card 2: Engagement Analysis */}
          <Card variant="dark" className="relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-full blur-3xl group-hover:bg-accent-yellow/20 transition-colors" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] opacity-50 mb-8">Engagement</h3>
            <div className="flex items-center justify-center h-48 mb-8 relative">
              <div className="w-36 h-36 rounded-full border-[10px] border-white/5 border-t-accent-yellow shadow-[0_0_30px_rgba(252,225,102,0.2)]" />
              <div className="absolute text-center">
                <p className="text-4xl font-bold tracking-tight">88%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Retention</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Avg Time</p>
                <p className="text-lg font-bold">4m 12s</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl">
                <p className="text-[10px] font-bold uppercase opacity-40 mb-1">Bounce</p>
                <p className="text-lg font-bold">22.4%</p>
              </div>
            </div>
          </Card>

          {/* Card 3: Upcoming Tasks */}
          <Card variant="accent" className="flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary mb-8">Upcoming</h3>
            <div className="space-y-4 flex-1">
              {[
                { task: 'Review AI Output', time: '10:00 AM' },
                { task: 'Weekly Analytics', time: '02:30 PM' },
                { task: 'Team Sync-up', time: '05:00 PM' }
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/40 p-4 rounded-2xl border border-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-text-primary" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-text-primary">{t.task}</p>
                    <p className="text-[10px] font-medium text-text-secondary mt-0.5">{t.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 py-4 bg-white/60 hover:bg-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
              Full Schedule
            </button>
          </Card>

        </div>
      </motion.div>
    </div>
  );
}
