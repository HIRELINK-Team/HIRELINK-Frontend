import { apiClient } from '../client';

export async function createStudentProfile<TResponse = unknown>(
  requestBody: unknown,
): Promise<TResponse> {
  const { data } = await apiClient.post<TResponse>(
    '/api/students/me/profile',
    requestBody,
  );

  return data;
}

export async function getStudentProfile<
  TResponse = unknown,
>(): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>('/api/students/me/profile');

  return data;
}

export async function updateStudentProfile<TResponse = unknown>(
  requestBody: unknown,
): Promise<TResponse> {
  const { data } = await apiClient.patch<TResponse>(
    '/api/students/me/profile',
    requestBody,
  );

  return data;
}
