import { apiClient } from '../client';

import type {
  StudentOnboardingDraftRequest,
  StudentOnboardingResponse,
} from '../../types/studentOnboarding';

export async function completeStudentOnboarding(
  requestBody: StudentOnboardingDraftRequest,
): Promise<StudentOnboardingResponse> {
  const { latitude, longitude } =
    requestBody.matchingPreferences.preferredLocation;
  if (
    typeof latitude !== 'number' ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    typeof longitude !== 'number' ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error(
      '희망 근무지의 좌표를 확인할 수 없어요. 위치 선택 기능이 준비되면 다시 시도해 주세요.',
    );
  }
  const { data } = await apiClient.post<StudentOnboardingResponse>(
    '/students/me/onboarding',
    requestBody,
  );
  return data;
}
