import { useEffect, useMemo, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import {
  DAY_OF_WEEK_VALUES,
  type DayOfWeek,
  type WeeklySchedule,
} from "../../types/workSchedule";
import {
  DAY_LABELS,
  formatMinutes,
  formatRange,
  formatScheduleSummary,
  rangesToSlotSet,
  updateScheduleSlots,
} from "../../utils/workSchedule";

type TimeViewMode = "DAY" | "NIGHT";

interface WorkTimeGridProps {
  value: WeeklySchedule;
  onChange: (schedule: WeeklySchedule) => void;
  readOnly?: boolean;
  initialViewMode?: TimeViewMode;
}

interface DragState {
  day: DayOfWeek;
  startSlot: number;
  currentSlot: number;
  action: "ADD" | "REMOVE";
}

const VIEW_CONFIG: Record<
  TimeViewMode,
  { startMinutes: number; endMinutes: number; markers: number[] }
> = {
  DAY: {
    startMinutes: 360,
    endMinutes: 1320,
    markers: [360, 540, 720, 900, 1080, 1260],
  },
  NIGHT: {
    startMinutes: 1320,
    endMinutes: 1800,
    markers: [1320, 1500, 1680],
  },
};

const SLOT_HEIGHT_PX = 18;

function getSlotLabel(slot: number) {
  return formatMinutes(slot * 30)
    .replace("시 ", ":")
    .replace("분", "");
}

function WorkTimeGrid({
  value,
  onChange,
  readOnly = false,
  initialViewMode = "DAY",
}: WorkTimeGridProps) {
  const [viewMode, setViewMode] = useState<TimeViewMode>(initialViewMode);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const config = VIEW_CONFIG[viewMode];
  const visibleSlots = useMemo(
    () =>
      Array.from(
        { length: (config.endMinutes - config.startMinutes) / 30 },
        (_, index) => config.startMinutes / 30 + index,
      ),
    [config.endMinutes, config.startMinutes],
  );
  const gridHeight = visibleSlots.length * SLOT_HEIGHT_PX;
  const selectedSlots = useMemo(
    () =>
      DAY_OF_WEEK_VALUES.reduce<Record<DayOfWeek, Set<number>>>(
        (result, day) => {
          result[day] = rangesToSlotSet(value[day]);
          return result;
        },
        {} as Record<DayOfWeek, Set<number>>,
      ),
    [value],
  );

  useEffect(() => {
    if (!dragState) {
      return;
    }

    const handlePointerEnd = () => {
      onChange(
        updateScheduleSlots(
          value,
          dragState.day,
          dragState.startSlot,
          dragState.currentSlot,
          dragState.action,
        ),
      );
      setDragState(null);
    };

    window.addEventListener("pointerup", handlePointerEnd, { once: true });
    window.addEventListener("pointercancel", handlePointerEnd, { once: true });

    return () => {
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [dragState, onChange, value]);

  const handleSlotPointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    day: DayOfWeek,
    slot: number,
  ) => {
    if (readOnly || event.button !== 0) {
      return;
    }

    event.preventDefault();
    setDragState({
      day,
      startSlot: slot,
      currentSlot: slot,
      action: selectedSlots[day].has(slot) ? "REMOVE" : "ADD",
    });
  };

  const handleSlotPointerMove = (day: DayOfWeek, slot: number) => {
    setDragState((current) => {
      if (!current || current.day !== day || current.currentSlot === slot) {
        return current;
      }

      return { ...current, currentSlot: slot };
    });
  };

  const handleRemoveRange = (day: DayOfWeek, rangeIndex: number) => {
    onChange({
      ...value,
      [day]: value[day].filter((_, index) => index !== rangeIndex),
    });
  };

  const isPreviewSlot = (day: DayOfWeek, slot: number) => {
    if (!dragState || dragState.day !== day) {
      return false;
    }

    return (
      slot >= Math.min(dragState.startSlot, dragState.currentSlot) &&
      slot <= Math.max(dragState.startSlot, dragState.currentSlot)
    );
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-5">
        <div>
          <h3 className="text-base leading-6 font-semibold text-[#171719]">
            요일별 근무시간
          </h3>
          <p className="text-xs leading-[18px] text-[#8b95a1]">
            드래그해서 시간대를 선택하세요
          </p>
        </div>

        <div
          className="flex h-9 w-28 shrink-0 rounded-[10px] bg-[#f2f3f5] p-1"
          aria-label="시간대 보기"
        >
          <button
            type="button"
            aria-label="주간 시간 보기"
            aria-pressed={viewMode === "DAY"}
            onClick={() => setViewMode("DAY")}
            className={`flex h-7 w-[52px] cursor-pointer items-center justify-center rounded-lg transition-colors ${
              viewMode === "DAY"
                ? "bg-[#00b894] text-white"
                : "text-[#70737c] hover:text-[#171719]"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="3.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.28 5.28l1.42 1.42M17.3 17.3l1.42 1.42M18.72 5.28 17.3 6.7M6.7 17.3l-1.42 1.42"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button
            type="button"
            aria-label="야간 시간 보기"
            aria-pressed={viewMode === "NIGHT"}
            onClick={() => setViewMode("NIGHT")}
            className={`flex h-7 w-[52px] cursor-pointer items-center justify-center rounded-lg transition-colors ${
              viewMode === "NIGHT"
                ? "bg-[#00b894] text-white"
                : "text-[#70737c] hover:text-[#171719]"
            }`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
            >
              <path
                d="M19.4 15.2A8 8 0 0 1 8.8 4.6 8 8 0 1 0 19.4 15.2Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4 min-w-[650px] select-none">
        <div className="grid grid-cols-[36px_repeat(7,minmax(54px,1fr))] gap-x-2">
          <div />
          {DAY_OF_WEEK_VALUES.map((day) => (
            <div
              key={day}
              className="pb-2 text-center text-sm leading-5 font-medium text-[#70737c]"
            >
              {DAY_LABELS[day]}
            </div>
          ))}

          <div className="relative" style={{ height: gridHeight }}>
            {config.markers.map((minute) => (
              <span
                key={minute}
                className="absolute left-0 translate-y-1 text-xs leading-none text-[#70737c]"
                style={{
                  top: `${((minute - config.startMinutes) / (config.endMinutes - config.startMinutes)) * 100}%`,
                }}
              >
                {Math.floor((minute % 1440) / 60)}
              </span>
            ))}
          </div>

          {DAY_OF_WEEK_VALUES.map((day) => (
            <div
              key={day}
              className="flex touch-none flex-col overflow-hidden rounded-[10px] bg-[#dfe2e6]"
              style={{ height: gridHeight }}
              aria-label={`${DAY_LABELS[day]}요일 근무시간`}
            >
              {visibleSlots.map((slot) => {
                const selected = selectedSlots[day].has(slot);
                const preview = isPreviewSlot(day, slot);
                const previewRemoving =
                  preview && dragState?.action === "REMOVE";

                return (
                  <button
                    type="button"
                    key={slot}
                    tabIndex={readOnly ? -1 : 0}
                    aria-label={`${DAY_LABELS[day]}요일 ${getSlotLabel(slot)}`}
                    aria-pressed={selected}
                    onPointerDown={(event) =>
                      handleSlotPointerDown(event, day, slot)
                    }
                    onPointerEnter={() => handleSlotPointerMove(day, slot)}
                    onPointerMove={() => handleSlotPointerMove(day, slot)}
                    className={`h-[18px] min-h-[18px] flex-none border-b border-dashed border-white/90 last:border-b-0 ${
                      previewRemoving
                        ? "bg-[#b8bdc4]"
                        : preview
                          ? "bg-[#43cfb4]"
                          : selected
                            ? "bg-[#00b894]"
                            : "bg-transparent hover:bg-[#d2d6dc]"
                    } ${readOnly ? "cursor-default" : "cursor-crosshair"}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {DAY_OF_WEEK_VALUES.flatMap((day) =>
          value[day].map((range, rangeIndex) => (
            <div
              key={`${day}-${range.startMinutes}-${range.endMinutes}`}
              className="flex h-8 items-center gap-2 rounded-full bg-[#f2f3f5] px-2.5 text-xs font-medium text-[#44464b]"
            >
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => handleRemoveRange(day, rangeIndex)}
                  aria-label={`${DAY_LABELS[day]}요일 ${formatRange(range)} 삭제`}
                  className="flex size-4 cursor-pointer items-center justify-center rounded-full bg-[#c7cbd1] text-[11px] leading-none text-white hover:bg-[#aeb4bc]"
                >
                  ×
                </button>
              )}
              <span>
                {DAY_LABELS[day]} {formatRange(range)}
              </span>
            </div>
          )),
        )}
      </div>

      <p className="mt-4 text-sm leading-5 font-semibold text-[#171719]">
        {formatScheduleSummary(value)}
      </p>
      <p className="mt-1 text-xs leading-[18px] text-[#8b95a1]">
        주당 근무 시간은 지원자의 시간제취업 허용 시간과 비교돼요
      </p>
    </div>
  );
}

export default WorkTimeGrid;
