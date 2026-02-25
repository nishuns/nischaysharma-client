import { apiFetch } from './apiClient';

export const jobsService = {
  getJobStatus: (id: string, token: string) => {
    return apiFetch<any>(`/jobs/${id}`, {
      method: 'GET',
      token,
    });
  }
};
