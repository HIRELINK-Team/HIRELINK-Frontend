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
  minimumHourlyWage: number | null;
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

const WORK_TIME_MODE_START_MINUTES: Record<WorkTimeMode, number> = {
  daytime: 9 * 60,
  nighttime: 22 * 60,
};

type SlotRange = {
  endSlot: number;
  startSlot: number;
};

type DaySlotRange = SlotRange & {
  day: Weekday;
};

const WEEKDAYS: readonly Weekday[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

function getSlotRanges(slots: readonly number[]): SlotRange[] {
  const sortedSlots = [...new Set(slots)].sort(
    (first, second) => first - second,
  );
  const ranges: SlotRange[] = [];
  let startSlot: number | null = null;
  let previousSlot: number | null = null;

  sortedSlots.forEach((slot) => {
    if (
      startSlot === null ||
      previousSlot === null ||
      slot !== previousSlot + 1
    ) {
      if (startSlot !== null && previousSlot !== null) {
        ranges.push({ endSlot: previousSlot, startSlot });
      }
      startSlot = slot;
    }
    previousSlot = slot;
  });

  if (startSlot !== null && previousSlot !== null) {
    ranges.push({ endSlot: previousSlot, startSlot });
  }

  return ranges;
}

function formatBackendTime(minutes: number) {
  const normalizedMinutes = minutes % (24 * 60);
  const hours = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function getNextWeekday(day: Weekday): Weekday {
  const dayIndex = WEEKDAYS.indexOf(day);
  return WEEKDAYS[(dayIndex + 1) % WEEKDAYS.length] ?? day;
}

function splitNighttimeRange(day: Weekday, range: SlotRange): DaySlotRange[] {
  const midnightSlot = 4;

  if (range.startSlot < midnightSlot && range.endSlot >= midnightSlot) {
    return [
      { day, endSlot: midnightSlot - 1, startSlot: range.startSlot },
      {
        day: getNextWeekday(day),
        endSlot: range.endSlot,
        startSlot: midnightSlot,
      },
    ];
  }

  return [{ ...range, day }];
}

export function mapIndustrySelectionToUpdateRequest(
  selectedIndustries: readonly IndustryId[],
  otherIndustry: string,
  businessTypeFlexible: boolean,
): StudentMatchingPreferencesUpdateRequest | null {
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
  const preferredWorkTimes = (
    Object.keys(workAvailability) as WorkTimeMode[]
  ).flatMap((mode) =>
    (Object.keys(workAvailability[mode]) as Weekday[]).flatMap((day) =>
      getSlotRanges(workAvailability[mode][day])
        .flatMap((range) =>
          mode === 'nighttime'
            ? splitNighttimeRange(day, range)
            : [{ ...range, day }],
        )
        .map(({ day: rangeDay, ...range }) => {
          const startMinutes =
            WORK_TIME_MODE_START_MINUTES[mode] + range.startSlot * 30;
          const endMinutes =
            WORK_TIME_MODE_START_MINUTES[mode] + (range.endSlot + 1) * 30;

          return {
            dayOfWeek: WEEKDAY_TO_BACKEND[rangeDay],
            endTime: formatBackendTime(endMinutes),
            startTime: formatBackendTime(startMinutes),
          };
        }),
    ),
  );

  return { preferredWorkTimes };
}

export function mapWorkLocationToUpdateRequest(
  workLocation: WorkLocation,
): StudentMatchingPreferencesUpdateRequest | null {
  const locationName = workLocation.address.trim();
  const { latitude, longitude } = workLocation;

  if (!locationName || latitude === undefined || longitude === undefined) {
    return null;
  }

  return {
    preferredLocation: {
      latitude,
      locationName,
      longitude,
      radiusM: workLocation.radius,
    },
  };
}

export function mapPriorityOrderToUpdateRequest(
  priorityOrder: readonly MatchingPriorityId[],
): StudentMatchingPreferencesUpdateRequest | null {
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
    minimumHourlyWage: preferences.minimumHourlyWage,
    otherIndustry,
    priorityOrder: [...preferences.priorities]
      .sort((first, second) => first.priorityOrder - second.priorityOrder)
      .map((priority) => CRITERION_TO_PRIORITY[priority.criterionName]),
    selectedIndustries: [...new Set(selectedIndustries)],
    workAvailability: mapWorkAvailability(preferences.preferredWorkTimes),
    workLocation,
  };
}
