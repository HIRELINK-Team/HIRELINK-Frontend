import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import clearIcon from '../../assets/icons/student/clear.svg';
import { IndustryChip } from '../../components/student/onboarding/IndustryChip';
import type { IndustryId, IndustryOption } from '../../types/industry';

type StudentMatchingConditionIndustryPageProps = {
  initialOtherIndustry: string;
  initialSelectedIndustries: readonly IndustryId[];
  onBack: () => void;
  onSave: (
    selectedIndustries: IndustryId[],
    otherIndustry: string,
  ) => boolean | Promise<boolean | void> | void;
};

const INDUSTRY_ROWS: readonly (readonly IndustryOption[])[] = [
  [
    { id: 'foodCafe', label: '음식점·카페' },
    { id: 'retail', label: '매장·판매' },
  ],
  [
    { id: 'officeTourism', label: '사무·행사·관광' },
    { id: 'translation', label: '통·번역' },
    { id: 'dutyFree', label: '면세점' },
  ],
  [
    { id: 'majorStudy', label: '전공·학업' },
    { id: 'internship', label: '인턴십' },
    { id: 'other', label: '기타' },
  ],
];

export default function StudentMatchingConditionIndustryPage({
  initialOtherIndustry,
  initialSelectedIndustries,
  onBack,
  onSave,
}: StudentMatchingConditionIndustryPageProps) {
  const [draftIndustries, setDraftIndustries] = useState<IndustryId[]>([
    ...initialSelectedIndustries,
  ]);
  const [draftOtherIndustry, setDraftOtherIndustry] =
    useState(initialOtherIndustry);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const isOtherSelected = draftIndustries.includes('other');

  const handleIndustryToggle = (industryId: IndustryId) => {
    const isOtherBeingDeselected =
      industryId === 'other' && draftIndustries.includes('other');

    if (isOtherBeingDeselected) {
      setDraftOtherIndustry('');
    }
    setSaveError('');

    setDraftIndustries((currentIndustries) =>
      currentIndustries.includes(industryId)
        ? currentIndustries.filter(
            (currentIndustry) => currentIndustry !== industryId,
          )
        : [...currentIndustries, industryId],
    );
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const isSaved = await onSave(draftIndustries, draftOtherIndustry);
      if (isSaved === false) {
        setSaveError('저장하지 못했어요. 선택 내용을 다시 확인해 주세요.');
      }
    } catch {
      setSaveError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

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
        원하는 업종을
        <br />
        선택해주세요.
      </h1>

      <section className="mt-5 h-[248px]">
        <div className="space-y-2">
          {INDUSTRY_ROWS.map((industryRow) => (
            <div className="flex items-center gap-2" key={industryRow[0].id}>
              {industryRow.map((industry) => (
                <IndustryChip
                  isSelected={draftIndustries.includes(industry.id)}
                  key={industry.id}
                  label={industry.label}
                  onClick={() => handleIndustryToggle(industry.id)}
                />
              ))}
            </div>
          ))}
        </div>

        {isOtherSelected ? (
          <label className="mt-5 block">
            <span className="block text-[17px] leading-[1.5]">기타:</span>
            <span className="relative mt-[3.5px] block h-[54px] border-b border-[#D1D6DB]">
              <input
                className="h-full w-full border-0 bg-transparent py-0 pr-8 text-[26px] leading-[1.5] font-semibold outline-none"
                value={draftOtherIndustry}
                onChange={(event) => {
                  setDraftOtherIndustry(event.target.value);
                  setSaveError('');
                }}
              />
              {draftOtherIndustry ? (
                <button
                  aria-label="기타 업종 입력 지우기"
                  className="absolute top-[15px] right-4 size-[21px] border-0 bg-transparent p-0"
                  type="button"
                  onClick={() => setDraftOtherIndustry('')}
                >
                  <img alt="" className="size-full" src={clearIcon} />
                </button>
              ) : null}
            </span>
          </label>
        ) : null}
      </section>

      {saveError ? (
        <p aria-live="polite" className="text-[14px] text-[#E05260]">
          {saveError}
        </p>
      ) : null}

      <button
        className="absolute right-6 bottom-[clamp(20px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        disabled={isSaving}
        onClick={handleSave}
      >
        수정하기
      </button>
    </main>
  );
}
