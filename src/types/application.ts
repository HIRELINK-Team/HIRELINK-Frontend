import type { JobPostingDayOfWeek, RequiredKoreanLevel } from './jobPosting';

export type EmployerApplicationListStatus =
  'WAITING_RESPONSE' | 'OFFERED' | 'COMPLETED';

export type EmployerApplicationStatus = EmployerApplicationListStatus | 'ENDED';

export interface EmployerApplicationListItem {
  applicationId: number;
  status: EmployerApplicationListStatus;
  applicantName: string;
  profileImageUrl: string | null;
  nationality: string;
  visaType: string;
  topikLevel: number | null;
  matchScore: number;
  desiredStartDate: string;
  appliedAt: string;
  employerResponseDeadline: string | null;
  offerId: number | null;
  studentResponseDeadline: string | null;
  matchId: number | null;
}

export interface EmployerApplicationListResponse {
  jobPostingId: number;
  capacity: number;
  occupiedCount: number;
  waitingResponseCount: number;
  offeredCount: number;
  completedCount: number;
  applications: EmployerApplicationListItem[];
}

export interface EmployerApplicationListQuery {
  status?: EmployerApplicationListStatus;
}

export interface EmployerApplicantCareer {
  careerName: string;
  startMonth: string;
  endMonth: string | null;
  description: string | null;
}

export interface EmployerApplicantWorkTime {
  dayOfWeek: JobPostingDayOfWeek;
  startTime: string;
  endTime: string;
}

export interface EmployerApplicationDetailResponse {
  applicationId: number;
  jobPostingId: number;
  status: EmployerApplicationStatus;
  desiredStartDate: string;
  appliedAt: string;
  employerResponseDeadline: string | null;
  applicant: {
    name: string;
    profileImageUrl: string | null;
    nationality: string;
    visaType: string;
    visaExpirationDate: string | null;
    koreanLevel: RequiredKoreanLevel | null;
    topikLevel: number | null;
    careers: EmployerApplicantCareer[];
    availableWorkTimes: EmployerApplicantWorkTime[];
  };
  jobRequirements: {
    workTimes: EmployerApplicantWorkTime[];
    wageAmount: number;
    requiredKoreanLevel: RequiredKoreanLevel | null;
  };
  matchResult: {
    matchScore: number;
    workTimeMatched: boolean;
    experienceMatched: boolean;
    locationMatched: boolean;
    wageMatched: boolean;
    koreanLevelMatched: boolean;
  };
}

export interface RejectApplicationResponse {
  applicationId: number;
  status: 'ENDED';
  endReason: 'EMPLOYER_REJECTED';
  endedAt: string;
}

export interface CreateEmploymentOfferResponse {
  offerId: number;
  applicationId: number;
  status: 'PENDING';
  offeredAt: string;
  studentResponseDeadline: string;
}

export interface ApplicantDocumentMock {
  id: string;
  name: string;
  submittedAt: string;
  expiresAt: string;
  isRegistered?: boolean;
}
