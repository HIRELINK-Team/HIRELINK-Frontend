import { apiClient } from '../client';

export async function getStudentMatchingPreferences<
  TResponse = unknown,
>(): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>(
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
