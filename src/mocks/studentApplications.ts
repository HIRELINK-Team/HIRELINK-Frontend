import { STUDENT_RECOMMENDED_JOBS } from './studentMatching';
import type { StudentApplication } from '../types/studentApplication';

export const STUDENT_APPLICATIONS_MOCK: StudentApplication[] = [
  {
    id: 'application-reviewing-1',
    job: STUDENT_RECOMMENDED_JOBS[0],
    status: 'REVIEWING',
    timerLabel: '23:10',
    startedAt: '2026-10-29T09:00:00+09:00',
    expiresAt: '2026-10-30T09:00:00+09:00',
  },
  {
    id: 'application-reviewing-2',
    job: STUDENT_RECOMMENDED_JOBS[1],
    status: 'REVIEWING',
    timerLabel: '20:10',
    startedAt: '2026-10-29T12:00:00+09:00',
    expiresAt: '2026-10-30T12:00:00+09:00',
  },
  {
    id: 'application-offer-1',
    job: STUDENT_RECOMMENDED_JOBS[0],
    status: 'OFFER_WAITING',
    timerLabel: '23:10',
    startedAt: '2026-10-29T09:00:00+09:00',
    expiresAt: '2026-10-30T09:00:00+09:00',
  },
  {
    id: 'application-hired-1',
    job: STUDENT_RECOMMENDED_JOBS[2],
    status: 'HIRED',
  },
];
