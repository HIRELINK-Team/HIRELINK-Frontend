export const STUDENT_TERM_TYPE_IDS = {
  termsOfService: 1,
  privacyPolicy: 2,
  marketing: 3,
} as const;

export type StudentTermTypeId =
  (typeof STUDENT_TERM_TYPE_IDS)[keyof typeof STUDENT_TERM_TYPE_IDS];

export type TermAgreementRequestItem = {
  termTypeId: StudentTermTypeId;
  isAgreed: boolean;
};

export type TermAgreementsRequest = {
  agreements: TermAgreementRequestItem[];
};

export type TermAgreementResponseItem = TermAgreementRequestItem & {
  agreedAt: string | null;
};

export type TermAgreementsResponse = {
  agreements: TermAgreementResponseItem[];
};

/**
 * Employer onboarding compatibility types.
 * The backend endpoint accepts numeric term type IDs.
 */
export interface TermAgreementItem {
  termTypeId: number;
  isAgreed: boolean;
}

export interface UpdateTermAgreementsRequest {
  agreements: TermAgreementItem[];
}

export interface UpdateTermAgreementResponseItem {
  termTypeId: number;
  isAgreed: boolean;
  agreedAt: string | null;
}

export interface UpdateTermAgreementsResponse {
  agreements: UpdateTermAgreementResponseItem[];
}