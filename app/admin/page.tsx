'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
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
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 font-sans text-xs tracking-[0.2em] uppercase text-neutral-400">
        Loading Interface...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between h-screen fixed left-0 top-0 z-20">
        <div>
          <div className="p-8 border-b border-neutral-100">
            <h1 className="font-serif text-xl tracking-wider uppercase">Nischay</h1>
            <p className="text-[10px] text-neutral-400 mt-2 uppercase tracking-widest">Dashboard</p>
          </div>
          
          <nav className="mt-8 px-4 space-y-2">
            {['Overview', 'Articles', 'Gallery', 'Subscribers', 'Settings'].map((item) => (
              <button 
                key={item}
                className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-neutral-50 hover:text-black text-neutral-500 transition-colors rounded-sm"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] text-neutral-400 uppercase tracking-wide truncate max-w-[120px]">
              {user?.email}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-center text-[10px] uppercase tracking-[0.15em] border border-neutral-200 px-4 py-3 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12 lg:p-16">
        <header className="mb-16 flex justify-between items-end border-b border-neutral-200 pb-8">
          <div>
            <span className="block text-[10px] text-[#E57373] uppercase tracking-[0.2em] mb-4 font-medium">Overview</span>
            <h2 className="font-serif text-4xl lg:text-5xl text-neutral-800 font-light leading-tight">
              Welcome back,<br />
              <span className="italic opacity-60">Admin</span>
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'Active Users', value: '0', change: '+0%' },
            { label: 'Published Posts', value: '0', change: 'Drafts: 0' },
            { label: 'Total Views', value: '0', change: 'This Month' }
          ].map((stat, i) => (
            <div key={i} className="group p-8 bg-white border border-neutral-100 hover:border-neutral-300 hover:shadow-xl transition-all duration-500 cursor-pointer">
              <div className="flex justify-between items-start mb-8">
                <h3 className="font-serif text-sm text-neutral-400 uppercase tracking-wider">{stat.label}</h3>
                <span className="text-[10px] bg-neutral-50 px-2 py-1 uppercase tracking-wider text-neutral-400 group-hover:bg-black group-hover:text-white transition-colors">
                  {stat.change}
                </span>
              </div>
              <p className="font-serif text-5xl lg:text-6xl font-light text-neutral-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity Section Placeholder */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-serif text-2xl text-neutral-800">Recent Content</h3>
            <button className="text-[10px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity">View All</button>
          </div>
          <div className="bg-white border border-neutral-100 p-12 text-center text-neutral-400 text-xs uppercase tracking-widest min-h-[200px] flex items-center justify-center">
            No recent activity to display
          </div>
        </div>
      </main>
    </div>
  );
}
