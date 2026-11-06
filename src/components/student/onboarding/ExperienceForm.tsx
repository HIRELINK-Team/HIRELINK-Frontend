import backIcon from '../../../assets/icons/student/back.svg';
import calendarIcon from '../../../assets/icons/student/calendar.svg';
import type { ExperienceDraft } from '../../../types/experience';

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

function formatMonthInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 6);

  return digits.length > 4
    ? `${digits.slice(0, 4)}.${digits.slice(4)}`
    : digits;
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
  const formTitle = isEditing ? '경력 수정하기' : '경력 추가하기';
  const submitLabel = isEditing ? '수정하기' : '+ 추가하기';

  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[112px] pb-[calc(61px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28] [@media(max-height:700px)]:pt-16 [@media(max-height:700px)]:pb-4">
      <button
        aria-label="경력 목록으로 이동"
        className="absolute top-[65px] left-5 flex size-6 items-center justify-center border-0 bg-transparent p-0 [@media(max-height:700px)]:top-6"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
        {formTitle}
      </h1>

      <label className="mt-[29px] block [@media(max-height:700px)]:mt-4">
        <span className="text-[15px] leading-[1.5]">알바명</span>
        <input
          className="mt-2 h-[56px] w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:h-12"
          placeholder="근무처 또는 업체명"
          value={draft.workplace}
          onChange={(event) => onChange('workplace', event.target.value)}
        />
      </label>

      <fieldset className="mt-[15px] min-w-0 border-0 p-0 [@media(max-height:700px)]:mt-2.5">
        <legend className="text-[15px] leading-[1.5]">근무기간</legend>
        <div className="mt-2 flex items-center gap-[7px] [@media(max-height:700px)]:mt-1.5">
          <label className="relative flex h-[56px] min-w-0 flex-1 items-center rounded-[15px] bg-[#E5E8EB] pl-8 [@media(max-height:700px)]:h-12">
            <img alt="" src={calendarIcon} />
            <input
              aria-label="근무 시작 월"
              className="min-w-0 flex-1 bg-transparent pl-2 text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              inputMode="numeric"
              placeholder="2023.03"
              value={draft.startMonth}
              onChange={(event) =>
                onChange('startMonth', formatMonthInput(event.target.value))
              }
            />
          </label>
          <span aria-hidden="true" className="h-px w-4 bg-[#D1D6DB]" />
          <label className="relative flex h-[56px] min-w-0 flex-1 items-center rounded-[15px] bg-[#E5E8EB] pl-8 [@media(max-height:700px)]:h-12">
            <img alt="" src={calendarIcon} />
            <input
              aria-label="근무 종료 월"
              className="min-w-0 flex-1 bg-transparent pl-2 text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              inputMode="numeric"
              placeholder="2023.09"
              value={draft.endMonth}
              onChange={(event) =>
                onChange('endMonth', formatMonthInput(event.target.value))
              }
            />
          </label>
        </div>
      </fieldset>

      <label className="mt-[15px] block [@media(max-height:700px)]:mt-2.5">
        <span className="text-[15px] leading-[1.5]">근무 내용</span>
        <input
          className="mt-2 h-[56px] w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[17px] leading-[1.5] outline-none placeholder:text-[#8B95A1] [@media(max-height:700px)]:mt-1.5 [@media(max-height:700px)]:h-12"
          placeholder="담당 업무를 입력해주세요"
          value={draft.duties}
          onChange={(event) => onChange('duties', event.target.value)}
        />
      </label>

      <button
        className="mt-auto h-[57px] w-full rounded-[15px] border-[0.7px] border-[#191F28] bg-transparent text-[20px] leading-[1.5] font-medium disabled:border-[#B0B8C1] disabled:text-[#8B95A1] [@media(max-height:700px)]:h-[52px]"
        disabled={isSubmitDisabled}
        type="button"
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
    </main>
  );
}
