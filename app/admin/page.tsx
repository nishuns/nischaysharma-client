'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- Modern UI Components ---

const BentoCard = ({ children, className = "", noPadding = false }: { children: React.ReactNode, className?: string, noPadding?: boolean }) => (
  <div className={`bg-white rounded-3xl border border-slate-200/60 shadow-bento overflow-hidden transition-all duration-300 hover:shadow-lg ${noPadding ? '' : 'p-6 md:p-8'} ${className}`}>
    {children}
  </div>
);

const PillButton = ({ 
  children, 
  variant = "secondary", 
  className = "", 
  onClick 
}: { 
  children: React.ReactNode, 
  variant?: "primary" | "secondary" | "ghost" | "danger", 
  className?: string,
  onClick?: () => void
}) => {
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 border border-slate-800",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
  };

  return (
    <button 
      onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const NavPill = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
    active 
      ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
  }`}>
    {icon}
    {label}
  </button>
);

const StatMini = ({ label, value, trend, isPositive = true }: { label: string, value: string, trend: string, isPositive?: boolean }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-semibold tracking-tight text-slate-900">{value}</span>
      <span className={`text-xs font-medium mb-1 px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
        {trend}
      </span>
    </div>
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

  if (loading) return null; // Or a subtle modern spinner

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative overflow-hidden font-sans text-slate-900">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />

      {/* --- Floating Sidebar --- */}
      <aside className="w-72 p-6 flex flex-col h-screen sticky top-0 z-20">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-bento rounded-3xl h-full flex flex-col overflow-hidden">
          
          {/* Logo */}
          <div className="p-6 pt-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 transform rotate-3">
              <span className="font-serif font-bold text-white text-xl -rotate-3">T</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight leading-none text-slate-900">TaughtCode</h1>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">Workspace</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <NavPill active label="Overview" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
            <NavPill label="Content" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} />
            <NavPill label="Audience" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} />
            <NavPill label="Analytics" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} />
            <div className="pt-4 mt-4 border-t border-slate-100">
              <NavPill label="Settings" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
            </div>
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.displayName?.[0] || 'A'}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.displayName || 'Admin User'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <PillButton variant="ghost" className="w-full text-xs" onClick={() => signOut(auth)}>
              Sign Out
            </PillButton>
          </div>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-6 lg:p-10 lg:pl-4 max-w-7xl mx-auto relative z-10 overflow-y-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">Welcome back, {user?.displayName?.split(' ')[0] || 'Admin'}</h2>
            <p className="text-sm text-slate-500">Here's what's happening with your platform today.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <PillButton variant="secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              View Site
            </PillButton>
            <PillButton variant="primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              Create Content
            </PillButton>
          </motion.div>
        </header>

        {/* Bento Grid Layout */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          
          {/* Top Stats Row (Spans 8 cols on large screens) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <BentoCard>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
              </div>
              <StatMini label="Total Views" value="48.2k" trend="+12.5%" />
            </BentoCard>
            <BentoCard>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <StatMini label="Subscribers" value="1,204" trend="+4.2%" />
            </BentoCard>
            <BentoCard>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <StatMini label="Avg. Engagement" value="68%" trend="+2.1%" />
            </BentoCard>
          </div>

          {/* Quick AI Action Card (Spans 4 cols) */}
          <BentoCard className="lg:col-span-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors" />
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">AI Assistant Online</span>
                </div>
                <h3 className="text-2xl font-serif mb-2 text-white">Generate Content</h3>
                <p className="text-sm text-indigo-100/70 mb-6">Let the AI draft your next high-performing technical article.</p>
              </div>
              <PillButton variant="secondary" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Start Generating
              </PillButton>
            </div>
          </BentoCard>

          {/* Recent Content Table (Spans 8 cols) */}
          <BentoCard noPadding className="lg:col-span-8 flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">Recent Content</h3>
              <PillButton variant="ghost" className="text-xs py-1.5 px-3 h-auto">View All</PillButton>
            </div>
            <div className="divide-y divide-slate-100 flex-1">
              {[
                { title: 'The Future of AI Architecture', type: 'Technical Guide', date: 'Today', status: 'Published' },
                { title: 'Designing Minimalist Systems', type: 'Design Pattern', date: 'Yesterday', status: 'Draft' },
                { title: 'Quantum Computing 101', type: 'Deep Dive', date: 'Oct 24', status: 'Review' },
                { title: 'State Management in 2026', type: 'Tutorial', date: 'Oct 20', status: 'Published' },
              ].map((item, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>{item.type}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      item.status === 'Draft' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </BentoCard>

          {/* System Health / Secondary Column (Spans 4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Storage/Health Widget */}
            <BentoCard>
              <h3 className="font-semibold text-slate-900 mb-6">Storage Overview</h3>
              <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="absolute top-0 left-0 h-full w-[65%] bg-indigo-500 rounded-full" />
                <div className="absolute top-0 left-[65%] h-full w-[15%] bg-blue-400 rounded-full border-l-2 border-white" />
              </div>
              <div className="flex justify-between items-center text-sm mb-6">
                <span className="font-semibold text-slate-900">82.4 GB <span className="text-slate-500 font-normal">/ 100 GB</span></span>
                <span className="text-slate-500">80% Used</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-slate-600">Media Assets</span>
                  </div>
                  <span className="font-medium text-slate-900">65.2 GB</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="text-slate-600">Database Backups</span>
                  </div>
                  <span className="font-medium text-slate-900">17.2 GB</span>
                </div>
              </div>
              <PillButton variant="ghost" className="w-full mt-6 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                Upgrade Plan
              </PillButton>
            </BentoCard>

            {/* Quick Actions List */}
            <BentoCard noPadding>
              <div className="p-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900">Quick Actions</h3>
              </div>
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 text-left">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  Add New User
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 text-left">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  System Settings
                </button>
              </div>
            </BentoCard>

          </div>

        </motion.div>
      </main>
    </div>
  );
}
