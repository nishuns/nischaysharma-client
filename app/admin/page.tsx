'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- Sub-components ---

const Card = ({ 
  children, 
  className = "", 
  variant = "light",
  style = {}
}: { 
  children: React.ReactNode, 
  className?: string, 
  variant?: "light" | "dark" | "glass" | "image",
  style?: React.CSSProperties
}) => {
  const baseStyles = "rounded-[24px] p-6 transition-all duration-300";
  const variants = {
    light: "bg-white shadow-soft text-text-primary",
    dark: "bg-bg-card-dark text-white",
    glass: "bg-white/30 backdrop-blur-md border border-white/20 shadow-soft",
    image: "relative overflow-hidden text-white"
  };

  return (
    <div 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    >
      {variant === "image" && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 z-0" />
      )}
      <div className={variant === "image" ? "relative z-10" : ""}>
        {children}
      </div>
    </div>
  );
};

const Pill = ({ children, active = false }: { children: React.ReactNode, active?: boolean }) => (
  <div className={`px-5 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
    active ? 'bg-bg-card-dark text-white shadow-lg' : 'text-text-secondary hover:bg-black/5'
  }`}>
    {children}
  </div>
);

const MetricItem = ({ label, value, color = "bg-accent-yellow" }: { label: string, value: string, color?: string }) => (
  <div className="flex flex-col gap-1 px-4 border-r border-divider last:border-0">
    <span className="text-[10px] uppercase tracking-widest text-text-secondary font-semibold">{label}</span>
    <span className="text-xl font-bold text-text-primary">{value}</span>
    <div className={`h-1 w-8 rounded-full ${color}`} />
  </div>
);

// --- Main Page Component ---

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

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-global">
        <div className="animate-pulse text-xs tracking-[0.2em] uppercase text-white font-bold">Initializing Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-global p-4 md:p-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1400px] min-h-[90vh] rounded-[32px] overflow-hidden flex flex-col p-8 md:p-10 shadow-2xl relative"
        style={{ background: 'linear-gradient(135deg, #fefaf3 0%, #fbedcc 100%)' }}
      >
        {/* Top Navigation */}
        <nav className="flex items-center justify-between mb-12">
          {/* Logo Pill */}
          <div className="bg-bg-card-dark text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-6 h-6 bg-accent-yellow rounded-full" />
            <span className="font-serif font-bold tracking-tight">TaughtCode</span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex bg-white/50 backdrop-blur-sm p-1.5 rounded-full border border-white/40 shadow-soft">
            {['Dashboard', 'Articles', 'Students', 'Analytics', 'Settings'].map((tab, idx) => (
              <Pill key={tab} active={idx === 0}>{tab}</Pill>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center cursor-pointer hover:bg-accent-yellow transition-colors">
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </div>
            <div 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-bg-card-dark text-white shadow-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </div>
          </div>
        </nav>

        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="flex flex-col gap-4">
            <h1 className="font-serif text-5xl md:text-6xl text-text-primary tracking-tight leading-tight">
              Platform <span className="italic opacity-40 font-light underline decoration-accent-yellow underline-offset-8">Overview</span>
            </h1>
            <div className="flex bg-white/40 p-1 rounded-full w-fit border border-white/30 shadow-sm">
              <div className="bg-bg-card-dark text-white px-4 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest">Real-time</div>
              <div className="px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest text-text-secondary">Historical</div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md p-6 rounded-[24px] shadow-soft flex gap-4 border border-white/50">
            <MetricItem label="Content" value="128" color="bg-accent-yellow" />
            <MetricItem label="Authors" value="12" color="bg-indigo-400" />
            <MetricItem label="Engagement" value="94%" color="bg-emerald-400" />
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-6 flex-1">
          
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            <Card variant="image" className="h-[200px] flex flex-col justify-end gap-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80">Featured Teacher</span>
              <h3 className="text-2xl font-bold">Nischay Sharma</h3>
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit text-[10px] font-bold border border-white/10 mt-2">
                EXPERT INSTRUCTOR
              </div>
            </Card>
            
            <Card className="flex-1">
              <h4 className="font-bold text-xs uppercase tracking-widest text-text-secondary mb-6">Quick Navigation</h4>
              <div className="space-y-3">
                {['Live Sessions', 'Course Materials', 'Student Reviews', 'Billing History'].map((item, idx) => (
                  <div key={item} className={`group flex items-center justify-between p-4 rounded-[16px] cursor-pointer transition-all ${idx === 0 ? 'bg-accent-yellow-light text-text-primary' : 'hover:bg-neutral-50'}`}>
                    <span className="text-sm font-semibold">{item}</span>
                    <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${idx === 0 ? 'text-text-primary' : 'text-text-secondary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Middle Column */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="h-[180px] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Readership</span>
                  <div className="w-8 h-8 rounded-full bg-accent-yellow-light flex items-center justify-center">
                    <div className="w-4 h-4 text-accent-yellow">
                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1 h-12 bg-neutral-100 rounded-md relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent-yellow rounded-t-sm" />
                    <div className="absolute bottom-0 left-[26%] w-1/4 h-3/4 bg-accent-yellow rounded-t-sm" />
                    <div className="absolute bottom-0 left-[52%] w-1/4 h-[90%] bg-accent-yellow rounded-t-sm" />
                    <div className="absolute bottom-0 left-[78%] w-1/4 h-[40%] bg-accent-yellow rounded-t-sm" />
                  </div>
                </div>
              </Card>
              
              <Card className="h-[180px] flex flex-col items-center justify-center gap-4 relative">
                <div className="w-24 h-24 rounded-full border-[8px] border-neutral-100 border-t-accent-yellow rotate-[45deg]" />
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold">78%</span>
                  <span className="text-[8px] uppercase tracking-widest text-text-secondary">Progress</span>
                </div>
              </Card>
            </div>

            <Card className="flex-1 min-h-[300px]">
              <div className="flex justify-between items-center mb-8">
                <h4 className="font-bold text-xs uppercase tracking-widest text-text-secondary">Recent Content Activity</h4>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-accent-yellow" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
              </div>
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-10 bg-divider rounded-full mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-text-primary">Article Published: Future of AI</span>
                        <span className="text-[10px] text-text-secondary">2h ago</span>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">System successfully deployed the technical deep-dive on quantum computing...</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            <Card className="bg-accent-yellow-light border border-accent-yellow/20">
              <h4 className="font-bold text-xs uppercase tracking-widest text-text-primary mb-6">Learning Goals</h4>
              <div className="space-y-4">
                {[
                  { label: 'Technical Writing', val: 85 },
                  { label: 'SEO Optimization', val: 40 },
                  { label: 'Cloud Architecture', val: 65 }
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span>{item.label}</span>
                      <span>{item.val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-text-primary" style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="dark" className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-xs uppercase tracking-widest opacity-60">Pending Tasks</h4>
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {[
                  { task: 'Review AI Generation', done: true },
                  { task: 'Update API Endpoints', done: false },
                  { task: 'Clean Up Database', done: false },
                  { task: 'User Interview', done: false }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-[16px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-accent-yellow' : 'bg-indigo-400'}`} />
                      <span className="text-xs font-medium">{item.task}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${item.done ? 'bg-accent-yellow border-accent-yellow' : 'border-white/20'}`}>
                      {item.done && <svg className="w-3 h-3 text-bg-card-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-4 rounded-[20px] bg-white text-bg-card-dark text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-accent-yellow transition-colors">
                View All Schedule
              </button>
            </Card>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
