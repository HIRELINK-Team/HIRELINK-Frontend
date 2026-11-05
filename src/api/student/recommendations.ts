import { apiClient } from '../client';

import type {
  CreateStudentRecommendationsResponse,
  StudentRecommendationDetailResponse,
  StudentRecommendationRefreshResponse,
  StudentRecommendationsResponse,
} from '../../types/studentRecommendation';

export async function createStudentRecommendations(): Promise<CreateStudentRecommendationsResponse> {
  // Student-only endpoint. The server creates at most three recommendations.
  const { data } = await apiClient.post<CreateStudentRecommendationsResponse>(
    '/recommendations',
  );

  return data;
}

export async function getStudentRecommendations(): Promise<StudentRecommendationsResponse> {
  const { data } = await apiClient.get<StudentRecommendationsResponse>(
    '/recommendations',
  );

  return data;
}

export async function getStudentRecommendation(
  recommendationId: string | number,
): Promise<StudentRecommendationDetailResponse> {
  // Only a valid recommendation in the student's latest batch is accessible.
  const { data } = await apiClient.get<StudentRecommendationDetailResponse>(
    `/recommendations/${encodeURIComponent(String(recommendationId))}`,
  );

  return data;
}

export async function refreshStudentRecommendations(): Promise<StudentRecommendationRefreshResponse> {
  // The server creates a new batch only when a refresh is required.
  const { data } = await apiClient.post<StudentRecommendationRefreshResponse>(
    '/recommendations/refresh',
  );

  return data;
}
