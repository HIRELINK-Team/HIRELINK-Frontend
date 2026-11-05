import { useState } from 'react';

import backIcon from '../../assets/icons/student/matching/back.svg';
import { MatchingEmptyState } from '../../components/student/matching/MatchingEmptyState';
import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import { RecommendedJobCard } from '../../components/student/matching/RecommendedJobCard';
import { ApplicationConfirmationStep } from '../../components/student/matching/ApplicationConfirmationStep';
import { ApplicationCompleteStep } from '../../components/student/matching/ApplicationCompleteStep';
import { RecommendationRefreshModal } from '../../components/student/matching/RecommendationRefreshModal';
import { WorkStartDateStep } from '../../components/student/matching/WorkStartDateStep';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { MAX_RECOMMENDED_JOBS } from '../../mocks/studentMatching';
import type { StudentNavigationTab } from '../../types/studentHome';
import type {
  RecommendedJob,
  StudentMatchingView,
} from '../../types/studentMatching';

type StudentMatchingPageProps = {
  isBottomNavigationFixed?: boolean;
  initialRefreshPopupOpen?: boolean;
  initialSelectedJob?: RecommendedJob | null;
  initialView?: StudentMatchingView;
  isRecommendationsLoading?: boolean;
  onBack?: () => void;
  onRecommendationDetailRequest?: (
    job: RecommendedJob,
  ) => Promise<RecommendedJob | null>;
  onApplicationSubmit?: (
    job: RecommendedJob,
    desiredStartDate: string,
  ) => Promise<boolean>;
  onRecommendationRefresh?: () => Promise<boolean>;
  onTabChange?: (tab: StudentNavigationTab) => void;
  onViewChange?: (
    view: Exclude<StudentMatchingView, 'result'>,
    job: RecommendedJob,
  ) => void;
  recommendations?: readonly RecommendedJob[];
};

