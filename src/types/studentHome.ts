export type StudentNavigationTab = 'home' | 'matching' | 'applications' | 'my';

export type StudentHomeCondition = {
  label: string;
  value: string;
};

export type StudentHomeSummary = {
  applications: {
    completed: number;
    offer: number;
    reviewing: number;
    total: number;
  };
  conditions: StudentHomeCondition[];
  greetingName: string;
  recommendedJobCount: number;
};
