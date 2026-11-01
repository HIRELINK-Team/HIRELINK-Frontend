import { useEffect, useMemo, useRef, useState } from "react";

interface DateFieldProps {
  value: string;
  placeholder: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChange: (value: string) => void;
  ariaLabel: string;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function parseDate(value: string): Date | null {
  const [year, month, date] = value.split("-").map(Number);
  if (!year || !month || !date) {
    return null;
  }
  return new Date(year, month - 1, date);
}

function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value: string): string {
  return value ? value.replaceAll("-", ".") : "";
}

function DateField({
  value,
  placeholder,
  isOpen,
  onOpenChange,
  onChange,
  ariaLabel,
}: DateFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = parseDate(value);
  const [visibleMonth, setVisibleMonth] = useState(
    () => selectedDate ?? new Date(),
  );
  const calendarDays = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const dayCount = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: dayCount }, (_, index) => index + 1),
    ];
  }, [visibleMonth]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onOpenChange]);

  const handleMoveMonth = (offset: number) => {
    setVisibleMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          const nextOpen = !isOpen;
          if (nextOpen && selectedDate) {
            setVisibleMonth(selectedDate);
          }
          onOpenChange(nextOpen);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onOpenChange(false);
          }
        }}
        className={`flex h-[58px] w-full cursor-pointer items-center justify-between rounded-[10px] border bg-white px-4 text-left text-base transition-colors ${
          isOpen
            ? "border-[#00b894] ring-2 ring-[#00b894]/10"
            : "border-[rgba(112,115,124,0.22)] hover:border-[#aeb4bc]"
        }`}
      >
        <span className={value ? "text-[#171719]" : "text-[#8b95a1]"}>
          {formatDisplayDate(value) || placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5 text-[#70737c]"
          fill="none"
        >
          <rect
            x="4"
            y="5.5"
            width="16"
            height="14.5"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 3.5v4M16 3.5v4M4 9.5h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={`${ariaLabel} 달력`}
          className="absolute top-[64px] right-0 left-0 z-40 w-full rounded-xl border border-[rgba(112,115,124,0.22)] bg-white p-6 shadow-[0_4px_14px_rgba(23,23,25,0.14)]"
        >
          <div className="flex items-center justify-between">
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => handleMoveMonth(-1)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-2xl text-[#171719] hover:bg-[#f2f3f5]"
            >
              ‹
            </button>
            <strong className="text-lg font-semibold text-[#171719]">
              {visibleMonth.getFullYear()}년 {visibleMonth.getMonth() + 1}월
            </strong>
            <button
              type="button"
              aria-label="다음 달"
              onClick={() => handleMoveMonth(1)}
              className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-2xl text-[#171719] hover:bg-[#f2f3f5]"
            >
              ›
            </button>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-y-2 text-center">
            {WEEKDAY_LABELS.map((day, index) => (
              <span
                key={day}
                className={`text-[13px] font-medium ${index === 0 ? "text-[#e11e1e]" : "text-[#70737c]"}`}
              >
                {day}
              </span>
            ))}
            {calendarDays.map((day, index) => {
              if (!day) {
                return <span key={`empty-${index}`} />;
              }

              const date = new Date(
                visibleMonth.getFullYear(),
                visibleMonth.getMonth(),
                day,
              );
              const isoDate = formatIsoDate(date);
              const isSelected = isoDate === value;
              const isSunday = index % 7 === 0;

              return (
                <button
                  type="button"
                  key={isoDate}
                  aria-pressed={isSelected}
                  onClick={() => {
                    onChange(isoDate);
                    onOpenChange(false);
                  }}
                  className={`mx-auto flex size-10 cursor-pointer items-center justify-center rounded-full text-base transition-colors ${
                    isSelected
                      ? "bg-[#00b894] font-semibold text-white"
                      : isSunday
                        ? "text-[#e11e1e] hover:bg-[#fff0f0]"
                        : "text-[#171719] hover:bg-[#f2f3f5]"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default DateField;
