export const DAY_OF_WEEK_VALUES = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
] as const;

export type DayOfWeek = (typeof DAY_OF_WEEK_VALUES)[number];

/**
 * 30분 단위 시간 범위입니다. 자정을 넘는 범위는 endMinutes가 1440보다 큽니다.
 * 예: 22:00~익일 04:00 = { startMinutes: 1320, endMinutes: 1680 }
 */
export interface TimeRange {
  startMinutes: number;
  endMinutes: number;
}

export type WeeklySchedule = Record<DayOfWeek, TimeRange[]>;
