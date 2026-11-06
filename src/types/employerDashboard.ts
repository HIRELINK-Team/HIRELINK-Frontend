import type { EmployerApplicationListItem } from './application';
import type { JobPostingListItem } from './jobPosting';

export interface EmployerDashboardApplication {
  jobPostingId: number;
  application: EmployerApplicationListItem;
}

export interface EmployerDashboardData {
  recruitingCount: number;
  waitingResponseCount: number;
  offeredCount: number;
  recentApplications: EmployerDashboardApplication[];
  offeredApplications: EmployerDashboardApplication[];
  recruitingJobPostings: JobPostingListItem[];
  failedApplicationJobIds: number[];
}
