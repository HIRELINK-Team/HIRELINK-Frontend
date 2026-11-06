export type JobPostingStatus = 'DRAFT' | 'RECRUITING' | 'CLOSED';
export type JobPostingQueryStatus = Extract<
  JobPostingStatus,
  'RECRUITING' | 'CLOSED'
>;
export type JobPostingWageType = 'HOURLY' | 'MONTHLY';
export type JobPostingDayOfWeek =
  'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
export type RequiredKoreanLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type PreferredExperience =
  'NONE' | 'SIX_MONTHS_OR_MORE' | 'ONE_YEAR_OR_MORE';

export interface JobPostingWorkTime {
  dayOfWeek: JobPostingDayOfWeek;
  startTime: string;
  endTime: string;
}

export interface JobPostingListItem {
  jobPostingId: number;
  workplaceId: number;
  workplaceName: string;
  jobRole: string | null;
  wageType: JobPostingWageType | null;
  wageAmount: number | null;
  status: JobPostingStatus;
  applicationDeadlineDate: string | null;
  workTimes: JobPostingWorkTime[];
  createdAt: string;
}

export interface JobPostingListResponse {
  jobPostings: JobPostingListItem[];
}

export interface JobPostingListQuery {
  status?: JobPostingQueryStatus;
  includeDraft?: boolean;
}

export interface JobPostingDetailResponse {
  jobPostingId: number;
  title: string | null;
  status: JobPostingStatus;
  workplaceId: number;
  workplaceName: string;
  workplaceAddress: string;
  latitude: number;
  longitude: number;
  businessTypeId: number | null;
  businessTypeName: string | null;
  jobRole: string | null;
  wageType: JobPostingWageType | null;
  wageAmount: number | null;
  recruitmentCount: number | null;
  workStartDate: string | null;
  requiredKoreanLevel: RequiredKoreanLevel | null;
  preferredExperience: PreferredExperience | null;
  workTimeNegotiable: boolean | null;
  applicationDeadlineDate: string | null;
  workTimes: JobPostingWorkTime[];
}

export interface CreateJobPostingRequest {
  workplaceId: number;
  businessTypeId?: number | null;
  jobRole?: string | null;
  recruitmentCount?: number | null;
  wageType?: JobPostingWageType | null;
  wageAmount?: number | null;
  workStartDate?: string | null;
  requiredKoreanLevel?: RequiredKoreanLevel | null;
  preferredExperience?: PreferredExperience | null;
  applicationDeadlineDate?: string | null;
  workTimeNegotiable?: boolean | null;
  workTimes?: JobPostingWorkTime[] | null;
  status: Extract<JobPostingStatus, 'DRAFT' | 'RECRUITING'>;
}

export interface UpdateJobPostingRequest {
  businessTypeId?: number;
  jobRole?: string;
  recruitmentCount?: number;
  wageType?: JobPostingWageType;
  wageAmount?: number;
  workStartDate?: string;
  requiredKoreanLevel?: RequiredKoreanLevel;
  preferredExperience?: PreferredExperience;
  applicationDeadlineDate?: string;
  workTimeNegotiable?: boolean;
  workTimes?: JobPostingWorkTime[];
  status?: Extract<JobPostingStatus, 'DRAFT' | 'RECRUITING'>;
}

export interface CloseJobPostingResponse {
  jobPostingId: number;
  status: 'CLOSED';
  closedAt: string;
}
