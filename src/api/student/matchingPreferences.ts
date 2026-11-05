import { apiClient } from '../client';

import type {
  StudentMatchingPreferencesResponse,
  StudentMatchingPreferencesUpdateRequest,
} from '../../types/studentMatchingPreferences';

export async function getStudentMatchingPreferences(): Promise<StudentMatchingPreferencesResponse> {
  const { data } = await apiClient.get<StudentMatchingPreferencesResponse>(
    '/students/me/matching-preferences',
  );

  return data;
}

export async function updateStudentMatchingPreferences(
  requestBody: StudentMatchingPreferencesUpdateRequest,
): Promise<StudentMatchingPreferencesResponse> {
  const { data } = await apiClient.patch<StudentMatchingPreferencesResponse>(
    '/students/me/matching-preferences',
    requestBody,
  );

  return data;
}
