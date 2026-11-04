import type { IndustryId } from '../types/industry';
import type { MatchingPriorityId } from '../types/matchingPriority';
import type {
  StudentMatchingCriterionName,
  StudentMatchingPreferencesResponse,
  StudentPreferredWorkTime,
} from '../types/studentMatchingPreferences';
import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../types/workAvailability';
import type { WorkLocation } from '../types/workLocation';

export type StudentMatchingPreferencesUiState = {
  businessTypeFlexible: boolean;
  otherIndustry: string;
  priorityOrder: MatchingPriorityId[];
  selectedIndustries: IndustryId[];
  workAvailability: WorkAvailability;
  workLocation: WorkLocation;
};

const BUSINESS_TYPE_TO_INDUSTRY: Readonly<Record<string, IndustryId>> = {
  ACADEMIC: 'majorStudy',
  DUTY_FREE: 'dutyFree',
  FOOD_AND_CAFE: 'foodCafe',
  FOOD_CAFE: 'foodCafe',
  INTERNSHIP: 'internship',
  INTERPRETATION: 'translation',
  OFFICE_AND_TOURISM: 'officeTourism',
  OTHER: 'other',
  RETAIL: 'retail',
};

const CRITERION_TO_PRIORITY: Record<
  StudentMatchingCriterionName,
  MatchingPriorityId
> = {
  BUSINESS_TYPE: 'industry',
  DISTANCE: 'distance',
  WAGE: 'wage',
  WORK_TIME: 'workTime',
};

function createEmptyWorkAvailability(): WorkAvailability {
  return {
    daytime: {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    },
    nighttime: {
      mon: [],
      tue: [],
      wed: [],
      thu: [],
      fri: [],
      sat: [],
      sun: [],
    },
  };
}

function parseTime(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function getWorkTimeSlots(workTime: StudentPreferredWorkTime): {
  day: Weekday;
  mode: WorkTimeMode;
  slots: number[];
} | null {
  const day = workTime.dayOfWeek.toLowerCase() as Weekday;
  const startMinutes = parseTime(workTime.startTime);
  const endMinutes = parseTime(workTime.endTime);
  const isDaytimeRange =
    startMinutes >= 9 * 60 &&
    endMinutes > startMinutes &&
    endMinutes <= 23 * 60;
  const mode: WorkTimeMode = isDaytimeRange ? 'daytime' : 'nighttime';
  const rangeStart = isDaytimeRange
    ? startMinutes
    : startMinutes < 6 * 60
      ? startMinutes + 24 * 60
      : startMinutes;
  const rangeEnd = isDaytimeRange
    ? endMinutes
    : endMinutes <= 6 * 60
      ? endMinutes + 24 * 60
      : endMinutes;
  const modeStart = mode === 'daytime' ? 9 * 60 : 22 * 60;
  const modeEnd = mode === 'daytime' ? 23 * 60 : 30 * 60;

  if (
    rangeStart < modeStart ||
    rangeEnd > modeEnd ||
    rangeEnd <= rangeStart ||
    (rangeStart - modeStart) % 30 !== 0 ||
    (rangeEnd - modeStart) % 30 !== 0
  ) {
    return null;
  }

  const startSlot = (rangeStart - modeStart) / 30;
  const slotCount = (rangeEnd - rangeStart) / 30;

  return {
    day,
    mode,
    slots: Array.from({ length: slotCount }, (_, index) => startSlot + index),
  };
}

function mapWorkAvailability(preferredWorkTimes: StudentPreferredWorkTime[]) {
  const workAvailability = createEmptyWorkAvailability();

  preferredWorkTimes.forEach((workTime) => {
    const mappedRange = getWorkTimeSlots(workTime);

    if (!mappedRange) return;

    workAvailability[mappedRange.mode][mappedRange.day] = [
      ...new Set([
        ...workAvailability[mappedRange.mode][mappedRange.day],
        ...mappedRange.slots,
      ]),
    ].sort((first, second) => first - second);
  });

  return workAvailability;
}

export function mapStudentMatchingPreferencesToUiState(
  preferences: StudentMatchingPreferencesResponse,
): StudentMatchingPreferencesUiState {
  const selectedIndustries = preferences.preferredJobs.flatMap((job) => {
    const industry = BUSINESS_TYPE_TO_INDUSTRY[job.businessTypeName];
    return industry ? [industry] : [];
  });
  const otherIndustry =
    preferences.preferredJobs.find((job) => job.businessTypeName === 'OTHER')
      ?.otherJobName ?? '';
  const workLocation: WorkLocation = preferences.preferredLocation
    ? {
        address: preferences.preferredLocation.locationName,
        latitude: preferences.preferredLocation.latitude,
        longitude: preferences.preferredLocation.longitude,
        radius: preferences.preferredLocation.radiusM,
      }
    : { address: '', radius: 500 };

  return {
    businessTypeFlexible: preferences.businessTypeFlexible,
    otherIndustry,
    priorityOrder: [...preferences.priorities]
      .sort((first, second) => first.priorityOrder - second.priorityOrder)
      .map((priority) => CRITERION_TO_PRIORITY[priority.criterionName]),
    selectedIndustries: [...new Set(selectedIndustries)],
    workAvailability: mapWorkAvailability(preferences.preferredWorkTimes),
    workLocation,
  };
}
