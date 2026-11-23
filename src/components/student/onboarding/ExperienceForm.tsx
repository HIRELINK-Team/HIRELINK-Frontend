import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import backIcon from '../../../assets/icons/student/back.svg';
import type { ExperienceDraft } from '../../../types/experience';
import { ResidenceExpiryDatePicker } from './ResidenceExpiryDatePicker';

type ExperienceFormProps = {
  draft: ExperienceDraft;
  isEditing: boolean;
  isSubmitDisabled: boolean;
  onBack: () => void;
  onChange: <Key extends keyof ExperienceDraft>(
    key: Key,
    value: ExperienceDraft[Key],
  ) => void;
  onSubmit: () => void;
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[19px] shrink-0"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M4.5 3.5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2ZM6.5 1.75v3.5M13.5 1.75v3.5M2.5 7.25h15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** Collects one student work-experience entry for creation or editing. */
export function ExperienceForm({
  draft,
  isEditing,
  isSubmitDisabled,
  onBack,
  onChange,
  onSubmit,
}: ExperienceFormProps) {
  const { t, i18n } = useTranslation();
  const [openDateField, setOpenDateField] = useState<
    'startMonth' | 'endMonth' | null
  >(null);
  const formTitle = t(isEditing ? 'my.experience.editTitle' : 'my.experience.addTitle');
  const submitLabel = t(isEditing ? 'my.profile.edit' : 'my.experience.add');

  return (
    <main className="relative mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-y-auto overscroll-contain bg-[#F5F5F5] px-6 pt-[calc(129px+env(safe-area-inset-top))] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        aria-label={t('my.experience.back')}
        className="absolute top-[calc(65px+env(safe-area-inset-top))] left-5 flex size-6 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
        {formTitle}
      </h1>

      <label className="mt-[39px] block">
        <span className="block text-[15px] leading-[1.5] font-semibold text-[#191F28]">
          {t('my.experience.workplace')}
        </span>
        <input
          className="mt-2 h-[56px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-transparent px-6 text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1] focus:border-[1.5px] focus:border-[#00B894]"
          placeholder={t('my.experience.workplacePlaceholder')}
          value={draft.workplace}
          onChange={(event) => onChange('workplace', event.target.value)}
        />
      </label>

      <fieldset className="mt-[10px] min-w-0 border-0 p-0">
        <legend className="text-[15px] leading-[1.5] font-semibold text-[#191F28]">
          {t('my.experience.period')}
        </legend>
        <div className="mt-2 flex items-center gap-[7px]">
          <label
            className={`relative flex h-[56px] min-w-0 flex-1 items-center justify-center rounded-[15px] bg-transparent px-2 ${
              openDateField === 'startMonth'
                ? 'border-[1.5px] border-[#00B894] text-[#00B894]'
                : 'border-[0.7px] border-[#B3B8B9] text-[#00B894]'
            }`}
          >
            <span className="-translate-x-2">
              <CalendarIcon />
            </span>
            <input
              aria-label={t('my.experience.startMonth')}
              className="w-[71px] min-w-0 -translate-x-2 bg-transparent pl-2 text-[17px] leading-[1.5] text-[#191F28] outline-none placeholder:text-[#8B95A1]"
              placeholder="2023.03"
              readOnly
              value={draft.startMonth}
              onClick={() => setOpenDateField('startMonth')}
            />
          </label>
          <span aria-hidden="true" className="h-px w-4 shrink-0 bg-[#D1D6DB]" />
          <label
            className={`relative flex h-[56px] min-w-0 flex-1 items-center justify-center rounded-[15px] bg-transparent px-2 ${
              openDateField === 'endMonth'
                ? 'border-[1.5px] border-[#00B894] text-[#00B894]'
                : 'border-[0.7px] border-[#B3B8B9] text-[#00B894]'
            }`}
          >
            <span className="-translate-x-2">
              <CalendarIcon />
            </span>
            <input
              aria-label={t('my.experience.endMonth')}
              className="w-[71px] min-w-0 -translate-x-2 bg-transparent pl-2 text-[17px] leading-[1.5] text-[#191F28] outline-none placeholder:text-[#8B95A1]"
              placeholder="2023.09"
              readOnly
              value={draft.endMonth}
              onClick={() => setOpenDateField('endMonth')}
            />
          </label>
        </div>
      </fieldset>

      <label className="mt-[10px] block">
        <span className="block text-[15px] leading-[1.5] font-semibold text-[#191F28]">
          {t('my.experience.duties')}
        </span>
        <input
          className="mt-2 h-[56px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-transparent px-6 text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1] focus:border-[1.5px] focus:border-[#00B894]"
          placeholder={t('my.experience.dutiesPlaceholder')}
          value={draft.duties}
          onChange={(event) => onChange('duties', event.target.value)}
        />
      </label>

      <div className="mt-auto shrink-0 pt-8">
        <button
          className="min-h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] disabled:bg-[#B0B8C1]"
          disabled={isSubmitDisabled}
          type="button"
          onClick={onSubmit}
        >
          {submitLabel}
        </button>
      </div>

      {openDateField ? (
        <ResidenceExpiryDatePicker
          emptyInitialDate="2023-01"
          initialDate={draft[openDateField].replace('.', '-')}
          precision="month"
          title={
            t(openDateField === 'startMonth' ? 'my.experience.startPicker' : 'my.experience.endPicker')
          }
          locale={i18n.resolvedLanguage === 'en' ? 'en' : 'ko'}
          confirmLabel={t('common.confirm')}
          onClose={() => setOpenDateField(null)}
          onConfirm={(month) => {
            onChange(openDateField, month.replace('-', '.'));
            setOpenDateField(null);
          }}
        />
      ) : null}
    </main>
  );
}
