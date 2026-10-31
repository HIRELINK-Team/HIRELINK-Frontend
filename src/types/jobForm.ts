import type { WeeklySchedule } from "./workSchedule";

export type SalaryType = "HOURLY" | "MONTHLY";

export type IndustryCode =
  "" | "FOOD_AND_CAFE" | "RETAIL" | "OFFICE" | "EDUCATION" | "MANUFACTURING";

export type KoreanLevelCode =
  "" | "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "NO_PREFERENCE";

/** 백엔드 명세 확정 전 공고 작성 화면에서만 사용하는 프론트엔드 타입입니다. */
export interface JobFormValues {
  jobTitle: string;
  workplace: string;
  industry: IndustryCode;
  headcount: string;
  salary: string;
  salaryType: SalaryType;
  startDate: string;
  koreanLevel: KoreanLevelCode;
  preferredExperience: string;
  deadline: string;
  schedule: WeeklySchedule;
  isScheduleNegotiable: boolean;
}
