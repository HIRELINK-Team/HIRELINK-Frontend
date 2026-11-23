import { useTranslation } from 'react-i18next';

import type { StudentApplicationsFilter } from '../../../types/studentApplication';

type ApplicationFilterTabsProps = {
  activeFilter: StudentApplicationsFilter;
  onChange: (filter: StudentApplicationsFilter) => void;
};

const FILTERS: Array<{
  labelKey: 'applications.inReview' | 'applications.offers' | 'applications.hired';
  value: StudentApplicationsFilter;
}> = [
  { value: 'reviewing', labelKey: 'applications.inReview' },
  { value: 'offer', labelKey: 'applications.offers' },
  { value: 'hired', labelKey: 'applications.hired' },
];

export function ApplicationFilterTabs({
  activeFilter,
  onChange,
}: ApplicationFilterTabsProps) {
  const { t } = useTranslation();
  return (
    <div
      aria-label={t('applications.filter')}
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
            {t(filter.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
