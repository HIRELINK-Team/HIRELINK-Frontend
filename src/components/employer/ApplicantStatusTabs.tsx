export type ApplicantStatusFilter =
  "ALL" | "REVIEWING" | "OFFER_WAITING" | "HIRED";

interface ApplicantStatusTabsProps {
  selectedFilter: ApplicantStatusFilter;
  counts: Record<ApplicantStatusFilter, number>;
  onChange: (filter: ApplicantStatusFilter) => void;
}

const TAB_LABELS: Record<ApplicantStatusFilter, string> = {
  ALL: "전체",
  REVIEWING: "검토 중",
  OFFER_WAITING: "수락 대기",
  HIRED: "채용 완료",
};

function ApplicantStatusTabs({
  selectedFilter,
  counts,
  onChange,
}: ApplicantStatusTabsProps) {
  return (
    <div
      className="flex items-center gap-1.5"
      role="tablist"
      aria-label="지원자 상태"
    >
      {(Object.keys(TAB_LABELS) as ApplicantStatusFilter[]).map((filter) => {
        const isSelected = selectedFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(filter)}
            className={`flex h-8 cursor-pointer items-center justify-center rounded-full px-5 text-[15px] leading-none whitespace-nowrap transition-colors ${
              isSelected
                ? "border border-[#007a63] bg-[#e5f8f4] font-medium text-[#007a63]"
                : "bg-white font-normal text-[#242424] shadow-[0_2px_1.5px_rgba(0,0,0,0.1)] hover:bg-[#f4f4f5]"
            }`}
          >
            {TAB_LABELS[filter]} {counts[filter]}
          </button>
        );
      })}
    </div>
  );
}

export default ApplicantStatusTabs;
