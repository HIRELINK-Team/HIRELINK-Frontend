import type {
  JobPostingListItem,
  JobPostingWorkTime,
} from '../types/jobPosting';
import {
  DAY_OF_WEEK_VALUES,
  type DayOfWeek,
  type WeeklySchedule,
} from '../types/workSchedule';
import {
  createEmptyWeeklySchedule,
  formatScheduleSummary,
} from './workSchedule';

const MINUTES_PER_DAY = 24 * 60;

function formatTime(minutes: number) {
  const normalized =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hour = String(Math.floor(normalized / 60)).padStart(2, '0');
  const minute = String(normalized % 60).padStart(2, '0');
  return `${hour}:${minute}`;
}

function parseTime(value: string) {
  const [hour, minute] = value.split(':').map(Number);
  return hour * 60 + minute;
}

function getNextDay(day: DayOfWeek): DayOfWeek {
  const index = DAY_OF_WEEK_VALUES.indexOf(day);
  return DAY_OF_WEEK_VALUES[(index + 1) % DAY_OF_WEEK_VALUES.length];
}

export function scheduleToJobPostingWorkTimes(
  schedule: WeeklySchedule,
): JobPostingWorkTime[] {
  return DAY_OF_WEEK_VALUES.flatMap((day) =>
    schedule[day].flatMap((range) => {
      if (range.endMinutes <= MINUTES_PER_DAY) {
        return [
          {
            dayOfWeek: day,
            startTime: formatTime(range.startMinutes),
            endTime: formatTime(range.endMinutes),
          },
        ];
      }

      return [
        {
          dayOfWeek: day,
          startTime: formatTime(range.startMinutes),
          endTime: '00:00',
        },
        {
          dayOfWeek: getNextDay(day),
          startTime: '00:00',
          endTime: formatTime(range.endMinutes),
        },
      ];
    }),
  );
}

export function jobPostingWorkTimesToSchedule(
  workTimes: JobPostingWorkTime[],
): WeeklySchedule {
  const schedule = createEmptyWeeklySchedule();

  workTimes.forEach((workTime) => {
    const startMinutes = parseTime(workTime.startTime);
    const parsedEndMinutes = parseTime(workTime.endTime);
    const endMinutes =
      workTime.endTime === '00:00' && workTime.startTime !== '00:00'
        ? MINUTES_PER_DAY
        : parsedEndMinutes;
    schedule[workTime.dayOfWeek].push({ startMinutes, endMinutes });
  });

  DAY_OF_WEEK_VALUES.forEach((day) => {
    const nextDay = getNextDay(day);
    const midnightEndingRange = schedule[day].find(
      (range) => range.endMinutes === MINUTES_PER_DAY,
    );
    const nextMorningIndex = schedule[nextDay].findIndex(
      (range) => range.startMinutes === 0 && range.endMinutes > 0,
    );

    if (midnightEndingRange && nextMorningIndex >= 0) {
      const [nextMorningRange] = schedule[nextDay].splice(nextMorningIndex, 1);
      midnightEndingRange.endMinutes =
        MINUTES_PER_DAY + nextMorningRange.endMinutes;
    }
  });

  DAY_OF_WEEK_VALUES.forEach((day) => {
    schedule[day].sort((a, b) => a.startMinutes - b.startMinutes);
  });
  return schedule;
}

export function formatJobPostingWage(job: JobPostingListItem) {
  if (!job.wageType || job.wageAmount === null) return '급여 미입력';
  const typeLabel = job.wageType === 'HOURLY' ? '시급' : '월급';
  return `${typeLabel} ${job.wageAmount.toLocaleString('ko-KR')}원`;
}

export function formatJobPostingSummary(job: JobPostingListItem) {
  const schedule = jobPostingWorkTimesToSchedule(job.workTimes);
  const scheduleLabel = job.workTimes.length
    ? formatScheduleSummary(schedule).split(' · 주 ')[0]
    : '근무시간 미입력';
  return `${formatJobPostingWage(job)} · ${scheduleLabel}`;
}

export function getSeoulTodayIsoDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}`;
}
