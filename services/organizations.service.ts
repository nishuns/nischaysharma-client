import { apiFetch } from './apiClient';

export interface Member {
  userId: string;
  role: 'admin' | 'moderator' | 'user';
  addedAt?: string;
  updatedAt?: string;
}

export interface Client {
  url: string;
  whitelistedApis: string[];
  addedAt?: string;
  updatedAt?: string;
}

export interface OrganizationData {
  id?: string;
  name: string;
  type?: string;
  description?: string;
  ownerId?: string;
  members?: Member[];
  clients?: Client[];
}

export const organizationsService = {
  create: (data: { name: string; type?: string; description?: string }, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>('/organizations', {
      method: 'POST',
      token,
      body: data,
    });
  },

  getById: (orgId: string, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}`, {
      method: 'GET',
      token,
    });
  },

  addMember: (orgId: string, data: { userId: string; role: string }, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/members`, {
      method: 'POST',
      token,
      body: data,
    });
  },

  updateMemberRole: (orgId: string, userId: string, role: string, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/members/${userId}`, {
      method: 'PATCH',
      token,
      body: { role },
    });
  },

  removeMember: (orgId: string, userId: string, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/members/${userId}`, {
      method: 'DELETE',
      token,
    });
  },

  addClient: (orgId: string, data: { url: string; whitelistedApis: string[] }, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/clients`, {
      method: 'POST',
      token,
      body: data,
    });
  },

  updateClient: (orgId: string, data: { url: string; whitelistedApis: string[] }, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/clients`, {
      method: 'PATCH',
      token,
      body: data,
    });
  },

  removeClient: (orgId: string, url: string, token: string) => {
    return apiFetch<{ success: boolean; data: OrganizationData }>(`/organizations/${orgId}/clients`, {
      method: 'DELETE',
      token,
      body: { url },
    });
  }
};
