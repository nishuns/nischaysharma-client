'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { primaryNavItems, secondaryNavItems } from '@/config/adminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  // Do not wrap login page in dashboard layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isActive = (href: string) => pathname === href;

  return (
    <div className="dashboard">
      
      {/* --- Sidebar --- */}
      <aside className="dashboard__sidebar">
        {/* Logo */}
        <div className="dashboard__logo">
          <Link href="/admin" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>TaughtCode<span>.</span></h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="dashboard__nav">
          {primaryNavItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={`dashboard__nav-item ${isActive(item.href) ? 'dashboard__nav-item--active' : ''}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
          
          <div className="dashboard__nav-divider"></div>
          
          {secondaryNavItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={`dashboard__nav-item ${isActive(item.href) ? 'dashboard__nav-item--active' : ''}`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="dashboard__profile">
          <div className="dashboard__profile-info">
            <div className="dashboard__profile-avatar">
              {user?.displayName?.[0] || 'A'}
            </div>
            <div className="dashboard__profile-text">
              <div className="name">{user?.displayName || 'Administrator'}</div>
              <div className="email">{user?.email}</div>
            </div>
          </div>
          <button className="btn btn--ghost btn--full" onClick={() => signOut(auth)}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="dashboard__main">
        
        {/* Header */}
        <header className="dashboard__header">
          <div></div>
          <div className="dashboard__header-actions">
            <Link href="/" className="btn btn--secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              View Site
            </Link>
            <button className="btn btn--primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Draft
            </button>
          </div>
        </header>

        <div className="dashboard__content">
          {children}
        </div>
      </main>
    </div>
  );
}
