/** 백엔드 명세 확정 전 지원 흐름에서 사용하는 프론트엔드 상태입니다. */
export type ApplicationStatus =
  | "REVIEWING"
  | "OFFER_WAITING"
  | "HIRED"
  | "REJECTED"
  | "EMPLOYER_EXPIRED"
  | "STUDENT_EXPIRED"
  | "CANCELED";

export interface ApplicantDocumentMock {
  id: string;
  name: string;
  submittedAt: string;
  expiresAt: string;
  hasExpiryWarning?: boolean;
  isRegistered?: boolean;
}

/** 백엔드 명세 확정 전 채용 유학생 상세 화면에서 사용하는 프론트엔드 mock입니다. */
export type WorkEligibilityAnalysisStatus = "READY" | "MISSING_DOCUMENTS";

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

export type ApplicantMatchResult = "MATCH" | "NEGOTIABLE";

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
