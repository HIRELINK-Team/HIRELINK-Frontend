import type { BusinessTypeName } from './workplace';

export type EmployerIndustryCode = BusinessTypeName;

export interface EmployerBusinessProfile {
  name: string;
  industry: EmployerIndustryCode;
  address: string;
  detailAddress: string;
  registrationNumber: string;
  representativeName: string;
}

/** API 프로필과 아직 mock인 사업장 정보를 화면에서 함께 다루는 모델입니다. */
export interface EmployerProfile {
  name: string;
  phone: string;
  email: string;
  position: string | null;
  business: EmployerBusinessProfile;
}

/** GET /api/employers/me/profile 응답입니다. */
export interface EmployerProfileResponse {
  employerId: number;
  name: string;
  email: string;
  phoneNumber: string;
  position: string | null;
}

export interface UpdateEmployerProfileRequest {
  name?: string;
  position?: string | null;
}

/** 실제 주소 검색 API 연결 전 화면 interaction을 위한 Frontend mock 모델입니다. */
export interface EmployerAddressMock {
  id: string;
  postalCode: string;
  roadAddress: string;
  lotAddress: string;
}
