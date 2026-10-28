import { useMemo, useState } from 'react';

import nextIcon from '../../../assets/icons/student/calendar-next.svg';
import previousIcon from '../../../assets/icons/student/calendar-previous.svg';

type ResidenceExpiryDatePickerProps = {
  initialDate: string;
  onClose: () => void;
  onConfirm: (date: string) => void;
};

const WEEKDAY_LABELS = [
  '\uC77C',
  '\uC6D4',
  '\uD654',
  '\uC218',
  '\uBAA9',
  '\uAE08',
  '\uD1A0',
];

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getInitialMonth(date: string) {
  if (!date) return new Date(2027, 2, 1);

  const [year, month] = date.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function ResidenceExpiryDatePicker({
  initialDate,
  onClose,
  onConfirm,
}: ResidenceExpiryDatePickerProps) {
  const [displayMonth, setDisplayMonth] = useState(() =>
    getInitialMonth(initialDate),
  );
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const calendarDays = useMemo(() => {
    const monthStart = getMonthStart(displayMonth);
    const firstCellDate = new Date(monthStart);
    firstCellDate.setDate(monthStart.getDate() - monthStart.getDay());

    return Array.from({ length: 35 }, (_, index) => {
      const date = new Date(firstCellDate);
      date.setDate(firstCellDate.getDate() + index);
      return date;
    });
  }, [displayMonth]);

  const selectedDateValue = selectedDate || toIsoDate(displayMonth);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-black/50">
      <button
        aria-label={'\uB9CC\uB8CC\uC77C \uC120\uD0DD \uB2EB\uAE30'}
        className="flex-1 cursor-default border-0 bg-transparent p-0"
        type="button"
        onClick={onClose}
      />
      <section
        aria-label={'\uB9CC\uB8CC\uC77C \uC120\uD0DD'}
        className="relative h-[494px] rounded-t-[20px] bg-[#F5F5F5] px-6 pt-[34px]"
      >
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
          {'\uB9CC\uB8CC\uC77C \uC120\uD0DD'}
        </h2>
        <div className="relative mt-[13px] h-[26px]">
          <p className="m-0 text-[17px] leading-[1.5] font-medium">
            {displayMonth.getFullYear()}
            {'\uB144 '}
            {displayMonth.getMonth() + 1}
            {'\uC6D4'}
          </p>
          <div
            aria-label={'\uC6D4 \uC774\uB3D9'}
            className="absolute top-[2px] left-[260.5px] flex items-center gap-[22px]"
            role="group"
          >
            <button
              aria-label={'\uC774\uC804 \uB2EC'}
              className="flex size-[22px] items-center justify-center border-0 bg-transparent p-0"
              type="button"
              onClick={() =>
                setDisplayMonth(
                  (currentMonth) =>
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1,
                    ),
                )
              }
            >
              <img alt="" className="block" src={previousIcon} />
            </button>
            <button
              aria-label={'\uB2E4\uC74C \uB2EC'}
              className="flex size-[22px] items-center justify-center border-0 bg-transparent p-0"
              type="button"
              onClick={() =>
                setDisplayMonth(
                  (currentMonth) =>
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1,
                    ),
                )
              }
            >
              <img alt="" className="block -scale-x-100" src={nextIcon} />
            </button>
          </div>
        </div>

        <div className="mt-[17px] grid grid-cols-7 gap-x-[10px] gap-y-[4px]">
          {WEEKDAY_LABELS.map((label) => (
            <span
              className="flex h-[22px] items-center justify-center text-[13px] leading-[1.5] text-[#B0B8C1]"
              key={label}
            >
              {label}
            </span>
          ))}
          {calendarDays.map((date) => {
            const dateValue = toIsoDate(date);
            const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
            const isSelected = dateValue === selectedDateValue;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex size-[37.625px] items-center justify-center rounded-[10px] text-[17px] leading-[1.5] ${
                  isSelected
                    ? 'bg-[#00B894] text-[#F5F5F5]'
                    : isCurrentMonth
                      ? 'text-[#6B7684]'
                      : 'text-[#D1D6DB]'
                }`}
                key={dateValue}
                type="button"
                onClick={() => setSelectedDate(dateValue)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        <button
          className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
          type="button"
          onClick={() => onConfirm(selectedDateValue)}
        >
          {'\uD655\uC778'}
        </button>
      </section>
    </div>
  );
}
