import { useState } from 'react';

import backIcon from '../../assets/icons/student/matching/back.svg';
import { ApplicationFilterTabs } from '../../components/student/applications/ApplicationFilterTabs';
import { StudentApplicationCard } from '../../components/student/applications/StudentApplicationCard';
import { StudentApplicationsEmptyState } from '../../components/student/applications/StudentApplicationsEmptyState';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { STUDENT_APPLICATIONS_MOCK } from '../../mocks/studentApplications';
import type {
  StudentApplication,
  StudentApplicationsFilter,
  StudentApplicationsScenario,
} from '../../types/studentApplication';
import type { StudentNavigationTab } from '../../types/studentHome';

type StudentApplicationsPageProps = {
  initialScenario?: StudentApplicationsScenario;
  onAcceptOffer?: (application: StudentApplication) => void;
  onBack?: () => void;
  onDeclineOffer?: (application: StudentApplication) => void;
  onDetailClick?: (application: StudentApplication) => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

const SCENARIO_FILTER: Record<
  StudentApplicationsScenario,
  StudentApplicationsFilter
> = {
  all: 'all',
  reviewing: 'reviewing',
  offer: 'offer',
  hired: 'hired',
  empty: 'all',
};

function getApplicationsForFilter(filter: StudentApplicationsFilter) {
  if (filter === 'all') {
    return STUDENT_APPLICATIONS_MOCK.filter((application) =>
      ['REVIEWING', 'HIRED'].includes(application.status),
    );
  }

  if (filter === 'reviewing') {
    return STUDENT_APPLICATIONS_MOCK.filter(
      (application) => application.status === 'REVIEWING',
    );
  }

  if (filter === 'offer') {
    return STUDENT_APPLICATIONS_MOCK.filter(
      (application) => application.status === 'OFFER_WAITING',
    );
  }

  return STUDENT_APPLICATIONS_MOCK.filter(
    (application) => application.status === 'HIRED',
  );
}

export default function StudentApplicationsPage({
  initialScenario = 'all',
  onAcceptOffer,
  onBack,
  onDeclineOffer,
  onDetailClick,
  onTabChange,
}: StudentApplicationsPageProps) {
  const [activeFilter, setActiveFilter] = useState<StudentApplicationsFilter>(
    SCENARIO_FILTER[initialScenario],
  );
  const [isEmptyScenario, setIsEmptyScenario] = useState(
    initialScenario === 'empty',
  );
  const applications = isEmptyScenario
    ? []
    : getApplicationsForFilter(activeFilter);
  const isGeneralLayout = activeFilter === 'all' && !isEmptyScenario;
  const isReviewingLayout = activeFilter === 'reviewing' && !isEmptyScenario;
  const isHiredLayout = activeFilter === 'hired' && !isEmptyScenario;

  const handleFilterChange = (filter: StudentApplicationsFilter) => {
    setActiveFilter(filter);
    setIsEmptyScenario(false);
  };

  return (
    <main className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] px-6 pb-[140px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로 가기"
        className="absolute top-[69px] left-[26px] flex h-4 w-2 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>

      <h1 className="m-0 pt-[112px] text-[26px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        지원 내역
      </h1>
      <div className="mt-[15px] ml-0.5">
        <ApplicationFilterTabs
          activeFilter={activeFilter}
          onChange={handleFilterChange}
        />
      </div>

      {isEmptyScenario ? (
        <StudentApplicationsEmptyState />
      ) : (
        <section
          className={`mt-[27px] ${
            isGeneralLayout
              ? 'space-y-[11px] [&>article:last-child]:-mt-px'
              : isReviewingLayout
                ? 'space-y-[11px]'
                : 'space-y-[12px]'
          }`}
          aria-label="지원한 공고 목록"
        >
          {applications.map((application) => (
            <StudentApplicationCard
              application={application}
              isGeneralLayout={isGeneralLayout || isReviewingLayout}
              isHiredLayout={isHiredLayout}
              key={application.id}
              onAcceptOffer={onAcceptOffer}
              onDeclineOffer={onDeclineOffer}
              onDetailClick={onDetailClick}
            />
          ))}
        </section>
      )}

      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="applications"
        onTabChange={onTabChange}
      />
    </main>
  );
}
