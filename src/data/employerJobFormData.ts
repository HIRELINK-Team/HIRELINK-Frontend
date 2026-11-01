import type { JobFormValues } from "../types/jobForm";
import type { WeeklySchedule } from "../types/workSchedule";
import {
  cloneWeeklySchedule,
  createEmptyWeeklySchedule,
} from "../utils/workSchedule";

function createSchedule(
  days: Array<keyof WeeklySchedule>,
  startMinutes: number,
  endMinutes: number,
): WeeklySchedule {
  const schedule = createEmptyWeeklySchedule();
  days.forEach((day) => {
    schedule[day] = [{ startMinutes, endMinutes }];
  });
  return schedule;
}

const FIGMA_DAY_SCHEDULE = createSchedule(
  ["MON", "WED", "FRI"],
  16 * 60,
  22 * 60,
);

const FIGMA_NIGHT_SCHEDULE = createSchedule(
  ["MON", "WED", "FRI"],
  22 * 60,
  28 * 60,
);

const PREVIOUS_SHORT_SCHEDULE = createSchedule(
  ["TUE", "THU"],
  12 * 60,
  14 * 60,
);

const BASE_VALUES: JobFormValues = {
  jobTitle: "바리스타",
  workplace: "모모카페 연남점",
  industry: "FOOD_AND_CAFE",
  headcount: "1",
  salary: "1000000",
  salaryType: "MONTHLY",
  startDate: "2026-10-24",
  koreanLevel: "",
  preferredExperience: "",
  deadline: "2026-10-31",
  schedule: FIGMA_DAY_SCHEDULE,
  isScheduleNegotiable: false,
};

function cloneValues(values: JobFormValues): JobFormValues {
  return {
    ...values,
    schedule: cloneWeeklySchedule(values.schedule),
  };
}

export function createDefaultJobFormValues(): JobFormValues {
  return cloneValues(BASE_VALUES);
}

export function getEditJobFormValues(jobId: string): JobFormValues {
  const usesNightSchedule = jobId.includes("night");
  return cloneValues({
    ...BASE_VALUES,
    salary: "12000",
    salaryType: "HOURLY",
    koreanLevel: "INTERMEDIATE",
    preferredExperience: "카페 근무 6개월 이상",
    schedule: usesNightSchedule ? FIGMA_NIGHT_SCHEDULE : FIGMA_DAY_SCHEDULE,
  });
}

export function getPreviousJobFormValues(
  previousJobId: string,
): JobFormValues | null {
  if (!previousJobId) {
    return null;
  }

  return cloneValues({
    ...BASE_VALUES,
    jobTitle: previousJobId.includes("server") ? "서빙" : "바리스타",
    salary: "13000",
    salaryType: "HOURLY",
    koreanLevel: "BEGINNER",
    schedule: PREVIOUS_SHORT_SCHEDULE,
  });
}
