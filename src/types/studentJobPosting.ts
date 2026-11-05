import type { SalaryType } from './jobForm';
import type { DayOfWeek } from './workSchedule';

export type StudentJobPostingStatus = 'DRAFT' | 'RECRUITING' | 'CLOSED';

export type StudentJobPostingWorkTime = {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
};

export type StudentJobPostingDetail = {
  jobPostingId: number;
  status: StudentJobPostingStatus;
  jobTitle: string;
  workplace: {
    name: string;
    address: string;
  };
  wage: {
    type: SalaryType;
    amount: number;
  };
  workTimes: StudentJobPostingWorkTime[];
  deadline: string;
};
