export type SocialSignupTerm = {
  termTypeId: number;
  termTypeName: string;
  isRequired: boolean;
  isAgreed: boolean;
  agreedAt: string | null;
  currentVersion: string | null;
  agreedVersion: string | null;
};

export type SocialSignupTermsResponse = { terms: SocialSignupTerm[] };
export type SocialSignupTermsRequest = {
  agreements: { termTypeId: number; version: string; isAgreed: boolean }[];
};
