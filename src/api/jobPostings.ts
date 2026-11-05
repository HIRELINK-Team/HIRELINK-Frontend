import { apiClient } from './client';
import type { StudentJobPostingDetail } from '../types/studentJobPosting';

export async function getJobPosting<TResponse = unknown>(
  jobPostingId: string | number,
): Promise<TResponse> {
  const { data } = await apiClient.get<TResponse>(
    `/job-postings/${encodeURIComponent(String(jobPostingId))}`,
  );

  return data;
}

export function getStudentJobPosting(jobPostingId: string | number) {
  return getJobPosting<StudentJobPostingDetail>(jobPostingId);
}
