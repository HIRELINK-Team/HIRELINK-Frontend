import type { StudentApplicationsFilter } from '../../../types/studentApplication';

type ApplicationFilterTabsProps = {
  activeFilter: StudentApplicationsFilter;
  onChange: (filter: StudentApplicationsFilter) => void;
};

const FILTERS: Array<{ label: string; value: StudentApplicationsFilter }> = [
  { value: 'reviewing', label: '검토 중' },
  { value: 'offer', label: '채용 제안' },
  { value: 'hired', label: '채용 완료' },
];

export function ApplicationFilterTabs({
  activeFilter,
  onChange,
}: ApplicationFilterTabsProps) {
  return (
    <div
      aria-label="지원 내역 상태 필터"
      className="flex justify-start gap-[5px]"
      role="tablist"
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;

        return (
          <button
            aria-selected={isActive}
            className={`h-[31px] shrink-0 rounded-[50px] border-0 px-[15px] text-[10px] leading-[1.5] tracking-[-0.02em] ${
              isActive
                ? 'bg-[#00B894] font-bold text-white'
                : 'bg-[#E6E8E9] font-normal text-[#191F28]'
            }`}
            key={filter.value}
            role="tab"
            type="button"
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
