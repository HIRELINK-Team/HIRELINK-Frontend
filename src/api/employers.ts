import apiClient from './client';
import type {
  EmployerProfileResponse,
  UpdateEmployerProfileRequest,
} from '../types/employerProfile';

async function getEmployerProfile(): Promise<EmployerProfileResponse> {
  const { data } = await apiClient.get<EmployerProfileResponse>(
    '/employers/me/profile',
  );

  return data;
}

async function updateEmployerProfile(
  request: UpdateEmployerProfileRequest,
): Promise<EmployerProfileResponse> {
  const { data } = await apiClient.patch<EmployerProfileResponse>(
    '/employers/me/profile',
    request,
  );

  return data;
}

export { getEmployerProfile, updateEmployerProfile };
