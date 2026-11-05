import type {
  EmployerApplicantWorkTime,
  EmployerApplicationStatus,
} from '../types/application';
import type { RequiredKoreanLevel } from '../types/jobPosting';
import { DAY_LABELS } from './workSchedule';

const KOREAN_LEVEL_LABELS: Record<RequiredKoreanLevel, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

const APPLICATION_STATUS_LABELS: Record<EmployerApplicationStatus, string> = {
  WAITING_RESPONSE: '검토 중',
  OFFERED: '수락 대기',
  COMPLETED: '채용 완료',
  ENDED: '지원 종료',
};

export function formatKoreanLevel(level: RequiredKoreanLevel | null) {
  return level ? KOREAN_LEVEL_LABELS[level] : '-';
}

export function formatApplicationStatus(status: EmployerApplicationStatus) {
  return APPLICATION_STATUS_LABELS[status];
}

export function formatApplicationWorkTimes(
  workTimes: EmployerApplicantWorkTime[],
) {
  if (workTimes.length === 0) return '등록된 시간이 없어요';

  const groups = new Map<string, EmployerApplicantWorkTime[]>();
  workTimes.forEach((workTime) => {
    const key = `${workTime.startTime}-${workTime.endTime}`;
    groups.set(key, [...(groups.get(key) ?? []), workTime]);
  });

  return [...groups.entries()]
    .map(([key, groupedTimes]) => {
      const [startTime, endTime] = key.split('-');
      const days = groupedTimes
        .map((workTime) => DAY_LABELS[workTime.dayOfWeek])
        .join('·');
      return `${days} ${startTime}-${endTime}`;
    })
    .join(' / ');
}

export function formatApplicationDate(value: string | null) {
  return value ? value.replaceAll('-', '.') : '-';
}

export function formatApplicationDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}
