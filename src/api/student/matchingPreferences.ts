import { apiClient } from '../client';

import type { StudentMatchingPreferencesResponse } from '../../types/studentMatchingPreferences';

export async function getStudentMatchingPreferences(): Promise<StudentMatchingPreferencesResponse> {
  const { data } = await apiClient.get<StudentMatchingPreferencesResponse>(
    '/api/students/me/matching-preferences',
  );

  return data;
}

export async function updateStudentMatchingPreferences<TResponse = unknown>(
  requestBody: unknown,
): Promise<TResponse> {
  const { data } = await apiClient.patch<TResponse>(
    '/api/students/me/matching-preferences',
    requestBody,
  );

  return data;
}
