import type { JobPostingWageType, JobPostingWorkTime } from './jobPosting';

export interface EmployerMatchStudent {
  name: string;
  profileImageUrl: string | null;
  nationality: string;
  visaType: string | null;
  topikLevel: number | null;
}

export interface EmployerMatchListItem {
  matchId: number;
  applicationId: number;
  offerId: number;
  jobPostingId: number;
  jobTitle: string;
  workplaceName: string;
  wageType: JobPostingWageType;
  wageAmount: number;
  desiredStartDate: string;
  matchedAt: string;
  student: EmployerMatchStudent | null;
}

export interface EmployerMatchListResponse {
  matches: EmployerMatchListItem[];
}

export interface EmployerMatchListQuery {
  jobPostingId?: number;
}

export interface EmployerMatchDetailResponse {
  matchId: number;
  applicationId: number;
  offerId: number;
  jobPostingId: number;
  jobTitle: string;
  workplaceName: string;
  workplaceAddress: string;
  wageType: JobPostingWageType;
  wageAmount: number;
  workTimes: JobPostingWorkTime[];
  desiredStartDate: string;
  matchedAt: string;
  contact: {
    name: string;
    phoneNumber: string;
  };
  student: EmployerMatchStudent | null;
}
