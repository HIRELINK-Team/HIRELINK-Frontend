import type { DayOfWeek } from './workSchedule';

export type StudentMatchingCriterionName =
  'WORK_TIME' | 'WAGE' | 'DISTANCE' | 'BUSINESS_TYPE';

export type StudentPreferredJob = {
  businessTypeId: number;
  businessTypeName: string;
  otherJobName: string | null;
};

export type StudentPreferredWorkTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type StudentPreferredLocation = {
  locationName: string;
  latitude: number;
  longitude: number;
  radiusM: number;
};

export type StudentMatchingPriority = {
  criterionId: number;
  criterionName: StudentMatchingCriterionName;
  priorityOrder: number;
};

export type StudentMatchingPreferencesResponse = {
  businessTypeFlexible: boolean;
  preferredJobs: StudentPreferredJob[];
  preferredWorkTimes: StudentPreferredWorkTime[];
  preferredLocation: StudentPreferredLocation | null;
  minimumHourlyWage: number | null;
  priorities: StudentMatchingPriority[];
};
