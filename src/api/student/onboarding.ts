import { apiClient } from '../client';

import type {
  StudentOnboardingDraftRequest,
  StudentOnboardingResponse,
} from '../../types/studentOnboarding';

export async function completeStudentOnboarding(
  requestBody: StudentOnboardingDraftRequest,
): Promise<StudentOnboardingResponse> {
  const { data } = await apiClient.post<StudentOnboardingResponse>(
    '/students/me/onboarding',
    requestBody,
  );
  return data;
}
