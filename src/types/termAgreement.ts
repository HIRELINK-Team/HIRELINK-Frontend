export interface TermAgreementItem {
  termTypeId: number;
  isAgreed: boolean;
}

export interface UpdateTermAgreementsRequest {
  agreements: TermAgreementItem[];
}

export interface TermAgreementResponseItem {
  termTypeId: number;
  isAgreed: boolean;
  agreedAt: string | null;
}

export interface UpdateTermAgreementsResponse {
  agreements: TermAgreementResponseItem[];
}
