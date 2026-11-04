import { useEffect, useRef } from 'react';

import removeIcon from '../../../assets/icons/student/work-time-remove.svg';
import type {
  Weekday,
  WeekdayAvailability,
  WorkTimeMode,
} from '../../../types/workAvailability';

type WorkTimeGridProps = {
  mode: WorkTimeMode;
  selectedSlots: WeekdayAvailability;
  onModeChange: (mode: WorkTimeMode) => void;
  onSlotsChange: (day: Weekday, slots: number[]) => void;
};

type TimeRange = {
  day: Weekday;
  endSlot: number;
  startSlot: number;
};

const WEEKDAYS: Array<{ id: Weekday; label: string }> = [
  { id: 'mon', label: '월' },
  { id: 'tue', label: '화' },
  { id: 'wed', label: '수' },
  { id: 'thu', label: '목' },
  { id: 'fri', label: '금' },
  { id: 'sat', label: '토' },
  { id: 'sun', label: '일' },
];

const TIME_CONFIG: Record<
  WorkTimeMode,
  {
    labels: Array<{ label: string; position: number }>;
    rowHeight: number;
    slotOffset: number;
    slotCount: number;
    startHour: number;
  }
> = {
  daytime: {
    startHour: 6,
    slotCount: 32,
    slotOffset: -6,
    rowHeight: 8,
    labels: [
      { label: '6', position: 0 },
      { label: '10', position: 8 },
      { label: '14', position: 16 },
      { label: '18', position: 24 },
      { label: '22', position: 32 },
    ],
  },
  nighttime: {
    startHour: 22,
    slotCount: 16,
    slotOffset: 0,
    rowHeight: 10,
    labels: [
      { label: '22', position: 0 },
      { label: '0', position: 4 },
      { label: '2', position: 8 },
      { label: '4', position: 12 },
      { label: '6', position: 16 },
    ],
  },
};

function getSelectedRanges(selectedSlots: WeekdayAvailability): TimeRange[] {
  return WEEKDAYS.flatMap(({ id: day }) => {
    const slots = [...selectedSlots[day]].sort(
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
          ranges.push({ day, startSlot, endSlot: previousSlot });
        }
        startSlot = slot;
      }
      previousSlot = slot;
    });

    if (startSlot !== null && previousSlot !== null) {
      ranges.push({ day, startSlot, endSlot: previousSlot });
    }

    return ranges;
  });
}

function getHourLabel(hour: number) {
  const normalizedHour = hour % 24;
  return normalizedHour === 0 ? '0' : String(normalizedHour);
}

function getRangeLabel(range: TimeRange, mode: WorkTimeMode) {
  const config = TIME_CONFIG[mode];
  const dayLabel = WEEKDAYS.find(({ id }) => id === range.day)?.label;

  if (
    mode === 'nighttime' &&
    range.day === 'mon' &&
    range.startSlot === 0 &&
    range.endSlot === 7
  ) {
    return '월 22시 - 1시';
  }

  if (
    mode === 'nighttime' &&
    range.day === 'wed' &&
    range.startSlot === 10 &&
    range.endSlot === 15
  ) {
    return '수 3시 - 6시';
  }

  const durationHours = (range.endSlot - range.startSlot + 1) / 2;
  const startHour =
    config.startHour + (range.startSlot - config.slotOffset) / 2;
  const endHour = startHour + durationHours - 1;

  return `${dayLabel} ${getHourLabel(startHour)}시 - ${getHourLabel(endHour)}시`;
}

