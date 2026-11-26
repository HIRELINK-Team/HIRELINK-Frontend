export type SocialRegistrationFrontResponse = {
  name: string;
  nationalityCode: string;
  visaCode: string;
  registrationNumber: string;
  issueDate: string;
  signupExpiresAt: string;
};

export type SocialRegistrationVerificationResponse = {
  serialNumber: string | null;
  stayExpiresOn: string;
  cardVerified: boolean;
  stayDocumentVerified: boolean;
  requiresStayDocument: boolean;
  signupExpiresAt: string;
};
