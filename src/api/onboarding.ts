import { apiClient } from './client';

import type { OnboardingStatusResponse } from '../types/onboarding';

export async function getOnboardingStatus(): Promise<OnboardingStatusResponse> {
  const { data } = await apiClient.get<OnboardingStatusResponse>(
    '/users/me/onboarding',
  );

  return data;
}
