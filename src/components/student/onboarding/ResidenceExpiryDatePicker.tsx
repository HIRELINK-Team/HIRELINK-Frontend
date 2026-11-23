import { useMemo, useState } from 'react';

import nextIcon from '../../../assets/icons/student/calendar-next.svg';
import previousIcon from '../../../assets/icons/student/calendar-previous.svg';

type ResidenceExpiryDatePickerProps = {
  closeLabel?: string;
  confirmLabel?: string;
  emptyInitialDate?: string;
  initialDate: string;
  locale?: 'ko' | 'en';
  nextLabel?: string;
  onDateChange?: (date: string) => void;
  onClose: () => void;
  onConfirm: (date: string) => void;
  precision?: 'day' | 'month';
  previousLabel?: string;
  title?: string;
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
const ENGLISH_WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isValidIsoDate(value: string) {
  const matchedDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matchedDate) return false;

  const year = Number(matchedDate[1]);
  const month = Number(matchedDate[2]);
  const day = Number(matchedDate[3]);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function isValidIsoMonth(value: string) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function getInitialMonth(
  date: string,
  emptyInitialDate: string,
  precision: 'day' | 'month',
) {
  const isValid =
    precision === 'month' ? isValidIsoMonth(date) : isValidIsoDate(date);

  if (!isValid) {
    const [year, month] = emptyInitialDate.split('-').map(Number);
    return new Date(year, month - 1, 1);
  }

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
  closeLabel = '\uB9CC\uB8CC\uC77C \uC120\uD0DD \uB2EB\uAE30',
  confirmLabel = '\uD655\uC778',
  emptyInitialDate = '2027-03-01',
  initialDate,
  locale = 'ko',
  nextLabel = '\uB2E4\uC74C \uB2EC',
  onDateChange,
  onClose,
  onConfirm,
  precision = 'day',
  previousLabel = '\uC774\uC804 \uB2EC',
  title = '\uB9CC\uB8CC\uC77C \uC120\uD0DD',
}: ResidenceExpiryDatePickerProps) {
  const [displayMonth, setDisplayMonth] = useState(() =>
    getInitialMonth(initialDate, emptyInitialDate, precision),
  );
  const [selectedDate, setSelectedDate] = useState(() =>
    precision === 'month'
      ? isValidIsoMonth(initialDate)
        ? initialDate
        : ''
      : isValidIsoDate(initialDate)
        ? initialDate
        : '',
  );

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

  const selectValue = (value: string) => {
    setSelectedDate(value);
    onDateChange?.(value);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-black/50">
      <button
        aria-label={closeLabel}
        className="flex-1 cursor-default border-0 bg-transparent p-0"
        type="button"
        onClick={onClose}
      />
      <section
        aria-label={title}
        className="relative h-[494px] rounded-t-[20px] bg-[#FAFAFA] px-6 pt-[34px]"
      >
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">{title}</h2>
        <div className="relative mt-[13px] h-[26px]">
          <p className="m-0 text-[17px] leading-[1.5] font-medium">
            {locale === 'en'
              ? precision === 'day'
                ? new Intl.DateTimeFormat('en', {
                    month: 'long',
                    year: 'numeric',
                  }).format(displayMonth)
                : String(displayMonth.getFullYear())
              : `${displayMonth.getFullYear()}\uB144${precision === 'day' ? ` ${displayMonth.getMonth() + 1}\uC6D4` : ''}`}
          </p>
          <div
            aria-label={locale === 'en' ? 'Change month' : '\uC6D4 \uC774\uB3D9'}
            className="absolute top-[2px] right-0 flex items-center gap-[22px]"
            role="group"
          >
            <button
              aria-label={previousLabel}
              className="flex size-[22px] items-center justify-center border-0 bg-transparent p-0"
              type="button"
              onClick={() =>
                setDisplayMonth((currentMonth) =>
                  precision === 'month'
                    ? new Date(currentMonth.getFullYear() - 1, 0, 1)
                    : new Date(
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
              aria-label={nextLabel}
              className="flex size-[22px] items-center justify-center border-0 bg-transparent p-0"
              type="button"
              onClick={() =>
                setDisplayMonth((currentMonth) =>
                  precision === 'month'
                    ? new Date(currentMonth.getFullYear() + 1, 0, 1)
                    : new Date(
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

        {precision === 'month' ? (
          <div className="mt-[26px] grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }, (_, index) => {
              const month = String(index + 1).padStart(2, '0');
              const value = `${displayMonth.getFullYear()}-${month}`;
              const isSelected = selectedDate === value;

              return (
                <button
                  aria-pressed={isSelected}
                  className={`h-[48px] rounded-[12px] border-0 text-[17px] leading-[1.5] ${
                    isSelected
                      ? 'bg-[#00B894] font-medium text-[#F5F5F5]'
                      : 'bg-white text-[#6B7684]'
                  }`}
                  key={value}
                  type="button"
                  onClick={() => selectValue(value)}
                >
                  {index + 1}월
                </button>
              );
            })}
          </div>
        ) : (
        <div className="mt-[17px] grid grid-cols-7 gap-x-[10px] gap-y-[4px]">
          {(locale === 'en' ? ENGLISH_WEEKDAY_LABELS : WEEKDAY_LABELS).map((label) => (
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
            const isSelected = dateValue === selectedDate;

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
                onClick={() => {
                  selectValue(dateValue);
                }}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
        )}
        <button
          className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376] disabled:bg-[#B0B8C1] disabled:active:bg-[#B0B8C1]"
          disabled={!selectedDate}
          type="button"
          onClick={() => onConfirm(selectedDate)}
        >
          {confirmLabel}
        </button>
      </section>
    </div>
  );
}
