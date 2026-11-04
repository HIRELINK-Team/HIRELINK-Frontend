import type { SalaryType } from './jobForm';
import type { DayOfWeek } from './workSchedule';

export type StudentRecommendationWorkTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type StudentRecommendation = {
  recommendationId: number;
  jobPostingId: number;
  rank: number;
  jobTitle: string;
  workplaceName: string;
  workplaceAddress: string;
  wageType: SalaryType;
  wageAmount: number;
  workTimes: StudentRecommendationWorkTime[];
  matchScore: number;
  recommendationReasons: string[];
};

export type StudentRecommendationsResponse = {
  batchId: number;
  generatedAt: string;
  refreshRequired: boolean;
  recommendations: StudentRecommendation[];
};

export type StudentRecommendationDetailResponse = StudentRecommendation & {
  batchId: number;
  generatedAt: string;
};
