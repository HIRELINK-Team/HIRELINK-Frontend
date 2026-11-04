import type { RecommendedJob } from './studentMatching';
import type { SalaryType } from './jobForm';

export type StudentApplicationApiStatus = 'WAITING_RESPONSE';

export type StudentApplicationDetailStatus =
  'WAITING_RESPONSE' | 'OFFERED' | 'COMPLETED' | 'ENDED';

export type StudentApplicationOfferStatus =
  'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export type StudentApplicationWorkTime = {
  dayOfWeek: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  startTime: string;
  endTime: string;
};

export type StudentApplicationDetail = {
  applicationId: number;
  status: StudentApplicationDetailStatus;
  jobPostingId: number;
  jobTitle: string;
  workplaceName: string;
  workplaceAddress: string;
  wageType: SalaryType;
  wageAmount: number;
  workTimes: StudentApplicationWorkTime[];
  desiredStartDate: string;
  appliedAt: string;
  employerResponseDeadline: string | null;
  offerId: number | null;
  offerStatus: StudentApplicationOfferStatus | null;
  offeredAt: string | null;
  studentResponseDeadline: string | null;
  respondedAt: string | null;
  matchId: number | null;
  endReason: string | null;
  endedAt: string | null;
};

export type StudentApplication = {
  applicationId: number;
  status: StudentApplicationApiStatus;
  jobPostingId: number;
  jobTitle: string;
  workplaceName: string;
  wageType: SalaryType;
  wageAmount: number;
  recommendationReasons: string[];
  desiredStartDate: string;
  appliedAt: string;
  employerResponseDeadline: string;
  offerId: number | null;
  offerStatus: string | null;
  offeredAt: string | null;
  studentResponseDeadline: string | null;
  matchId: number | null;
};

export type StudentApplicationsResponse = {
  applications: StudentApplication[];
};

export type CreateStudentApplicationRequest = {
  jobPostingId: number;
  desiredStartDate: string;
};

export type CreateStudentApplicationResponse = {
  applicationId: number;
  jobPostingId: number;
  desiredStartDate: string;
  status: 'WAITING_RESPONSE';
  appliedAt: string;
  employerResponseDeadline: string;
};

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

export type StudentApplicationCardModel = {
  apiStatus?: StudentApplicationApiStatus | StudentApplicationDetailStatus;
  applicationId?: number;
  appliedAt?: string;
  desiredStartDate?: string;
  employerResponseDeadline?: string;
  expiresAt?: string;
  id: string;
  job: RecommendedJob;
  matchId?: number | null;
  offerId?: number | null;
  offeredAt?: string | null;
  offerStatus?: string | null;
  startedAt?: string;
  status: StudentApplicationStatus;
  studentResponseDeadline?: string | null;
  timerLabel?: string;
};
