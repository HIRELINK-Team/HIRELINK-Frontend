import { apiClient } from '../client';

import type {
  StudentProfileCreateResponse,
  StudentProfileCreateRequest,
  StudentProfileResponse,
  StudentProfileUpdateResponse,
  StudentProfileUpdateRequest,
} from '../../types/studentProfile';

export async function createStudentProfile(
  requestBody: StudentProfileCreateRequest,
): Promise<StudentProfileCreateResponse> {
  const { data } = await apiClient.post<StudentProfileCreateResponse>(
    '/students/me/profile',
    requestBody,
  );

  return data;
}

export async function getStudentProfile(): Promise<StudentProfileResponse> {
  const { data } = await apiClient.get<StudentProfileResponse>(
    '/students/me/profile',
  );

  return data;
}

export async function updateStudentProfile(
  requestBody: StudentProfileUpdateRequest,
): Promise<StudentProfileUpdateResponse> {
  const { data } = await apiClient.patch<StudentProfileUpdateResponse>(
    '/students/me/profile',
    requestBody,
  );

  return data;
}
