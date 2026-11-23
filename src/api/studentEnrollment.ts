import apiClient from './client';
import type { EnrollmentPreviewResponse } from '../types/studentDocument';

export async function previewEnrollmentCertificate(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<EnrollmentPreviewResponse>(
    '/students/me/documents/enrollment/preview',
    formData,
  );
  return data;
}
