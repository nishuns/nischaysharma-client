'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { organizationsService, OrganizationData } from '@/services/organizations.service';
import { usersService } from '@/services/users.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function OrganizationPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<OrganizationData | null>(null);
  const [error, setError] = useState('');
  
  // Form states for creating organization
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('No authentication token');

      const userProfile = await usersService.getMe(token);
      if (userProfile.success && userProfile.data.organizationId) {
        const orgResponse = await organizationsService.getById(userProfile.data.organizationId, token);
        if (orgResponse.success) {
          setOrganization(orgResponse.data);
        }
      }
    } catch (err: any) {
      console.error('Error fetching organization data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error('No authentication token');

      const response = await organizationsService.create({
        name: orgName,
        description: orgDescription
      }, token);

      if (response.success) {
        setOrganization(response.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading organization settings...</div>;
  }

  if (!organization) {
    return (
      <div className="organization">
        <div className="dashboard__title">
          <h2>Create Organization</h2>
          <p>Get started by creating an organization for your team.</p>
        </div>
        
        <div className="card card--padded organization__setup">
          <form onSubmit={handleCreateOrganization} className="auth__fields">
            <div className="organization__form-group">
              <label className="label">Organization Name</label>
              <Input 
                placeholder="e.g. TaughtCode Team" 
                value={orgName} 
                onChange={(e) => setOrgName(e.target.value)} 
                required
              />
            </div>
            <div className="organization__form-group">
              <label className="label">Description (Optional)</label>
              <Input 
                placeholder="Tell us about your organization" 
                value={orgDescription} 
                onChange={(e) => setOrgDescription(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary" className="btn--full">
              Create Organization
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="organization">
      <div className="dashboard__title">
        <h2>Organization Settings</h2>
        <p>Manage <strong>{organization.name}</strong>, members, and API access.</p>
      </div>

      <div className="dashboard__grid-layout">
        <div className="lg:col-span-2">
          {/* Members Section */}
          <div className="card dashboard__recent" style={{ marginBottom: '2rem' }}>
            <div className="dashboard__recent-header">
              <h3>Members</h3>
              <button className="btn btn--secondary" style={{ padding: '0.5rem 1rem', height: 'auto' }}>
                + Add Member
              </button>
            </div>
            <div className="dashboard__recent-list">
              {organization.members?.map((member, i) => (
                <div key={i} className="dashboard__recent-item">
                  <div className="dashboard__recent-item-info">
                    <div className="dashboard__recent-item-title">{member.userId}</div>
                    <div className="dashboard__recent-item-meta">
                      <span>Joined {new Date(member.addedAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span className={`badge badge--${member.role === 'admin' ? 'published' : 'draft'}`}>
                      {member.role}
                    </span>
                    <button className="btn btn--ghost" style={{ padding: '0.2rem' }}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '1rem' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Whitelisted Clients Section */}
          <div className="card dashboard__recent">
            <div className="dashboard__recent-header">
              <h3>Whitelisted Clients</h3>
              <button className="btn btn--secondary" style={{ padding: '0.5rem 1rem', height: 'auto' }}>
                + Add Client
              </button>
            </div>
            <div className="dashboard__recent-list">
              {organization.clients && organization.clients.length > 0 ? (
                organization.clients.map((client, i) => (
                  <div key={i} className="dashboard__recent-item">
                    <div className="dashboard__recent-item-info">
                      <div className="dashboard__recent-item-title">{client.url}</div>
                      <div className="dashboard__recent-item-meta">
                        <span>{client.whitelistedApis.length} APIs allowed</span>
                      </div>
                    </div>
                    <button className="btn btn--ghost" style={{ color: '#ff6b6b' }}>Remove</button>
                  </div>
                ))
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#737373', fontSize: '0.875rem' }}>
                  No whitelisted clients yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="dashboard__sidebar-col">
          <div className="card card--padded">
            <h3 className="label" style={{ marginBottom: '1.5rem', display: 'block', fontSize: '0.625rem', fontWeight: 700, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organization Details</h3>
            <div className="stat-group">
              <span className="label">Type</span>
              <p className="value">{organization.type || 'Standard'}</p>
            </div>
            <div className="stat-group">
              <span className="label">Description</span>
              <p className="description">
                {organization.description || 'No description provided.'}
              </p>
            </div>
            <Button variant="secondary" className="btn--full" style={{ marginTop: '1.5rem' }}>
              Edit Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
