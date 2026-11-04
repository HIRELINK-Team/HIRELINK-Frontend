import backIcon from '../../assets/icons/student/documents/back.svg';
import matchingConditionChevronIcon from '../../assets/icons/student/my/matching-condition-chevron.svg';
import matchingConditionNoticeImage from '../../assets/images/student/my/matching-condition-notice.png';
import priorityDragHandleIcon from '../../assets/icons/student/priority-drag-handle.svg';
import type { MatchingPriorityId } from '../../types/matchingPriority';

type MatchingConditionId =
  'industry' | 'location' | 'work-time' | 'start-date' | 'priority';

type MatchingConditionSummaryId = Exclude<MatchingConditionId, 'priority'>;

type MatchingConditionSummaryValues = Partial<
  Record<MatchingConditionSummaryId, string | string[]>
>;

type StudentMatchingConditionManagementPageProps = {
  isLoading?: boolean;
  onApply?: () => void;
  onBack?: () => void;
  onConditionClick?: (conditionId: MatchingConditionId) => void;
  priorityOrder?: readonly MatchingPriorityId[];
  summaryValues?: MatchingConditionSummaryValues;
};

const MATCHING_CONDITION_SUMMARIES = [
  { id: 'industry', label: '희망 직종', value: '음식점·카페' },
  { id: 'location', label: '희망 근무지역', value: '주소 미입력' },
  {
    id: 'work-time',
    label: '희망 근무시간',
    value: ['월 18:00 - 22:00', '수 18:00 - 22:00'],
  },
  {
    id: 'start-date',
    label: '근무 시작일',
    value: '2025.10.20부터 (바로 가능)',
  },
] as const;

const MATCHING_PRIORITY_CARDS = [
  {
    description: '원하는 시간대에 일하고 싶어요.',
    id: 'workTime',
    title: '근무시간',
  },
  { description: '만족스러운 급여를 받고 싶어요.', id: 'wage', title: '급여' },
  {
    description: '집 가까운 곳에서 일하고 싶어요.',
    id: 'distance',
    title: '거리',
  },
  {
    description: '원하는 분야에서 일하고 싶어요.',
    id: 'industry',
    title: '업종',
  },
] as const;

export default function StudentMatchingConditionManagementPage({
  isLoading = false,
  onApply,
  onBack,
  onConditionClick,
  priorityOrder,
  summaryValues,
}: StudentMatchingConditionManagementPageProps) {
  const handleConditionClick = (conditionId: MatchingConditionId) => {
    onConditionClick?.(conditionId);
  };

  return (
    <main
      aria-busy={isLoading}
      className="mx-auto min-h-[1074px] w-full max-w-[390px] bg-[#F5F5F5] px-6 pt-[61px] pb-[34px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
    >
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <h1 className="m-0 mt-[18px] text-[26px] leading-[1.5] font-semibold">
        매칭 조건 관리
      </h1>

      <section className="mt-[12px] flex h-[82px] items-center rounded-[20px] bg-[#E5E8EB]">
        <img
          alt=""
          className="ml-[22px] h-[55.475px] w-[55.475px] shrink-0 object-contain"
          src={matchingConditionNoticeImage}
        />
        <p className="m-0 ml-[18.5px] text-[15px] leading-[1.5] font-bold">
          희망하는 조건을 설정하면
          <br />
          내게 딱 맞는 일자리를 추천드려요.
        </p>
      </section>
      <p className="m-0 mt-[6px] text-[12px] leading-[1.5] text-[#8B95A1]">
        여러 항목을 설정할수록 매칭 정확도가 높아져요.
      </p>

      <section className="-mx-6 mt-[24px] border-y border-[#E5E8EB]">
        {MATCHING_CONDITION_SUMMARIES.map((condition) => {
          const value = summaryValues?.[condition.id] ?? condition.value;
          const isWorkTimeSummary =
            condition.id === 'work-time' && Array.isArray(value);

          return (
            <button
              className={`flex w-full items-center border-0 border-b border-[#E5E8EB] bg-transparent px-6 text-left last:border-b-0 ${
                isWorkTimeSummary
                  ? 'min-h-[76px] items-start py-3'
                  : Array.isArray(value)
                    ? 'h-[76px]'
                    : 'h-11'
              }`}
              key={condition.id}
              type="button"
              onClick={() => handleConditionClick(condition.id)}
            >
              <span
                className={`w-[102px] shrink-0 text-[13px] leading-[1.5] text-[#8B95A1] ${
                  isWorkTimeSummary ? 'pt-1' : ''
                }`}
              >
                {condition.label}
              </span>
              {isWorkTimeSummary ? (
                <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                  {value.map((summaryValue, index) => (
                    <span
                      className="rounded-full bg-[#E9EDF2] px-2 py-1 text-[12px] leading-[1.3] text-[#4E5968]"
                      key={`${summaryValue}-${index}`}
                    >
                      {summaryValue}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#191F28]">
                  {Array.isArray(value)
                    ? value.map((summaryValue) => (
                        <span className="block" key={summaryValue}>
                          {summaryValue}
                        </span>
                      ))
                    : value}
                </span>
              )}
              <img
                alt=""
                className={`ml-3 h-[13.0958px] w-[5.99994px] shrink-0 -scale-x-100 ${
                  isWorkTimeSummary ? 'mt-1.5' : ''
                }`}
                src={matchingConditionChevronIcon}
              />
            </button>
          );
        })}
      </section>

      <h2 className="m-0 mt-[21px] ml-[2px] text-[20px] leading-[1.4] font-semibold">
        매칭 중요도
      </h2>
      <section className="mt-[18px] space-y-[10px]">
        {(priorityOrder?.length
          ? priorityOrder.flatMap((priorityId) => {
              const card = MATCHING_PRIORITY_CARDS.find(
                (priorityCard) => priorityCard.id === priorityId,
              );
              return card ? [card] : [];
            })
          : MATCHING_PRIORITY_CARDS
        ).map((card) => (
          <button
            className="flex h-[89px] w-full items-center rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-transparent px-[30.3px] text-left"
            key={card.id}
            type="button"
            onClick={() => handleConditionClick('priority')}
          >
            <span>
              <span className="block text-[17px] leading-[1.5] font-bold">
                {card.title}
              </span>
              <span className="block text-[15px] leading-[1.5] text-[#8B95A1]">
                {card.description}
              </span>
            </span>
            <img
              alt=""
              className="ml-auto size-[23px]"
              src={priorityDragHandleIcon}
            />
          </button>
        ))}
      </section>

      <button
        className="mt-[29px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onApply}
      >
        수정 반영하기
      </button>
    </main>
  );
}
