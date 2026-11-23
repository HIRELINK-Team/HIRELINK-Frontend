import { mapExperienceDraftToCreateRequest } from './studentExperience';
import {
  mapIndustrySelectionToUpdateRequest,
  mapPriorityOrderToUpdateRequest,
} from './studentMatchingPreferences';

import type { KoreanLevel } from '../constants/studentOnboardingOptions';
import type { Experience } from '../types/experience';
import type { IndustryId } from '../types/industry';
import type { MatchingPriorityId } from '../types/matchingPriority';
import type { ResidenceQualification } from '../types/residence';
import type {
  StudentOnboardingRequest,
  StudentOnboardingDraftRequest,
  StudentStudyProgram,
} from '../types/studentOnboarding';
import type { StudentPreferredWorkTime } from '../types/studentMatchingPreferences';
import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../types/workAvailability';
import type { WorkLocation } from '../types/workLocation';

const STUDY_PROGRAMS: Partial<
  Record<ResidenceQualification, StudentStudyProgram>
> = {
  D2_1: 'ASSOCIATE',
  D2_2: 'BACHELOR',
  D2_3: 'MASTER',
  D2_4: 'DOCTORATE',
  D2_6: 'EXCHANGE',
};
const DAYS: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const BACKEND_DAYS: StudentPreferredWorkTime['dayOfWeek'][] = [
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
  'SUN',
];
const SLOTS_PER_DAY = 48;
const SLOTS_PER_WEEK = 7 * SLOTS_PER_DAY;

function formatTime(slot: number) {
  const minutes = (slot % SLOTS_PER_DAY) * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function mapOnboardingWorkTimes(
  availability: WorkAvailability,
): StudentPreferredWorkTime[] {
  const selected = Array<boolean>(SLOTS_PER_WEEK).fill(false);
  for (const mode of ['daytime', 'nighttime'] as WorkTimeMode[]) {
    DAYS.forEach((day, dayIndex) => {
      for (const slot of availability[mode][day]) {
        const start = mode === 'daytime' ? 18 : 44;
        selected[(dayIndex * SLOTS_PER_DAY + start + slot) % SLOTS_PER_WEEK] =
          true;
      }
    });
  }

  const ranges: StudentPreferredWorkTime[] = [];
  for (let start = 0; start < SLOTS_PER_WEEK; start += 1) {
    if (
      !selected[start] ||
      selected[(start + SLOTS_PER_WEEK - 1) % SLOTS_PER_WEEK]
    )
      continue;
    let length = 0;
    while (
      length < SLOTS_PER_WEEK &&
      selected[(start + length) % SLOTS_PER_WEEK]
    )
      length += 1;
    ranges.push({
      dayOfWeek: BACKEND_DAYS[Math.floor(start / SLOTS_PER_DAY)],
      startTime: formatTime(start),
      endTime: formatTime(start + length),
    });
  }
  return ranges;
}

export function hasOneHourWorkTime(times: StudentPreferredWorkTime[]) {
  return times.some(({ startTime, endTime }) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const minutes =
      (endHour * 60 + endMinute - startHour * 60 - startMinute + 1440) % 1440;
    return minutes >= 60;
  });
}

export function mapStudentOnboardingRequest(input: {
  birthDate: string;
  currentRegion: string;
  koreanLevel: KoreanLevel;
  residenceQualification: ResidenceQualification;
  experiences: Experience[];
  selectedIndustries: IndustryId[];
  otherIndustry: string;
  businessTypeFlexible: boolean;
  workAvailability: WorkAvailability;
  workLocation: WorkLocation;
  priorityOrder: MatchingPriorityId[];
}): StudentOnboardingDraftRequest | null {
  const studyProgram = STUDY_PROGRAMS[input.residenceQualification];
  const industry = mapIndustrySelectionToUpdateRequest(
    input.selectedIndustries,
    input.otherIndustry,
    input.businessTypeFlexible,
  );
  const priority = mapPriorityOrderToUpdateRequest(input.priorityOrder);
  const preferredWorkTimes = mapOnboardingWorkTimes(input.workAvailability);
  const careers = input.experiences.map(mapExperienceDraftToCreateRequest);
  const { address, latitude, longitude, radius } = input.workLocation;

  if (
    !studyProgram ||
    !input.birthDate ||
    !input.currentRegion.trim() ||
    !industry ||
    !('businessTypeFlexible' in industry) ||
    !priority ||
    !('priorities' in priority) ||
    !priority.priorities ||
    !address.trim() ||
    !hasOneHourWorkTime(preferredWorkTimes) ||
    careers.some((career) => !career?.description)
  )
    return null;

  return {
    birthDate: input.birthDate,
    currentRegion: input.currentRegion.trim(),
    koreanLevel:
      input.koreanLevel.toUpperCase() as StudentOnboardingRequest['koreanLevel'],
    studyProgram,
    careers: careers.map((career) => ({
      careerName: career!.careerName,
      startMonth: career!.startMonth,
      endMonth: career!.endMonth,
      description: career!.description!,
    })),
    matchingPreferences: {
      businessTypeFlexible: industry.businessTypeFlexible,
      preferredJobs: industry.preferredJobs,
      preferredWorkTimes,
      preferredLocation: {
        locationName: address.trim(),
        ...(latitude === undefined ? {} : { latitude }),
        ...(longitude === undefined ? {} : { longitude }),
        radiusM: radius,
      },
      priorities: priority.priorities,
    },
  };
}
