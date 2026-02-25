'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- Premium UI Components ---

const Card = ({ children, className = "", noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean }) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 shadow-premium overflow-hidden transition-all duration-300 ${noPadding ? '' : 'p-8'} ${className}`}>
    {children}
  </div>
);

const PillButton = ({ 
  children, 
  variant = "primary", 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode, 
  variant?: "primary" | "secondary" | "ghost", 
  className?: string,
  onClick?: () => void
}) => {
  const variants = {
    primary: "bg-neutral-900 text-white hover:bg-black border border-neutral-900 hover:shadow-md",
    secondary: "bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 shadow-sm",
    ghost: "bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900",
  };

  return (
    <button 
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const NavPill = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
    active 
      ? 'bg-neutral-900 text-white shadow-premium' 
      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
  }`}>
    {icon}
    {label}
  </button>
);

const StatMini = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-3">
    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em]">{label}</span>
    <span className="text-4xl font-serif tracking-tight text-neutral-900">{value}</span>
  </div>
);

// --- Main Dashboard ---

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
    <div className="min-h-screen bg-[#fafafa] flex font-sans text-neutral-900">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 z-20">
        
        {/* Logo */}
        <div className="h-20 px-8 flex items-center border-b border-neutral-100">
          <h1 className="font-serif font-bold text-xl tracking-tight text-neutral-900">TaughtCode<span className="text-neutral-400">.</span></h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavPill active label="Overview" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
          <NavPill label="Content" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} />
          <NavPill label="Audience" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
          <div className="pt-6 mt-6 border-t border-neutral-100">
            <NavPill label="Settings" icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-serif font-bold text-lg border border-neutral-300">
              {user?.displayName?.[0] || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-neutral-900 truncate">{user?.displayName || 'Administrator'}</p>
              <p className="text-[10px] text-neutral-500 truncate uppercase tracking-wider">{user?.email}</p>
            </div>
          </div>
          <PillButton variant="ghost" className="w-full text-xs" onClick={() => signOut(auth)}>
            Sign Out
          </PillButton>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col min-h-screen max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <header className="h-20 px-10 flex items-center justify-between sticky top-0 bg-[#fafafa]/90 backdrop-blur-md z-10 border-b border-transparent">
          <div className="flex-1" /> {/* Spacer */}
          <div className="flex items-center gap-4">
            <PillButton variant="secondary">
              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              View Site
            </PillButton>
            <PillButton variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Draft
            </PillButton>
          </div>
        </header>

        <div className="p-10 flex-1 space-y-10">
          
          {/* Page Title */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-4xl font-serif text-neutral-900 mb-2">Platform Overview</h2>
            <p className="text-sm text-neutral-500 font-medium">Analytics and recent activity for TaughtCode.</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          >
            <Card>
              <StatMini label="Total Views" value="48.2k" />
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
                <span className="text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">+12.5%</span> from last month
              </div>
            </Card>
            <Card>
              <StatMini label="Subscribers" value="1,204" />
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
                <span className="text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">+42</span> new this week
              </div>
            </Card>
            <Card>
              <StatMini label="Avg. Engagement" value="68%" />
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
                <span className="text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">+2.1%</span> from last month
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Recent Content Table */}
            <Card noPadding className="lg:col-span-2 flex flex-col h-full">
              <div className="px-8 py-6 border-b border-neutral-100 flex items-center justify-between bg-white">
                <h3 className="font-semibold text-neutral-900 text-sm">Recent Publications</h3>
                <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors">View All &rarr;</button>
              </div>
              <div className="divide-y divide-neutral-100 flex-1">
                {[
                  { title: 'The Future of AI Architecture', type: 'Technical Guide', date: 'Today', status: 'Published' },
                  { title: 'Designing Minimalist Systems', type: 'Design Pattern', date: 'Yesterday', status: 'Draft' },
                  { title: 'Quantum Computing 101', type: 'Deep Dive', date: 'Oct 24', status: 'Review' },
                  { title: 'State Management in 2026', type: 'Tutorial', date: 'Oct 20', status: 'Published' },
                ].map((item, i) => (
                  <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-neutral-50 transition-colors group cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-semibold text-neutral-900 group-hover:underline decoration-neutral-300 underline-offset-4">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                        <span>{item.type}</span>
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                        item.status === 'Published' ? 'bg-white text-neutral-900 border-neutral-200' :
                        item.status === 'Draft' ? 'bg-neutral-100 text-neutral-500 border-transparent' :
                        'bg-white text-neutral-500 border-neutral-200 border-dashed'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* AI Action / Side Card */}
            <div className="flex flex-col gap-6 h-full">
              
              <Card className="bg-neutral-900 text-white border-transparent">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">Generative AI</h3>
                <h4 className="text-xl font-serif mb-2">Draft Content</h4>
                <p className="text-sm text-neutral-400 mb-8 leading-relaxed">Leverage the fine-tuned model to generate technical outlines and drafts.</p>
                <PillButton variant="secondary" className="w-full bg-white text-neutral-900 border-transparent hover:bg-neutral-100">
                  <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Open Generator
                </PillButton>
              </Card>

              <Card className="flex-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-6">Quick Links</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-700">
                    User Management
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-700">
                    API Credentials
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium text-neutral-700">
                    System Logs
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </Card>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
