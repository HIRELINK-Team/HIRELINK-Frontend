import type { SalaryType } from './jobForm';
import type { DayOfWeek } from './workSchedule';

export type StudentEmploymentMatchStudent = {
  name: string;
  nationality: string;
  profileImageUrl: string | null;
  topikLevel: number | null;
  visaType: string | null;
};

export type StudentEmploymentMatchListItem = {
  applicationId: number;
  desiredStartDate: string;
  jobPostingId: number;
  jobTitle: string;
  matchId: number;
  matchedAt: string;
  offerId: number;
  student: StudentEmploymentMatchStudent | null;
  wageAmount: number;
  wageType: SalaryType;
  workplaceName: string;
};

export type StudentEmploymentMatchesResponse = {
  matches: StudentEmploymentMatchListItem[];
};

export type StudentEmploymentMatchContact = {
  name: string;
  phoneNumber: string;
};

export type StudentEmploymentMatchWorkTime = {
  dayOfWeek: DayOfWeek;
  endTime: string;
  startTime: string;
};

export type StudentEmploymentMatchResponse = StudentEmploymentMatchListItem & {
  contact: StudentEmploymentMatchContact;
  workTimes: StudentEmploymentMatchWorkTime[];
  workplaceAddress: string;
};
