import { apiClient } from '../client';

export type StudentDocumentCompletion = {
  completionPercentage: number;
  registrationIncluded: boolean;
  enrollmentIncluded: boolean;
  transcriptIncluded: boolean;
  topikIncluded: boolean;
};

export type StudentBadge = {
  active: boolean;
  issuedAt?: string | null;
  stayExpirationDate?: string | null;
};

export async function getDocumentCompletion(): Promise<StudentDocumentCompletion> {
  const { data } = await apiClient.get<StudentDocumentCompletion>(
    '/students/me/documents/completion',
  );
  if (
    ![
      data?.registrationIncluded,
      data?.enrollmentIncluded,
      data?.transcriptIncluded,
      data?.topikIncluded,
    ].every((value) => typeof value === 'boolean') ||
    ![0, 25, 50, 75, 100].includes(data?.completionPercentage)
  )
    throw new Error('Invalid document completion response');
  return data;
}

export async function getStudentBadge(): Promise<StudentBadge> {
  const { data } = await apiClient.get<StudentBadge>('/students/me/badge');
  if (typeof data?.active !== 'boolean')
    throw new Error('Invalid badge response');
  return data;
}
