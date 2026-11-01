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
}

export interface ApplicantJobMock {
  id: string;
  label: string;
}
