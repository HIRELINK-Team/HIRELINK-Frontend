import apiClient from './client';
import type {
  BusinessRegistrationOcrResponse,
  CreateWorkplaceRequest,
  CreateWorkplaceResponse,
  VerifyBusinessRegistrationRequest,
  VerifyBusinessRegistrationResponse,
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

export {
  createWorkplace,
  extractBusinessRegistration,
  verifyBusinessRegistration,
};
