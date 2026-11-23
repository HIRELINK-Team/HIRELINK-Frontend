import type { UserRole } from './auth';

export type OnboardingStatusResponse = {
  userId: number;
  role: UserRole;
  status: 'REQUIRED' | 'COMPLETED' | 'NOT_APPLICABLE';
  nextStep: 'BASIC_INFORMATION' | 'NONE' | 'EXISTING_FLOW';
  completedAt: string | null;
};
