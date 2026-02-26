'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
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

  const navItems = [
    { name: 'Overview', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { name: 'Profile', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { name: 'Organization', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { name: 'Templates', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg> },
    { name: 'Articles', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
  ];

  return (
    <div className="dashboard">
      
      {/* --- Sidebar --- */}
      <aside className="dashboard__sidebar">
        {/* Logo */}
        <div className="dashboard__logo">
          <h1>TaughtCode<span>.</span></h1>
        </div>

        {/* Navigation */}
        <nav className="dashboard__nav">
          {navItems.map((item) => (
            <button 
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`dashboard__nav-item ${activeTab === item.name ? 'dashboard__nav-item--active' : ''}`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
          
          <div className="dashboard__nav-divider"></div>
          
          <button 
            onClick={() => setActiveTab('Settings')}
            className={`dashboard__nav-item ${activeTab === 'Settings' ? 'dashboard__nav-item--active' : ''}`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Settings
          </button>
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
            <button className="btn btn--secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              View Site
            </button>
            <button className="btn btn--primary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              New Draft
            </button>
          </div>
        </header>

        <div className="dashboard__content">
          
          <div className="dashboard__title">
            <h2>Platform Overview</h2>
            <p>Analytics and recent activity for TaughtCode.</p>
          </div>

          {/* Stats Grid */}
          <div className="dashboard__grid-stats">
            <div className="card card--padded">
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Total Views</span>
                <span className="dashboard__stat-value">48.2k</span>
                <div className="dashboard__stat-trend">
                  <span>+12.5%</span> from last month
                </div>
              </div>
            </div>
            <div className="card card--padded">
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Subscribers</span>
                <span className="dashboard__stat-value">1,204</span>
                <div className="dashboard__stat-trend">
                  <span>+42</span> new this week
                </div>
              </div>
            </div>
            <div className="card card--padded">
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Avg. Engagement</span>
                <span className="dashboard__stat-value">68%</span>
                <div className="dashboard__stat-trend">
                  <span>+2.1%</span> from last month
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard__grid-layout">
            
            {/* Recent Content */}
            <div className="card dashboard__recent">
              <div className="dashboard__recent-header">
                <h3>Recent Publications</h3>
                <button className="btn btn--ghost">View All &rarr;</button>
              </div>
              <div className="dashboard__recent-list">
                {[
                  { title: 'The Future of AI Architecture', type: 'Technical Guide', date: 'Today', status: 'Published' },
                  { title: 'Designing Minimalist Systems', type: 'Design Pattern', date: 'Yesterday', status: 'Draft' },
                  { title: 'Quantum Computing 101', type: 'Deep Dive', date: 'Oct 24', status: 'Review' },
                  { title: 'State Management in 2026', type: 'Tutorial', date: 'Oct 20', status: 'Published' },
                ].map((item, i) => (
                  <div key={i} className="dashboard__recent-item">
                    <div className="dashboard__recent-item-info">
                      <div className="dashboard__recent-item-title">{item.title}</div>
                      <div className="dashboard__recent-item-meta">
                        <span>{item.type}</span>
                        <span className="dot" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                    <div>
                      <span className={`badge badge--${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="dashboard__sidebar-col">
              
              <div className="card card--padded card--dark dashboard__ai-card">
                <h3>Generative AI</h3>
                <h4>Draft Content</h4>
                <p>Leverage the fine-tuned model to generate technical outlines and drafts.</p>
                <button className="btn btn--secondary btn--full">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Open Generator
                </button>
              </div>

              <div className="card dashboard__links-card">
                <div className="card--padded" style={{ paddingBottom: '0.5rem' }}>
                  <h3>Quick Links</h3>
                </div>
                <div className="links" style={{ padding: '0 1rem 1rem 1rem' }}>
                  <button className="links-item">
                    User Management
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="links-item">
                    API Credentials
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="links-item">
                    System Logs
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
