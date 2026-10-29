import type { RecommendedJob } from './studentMatching';

export type StudentApplicationStatus =
  | 'REVIEWING'
  | 'OFFER_WAITING'
  | 'HIRED'
  | 'REJECTED'
  | 'EMPLOYER_EXPIRED'
  | 'STUDENT_EXPIRED'
  | 'CANCELED';

export type StudentApplicationsFilter = 'all' | 'reviewing' | 'offer' | 'hired';

export type StudentApplicationsScenario = StudentApplicationsFilter | 'empty';

export type StudentApplication = {
  expiresAt?: string;
  id: string;
  job: RecommendedJob;
  startedAt?: string;
  status: StudentApplicationStatus;
  timerLabel?: string;
};
