import apiClient from './client';
import type {
  EnrollmentDocumentResponse,
  EnrollmentPreviewResponse,
} from '../types/studentDocument';

export async function getEnrollmentCertificate() {
  const { data } = await apiClient.get<EnrollmentDocumentResponse>(
    '/students/me/documents/enrollment',
  );
  return data;
}

export async function previewEnrollmentCertificate(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<EnrollmentPreviewResponse>(
    '/students/me/documents/enrollment/preview',
    formData,
  );
  return data;
}

export async function confirmEnrollmentCertificate(draftId: string) {
  const { data } = await apiClient.post<EnrollmentDocumentResponse>(
    `/students/me/documents/enrollment/${encodeURIComponent(draftId)}/confirm`,
  );
  return data;
}
