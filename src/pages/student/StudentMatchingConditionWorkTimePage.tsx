import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { WorkTimeGrid } from '../../components/student/onboarding/WorkTimeGrid';
import type {
  Weekday,
  WorkAvailability,
  WorkTimeMode,
} from '../../types/workAvailability';

type StudentMatchingConditionWorkTimePageProps = {
  initialWorkAvailability: WorkAvailability;
  onBack: () => void;
  onSave: (
    workAvailability: WorkAvailability,
  ) => boolean | Promise<boolean | void> | void;
};

function cloneWorkAvailability(
  workAvailability: WorkAvailability,
): WorkAvailability {
  return {
    daytime: {
      mon: [...workAvailability.daytime.mon],
      tue: [...workAvailability.daytime.tue],
      wed: [...workAvailability.daytime.wed],
      thu: [...workAvailability.daytime.thu],
      fri: [...workAvailability.daytime.fri],
      sat: [...workAvailability.daytime.sat],
      sun: [...workAvailability.daytime.sun],
    },
    nighttime: {
      mon: [...workAvailability.nighttime.mon],
      tue: [...workAvailability.nighttime.tue],
      wed: [...workAvailability.nighttime.wed],
      thu: [...workAvailability.nighttime.thu],
      fri: [...workAvailability.nighttime.fri],
      sat: [...workAvailability.nighttime.sat],
      sun: [...workAvailability.nighttime.sun],
    },
  };
}

export default function StudentMatchingConditionWorkTimePage({
  initialWorkAvailability,
  onBack,
  onSave,
}: StudentMatchingConditionWorkTimePageProps) {
  const [workTimeMode, setWorkTimeMode] = useState<WorkTimeMode>('daytime');
  const [draftWorkAvailability, setDraftWorkAvailability] =
    useState<WorkAvailability>(() =>
      cloneWorkAvailability(initialWorkAvailability),
    );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSlotsChange = (day: Weekday, slots: number[]) => {
    setDraftWorkAvailability((currentAvailability) => ({
      ...currentAvailability,
      [workTimeMode]: {
        ...currentAvailability[workTimeMode],
        [day]: slots,
      },
    }));
    setSaveError('');
  };

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const isSaved = await onSave(draftWorkAvailability);
      if (isSaved === false) {
        setSaveError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
      }
    } catch {
      setSaveError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-y-auto overscroll-contain bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-[36px] text-[26px] leading-[1.5] font-semibold">
        원하는 근무시간대를
        <br />
        선택해주세요.
      </h1>

      <p className="m-0 mt-[5px] text-[15px] leading-[1.5] text-[#939393]">
        드래그하여 선택해주세요.
      </p>

      <WorkTimeGrid
        mode={workTimeMode}
        selectedSlots={draftWorkAvailability[workTimeMode]}
        onModeChange={setWorkTimeMode}
        onSlotsChange={handleSlotsChange}
      />

      {saveError ? (
        <p aria-live="polite" className="mt-3 text-[14px] text-[#E05260]">
          {saveError}
        </p>
      ) : null}

      <div className="mt-auto shrink-0 pt-8">
        <button
          className="h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          disabled={isSaving}
          onClick={handleSave}
        >
          수정하기
        </button>
      </div>
    </main>
  );
}
