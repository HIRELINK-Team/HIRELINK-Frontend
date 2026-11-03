import {
  DAY_OF_WEEK_VALUES,
  type DayOfWeek,
  type TimeRange,
  type WeeklySchedule,
} from "../types/workSchedule";

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

export function createEmptyWeeklySchedule(): WeeklySchedule {
  return {
    MON: [],
    TUE: [],
    WED: [],
    THU: [],
    FRI: [],
    SAT: [],
    SUN: [],
  };
}

export function cloneWeeklySchedule(schedule: WeeklySchedule): WeeklySchedule {
  return DAY_OF_WEEK_VALUES.reduce<WeeklySchedule>((cloned, day) => {
    cloned[day] = schedule[day].map((range) => ({ ...range }));
    return cloned;
  }, createEmptyWeeklySchedule());
}

export function rangesToSlotSet(ranges: TimeRange[]): Set<number> {
  const slots = new Set<number>();

  ranges.forEach(({ startMinutes, endMinutes }) => {
    for (let minute = startMinutes; minute < endMinutes; minute += 30) {
      slots.add(Math.floor(minute / 30));
    }
  });

  return slots;
}

export function slotSetToRanges(slots: Set<number>): TimeRange[] {
  const sortedSlots = [...slots].sort((a, b) => a - b);
  const ranges: TimeRange[] = [];

  sortedSlots.forEach((slot) => {
    const lastRange = ranges.at(-1);
    const startMinutes = slot * 30;
    const endMinutes = startMinutes + 30;

    if (lastRange?.endMinutes === startMinutes) {
      lastRange.endMinutes = endMinutes;
      return;
    }

    ranges.push({ startMinutes, endMinutes });
  });

  return ranges;
}

export function updateScheduleSlots(
  schedule: WeeklySchedule,
  day: DayOfWeek,
  startSlot: number,
  endSlot: number,
  action: "ADD" | "REMOVE",
): WeeklySchedule {
  const nextSlots = rangesToSlotSet(schedule[day]);
  const rangeStart = Math.min(startSlot, endSlot);
  const rangeEnd = Math.max(startSlot, endSlot);

  for (let slot = rangeStart; slot <= rangeEnd; slot += 1) {
    if (action === "ADD") {
      nextSlots.add(slot);
    } else {
      nextSlots.delete(slot);
    }
  }

  return {
    ...schedule,
    [day]: slotSetToRanges(nextSlots),
  };
}

export function getWeeklyTotalHours(schedule: WeeklySchedule): number {
  const totalMinutes = DAY_OF_WEEK_VALUES.reduce(
    (weekTotal, day) =>
      weekTotal +
      schedule[day].reduce(
        (dayTotal, range) => dayTotal + range.endMinutes - range.startMinutes,
        0,
      ),
    0,
  );

  return totalMinutes / 60;
}

export function formatMinutes(minutes: number): string {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;

  return minute === 0 ? `${hour}시` : `${hour}시 ${minute}분`;
}

export function formatRange(range: TimeRange): string {
  const nextDayLabel = range.endMinutes >= 1440 ? "익일 " : "";
  return `${formatMinutes(range.startMinutes)} - ${nextDayLabel}${formatMinutes(range.endMinutes)}`;
}

function formatCompactMinutes(minutes: number): string {
  const normalizedMinutes = ((minutes % 1440) + 1440) % 1440;
  const hour = Math.floor(normalizedMinutes / 60);
  const minute = normalizedMinutes % 60;
  return minute === 0
    ? `${hour}`
    : `${hour}:${String(minute).padStart(2, "0")}`;
}

export function formatScheduleSummary(schedule: WeeklySchedule): string {
  const groups = new Map<string, DayOfWeek[]>();

  DAY_OF_WEEK_VALUES.forEach((day) => {
    schedule[day].forEach((range) => {
      const key = `${range.startMinutes}-${range.endMinutes}`;
      groups.set(key, [...(groups.get(key) ?? []), day]);
    });
  });

  const rangeSummary = [...groups.entries()]
    .map(([key, days]) => {
      const [startMinutes, endMinutes] = key.split("-").map(Number);
      return `${days.map((day) => DAY_LABELS[day]).join("")} ${formatCompactMinutes(startMinutes)}-${formatCompactMinutes(endMinutes)}`;
    })
    .join(" · ");
  const totalHours = getWeeklyTotalHours(schedule);
  const totalLabel = Number.isInteger(totalHours)
    ? String(totalHours)
    : totalHours.toFixed(1);

  return rangeSummary
    ? `${rangeSummary} · 주 ${totalLabel}시간`
    : "선택한 근무시간이 없습니다";
}
