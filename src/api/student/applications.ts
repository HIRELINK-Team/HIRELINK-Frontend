import { apiClient } from '../client';

type ApplicationListParams = {
  status?: string;
};

function applicationPath(applicationId: string | number) {
  return `/api/applications/${encodeURIComponent(String(applicationId))}`;
}

export async function createStudentApplication<TResponse = unknown>(
  requestBody: unknown,
): Promise<TResponse> {
  // The server limits reviewing applicants to five and prevents reapplication.
  // A successful application starts the employer's 24-hour response window.
  const { data } = await apiClient.post<TResponse>(
    '/api/applications',
    requestBody,
  );

  return data;
}

export async function getMyStudentApplications<TResponse = unknown>(
  params: ApplicationListParams = {},
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>('/api/applications/me', {
    params,
  });

  return data;
}

export async function getMyStudentApplication<TResponse = unknown>(
  applicationId: string | number,
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>(
    applicationPath(applicationId),
  );

  return data;
}

export async function withdrawStudentApplication<TResponse = unknown>(
  applicationId: string | number,
): Promise<TResponse> {
  // Withdrawal is permitted only while the employer is reviewing the application.
  const { data } = await apiClient.patch<TResponse>(
    `${applicationPath(applicationId)}/withdraw`,
  );

  return data;
}
