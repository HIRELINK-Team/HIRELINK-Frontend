import { useState } from 'react';

import backIcon from '../../assets/icons/student/matching/back.svg';
import { ApplicationFilterTabs } from '../../components/student/applications/ApplicationFilterTabs';
import { StudentApplicationCard } from '../../components/student/applications/StudentApplicationCard';
import { StudentApplicationsEmptyState } from '../../components/student/applications/StudentApplicationsEmptyState';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { STUDENT_APPLICATIONS_MOCK } from '../../mocks/studentApplications';
import type {
  StudentApplicationCardModel,
  StudentApplicationsFilter,
  StudentApplicationsScenario,
} from '../../types/studentApplication';
import type { StudentNavigationTab } from '../../types/studentHome';

type StudentApplicationsPageProps = {
  applications?: readonly StudentApplicationCardModel[];
  isBottomNavigationFixed?: boolean;
  isApplicationsLoading?: boolean;
  initialScenario?: StudentApplicationsScenario;
  onAcceptOffer?: (
    application: StudentApplicationCardModel,
  ) => boolean | Promise<boolean> | void;
  onBack?: () => void;
  onDeclineOffer?: (
    application: StudentApplicationCardModel,
  ) => boolean | Promise<boolean> | void;
  onDetailClick?: (application: StudentApplicationCardModel) => void;
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

function getApplicationsForFilter(
  applications: readonly StudentApplicationCardModel[],
  filter: StudentApplicationsFilter,
) {
  if (filter === 'all') {
    return applications.filter((application) =>
      ['REVIEWING', 'HIRED'].includes(application.status),
    );
  }

  if (filter === 'reviewing') {
    return applications.filter(
      (application) => application.status === 'REVIEWING',
    );
  }

  if (filter === 'offer') {
    return applications.filter(
      (application) => application.status === 'OFFER_WAITING',
    );
  }

  return applications.filter((application) => application.status === 'HIRED');
}

export default function StudentApplicationsPage({
  applications: applicationData = STUDENT_APPLICATIONS_MOCK,
  isBottomNavigationFixed = false,
  isApplicationsLoading = false,
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
  const [pendingOfferApplicationId, setPendingOfferApplicationId] = useState<
    string | null
  >(null);
  const applications = isEmptyScenario
    ? []
    : getApplicationsForFilter(applicationData, activeFilter);
  const isGeneralLayout = activeFilter === 'all' && !isEmptyScenario;
  const isReviewingLayout = activeFilter === 'reviewing' && !isEmptyScenario;
  const isHiredLayout = activeFilter === 'hired' && !isEmptyScenario;

  const handleFilterChange = (filter: StudentApplicationsFilter) => {
    setActiveFilter(filter);
    setIsEmptyScenario(false);
  };

  const handleAcceptOffer = async (
    application: StudentApplicationCardModel,
  ) => {
    if (pendingOfferApplicationId) return;

    setPendingOfferApplicationId(application.id);

    try {
      const didSucceed = await onAcceptOffer?.(application);

      if (didSucceed !== false) {
        setActiveFilter('hired');
        setIsEmptyScenario(false);
      }
    } finally {
      setPendingOfferApplicationId(null);
    }
  };

  const handleDeclineOffer = async (
    application: StudentApplicationCardModel,
  ) => {
    if (pendingOfferApplicationId) return;

    setPendingOfferApplicationId(application.id);

    try {
      await onDeclineOffer?.(application);
    } finally {
      setPendingOfferApplicationId(null);
    }
  };

  return (
    <main className="relative mx-auto flex h-[844px] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="relative min-h-0 flex-1 overflow-y-auto px-6 pb-6">
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

        {!isApplicationsLoading &&
        (isEmptyScenario || applications.length === 0) ? (
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
                isOfferActionPending={
                  pendingOfferApplicationId === application.id
                }
                key={application.id}
                onAcceptOffer={handleAcceptOffer}
                onDeclineOffer={handleDeclineOffer}
                onDetailClick={onDetailClick}
              />
            ))}
          </section>
        )}
      </div>
      <div className="relative h-[106px] shrink-0">
        <StudentBottomNavigation
          activeBackgroundClassName="bg-[#E5E8EB]/90"
          activeTab="applications"
          isFixed={isBottomNavigationFixed}
          onTabChange={onTabChange}
        />
      </div>
    </main>
  );
}
