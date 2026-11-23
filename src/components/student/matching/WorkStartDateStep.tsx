import { useTranslation } from 'react-i18next';

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
  const { i18n, t } = useTranslation();
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label={t('matching.backToDetail')}
        className="absolute top-[clamp(44px,8.2dvh,69px)] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="absolute top-[clamp(120px,18.7dvh,158px)] left-6 m-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold">
        {t('matching.workStartTitle')}
      </h1>

      <button
        aria-expanded={isDatePickerOpen}
        aria-haspopup="dialog"
        aria-label={t('matching.selectWorkStartDate')}
        className="absolute top-[clamp(206px,32.1dvh,271px)] right-6 left-6 h-[clamp(72px,9.9dvh,84px)] border-0 border-b border-[#B0B8C1] bg-transparent p-0 text-left"
        type="button"
        onClick={onDatePickerOpen}
      >
        <span className="block text-[17px] leading-[1.5]">
          {t('matching.workStartDate')}
        </span>
        <span className="mt-[7px] block text-[26px] leading-[1.5] font-semibold">
          {formatWorkStartDate(selectedDate)}
        </span>
        <img
          alt=""
          className="absolute right-[5px] bottom-[clamp(13px,2dvh,17px)]"
          src={calendarIcon}
        />
      </button>

      <button
        className="absolute right-6 bottom-[clamp(22px,4.4dvh,37px)] left-6 h-[clamp(52px,6.8dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
        type="button"
        onClick={onNext}
      >
        {t('common.confirm')}
      </button>

      {isDatePickerOpen ? (
        <ResidenceExpiryDatePicker
          initialDate={selectedDate}
          title={t('matching.selectStartDate')}
          confirmLabel={t('common.confirm')}
          closeLabel={t('matching.closeDatePicker')}
          locale={i18n.resolvedLanguage === 'en' ? 'en' : 'ko'}
          nextLabel={t('matching.nextMonth')}
          previousLabel={t('matching.previousMonth')}
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
