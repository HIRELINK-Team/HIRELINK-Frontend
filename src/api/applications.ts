import apiClient from './client';
import type {
  CreateEmploymentOfferResponse,
  EmployerApplicationDetailResponse,
  EmployerApplicationListQuery,
  EmployerApplicationListResponse,
  RejectApplicationResponse,
} from '../types/application';

async function getEmployerApplications(
  jobPostingId: number,
  query: EmployerApplicationListQuery = {},
): Promise<EmployerApplicationListResponse> {
  const { data } = await apiClient.get<EmployerApplicationListResponse>(
    `/job-postings/${jobPostingId}/applications`,
    { params: query },
  );
  return data;
}

async function getEmployerApplicationDetail(
  applicationId: number,
): Promise<EmployerApplicationDetailResponse> {
  const { data } = await apiClient.get<EmployerApplicationDetailResponse>(
    `/employer/applications/${applicationId}`,
  );
  return data;
}

async function rejectEmployerApplication(
  applicationId: number,
): Promise<RejectApplicationResponse> {
  const { data } = await apiClient.patch<RejectApplicationResponse>(
    `/applications/${applicationId}/reject`,
  );
  return data;
}

async function createEmploymentOffer(
  applicationId: number,
): Promise<CreateEmploymentOfferResponse> {
  const { data } = await apiClient.post<CreateEmploymentOfferResponse>(
    `/applications/${applicationId}/offers`,
  );
  return data;
}

export {
  createEmploymentOffer,
  getEmployerApplicationDetail,
  getEmployerApplications,
  rejectEmployerApplication,
};
