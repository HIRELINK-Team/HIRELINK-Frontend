export type EmployerIndustryCode =
  | "FOOD_AND_CAFE"
  | "RETAIL"
  | "INTERPRETATION"
  | "OFFICE_AND_TOURISM"
  | "DUTY_FREE"
  | "ACADEMIC"
  | "INTERNSHIP"
  | "OTHER";

export interface EmployerBusinessProfile {
  name: string;
  industry: EmployerIndustryCode;
  address: string;
  detailAddress: string;
  registrationNumber: string;
  representativeName: string;
}

/** Backend API가 연결되기 전 마이페이지 화면에서 사용하는 Frontend 임시 모델입니다. */
export interface EmployerProfile {
  name: string;
  phone: string;
  email: string;
  business: EmployerBusinessProfile;
}

/** 실제 주소 검색 API 연결 전 화면 interaction을 위한 Frontend mock 모델입니다. */
export interface EmployerAddressMock {
  id: string;
  postalCode: string;
  roadAddress: string;
  lotAddress: string;
}
