import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../types/workAvailability';

type TimeRange = {
  day: Weekday;
  endSlot: number;
  startSlot: number;
};

const WEEKDAY_LABELS: Record<Weekday, string> = {
  fri: '금',
  mon: '월',
  sat: '토',
  sun: '일',
  thu: '목',
  tue: '화',
  wed: '수',
};

const MODE_START_HOURS: Record<WorkTimeMode, number> = {
  daytime: 9,
  nighttime: 22,
};

function getSelectedRanges(availability: WorkAvailability[WorkTimeMode]) {
  return (Object.keys(WEEKDAY_LABELS) as Weekday[]).flatMap((day) => {
    const slots = [...availability[day]].sort(
      (first, second) => first - second,
    );
    const ranges: TimeRange[] = [];
    let startSlot: number | null = null;
    let previousSlot: number | null = null;

    slots.forEach((slot) => {
      if (
        startSlot === null ||
        previousSlot === null ||
        slot !== previousSlot + 1
      ) {
        if (startSlot !== null && previousSlot !== null) {
          ranges.push({ day, endSlot: previousSlot, startSlot });
        }
        startSlot = slot;
      }
      previousSlot = slot;
    });

    if (startSlot !== null && previousSlot !== null) {
      ranges.push({ day, endSlot: previousSlot, startSlot });
    }

    return ranges;
  });
}

function formatTime(totalHours: number) {
  const normalizedHours = totalHours % 24;
  const hour = Math.floor(normalizedHours);
  const minutes = normalizedHours % 1 === 0 ? '00' : '30';

  return `${hour}:${minutes}`;
}

export function formatWorkAvailabilityRanges(
  workAvailability: WorkAvailability,
) {
  return (['daytime', 'nighttime'] as const).flatMap((mode) =>
    getSelectedRanges(workAvailability[mode]).map((range) => {
      const startHour = MODE_START_HOURS[mode] + range.startSlot / 2;
      const endHour = MODE_START_HOURS[mode] + (range.endSlot + 1) / 2;

      return `${WEEKDAY_LABELS[range.day]} ${formatTime(startHour)} - ${formatTime(endHour)}`;
    }),
  );
}
