import { apiClient } from '../client';

import type {
  CreateStudentApplicationRequest,
  CreateStudentApplicationResponse,
  StudentApplicationDetail,
  StudentApplicationApiStatus,
  StudentApplicationsResponse,
  WithdrawStudentApplicationResponse,
} from '../../types/studentApplication';

type ApplicationListParams = {
  status?: StudentApplicationApiStatus;
};

function applicationPath(applicationId: string | number) {
  return `/applications/${encodeURIComponent(String(applicationId))}`;
}

export async function createStudentApplication(
  requestBody: CreateStudentApplicationRequest,
): Promise<CreateStudentApplicationResponse> {
  // The server limits reviewing applicants to five and prevents reapplication.
  // A successful application starts the employer's 24-hour response window.
  const request = {
    desiredStartDate: requestBody.desiredStartDate,
    jobPostingId: requestBody.jobPostingId,
  };
  const { data } = await apiClient.post<CreateStudentApplicationResponse>(
    '/applications',
    request,
  );

  return data;
}

export async function getMyStudentApplications(
  params: ApplicationListParams = {},
): Promise<StudentApplicationsResponse> {
  const { data } = await apiClient.get<StudentApplicationsResponse>(
    '/applications/me',
    { params },
  );

  return data;
}

export async function getMyStudentApplication(
  applicationId: string | number,
): Promise<StudentApplicationDetail> {
  const { data } = await apiClient.get<StudentApplicationDetail>(
    applicationPath(applicationId),
  );

  return data;
}

export async function withdrawStudentApplication(
  applicationId: string | number,
): Promise<WithdrawStudentApplicationResponse> {
  // Withdrawal is permitted only while the employer is reviewing the application.
  const { data } = await apiClient.patch<WithdrawStudentApplicationResponse>(
    `${applicationPath(applicationId)}/withdraw`,
  );

  return data;
}
