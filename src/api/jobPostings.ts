import { apiClient } from './client';

export async function getJobPosting<TResponse = unknown>(
  jobPostingId: string | number,
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>(
    `/api/job-postings/${encodeURIComponent(String(jobPostingId))}`,
  );

  return data;
}
