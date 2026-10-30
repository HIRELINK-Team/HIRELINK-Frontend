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
  onSave: (workAvailability: WorkAvailability) => void;
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

  const handleSlotsChange = (day: Weekday, slots: number[]) => {
    setDraftWorkAvailability((currentAvailability) => ({
      ...currentAvailability,
      [workTimeMode]: {
        ...currentAvailability[workTimeMode],
        [day]: slots,
      },
    }));
  };

  const handleSave = () => {
    onSave(draftWorkAvailability);
  };

  return (
    <main className="mx-auto h-[844px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
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

      <button
        className="mt-[103px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={handleSave}
      >
        수정하기
      </button>
    </main>
  );
}
