import apiClient from './client';
import type {
  CloseJobPostingResponse,
  CreateJobPostingRequest,
  JobPostingDetailResponse,
  JobPostingListQuery,
  JobPostingListResponse,
  UpdateJobPostingRequest,
} from '../types/jobPosting';

async function getMyJobPostings(
  query: JobPostingListQuery = {},
): Promise<JobPostingListResponse> {
  const { data } = await apiClient.get<JobPostingListResponse>(
    '/employers/me/job-postings',
    { params: query },
  );
  return data;
}

async function getJobPostingDetail(
  jobPostingId: number,
): Promise<JobPostingDetailResponse> {
  const { data } = await apiClient.get<JobPostingDetailResponse>(
    `/job-postings/${jobPostingId}`,
  );
  return data;
}

async function createJobPosting(
  request: CreateJobPostingRequest,
): Promise<JobPostingDetailResponse> {
  const { data } = await apiClient.post<JobPostingDetailResponse>(
    '/job-postings',
    request,
  );
  return data;
}

async function updateJobPosting(
  jobPostingId: number,
  request: UpdateJobPostingRequest,
): Promise<JobPostingDetailResponse> {
  const { data } = await apiClient.patch<JobPostingDetailResponse>(
    `/job-postings/${jobPostingId}`,
    request,
  );
  return data;
}

async function closeJobPosting(
  jobPostingId: number,
): Promise<CloseJobPostingResponse> {
  const { data } = await apiClient.patch<CloseJobPostingResponse>(
    `/job-postings/${jobPostingId}/close`,
  );
  return data;
}

export {
  closeJobPosting,
  createJobPosting,
  getJobPostingDetail,
  getMyJobPostings,
  updateJobPosting,
};
