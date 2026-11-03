import { apiClient } from '../client';

export async function createStudentRecommendations<
  TResponse = unknown,
>(): Promise<TResponse> {
  // Student-only endpoint. The server creates at most three recommendations.
  const { data } = await apiClient.post<TResponse>('/api/recommendations');

  return data;
}

export async function getStudentRecommendations<
  TResponse = unknown,
>(): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>('/api/recommendations');

  return data;
}

export async function getStudentRecommendation<TResponse = unknown>(
  recommendationId: string | number,
): Promise<TResponse> {
  // Only a valid recommendation in the student's latest batch is accessible.
  const { data } = await apiClient.get<TResponse>(
    `/api/recommendations/${encodeURIComponent(String(recommendationId))}`,
  );

  return data;
}

export async function refreshStudentRecommendations<
  TResponse = unknown,
>(): Promise<TResponse> {
  // The server creates a new batch only when a refresh is required.
  const { data } = await apiClient.post<TResponse>(
    '/api/recommendations/refresh',
  );

  return data;
}
