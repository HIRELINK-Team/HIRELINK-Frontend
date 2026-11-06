import type {
  JobPostingWageType,
  PreferredExperience,
  RequiredKoreanLevel,
} from './jobPosting';
import type { WeeklySchedule } from './workSchedule';
import type { EmployerIndustryCode } from './employerProfile';

export type SalaryType = JobPostingWageType;

export type IndustryCode = '' | EmployerIndustryCode;

export type KoreanLevelCode = '' | RequiredKoreanLevel;
export type PreferredExperienceCode = '' | PreferredExperience;

export interface JobFormValues {
  workplaceId: number | null;
  jobTitle: string;
  workplace: string;
  industry: IndustryCode;
  headcount: string;
  salary: string;
  salaryType: SalaryType;
  startDate: string;
  koreanLevel: KoreanLevelCode;
  preferredExperience: PreferredExperienceCode;
  deadline: string;
  schedule: WeeklySchedule;
  isScheduleNegotiable: boolean;
}
