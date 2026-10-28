export type WorkTimeMode = 'daytime' | 'nighttime';

export type Weekday = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type WeekdayAvailability = Record<Weekday, number[]>;

export type WorkAvailability = Record<WorkTimeMode, WeekdayAvailability>;
