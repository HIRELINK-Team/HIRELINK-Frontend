import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { MatchingPriorityList } from '../../components/student/onboarding/MatchingPriorityList';
import type {
  MatchingPriority,
  MatchingPriorityId,
} from '../../types/matchingPriority';

type StudentMatchingConditionPriorityPageProps = {
  initialPriorityOrder: readonly MatchingPriorityId[];
  onBack: () => void;
  onSave: (priorityOrder: MatchingPriorityId[]) => Promise<boolean>;
};

const MATCHING_PRIORITIES: readonly MatchingPriority[] = [
  {
    description: '원하는 시간대에 일하고 싶어요.',
    id: 'workTime',
    label: '근무시간',
  },
  {
    description: '만족스러운 급여를 받고 싶어요.',
    id: 'wage',
    label: '급여',
  },
  {
    description: '집 가까운 곳에서 일하고 싶어요.',
    id: 'distance',
    label: '거리',
  },
  {
    description: '원하는 분야에서 일하고 싶어요.',
    id: 'industry',
    label: '업종',
  },
];

function createPriorities(
  initialPriorityOrder: readonly MatchingPriorityId[],
): MatchingPriority[] {
  const order = [
    ...initialPriorityOrder,
    ...MATCHING_PRIORITIES.map((priority) => priority.id),
  ].filter(
    (priorityId, index, priorities) => priorities.indexOf(priorityId) === index,
  );

  return order.flatMap((priorityId) => {
    const priority = MATCHING_PRIORITIES.find(
      (currentPriority) => currentPriority.id === priorityId,
    );

    return priority ? [priority] : [];
  });
}

export default function StudentMatchingConditionPriorityPage({
  initialPriorityOrder,
  onBack,
  onSave,
}: StudentMatchingConditionPriorityPageProps) {
  const [priorities, setPriorities] = useState<MatchingPriority[]>(() =>
    createPriorities(initialPriorityOrder),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const isSaved = await onSave(priorities.map((priority) => priority.id));
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
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[61px] pb-[37px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-9 text-[26px] leading-[1.5] font-semibold">
        우선순위를 정해주세요.
      </h1>
      <p className="m-0 mt-1 text-[15px] leading-[1.5] text-[#939393]">
        중요한 순서대로 끌어다 놓으세요.
      </p>

      <MatchingPriorityList
        priorities={priorities}
        onChange={(nextPriorities) => {
          setPriorities(nextPriorities);
          setSaveError('');
        }}
      />

      {saveError ? (
        <p aria-live="polite" className="mt-3 text-[14px] text-[#E05260]">
          {saveError}
        </p>
      ) : null}

      <button
        className="mt-auto h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        disabled={isSaving}
        type="button"
        onClick={() => void handleSave()}
      >
        수정하기
      </button>
    </main>
  );
}
