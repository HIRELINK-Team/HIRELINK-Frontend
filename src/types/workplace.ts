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

export type BusinessTypeName =
  | 'FOOD_CAFE'
  | 'RETAIL'
  | 'OFFICE_EVENT_TOURISM'
  | 'INTERPRETATION_TRANSLATION'
  | 'DUTY_FREE'
  | 'MAJOR_RELATED'
  | 'INTERNSHIP'
  | 'OTHER';

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
  businessTypeName: BusinessTypeName;
  employeeCountRange: EmployeeCountRange;
  workplaceAddress: string;
  latitude: number;
  longitude: number;
}

export interface EmployerWorkplaceListItem {
  workplaceId: number;
  workplaceName: string;
  businessTypeId: number;
  businessTypeName: BusinessTypeName;
  workplaceAddress: string;
  employeeCountRange: EmployeeCountRange;
}

export interface EmployerWorkplaceListResponse {
  workplaces: EmployerWorkplaceListItem[];
}

export type WorkplaceDetailResponse = CreateWorkplaceResponse;

export interface UpdateWorkplaceRequest {
  workplaceName?: string;
  businessTypeId?: number;
  workplaceAddress?: string;
  latitude?: number;
  longitude?: number;
}
