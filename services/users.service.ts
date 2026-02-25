import { apiFetch } from './apiClient';

export interface OnboardUserData {
  photo?: File;
  email: string;
  displayName: string;
  writingStyle: string;
}

export const usersService = {
  onboard: (data: OnboardUserData, token: string) => {
    const formData = new FormData();
    if (data.photo) formData.append('photo', data.photo);
    formData.append('email', data.email);
    formData.append('displayName', data.displayName);
    formData.append('writingStyle', data.writingStyle);

    return apiFetch<any>('/users/onboard', {
      method: 'POST',
      token,
      body: formData,
    });
  },

  getMe: (token: string) => {
    return apiFetch<any>('/users/me', {
      method: 'GET',
      token,
    });
  },

  updateMe: (data: { displayName?: string; bio?: string }, token: string) => {
    return apiFetch<any>('/users/me', {
      method: 'PATCH',
      token,
      body: data,
    });
  },

  listUsers: (token: string) => {
    return apiFetch<any>('/users', {
      method: 'GET',
      token,
    });
  },

  getUserById: (id: string, token: string) => {
    return apiFetch<any>(`/users/${id}`, {
      method: 'GET',
      token,
    });
  },

  deactivateUser: (id: string, token: string) => {
    return apiFetch<any>(`/users/${id}/deactivate`, {
      method: 'PATCH',
      token,
    });
  },

  disableUser: (id: string, token: string) => {
    return apiFetch<any>(`/users/${id}/disable`, {
      method: 'PATCH',
      token,
    });
  },

  activateUser: (id: string, token: string) => {
    return apiFetch<any>(`/users/${id}/activate`, {
      method: 'PATCH',
      token,
    });
  }
};
