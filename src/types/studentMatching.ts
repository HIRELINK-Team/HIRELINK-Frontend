export type RecommendedJob = {
  countdownLabel: string;
  commuteAndWage: string;
  companyName: string;
  id: string;
  isCountdownActive: boolean;
  matchDescription: string;
  matchRate: number;
  role: string;
  showsApplyButton: boolean;
};

export type StudentMatchingView =
  | 'result'
  | 'detail'
  | 'startDate'
  | 'startDateSelection'
  | 'confirm'
  | 'complete'
  | 'offer'
  | 'refresh';
