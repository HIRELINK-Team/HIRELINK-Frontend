import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import calendarIcon from '../../assets/icons/student/matching/start-date-calendar.svg';
import { ResidenceExpiryDatePicker } from '../../components/student/onboarding/ResidenceExpiryDatePicker';

type StudentMatchingConditionStartDatePageProps = {
  initialDate: string;
  onBack: () => void;
  onSave: (date: string) => void;
};

function formatStartDate(date: string) {
  return date.replaceAll('-', '.');
}

export default function StudentMatchingConditionStartDatePage({
  initialDate,
  onBack,
  onSave,
}: StudentMatchingConditionStartDatePageProps) {
  const [draftDate, setDraftDate] = useState(initialDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <main className="relative mx-auto h-[100dvh] max-h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-5 font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-[clamp(24px,4.27dvh,36px)] text-[clamp(22px,3.08dvh,26px)] leading-[1.5] font-semibold">
        원하는 근무 시작일을
        <br />
        적어주세요.
      </h1>

      <button
        aria-expanded={isDatePickerOpen}
        aria-haspopup="dialog"
        aria-label="근무 시작일 선택"
        className="relative mt-[35px] h-[84px] w-full border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
        type="button"
        onClick={() => setIsDatePickerOpen(true)}
      >
        <span className="block text-[17px] leading-[1.5]">근무 시작일</span>
        <span className="mt-[7px] block text-[26px] leading-[1.5] font-semibold">
          {formatStartDate(draftDate)}
        </span>
        <img
          alt=""
          className="absolute top-[41px] right-[13px] size-6"
          src={calendarIcon}
        />
      </button>

      <button
        className="absolute right-6 bottom-[clamp(20px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={() => onSave(draftDate)}
      >
        수정하기
      </button>

      {isDatePickerOpen ? (
        <ResidenceExpiryDatePicker
          initialDate={draftDate}
          title="시작일 선택"
          onClose={() => setIsDatePickerOpen(false)}
          onConfirm={(date) => {
            setDraftDate(date);
            setIsDatePickerOpen(false);
          }}
        />
      ) : null}
    </main>
  );
}
