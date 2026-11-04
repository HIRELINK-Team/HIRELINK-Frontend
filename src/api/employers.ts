import apiClient from './client';
import type { EmployerProfileResponse } from '../types/employerProfile';

async function getEmployerProfile(): Promise<EmployerProfileResponse> {
  const { data } = await apiClient.get<EmployerProfileResponse>(
    '/employers/me/profile',
  );

  return data;
}

export { getEmployerProfile };
