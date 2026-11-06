import { createContext, useContext } from 'react';
import type {
  CloseJobPostingResponse,
  CreateJobPostingRequest,
  JobPostingDetailResponse,
  JobPostingListItem,
  UpdateJobPostingRequest,
} from '../types/jobPosting';

interface EmployerJobsContextValue {
  jobs: JobPostingListItem[];
  jobDetails: Record<number, JobPostingDetailResponse>;
  loadJobs: (force?: boolean) => Promise<JobPostingListItem[]>;
  loadJobDetail: (
    jobPostingId: number,
    force?: boolean,
  ) => Promise<JobPostingDetailResponse>;
  createJob: (
    request: CreateJobPostingRequest,
  ) => Promise<JobPostingDetailResponse>;
  updateJob: (
    jobPostingId: number,
    request: UpdateJobPostingRequest,
  ) => Promise<JobPostingDetailResponse>;
  closeJob: (jobPostingId: number) => Promise<CloseJobPostingResponse>;
}

const EmployerJobsContext = createContext<EmployerJobsContextValue | null>(
  null,
);

function useEmployerJobs() {
  const context = useContext(EmployerJobsContext);
  if (!context) {
    throw new Error('useEmployerJobs must be used within EmployerJobsProvider');
  }
  return context;
}

export { EmployerJobsContext, useEmployerJobs };
