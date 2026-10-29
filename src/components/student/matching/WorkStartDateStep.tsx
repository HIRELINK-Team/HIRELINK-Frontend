import backIcon from '../../../assets/icons/student/matching/back.svg';
import calendarIcon from '../../../assets/icons/student/matching/start-date-calendar.svg';
import { ResidenceExpiryDatePicker } from '../onboarding/ResidenceExpiryDatePicker';

type WorkStartDateStepProps = {
  isDatePickerOpen: boolean;
  selectedDate: string;
  onBack: () => void;
  onDateChange: (date: string) => void;
  onDatePickerClose: () => void;
  onDatePickerOpen: () => void;
  onNext: () => void;
};

function formatWorkStartDate(date: string) {
  return date.replaceAll('-', '.');
}

/** Work-start date entry step in the student matching application flow. */
export function WorkStartDateStep({
  isDatePickerOpen,
  selectedDate,
  onBack,
  onDateChange,
  onDatePickerClose,
  onDatePickerOpen,
  onNext,
}: WorkStartDateStepProps) {
  return (
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="추천 근무지 상세로 돌아가기"
        className="absolute top-[69px] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="absolute top-[158px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        원하는 근무 시작일을
        <br />
        적어주세요.
      </h1>

      <button
        aria-expanded={isDatePickerOpen}
        aria-haspopup="dialog"
        aria-label="근무 시작일 선택"
        className="absolute top-[271px] right-6 left-6 h-[84px] border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
        type="button"
        onClick={onDatePickerOpen}
      >
        <span className="block text-[17px] leading-[1.5]">근무 시작일</span>
        <span className="mt-[7px] block text-[26px] leading-[1.5] font-semibold">
          {formatWorkStartDate(selectedDate)}
        </span>
        <img
          alt=""
          className="absolute right-[5px] bottom-[17px]"
          src={calendarIcon}
        />
      </button>

      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
        type="button"
        onClick={onNext}
      >
        확인
      </button>

      {isDatePickerOpen ? (
        <ResidenceExpiryDatePicker
          initialDate={selectedDate}
          title="시작일 선택"
          onClose={onDatePickerClose}
          onConfirm={(date) => {
            onDateChange(date);
            onDatePickerClose();
          }}
          onDateChange={onDateChange}
        />
      ) : null}
    </main>
  );
}
