import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
    startHour: 9,
    slotCount: 28,
    slotOffset: 0,
    rowHeight: 10,
    labels: [
      { label: '9', position: 0 },
      { label: '12', position: 6 },
      { label: '15', position: 12 },
      { label: '18', position: 18 },
      { label: '21', position: 24 },
    ],
  },
  nighttime: {
    startHour: 22,
    slotCount: 16,
    slotOffset: 0,
    rowHeight: 10,
    labels: [
      { label: '22', position: 0 },
      { label: '12', position: 4 },
      { label: '2', position: 8 },
      { label: '4', position: 12 },
      { label: '6', position: 16 },
    ],
  },
};

function getHourLabel(hour: number) {
  const normalizedHour = hour % 24;
  return normalizedHour === 0 ? '0' : String(normalizedHour);
}

export function WorkTimeGrid({
  mode,
  selectedSlots,
  onModeChange,
  onSlotsChange,
}: WorkTimeGridProps) {
  const { t, i18n } = useTranslation();
  const dragSelection = useRef<boolean | null>(null);
  const config = TIME_CONFIG[mode];
  const gridHeight = config.slotCount * config.rowHeight;

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

  return (
    <div className="mt-4">
      <div className="flex gap-[5px]">
        {(['daytime', 'nighttime'] as WorkTimeMode[]).map((timeMode) => {
          const isSelected = mode === timeMode;
          const label = t(`my.workTimeGrid.${timeMode}`);

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
        <div className="ml-5 grid w-[calc(100%-20px)] grid-cols-7 gap-x-2">
          {WEEKDAYS.map(({ id }) => (
            <span
              className="text-center text-[12px] leading-[17px] text-[#8B95A1]"
              key={id}
            >
              {t(`my.workTimeGrid.days.${id}`)}
            </span>
          ))}
        </div>

        <div className="mt-1 flex min-w-0 gap-2">
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

          <div className="grid min-w-0 flex-1 grid-cols-7 gap-x-2">
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
                      aria-label={t('my.workTimeGrid.slot', { day: t(`my.workTimeGrid.days.${day}`), hour: getHourLabel(config.startHour + visualSlot / 2), minute: i18n.resolvedLanguage === 'en' ? (visualSlot % 2 ? '30' : '00') : (visualSlot % 2 ? t('my.workTimeGrid.halfHour') : ''), action: t(isSelected ? 'my.workTimeGrid.deselect' : 'my.workTimeGrid.select') })}
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

    </div>
  );
}
