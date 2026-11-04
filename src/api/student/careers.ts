import { apiClient } from '../client';

import type {
  CreateStudentCareerRequest,
  StudentCareerResponse,
  UpdateStudentCareerRequest,
} from '../../types/experience';

export async function createStudentCareer(
  requestBody: CreateStudentCareerRequest,
): Promise<StudentCareerResponse> {
  const { data } = await apiClient.post<StudentCareerResponse>(
    '/api/students/me/careers',
    requestBody,
  );

  return data;
}

export async function updateStudentCareer(
  careerId: string | number,
  requestBody: UpdateStudentCareerRequest,
): Promise<StudentCareerResponse> {
  const { data } = await apiClient.patch<StudentCareerResponse>(
    `/api/students/me/careers/${encodeURIComponent(String(careerId))}`,
    requestBody,
  );

  return data;
}

export async function deleteStudentCareer(
  careerId: string | number,
): Promise<void> {
  await apiClient.delete(
    `/api/students/me/careers/${encodeURIComponent(String(careerId))}`,
  );
}
