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
    light: "bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-text-primary border border-black/[0.03]",
    dark: "bg-bg-card-dark text-white shadow-xl",
    glass: "bg-white/60 backdrop-blur-xl border border-white/40 shadow-soft text-text-primary",
    accent: "bg-accent-yellow-light/50 text-text-primary border border-accent-yellow/20"
  };

  return (
    <div className={`rounded-[28px] p-8 transition-all duration-500 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const NavItem = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <button className={`relative px-1 py-2 text-sm font-bold tracking-tight transition-all duration-300 ${
    active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
  }`}>
    {children}
    {active && (
      <motion.div 
        layoutId="navUnderline"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-yellow"
      />
    )}
  </button>
);

const StatBadge = ({ label, value, trend }: { label: string, value: string, trend?: string }) => (
  <div className="flex flex-col gap-1 pr-12 last:pr-0 border-r border-black/[0.05] last:border-0">
    <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-text-secondary/60">{label}</span>
    <div className="flex items-baseline gap-2">
      <span className="text-4xl font-bold tracking-tight text-text-primary">{value}</span>
      {trend && <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
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
    <div className="min-h-screen w-full flex flex-col p-6 md:p-12 lg:p-16 max-w-[1600px] mx-auto">
      {/* Navigation - Clean & Modern */}
      <header className="flex items-center justify-between mb-20">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bg-card-dark rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-accent-yellow font-serif text-xl font-bold">T</span>
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-text-primary">TaughtCode</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Overview', 'Articles', 'Students', 'Templates'].map((tab, i) => (
              <NavItem key={tab} active={i === 0}>{tab}</NavItem>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 bg-white/40 hover:bg-white/60 transition-colors p-1.5 pr-5 rounded-full border border-white/40 cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-accent-yellow flex items-center justify-center font-bold text-xs text-text-primary shadow-sm group-hover:scale-105 transition-transform">
              {user?.displayName?.[0] || 'A'}
            </div>
            <span className="text-xs font-bold text-text-primary tracking-tight">{user?.displayName || 'Admin'}</span>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-11 h-11 rounded-full bg-bg-card-dark text-white flex items-center justify-center hover:scale-110 transition-all shadow-lg group"
          >
            <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
          </button>
        </div>
      </header>

      {/* Hero Content */}
      <section className="mb-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent-yellow/20 text-accent-yellow text-[10px] font-black uppercase tracking-[0.25em] mb-6"
            >
              Control Center
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-7xl md:text-8xl text-text-primary leading-[0.95] tracking-tighter"
            >
              Elevate <br />
              <span className="italic font-light text-text-primary/40">the</span> <span className="text-text-primary">Standard.</span>
            </motion.h1>
          </div>

          <div className="flex gap-4 mb-2">
            <button className="h-16 px-10 bg-bg-card-dark text-white rounded-2xl text-xs font-bold uppercase tracking-[0.2em] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1">
              Create New
            </button>
            <button className="h-16 w-16 bg-white text-text-primary rounded-2xl flex items-center justify-center border border-black/5 hover:bg-neutral-50 transition-colors shadow-sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="mb-12">
        <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-10 border border-white/60 shadow-sm inline-flex flex-wrap gap-0">
          <StatBadge label="Total Reach" value="48.2k" trend="+18%" />
          <StatBadge label="Active Students" value="1,204" />
          <StatBadge label="Avg. Score" value="92" trend="+4%" />
        </div>
      </section>

      {/* Content Grid */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        
        {/* Articles List */}
        <Card className="flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-secondary/50">Recent Articles</h3>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="space-y-8 flex-1">
            {[
              { title: 'The Art of Clean Code', type: 'Design', views: '2.4k' },
              { title: 'Next.js 15 Deep Dive', type: 'Tech', views: '1.8k' },
              { title: 'Linguistic Psychology', type: 'Research', views: '942' }
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer flex items-center justify-between">
                <div>
                  <p className="text-base font-bold text-text-primary group-hover:translate-x-1 transition-transform">{item.title}</p>
                  <p className="text-[10px] font-bold text-text-secondary/60 uppercase tracking-widest mt-1">{item.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text-primary">{item.views}</p>
                  <p className="text-[9px] font-bold text-emerald-500 uppercase">views</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-10 group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">
            View Repository 
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </Card>

        {/* Dynamic Metric */}
        <Card variant="dark" className="relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-yellow/10 rounded-full blur-[100px] group-hover:bg-accent-yellow/20 transition-all duration-700" />
          
          <div className="relative">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-white/40 mb-12">Performance</h3>
            <div className="flex flex-col gap-2">
              <span className="text-6xl font-bold tracking-tighter">94%</span>
              <span className="text-sm font-bold text-white/60">Average Completion Rate</span>
            </div>
          </div>

          <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '94%' }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-accent-yellow shadow-[0_0_20px_rgba(252,225,102,0.4)]"
            />
          </div>
        </Card>

        {/* Active Schedule */}
        <Card variant="accent" className="flex flex-col">
          <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-text-primary/50 mb-10">Live Schedule</h3>
          <div className="space-y-4 flex-1">
            {[
              { task: 'AI Pipeline Review', status: 'In Progress' },
              { task: 'Student Onboarding', status: 'Upcoming' },
              { task: 'Database Migration', status: 'Completed' }
            ].map((t, i) => (
              <div key={i} className="bg-white/60 p-5 rounded-2xl border border-white/60 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">{t.task}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${t.status === 'In Progress' ? 'text-accent-yellow' : 'text-text-secondary/40'}`}>
                    {t.status}
                  </p>
                </div>
                {t.status === 'Completed' && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="mt-8 h-14 bg-white/80 hover:bg-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-sm transition-all active:scale-95">
            Manage Calendar
          </button>
        </Card>

      </main>
    </div>
  );
}
