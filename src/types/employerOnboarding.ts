import type {
  EmployerAcquisitionChannel,
  EmployerIndustryCode,
} from './employerProfile';

export type ReferralSourceCode = EmployerAcquisitionChannel;
export type EmployeeCountCode = 'UNDER_FIVE' | 'FIVE_OR_MORE';
export type OnboardingStep = 1 | 2;

export interface EmployerOnboardingForm {
  manager: {
    name: string;
    phoneParts: [string, string, string];
    verificationCode: string;
    referralSource: ReferralSourceCode | '';
  };
  business: {
    name: string;
    registrationNumberParts: [string, string, string];
    registrationFile: File | null;
    industry: EmployerIndustryCode | '';
    employeeCount: EmployeeCountCode | '';
    address: string;
    detailAddress: string;
  };
  agreements: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
}
