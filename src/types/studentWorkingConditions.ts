export type WorkingPeriodLimit = {
  type: 'WEEKDAY_LIMIT' | 'SHARED_WEEKLY_LIMIT' | 'NO_TIME_CAP';
  hours: number | null;
};

export type WorkingConditions = {
  estimate: {
    combinedWeeklyLimitHours: number | null;
    termWeekdays: WorkingPeriodLimit;
    weekendsAndHolidays: WorkingPeriodLimit;
    vacations: WorkingPeriodLimit;
  };
  notice: string;
};
