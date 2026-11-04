export interface BusinessRegistrationOcrResponse {
  businessRegistrationNumber: string;
  workplaceAddress: string | null;
}

export interface VerifyBusinessRegistrationRequest {
  businessRegistrationNumber: string;
}

export interface VerifyBusinessRegistrationResponse {
  businessRegistrationNumber: string;
  valid: boolean;
  message: string;
}

export type EmployeeCountRange = 'UNDER_5' | 'FIVE_OR_MORE';

export interface CreateWorkplaceRequest {
  workplaceName: string;
  businessRegistrationNumber: string;
  businessTypeId: number;
  employeeCountRange: EmployeeCountRange;
  workplaceAddress: string;
  latitude: number;
  longitude: number;
}

export interface CreateWorkplaceResponse {
  workplaceId: number;
  workplaceName: string;
  businessRegistrationNumber: string;
  businessTypeId: number;
  businessTypeName: string;
  employeeCountRange: EmployeeCountRange;
  workplaceAddress: string;
  latitude: number;
  longitude: number;
}
