import type { JobFormValues } from '../types/jobForm';
import {
  cloneWeeklySchedule,
  createEmptyWeeklySchedule,
} from '../utils/workSchedule';

const EMPTY_VALUES: JobFormValues = {
  workplaceId: null,
  jobTitle: '',
  workplace: '',
  industry: '',
  headcount: '',
  salary: '',
  salaryType: 'HOURLY',
  startDate: '',
  koreanLevel: '',
  preferredExperience: '',
  deadline: '',
  schedule: createEmptyWeeklySchedule(),
  isScheduleNegotiable: false,
};

export function createDefaultJobFormValues(): JobFormValues {
  return {
    ...EMPTY_VALUES,
    schedule: cloneWeeklySchedule(EMPTY_VALUES.schedule),
  };
}
