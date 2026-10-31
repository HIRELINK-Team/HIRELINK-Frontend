export type JobStatusFilter = "ALL" | "OPEN" | "CLOSED";

interface JobStatusTabsProps {
  selectedFilter: JobStatusFilter;
  counts: Record<JobStatusFilter, number>;
  onChange: (filter: JobStatusFilter) => void;
}

const TAB_LABELS: Record<JobStatusFilter, string> = {
  ALL: "전체",
  OPEN: "모집 중",
  CLOSED: "마감",
};

function JobStatusTabs({
  selectedFilter,
  counts,
  onChange,
}: JobStatusTabsProps) {
  return (
    <div
      className="flex items-center gap-2.5"
      role="tablist"
      aria-label="공고 상태"
    >
      {(Object.keys(TAB_LABELS) as JobStatusFilter[]).map((filter) => {
        const isSelected = selectedFilter === filter;

        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(filter)}
            className={`flex h-8 cursor-pointer items-center justify-center rounded-[50px] px-5 py-2.5 text-[15px] leading-normal whitespace-nowrap transition-colors ${
              isSelected
                ? "border border-[#007a63] bg-[#e5f8f4] font-semibold text-[#2e6c5a] shadow-[0_2px_1.5px_rgba(46,108,90,0.1)]"
                : "bg-white font-normal text-[#242424] shadow-[0_2px_1.5px_rgba(0,0,0,0.1)] hover:bg-[#f4f4f5] active:bg-[#eceef0]"
            }`}
          >
            {TAB_LABELS[filter]}{" "}
            <span className="ml-1 font-semibold">{counts[filter]}</span>
          </button>
        );
      })}
    </div>
  );
}

export default JobStatusTabs;