export default function StudentMatchingPage({
  isBottomNavigationFixed = false,
  initialRefreshPopupOpen = false,
  initialSelectedJob = null,
  initialView = 'result',
  isRecommendationsLoading = false,
  onBack,
  onApplicationSubmit,
  onRecommendationDetailRequest,
  onRecommendationRefresh,
  onTabChange,
  onViewChange,
  recommendations = [],
}: StudentMatchingPageProps) {
  const [matchingView, setMatchingView] =
    useState<StudentMatchingView>(initialView);
  const [selectedJob, setSelectedJob] = useState<RecommendedJob | null>(
    initialSelectedJob,
  );
  const [detailBackView, setDetailBackView] = useState<'complete' | 'result'>(
    'result',
  );
  const [workStartDate, setWorkStartDate] = useState('2027-03-14');
  const [isRefreshPopupOpen, setIsRefreshPopupOpen] = useState(
    initialRefreshPopupOpen,
  );
  const [isApplicationSubmitting, setIsApplicationSubmitting] = useState(false);
  const [isRecommendationRefreshing, setIsRecommendationRefreshing] =
    useState(false);
  const recommendedJobs = recommendations.slice(0, MAX_RECOMMENDED_JOBS);

  const handleBack = () => {
    onBack?.();
  };

  const requestRecommendationDetail = (job: RecommendedJob) => {
    if (!onRecommendationDetailRequest) return;

    void onRecommendationDetailRequest(job)
      .then((detailedJob) => {
        if (!detailedJob) return;

        setSelectedJob((currentJob) =>
          currentJob?.id === job.id ? detailedJob : currentJob,
        );
      })
      .catch(() => undefined);
  };

  const handleDetailClick = (job: RecommendedJob) => {
    setSelectedJob(job);
    setDetailBackView('result');
    setMatchingView('detail');
    onViewChange?.('detail', job);
    requestRecommendationDetail(job);
  };

  const handleTabChange = (tab: StudentNavigationTab) => {
    onTabChange?.(tab);
  };

  const handleDetailBack = () => {
    setMatchingView(detailBackView);
  };

  const handleApply = (job: RecommendedJob) => {
    setSelectedJob(job);
    setMatchingView('startDate');
    onViewChange?.('startDate', job);
  };

  const handleStartDateBack = () => {
    setMatchingView('detail');
  };

  const handleStartDatePickerOpen = () => {
    setMatchingView('startDateSelection');
  };

  const handleStartDatePickerClose = () => {
    setMatchingView('startDate');
  };

  const handleStartDateNext = () => {
    if (selectedJob) {
      setMatchingView('confirm');
      onViewChange?.('confirm', selectedJob);
    }
  };

  const handleConfirmationBack = () => {
    setMatchingView('startDate');
  };

  const handleApplicationConfirmation = async () => {
    if (!selectedJob || isApplicationSubmitting) return;

    setIsApplicationSubmitting(true);

    try {
      const didSubmit = onApplicationSubmit
        ? await onApplicationSubmit(selectedJob, workStartDate)
        : true;

      if (didSubmit) {
        setMatchingView('complete');
        onViewChange?.('complete', selectedJob);
      }
    } finally {
      setIsApplicationSubmitting(false);
    }
  };

  const handleCompleteBack = () => {
    setMatchingView('confirm');
  };

  const handleCompleteDetail = () => {
    if (selectedJob) {
      setDetailBackView('complete');
      setMatchingView('detail');
      onViewChange?.('detail', selectedJob);
      requestRecommendationDetail(selectedJob);
    }
  };

  const handleCompleteHome = () => {
    onTabChange?.('home');
  };

  const handleRecommendationRefreshConfirm = async () => {
    if (isRecommendationRefreshing) return;

    setIsRecommendationRefreshing(true);

    try {
      const didRefresh = onRecommendationRefresh
        ? await onRecommendationRefresh()
        : true;

      if (didRefresh) {
        setIsRefreshPopupOpen(false);
      }
    } finally {
      setIsRecommendationRefreshing(false);
    }
  };

  if (matchingView === 'detail' && selectedJob) {
    return (
      <RecommendedJobDetail
        job={selectedJob}
        onApply={handleApply}
        onBack={handleDetailBack}
      />
    );
  }

  if (
    (matchingView === 'startDate' || matchingView === 'startDateSelection') &&
    selectedJob
  ) {
    return (
      <WorkStartDateStep
        isDatePickerOpen={matchingView === 'startDateSelection'}
        selectedDate={workStartDate}
        onBack={handleStartDateBack}
        onDateChange={setWorkStartDate}
        onDatePickerClose={handleStartDatePickerClose}
        onDatePickerOpen={handleStartDatePickerOpen}
        onNext={handleStartDateNext}
      />
    );
  }

  if (matchingView === 'confirm' && selectedJob) {
    return (
      <ApplicationConfirmationStep
        isSubmitting={isApplicationSubmitting}
        job={selectedJob}
        workStartDate={workStartDate}
        onBack={handleConfirmationBack}
        onConfirm={handleApplicationConfirmation}
      />
    );
  }

  if (matchingView === 'complete' && selectedJob) {
    return (
      <ApplicationCompleteStep
        job={selectedJob}
        onBack={handleCompleteBack}
        onDetail={handleCompleteDetail}
        onHome={handleCompleteHome}
      />
    );
  }

  if (
    matchingView === 'result' &&
    !isRecommendationsLoading &&
    recommendedJobs.length === 0
  ) {
    return (
      <main className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em]">
        <button
          aria-label="이전 화면으로 이동"
          className="absolute top-[67px] left-6 z-10 flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
          type="button"
          onClick={handleBack}
        >
          <img alt="" className="block" src={backIcon} />
        </button>
        <MatchingEmptyState onConfirm={handleBack} />
      </main>
    );
  }

  return (
    <main
      className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      data-matching-view={matchingView}
      data-selected-job-id={selectedJob?.id}
    >
      <button
        aria-label="이전 화면으로 이동"
        className="absolute top-[69px] left-[26px] flex h-[16px] w-[8px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>

      <h1 className="absolute top-[112px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        지금 조건에 딱 맞는
        <br />
        일자리를 추천해드려요.
      </h1>

      <p className="absolute top-[198px] left-6 text-[15px] leading-[1.5] text-[#B0B8C1]">
        지원하면 24시간 타이머가 시작돼요.
      </p>

      <section
        aria-label="추천 근무지 목록"
        className="absolute top-[248px] bottom-[120px] left-6 w-[342px] space-y-2.5 overflow-y-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recommendedJobs.map((job) => (
          <RecommendedJobCard
            job={job}
            key={job.id}
            onApply={handleApply}
            onDetailClick={handleDetailClick}
          />
        ))}
      </section>

      <StudentBottomNavigation
        activeTab="matching"
        bottomOffsetClassName="bottom-[31px]"
        isFixed={isBottomNavigationFixed}
        onTabChange={handleTabChange}
      />
      {matchingView === 'result' && isRefreshPopupOpen ? (
        <RecommendationRefreshModal
          isSubmitting={isRecommendationRefreshing}
          onConfirm={handleRecommendationRefreshConfirm}
        />
      ) : null}
    </main>
  );
}
