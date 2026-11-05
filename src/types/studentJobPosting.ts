import type { KoreanLevelCode, SalaryType } from './jobForm';
import type { DayOfWeek } from './workSchedule';

export type StudentJobPostingStatus = 'DRAFT' | 'RECRUITING' | 'CLOSED';

export type StudentJobPostingWorkTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type StudentJobPostingDetail = {
  jobPostingId: number;
  status: StudentJobPostingStatus;
  title: string | null;
  businessTypeId: number | null;
  businessTypeName: string | null;
  jobRole: string | null;
  workplaceId: number;
  workplaceName: string;
  workplaceAddress: string;
  latitude: number;
  longitude: number;
  wageType: SalaryType | null;
  wageAmount: number | null;
  recruitmentCount: number | null;
  workStartDate: string | null;
  requiredKoreanLevel: KoreanLevelCode | null;
  preferredExperience: string | null;
  workTimeNegotiable: boolean | null;
  applicationDeadlineDate: string | null;
  workTimes: StudentJobPostingWorkTime[];
};
