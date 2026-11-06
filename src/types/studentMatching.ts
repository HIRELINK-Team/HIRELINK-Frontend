export type RecommendedJobDetailMetric = {
  label: string;
  value: string;
};

export type RecommendedJobDetail = {
  comparisonTags: string[];
  locationAndDistance: string;
  matchRate: number;
  metrics: RecommendedJobDetailMetric[];
  tags: string[];
};

export type RecommendedJob = {
  applicationId?: number | null;
  applicationStatus?: 'WAITING_RESPONSE' | 'OFFERED' | null;
  countdownLabel: string;
  commuteAndWage: string;
  companyName: string;
  detail: RecommendedJobDetail;
  id: string;
  isCountdownActive: boolean;
  jobPostingId?: number;
  matchDescription: string;
  matchRate: number;
  rank?: number;
  recommendationId?: number;
  role: string;
  showsApplyButton: boolean;
};

export type StudentOfferAction = 'accept' | 'decline';

export type StudentMatchingView =
  | 'result'
  | 'detail'
  | 'startDate'
  | 'startDateSelection'
  | 'confirm'
  | 'complete'
  | 'offer'
  | 'refresh';
