import type { SalaryType } from './jobForm';
import type { DayOfWeek } from './workSchedule';

export type StudentRecommendationWorkTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

type RecommendationFields = {
  recommendationId: number;
  jobPostingId: number;
  rank: number;
  jobTitle: string;
  workplaceName: string;
  workplaceAddress: string;
  wageAmount: number;
  workTimes: StudentRecommendationWorkTime[];
  matchScore: number;
  recommendationReasons: string[];
};

// The list item's Swagger reference currently points to an application schema.
// Keep the existing list contract until the actual recommendation response is confirmed.
export type StudentRecommendation = RecommendationFields & {
  applicationId: number | null;
  applicationStatus: 'WAITING_RESPONSE' | 'OFFERED' | null;
  wageType: SalaryType;
};

export type StudentRecommendationsResponse = {
  batchId: number;
  generatedAt: string;
  refreshRequired: boolean;
  recommendations: StudentRecommendation[];
};

export type CreateStudentRecommendationsResponse = {
  batchId: number;
  generatedAt: string;
  recommendationCount: number;
};

export type StudentRecommendationRefreshResponse = {
  batchId: number;
  generatedAt: string;
  recommendationCount: number;
  refreshed: boolean;
};

export type StudentRecommendationDetailResponse = RecommendationFields & {
  batchId: number;
  generatedAt: string;
  wageType: string;
};
