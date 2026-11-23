import type { IndustryId } from '../types/industry';
import type { MatchingPriorityId } from '../types/matchingPriority';
import type {
  StudentMatchingCriterionName,
  StudentMatchingPreferencesResponse,
  StudentMatchingPreferencesUpdateRequest,
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

const INDUSTRY_TO_BUSINESS_TYPE_ID: Readonly<Record<IndustryId, number>> = {
  foodCafe: 1,
  retail: 2,
  officeTourism: 3,
  translation: 4,
  dutyFree: 5,
  majorStudy: 6,
  internship: 7,
  other: 8,
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

const PRIORITY_TO_CRITERION_ID: Record<MatchingPriorityId, number> = {
  distance: 3,
  industry: 4,
  wage: 2,
  workTime: 1,
};

const WEEKDAY_TO_BACKEND = {
  fri: 'FRI',
  mon: 'MON',
  sat: 'SAT',
  sun: 'SUN',
  thu: 'THU',
  tue: 'TUE',
  wed: 'WED',
} as const satisfies Record<Weekday, StudentPreferredWorkTime['dayOfWeek']>;

const WEEKDAYS: readonly Weekday[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];
const SLOTS_PER_DAY = 48;
const SLOTS_PER_WEEK = 7 * SLOTS_PER_DAY;

function formatBackendTime(slot: number) {
  const minutes = (slot % SLOTS_PER_DAY) * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export function mapIndustrySelectionToUpdateRequest(
  selectedIndustries: readonly IndustryId[],
  otherIndustry: string,
  businessTypeFlexible: boolean,
): {
  businessTypeFlexible: boolean;
  preferredJobs: import('../types/studentMatchingPreferences').StudentPreferredJobUpdate[];
} | null {
  if (businessTypeFlexible) {
    return { businessTypeFlexible: true, preferredJobs: [] };
  }

  if (selectedIndustries.length === 0) return null;

  const preferredJobs = selectedIndustries.map((industry) => {
    const businessTypeId = INDUSTRY_TO_BUSINESS_TYPE_ID[industry];

    if (industry === 'other') {
      const trimmedOtherIndustry = otherIndustry.trim();
      if (!trimmedOtherIndustry) return null;

      return {
        businessTypeId,
        otherJobName: trimmedOtherIndustry,
      };
    }

    return {
      businessTypeId,
      otherJobName: null,
    };
  });

  const validPreferredJobs = preferredJobs.filter(
    (job): job is NonNullable<(typeof preferredJobs)[number]> => job !== null,
  );

  if (validPreferredJobs.length !== preferredJobs.length) {
    return null;
  }

  if (validPreferredJobs.length === 0) return null;

  return {
    businessTypeFlexible: false,
    preferredJobs: validPreferredJobs as [
      (typeof validPreferredJobs)[number],
      ...(typeof validPreferredJobs)[number][],
    ],
  };
}

export function mapWorkAvailabilityToUpdateRequest(
  workAvailability: WorkAvailability,
): StudentMatchingPreferencesUpdateRequest {
  const selected = Array<boolean>(SLOTS_PER_WEEK).fill(false);
  for (const mode of ['daytime', 'nighttime'] as WorkTimeMode[]) {
    WEEKDAYS.forEach((day, dayIndex) => {
      for (const slot of workAvailability[mode][day]) {
        const start = mode === 'daytime' ? 18 : 44;
        selected[(dayIndex * SLOTS_PER_DAY + start + slot) % SLOTS_PER_WEEK] =
          true;
      }
    });
  }
  const preferredWorkTimes: StudentPreferredWorkTime[] = [];
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
    preferredWorkTimes.push({
      dayOfWeek:
        WEEKDAY_TO_BACKEND[WEEKDAYS[Math.floor(start / SLOTS_PER_DAY)]],
      startTime: formatBackendTime(start),
      endTime: formatBackendTime(start + length),
    });
  }

  return { preferredWorkTimes };
}

export function mapWorkLocationToUpdateRequest(
  workLocation: WorkLocation,
): StudentMatchingPreferencesUpdateRequest | null {
  const locationName = workLocation.address.trim();

  if (
    !locationName ||
    workLocation.latitude === undefined ||
    workLocation.longitude === undefined
  )
    return null;

  return {
    preferredLocation: {
      latitude: workLocation.latitude,
      locationName,
      longitude: workLocation.longitude,
      radiusM: workLocation.radius,
    },
  };
}

export function mapPriorityOrderToUpdateRequest(
  priorityOrder: readonly MatchingPriorityId[],
): {
  priorities: import('../types/studentMatchingPreferences').StudentMatchingPriorityUpdate[];
} | null {
  if (priorityOrder.length !== 4 || new Set(priorityOrder).size !== 4) {
    return null;
  }

  const priorities = priorityOrder.map((priorityId, index) => ({
    criterionId: PRIORITY_TO_CRITERION_ID[priorityId],
    priorityOrder: index + 1,
  }));

  return {
    priorities: priorities as [
      (typeof priorities)[number],
      (typeof priorities)[number],
      (typeof priorities)[number],
      (typeof priorities)[number],
    ],
  };
}

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

export function hasUnrepresentableWorkTimes(times: StudentPreferredWorkTime[]) {
  return times.some(({ startTime, endTime }) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const duration = (end - start + 1440) % 1440;
    for (let offset = 0; offset < duration; offset += 30) {
      const minute = (start + offset) % 1440;
      if (minute >= 6 * 60 && minute < 9 * 60) return true;
    }
    return false;
  });
}

function mapWorkAvailability(preferredWorkTimes: StudentPreferredWorkTime[]) {
  const workAvailability = createEmptyWorkAvailability();
  preferredWorkTimes.forEach(({ dayOfWeek, startTime, endTime }) => {
    const startDay = WEEKDAYS.indexOf(dayOfWeek.toLowerCase() as Weekday);
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    if (
      startDay < 0 ||
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start % 30 ||
      end % 30 ||
      start === end
    )
      return;
    const duration = (end - start + 1440) % 1440;
    for (let offset = 0; offset < duration; offset += 30) {
      const absoluteMinutes = startDay * 1440 + start + offset;
      const dayIndex = Math.floor(absoluteMinutes / 1440) % 7;
      const minute = absoluteMinutes % 1440;
      const day = WEEKDAYS[dayIndex];
      if (minute >= 9 * 60 && minute < 23 * 60) {
        workAvailability.daytime[day].push((minute - 9 * 60) / 30);
      }
      if (minute >= 22 * 60) {
        workAvailability.nighttime[day].push((minute - 22 * 60) / 30);
      } else if (minute < 6 * 60) {
        const previousDay = WEEKDAYS[(dayIndex + 6) % 7];
        workAvailability.nighttime[previousDay].push((minute + 2 * 60) / 30);
      }
    }
  });
  for (const mode of ['daytime', 'nighttime'] as WorkTimeMode[]) {
    for (const day of WEEKDAYS) {
      workAvailability[mode][day] = [
        ...new Set(workAvailability[mode][day]),
      ].sort((a, b) => a - b);
    }
  }
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
