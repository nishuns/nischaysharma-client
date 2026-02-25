'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// --- Shared Layout Components ---

const SidebarLink = ({ label, active = false }: { label: string, active?: boolean }) => (
  <button className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
    active 
      ? 'bg-neutral-900 text-white shadow-sm' 
      : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
  }`}>
    {label}
  </button>
);

const MetricCard = ({ title, value, subtext }: { title: string, value: string, subtext: string }) => (
  <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-3xl font-serif text-neutral-900">{value}</span>
    </div>
    <span className="text-xs text-neutral-400 font-medium">{subtext}</span>
  </div>
);

// --- Main Dashboard Page ---

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">Loading Workspace</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans">
      
      {/* --- Sidebar Navigation --- */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between fixed h-screen left-0 top-0 z-10">
        <div>
          {/* Logo Area */}
          <div className="p-6 border-b border-neutral-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 text-white rounded-md flex items-center justify-center font-serif font-bold text-lg">
              T
            </div>
            <div>
              <h1 className="font-bold text-neutral-900 tracking-tight leading-none">TaughtCode</h1>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1 font-semibold">Workspace</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            <SidebarLink label="Overview" active />
            <SidebarLink label="Articles" />
            <SidebarLink label="Subscribers" />
            <SidebarLink label="Comments" />
            <SidebarLink label="Settings" />
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-3 p-2 mb-2 rounded-lg bg-neutral-50 border border-neutral-100">
            <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-xs font-bold text-neutral-600">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-neutral-900 truncate">{user?.displayName || 'Admin'}</p>
              <p className="text-[10px] text-neutral-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut(auth)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 ml-64 min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Dashboard</h2>
            <p className="text-xs text-neutral-500 font-medium">Welcome back, {user?.displayName || 'Administrator'}.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-neutral-700 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors shadow-sm">
              View Site
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
              New Article
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Page Title section */}
            <div className="mb-8">
              <h1 className="font-serif text-4xl text-neutral-900">Platform Overview</h1>
              <p className="text-sm text-neutral-500 mt-2">A high-level summary of your content and engagement.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <MetricCard 
                title="Total Reads" 
                value="24.8k" 
                subtext="+12% from last month" 
              />
              <MetricCard 
                title="Active Subscribers" 
                value="1,204" 
                subtext="+42 new this week" 
              />
              <MetricCard 
                title="Published Articles" 
                value="48" 
                subtext="2 drafts pending review" 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Recent Content Table/List */}
              <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
                  <h3 className="text-sm font-semibold text-neutral-900">Recent Articles</h3>
                  <button className="text-xs font-semibold text-neutral-500 hover:text-neutral-900">View All &rarr;</button>
                </div>
                <div className="divide-y divide-neutral-100">
                  {[
                    { title: 'The Future of AI Architecture', status: 'Published', date: 'Oct 12, 2026', author: 'N. Sharma' },
                    { title: 'Quantum Computing Fundamentals', status: 'Draft', date: 'Oct 10, 2026', author: 'N. Sharma' },
                    { title: 'Linguistic Psychology in UX', status: 'Published', date: 'Oct 08, 2026', author: 'System AI' },
                    { title: 'Designing Minimalist Dashboards', status: 'Review', date: 'Oct 05, 2026', author: 'N. Sharma' }
                  ].map((item, i) => (
                    <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer group">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                          <span>{item.author}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${
                          item.status === 'Published' ? 'bg-green-50 text-green-700 border border-green-200/50' :
                          item.status === 'Draft' ? 'bg-neutral-100 text-neutral-600 border border-neutral-200' :
                          'bg-yellow-50 text-yellow-700 border border-yellow-200/50'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Side Column: Quick Actions & System Status */}
              <div className="space-y-6">
                
                {/* System Status Card */}
                <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-medium text-neutral-700">Database Connection</span>
                      </div>
                      <span className="text-xs text-neutral-500">Healthy</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-neutral-700">AI Article Generator</span>
                      </div>
                      <span className="text-xs text-neutral-500">Online</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-medium text-neutral-700">Storage Bucket</span>
                      </div>
                      <span className="text-xs text-neutral-500">92% Free</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-neutral-900 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                  <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-4">Quick Shortcuts</h3>
                  <div className="space-y-2 relative z-10">
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                      Generate with AI
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                      Manage Templates
                      <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-red-300 hover:text-red-200">
                      Clear Cache
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