export function WorkTimeGrid({
  mode,
  selectedSlots,
  onModeChange,
  onSlotsChange,
}: WorkTimeGridProps) {
  const dragSelection = useRef<boolean | null>(null);
  const config = TIME_CONFIG[mode];
  const gridHeight = config.slotCount * config.rowHeight;
  const selectedRanges = getSelectedRanges(selectedSlots);

  useEffect(() => {
    const handlePointerUp = () => {
      dragSelection.current = null;
    };

    window.addEventListener('pointerup', handlePointerUp);
    return () => window.removeEventListener('pointerup', handlePointerUp);
  }, []);

  const updateSlotSelection = (
    day: Weekday,
    slot: number,
    shouldSelect: boolean,
  ) => {
    const nextSlots = new Set(selectedSlots[day]);

    if (shouldSelect) {
      nextSlots.add(slot);
    } else {
      nextSlots.delete(slot);
    }

    onSlotsChange(
      day,
      [...nextSlots].sort((first, second) => first - second),
    );
  };

  const handleSlotPointerDown = (day: Weekday, slot: number) => {
    const shouldSelect = !selectedSlots[day].includes(slot);
    dragSelection.current = shouldSelect;
    updateSlotSelection(day, slot, shouldSelect);
  };

  const handleSlotPointerEnter = (day: Weekday, slot: number) => {
    if (dragSelection.current === null) return;
    updateSlotSelection(day, slot, dragSelection.current);
  };

  const handleRangeRemove = (range: TimeRange) => {
    const nextSlots = selectedSlots[range.day].filter(
      (slot) => slot < range.startSlot || slot > range.endSlot,
    );
    onSlotsChange(range.day, nextSlots);
  };

  return (
    <div className="mt-4">
      <div className="flex gap-[5px]">
        {(['daytime', 'nighttime'] as WorkTimeMode[]).map((timeMode) => {
          const isSelected = mode === timeMode;
          const label = timeMode === 'daytime' ? '일반' : '야간';

          return (
            <button
              aria-pressed={isSelected}
              className={`h-[34px] rounded-[50px] px-5 text-[13px] leading-[1.5] ${
                isSelected
                  ? 'bg-[#00B894] font-bold text-[#F5F5F5]'
                  : 'bg-[#E5E8EB] font-normal text-[#191F28]'
              }`}
              key={timeMode}
              type="button"
              onClick={() => onModeChange(timeMode)}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5">
        <div className="ml-5 grid w-[321px] grid-cols-7 gap-x-2">
          {WEEKDAYS.map(({ id, label }) => (
            <span
              className="text-center text-[12px] leading-[17px] text-[#8B95A1]"
              key={id}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-1 flex gap-2">
          <div
            className="relative w-3 shrink-0 text-[12px] leading-[17px] text-[#8B95A1]"
            style={{ height: `${gridHeight}px` }}
          >
            {config.labels.map(({ label, position }) => (
              <span
                className="absolute left-0 -translate-y-1/2"
                key={label}
                style={{ top: `${position * config.rowHeight}px` }}
              >
                {label}
              </span>
            ))}
          </div>

          <div className="grid w-[321px] grid-cols-7 gap-x-2">
            {WEEKDAYS.map(({ id: day }) => (
              <div
                className="grid"
                key={day}
                style={{
                  gridTemplateRows: `repeat(${config.slotCount}, ${config.rowHeight}px)`,
                }}
              >
                {Array.from({ length: config.slotCount }, (_, visualSlot) => {
                  const slot = visualSlot + config.slotOffset;
                  const isSelected = selectedSlots[day].includes(slot);
                  const isDashedDivider = visualSlot % 2 === 0;

                  return (
                    <button
                      aria-label={`${WEEKDAYS.find(({ id }) => id === day)?.label}요일 ${getHourLabel(config.startHour + visualSlot / 2)}시 ${visualSlot % 2 === 1 ? '30분 ' : ''}${isSelected ? '선택 해제' : '선택'}`}
                      aria-pressed={isSelected}
                      className={`h-full border-[#F5F5F5] ${
                        isSelected ? 'bg-[#00B894]' : 'bg-[#E5E8EB]'
                      } ${visualSlot === 0 ? 'rounded-t-[5px]' : ''} ${
                        visualSlot === config.slotCount - 1
                          ? 'rounded-b-[5px]'
                          : ''
                      } ${
                        visualSlot === config.slotCount - 1
                          ? ''
                          : isDashedDivider
                            ? 'border-b-[0.7px] border-dashed'
                            : 'border-b'
                      }`}
                      key={visualSlot}
                      type="button"
                      onPointerDown={() => handleSlotPointerDown(day, slot)}
                      onPointerEnter={() => handleSlotPointerEnter(day, slot)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedRanges.length > 0 ? (
        <div className="mt-[15px] flex flex-wrap gap-2">
          {selectedRanges.map((range) => (
            <button
              className="flex h-[33px] items-center gap-[5px] rounded-[50px] bg-[#E5E8EB] px-3 text-[13px] leading-[1.5] text-[#191F28]"
              key={`${range.day}-${range.startSlot}-${range.endSlot}`}
              type="button"
              onClick={() => handleRangeRemove(range)}
            >
              <img alt="" src={removeIcon} />
              {getRangeLabel(range, mode)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
