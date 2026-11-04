import apiClient from './client';
import type {
  BusinessRegistrationOcrResponse,
  CreateWorkplaceRequest,
  CreateWorkplaceResponse,
  EmployerWorkplaceListResponse,
  UpdateWorkplaceRequest,
  VerifyBusinessRegistrationRequest,
  VerifyBusinessRegistrationResponse,
  WorkplaceDetailResponse,
} from '../types/workplace';

async function extractBusinessRegistration(
  file: File,
): Promise<BusinessRegistrationOcrResponse> {
  const formData = new FormData();
  formData.append('businessRegistrationFile', file);

  const { data } = await apiClient.post<BusinessRegistrationOcrResponse>(
    '/workplaces/business-registration/ocr',
    formData,
  );

  return data;
}

async function verifyBusinessRegistration(
  request: VerifyBusinessRegistrationRequest,
): Promise<VerifyBusinessRegistrationResponse> {
  const { data } = await apiClient.post<VerifyBusinessRegistrationResponse>(
    '/workplaces/business-registration/verify',
    request,
  );

  return data;
}

async function createWorkplace(
  request: CreateWorkplaceRequest,
): Promise<CreateWorkplaceResponse> {
  const { data } = await apiClient.post<CreateWorkplaceResponse>(
    '/workplaces',
    request,
  );

  return data;
}

async function getMyWorkplaces(): Promise<EmployerWorkplaceListResponse> {
  const { data } = await apiClient.get<EmployerWorkplaceListResponse>(
    '/employers/me/workplaces',
  );

  return data;
}

async function getWorkplaceDetail(
  workplaceId: number,
): Promise<WorkplaceDetailResponse> {
  const { data } = await apiClient.get<WorkplaceDetailResponse>(
    `/workplaces/${workplaceId}`,
  );

  return data;
}

async function updateWorkplace(
  workplaceId: number,
  request: UpdateWorkplaceRequest,
): Promise<WorkplaceDetailResponse> {
  const { data } = await apiClient.patch<WorkplaceDetailResponse>(
    `/workplaces/${workplaceId}`,
    request,
  );

  return data;
}

export {
  createWorkplace,
  extractBusinessRegistration,
  getMyWorkplaces,
  getWorkplaceDetail,
  updateWorkplace,
  verifyBusinessRegistration,
};
