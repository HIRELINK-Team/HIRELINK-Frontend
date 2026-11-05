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

/** Backend Application API와 연결되지 않은 화면에서만 사용하는 legacy mock 상태입니다. */
export type ApplicationStatus =
  | 'REVIEWING'
  | 'OFFER_WAITING'
  | 'HIRED'
  | 'REJECTED'
  | 'EMPLOYER_EXPIRED'
  | 'STUDENT_EXPIRED'
  | 'CANCELED';

export interface ApplicantDocumentMock {
  id: string;
  name: string;
  submittedAt: string;
  expiresAt: string;
  isRegistered?: boolean;
}

/** 백엔드 명세 확정 전 채용 유학생 상세 화면에서 사용하는 프론트엔드 mock입니다. */
export type WorkEligibilityAnalysisStatus = 'READY' | 'MISSING_DOCUMENTS';

export interface WorkEligibilityStandardMock {
  id: string;
  label: string;
  value: string;
}

export interface WorkEligibilityDocumentMock {
  id: string;
  name: string;
  value: string;
}

export interface HiredStudentDetailsMock {
  qualificationExpiresAt: string;
  visaTypeLabel: string;
  preferredExperience: string;
  workAvailabilitySummary: string;
  hasQualificationExpiryWarning?: boolean;
  analysisStatus: WorkEligibilityAnalysisStatus;
  analysisStandards: WorkEligibilityStandardMock[];
  jobScheduleLabel: string;
  jobWeeklyHours: number;
  maxWeeklyHours: number;
  analysisSource: string;
  analysisCheckedAt: string;
  analysisDocuments: WorkEligibilityDocumentMock[];
}

export type ApplicantMatchResult = 'MATCH' | 'NEGOTIABLE';

export interface ApplicantMatchItemMock {
  id: string;
  label: string;
  applicantValue: string;
  jobValue: string;
  result: ApplicantMatchResult;
}

export interface EmployerApplicantMock {
  id: string;
  jobId: string;
  name: string;
  nationality: string;
  visa: string;
  matchRate: number;
  status: ApplicationStatus;
  expiresAt?: string;
  hiredAt?: string;
  phoneNumber?: string;
  topikLevel: string;
  birthDate: string;
  age: number;
  availableStartDate: string;
  documents: ApplicantDocumentMock[];
  matchItems: ApplicantMatchItemMock[];
  hiredDetails?: HiredStudentDetailsMock;
}

export interface ApplicantJobMock {
  id: string;
  label: string;
  hiredSummary: string;
}
