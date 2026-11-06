import { useEffect, useRef, useState } from 'react';

import { getMyStudentApplications } from '../../api/student/applications';
import backIcon from '../../assets/icons/student/matching/back.svg';
import { MatchingEmptyState } from '../../components/student/matching/MatchingEmptyState';
import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import { RecommendedJobCard } from '../../components/student/matching/RecommendedJobCard';
import { ApplicationConfirmationStep } from '../../components/student/matching/ApplicationConfirmationStep';
import { ApplicationCompleteStep } from '../../components/student/matching/ApplicationCompleteStep';
import { MatchingOfferOverlay } from '../../components/student/matching/MatchingOfferOverlay';
import { RecommendationRefreshModal } from '../../components/student/matching/RecommendationRefreshModal';
import { WorkStartDateStep } from '../../components/student/matching/WorkStartDateStep';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import type { StudentNavigationTab } from '../../types/studentHome';
import type {
  CreateStudentApplicationResponse,
  StudentApplication,
} from '../../types/studentApplication';
import type {
  RecommendedJob,
  StudentMatchingView,
} from '../../types/studentMatching';
import type { StudentProfileResponse } from '../../types/studentProfile';

const MAX_RECOMMENDED_JOBS = 3;
const APPLICATIONS_POLLING_INTERVAL_MS = 10_000;
// The recommendations API has no dismissal endpoint, so preserve this explicit
// browser preference across navigation and reloads.
const DISMISSED_RECOMMENDATION_STORAGE_KEY =
  'hirelink.student.dismissed-job-postings';

type ApplicationSubmissionResult =
  CreateStudentApplicationResponse | 'recommendation-conflict' | null;

type RecommendationApplication = Pick<
  StudentApplication,
  | 'applicationId'
  | 'employerResponseDeadline'
  | 'jobPostingId'
  | 'status'
> &
  Partial<
    Pick<
      StudentApplication,
      | 'jobTitle'
      | 'workplaceName'
      | 'wageType'
      | 'wageAmount'
      | 'recommendationReasons'
      | 'offerId'
      | 'offerStatus'
    >
  >;

type PendingOfferApplication = RecommendationApplication &
  Pick<
    StudentApplication,
    | 'jobTitle'
    | 'workplaceName'
    | 'wageType'
    | 'wageAmount'
    | 'recommendationReasons'
    | 'offerId'
    | 'offerStatus'
  >;

function getJobPostingIdKey(jobPostingId: string | number | undefined) {
  return jobPostingId === undefined ? null : String(jobPostingId);
}

function getRecommendationDismissalKey(job: RecommendedJob) {
  return job.jobPostingId === undefined
    ? `recommendation:${job.recommendationId ?? job.id}`
    : `job-posting:${job.jobPostingId}`;
}

function getRecommendationKey(job: RecommendedJob) {
  return String(job.recommendationId ?? job.id);
}

function getStoredDismissedRecommendationKeys() {
  try {
    const storedValue = localStorage.getItem(
      DISMISSED_RECOMMENDATION_STORAGE_KEY,
    );
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : [];

    return Array.isArray(parsedValue)
      ? parsedValue.filter(
          (value): value is string => typeof value === 'string',
        )
      : [];
  } catch {
    return [];
  }
}

function storeDismissedRecommendationKeys(keys: readonly string[]) {
  try {
    localStorage.setItem(
      DISMISSED_RECOMMENDATION_STORAGE_KEY,
      JSON.stringify(keys),
    );
  } catch {
    // Keep the current-page dismissal even when browser storage is unavailable.
  }
}

function getWaitingApplicationForRecommendation(
  applications: readonly RecommendationApplication[],
  jobPostingId: string | number | undefined,
) {
  const jobPostingIdKey = getJobPostingIdKey(jobPostingId);
  if (jobPostingIdKey === null) return undefined;

  return applications
    .filter(
      (application) =>
        application.status === 'WAITING_RESPONSE' &&
        getJobPostingIdKey(application.jobPostingId) === jobPostingIdKey,
    )
    .reduce<RecommendationApplication | undefined>((latest, application) => {
      if (!latest) return application;

      return new Date(application.employerResponseDeadline).getTime() >
        new Date(latest.employerResponseDeadline).getTime()
        ? application
        : latest;
    }, undefined);
}

function isPendingOfferApplication(
  application: RecommendationApplication,
): application is PendingOfferApplication {
  return (
    application.status === 'OFFERED' &&
    application.offerStatus === 'PENDING' &&
    application.offerId !== null &&
    application.offerId !== undefined &&
    typeof application.jobTitle === 'string' &&
    typeof application.workplaceName === 'string' &&
    application.wageType !== undefined &&
    typeof application.wageAmount === 'number' &&
    Array.isArray(application.recommendationReasons)
  );
}

function mapOfferApplicationToRecommendedJob(
  application: PendingOfferApplication,
): RecommendedJob {
  const wageLabel = `${application.wageType === 'HOURLY' ? '시급' : '월급'} ${application.wageAmount.toLocaleString('ko-KR')}원`;

  return {
    applicationId: application.applicationId,
    applicationStatus: 'OFFERED',
    countdownLabel: '',
    commuteAndWage: wageLabel,
    companyName: application.workplaceName,
    detail: {
      comparisonTags: application.recommendationReasons,
      locationAndDistance: '',
      matchRate: 0,
      metrics: [{ label: '급여', value: wageLabel }],
      tags: [],
    },
    id: `offer:${application.applicationId}`,
    isCountdownActive: false,
    jobPostingId: application.jobPostingId,
    matchDescription: application.recommendationReasons.join(' · '),
    matchRate: 0,
    role: `직무 | ${application.jobTitle}`,
    showsApplyButton: false,
  };
}

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
  ) => Promise<ApplicationSubmissionResult>;
  onOfferAction?: (
    offerId: number,
    action: 'accept' | 'decline',
  ) => Promise<StudentApplication[] | null>;
  onRecommendationRefresh?: () => Promise<boolean>;
  onTabChange?: (tab: StudentNavigationTab) => void;
  onViewChange?: (
    view: Exclude<StudentMatchingView, 'result'>,
    job: RecommendedJob,
  ) => void;
  recommendations?: readonly RecommendedJob[];
  studentProfile?: StudentProfileResponse | null;
};

export default function StudentMatchingPage({
  isBottomNavigationFixed = false,
  initialRefreshPopupOpen = false,
  initialSelectedJob = null,
  initialView = 'result',
  isRecommendationsLoading = false,
  onBack,
  onApplicationSubmit,
  onOfferAction,
  onRecommendationDetailRequest,
  onRecommendationRefresh,
  onTabChange,
  onViewChange,
  recommendations = [],
  studentProfile = null,
}: StudentMatchingPageProps) {
  const [matchingView, setMatchingView] =
    useState<StudentMatchingView>(initialView);
  const [selectedJob, setSelectedJob] = useState<RecommendedJob | null>(
    initialSelectedJob,
  );
  const [expandedRecommendationKey, setExpandedRecommendationKey] = useState<
    string | null
  >(initialSelectedJob ? getRecommendationKey(initialSelectedJob) : null);
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
  const [isOfferActionSubmitting, setIsOfferActionSubmitting] = useState(false);
  const [applications, setApplications] = useState<RecommendationApplication[]>(
    [],
  );
  const [dismissedRecommendationIds, setDismissedRecommendationIds] = useState<
    string[]
  >(getStoredDismissedRecommendationKeys);
  const selectedJobRef = useRef<RecommendedJob | null>(initialSelectedJob);
  const latestRecommendationIdsRef = useRef<Set<number>>(new Set());
  const pendingApplicationIdsRef = useRef<Set<number>>(new Set());
  const dismissedOfferApplicationIdRef = useRef<number | null>(null);
  const isOfferActionSubmittingRef = useRef(false);
  const recommendedJobs = recommendations
    .filter((job) => {
      const dismissalKey = getRecommendationDismissalKey(job);

      return !dismissedRecommendationIds.includes(dismissalKey);
    })
    .slice(0, MAX_RECOMMENDED_JOBS);
  const offeredApplication = applications.find(isPendingOfferApplication);
  const offeredJob = offeredApplication
    ? mapOfferApplicationToRecommendedJob(offeredApplication)
    : null;

  useEffect(() => {
    selectedJobRef.current = selectedJob;
  }, [selectedJob]);

  useEffect(() => {
    const latestRecommendationIds = new Set(
      recommendations.flatMap((job) =>
        job.recommendationId === undefined ? [] : [job.recommendationId],
      ),
    );
    latestRecommendationIdsRef.current = latestRecommendationIds;

    const currentSelectedJob = selectedJobRef.current;
    if (!currentSelectedJob) return;

    const latestSelectedJob = recommendations.find(
      (job) => job.recommendationId === currentSelectedJob.recommendationId,
    );

    if (!latestSelectedJob) {
      setSelectedJob(null);
      setExpandedRecommendationKey(null);
      setMatchingView('result');
      setDetailBackView('result');
      return;
    }

    setSelectedJob(latestSelectedJob);
  }, [recommendations]);

  useEffect(() => {
    let isActive = true;
    let isApplicationsRequestInFlight = false;

    const loadApplications = async () => {
      if (
        !isActive ||
        isApplicationsRequestInFlight ||
        isOfferActionSubmittingRef.current
      ) {
        return;
      }

      isApplicationsRequestInFlight = true;

      try {
        const response = await getMyStudentApplications();
        if (!isActive) return;

        const pendingOffer = response.applications.find(
          isPendingOfferApplication,
        );
        if (
          pendingOffer &&
          pendingOffer.applicationId !== dismissedOfferApplicationIdRef.current
        ) {
          setMatchingView('offer');
        } else if (!pendingOffer) {
          setMatchingView((currentView) =>
            currentView === 'offer' ? 'result' : currentView,
          );
        }

        setApplications((currentApplications) => {
          const serverApplicationIds = new Set(
            response.applications.map((application) => application.applicationId),
          );
          serverApplicationIds.forEach((applicationId) => {
            pendingApplicationIdsRef.current.delete(applicationId);
          });

          const pendingApplications = currentApplications.filter(
            (application) =>
              pendingApplicationIdsRef.current.has(application.applicationId) &&
              !serverApplicationIds.has(application.applicationId),
          );

          return [...response.applications, ...pendingApplications];
        });
      } catch {
        if (isActive) {
          setApplications((currentApplications) =>
            currentApplications.filter((application) =>
              pendingApplicationIdsRef.current.has(application.applicationId),
            ),
          );
        }
      } finally {
        isApplicationsRequestInFlight = false;
      }
    };

    void loadApplications();
    const intervalId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void loadApplications();
      }
    }, APPLICATIONS_POLLING_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void loadApplications();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBack = () => {
    onBack?.();
  };

  const requestRecommendationDetail = (job: RecommendedJob) => {
    if (!onRecommendationDetailRequest) return;

    void onRecommendationDetailRequest(job)
      .then((detailedJob) => {
        if (!detailedJob) return;

        if (
          detailedJob.recommendationId === undefined ||
          !latestRecommendationIdsRef.current.has(detailedJob.recommendationId)
        ) {
          return;
        }

        setSelectedJob((currentJob) =>
          currentJob?.id === job.id ? detailedJob : currentJob,
        );
      })
      .catch(() => undefined);
  };

  const handleCardClick = (job: RecommendedJob) => {
    const recommendationKey = getRecommendationKey(job);

    setExpandedRecommendationKey((currentKey) =>
      currentKey === recommendationKey ? null : recommendationKey,
    );
    setSelectedJob(job);
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

  const handleRecommendationDismiss = (job: RecommendedJob) => {
    const dismissalKey = getRecommendationDismissalKey(job);

    setDismissedRecommendationIds((currentIds) => {
      if (currentIds.includes(dismissalKey)) return currentIds;

      const nextIds = [...currentIds, dismissalKey];
      storeDismissedRecommendationKeys(nextIds);
      return nextIds;
    });

    setSelectedJob(null);
    setExpandedRecommendationKey(null);
    setDetailBackView('result');
    setMatchingView('result');
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

    const latestSelectedJob = recommendedJobs.find(
      (job) => job.recommendationId === selectedJob.recommendationId,
    );
    if (!latestSelectedJob) {
      setSelectedJob(null);
      setExpandedRecommendationKey(null);
      setMatchingView('result');
      return;
    }

    setIsApplicationSubmitting(true);

    try {
      const createdApplication = onApplicationSubmit
        ? await onApplicationSubmit(latestSelectedJob, workStartDate)
        : null;

      if (createdApplication === 'recommendation-conflict') {
        setSelectedJob(null);
        setMatchingView('result');
        return;
      }

      if (createdApplication) {
        pendingApplicationIdsRef.current.add(createdApplication.applicationId);
        setSelectedJob({
          ...latestSelectedJob,
          applicationId: createdApplication.applicationId,
          applicationStatus: createdApplication.status,
          showsApplyButton: false,
        });
        setApplications((currentApplications) => [
          createdApplication,
          ...currentApplications.filter(
            (application) =>
              getJobPostingIdKey(application.jobPostingId) !==
              getJobPostingIdKey(createdApplication.jobPostingId),
          ),
        ]);
        setMatchingView('complete');
        onViewChange?.('complete', latestSelectedJob);
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

  const handleOfferAction = async (action: 'accept' | 'decline') => {
    if (
      !offeredApplication ||
      offeredApplication.offerId === null ||
      offeredApplication.offerId === undefined ||
      isOfferActionSubmitting
    ) {
      return;
    }

    setIsOfferActionSubmitting(true);
    isOfferActionSubmittingRef.current = true;

    try {
      const nextApplications = onOfferAction
        ? await onOfferAction(offeredApplication.offerId, action)
        : null;

      if (!nextApplications) return;

      setApplications(nextApplications);
      dismissedOfferApplicationIdRef.current =
        offeredApplication.applicationId;
      setMatchingView('result');
    } finally {
      isOfferActionSubmittingRef.current = false;
      setIsOfferActionSubmitting(false);
    }
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
        onRecommendationDismiss={handleRecommendationDismiss}
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
        studentProfile={studentProfile}
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
      <main className="relative mx-auto h-[990px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em]">
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
      className="relative mx-auto h-[990px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
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
        className="absolute top-[248px] right-6 left-6 flex flex-col gap-2.5"
      >
        {recommendedJobs.map((job) => {
          const application = getWaitingApplicationForRecommendation(
            applications,
            job.jobPostingId,
          );
          const isExpanded =
            expandedRecommendationKey === getRecommendationKey(job);
          const showApplyButton =
            job.showsApplyButton && application === undefined;

          return (
            <RecommendedJobCard
              application={application}
              isExpanded={isExpanded}
              job={job}
              key={job.id}
              onApply={handleApply}
              onCardClick={handleCardClick}
              onDetailClick={handleDetailClick}
              showApplyButton={showApplyButton}
            />
          );
        })}
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
      {matchingView === 'offer' && offeredJob && offeredApplication ? (
        <MatchingOfferOverlay
          isSubmitting={isOfferActionSubmitting}
          job={offeredJob}
          onAction={(action) => void handleOfferAction(action)}
          onBack={() => {
            dismissedOfferApplicationIdRef.current =
              offeredApplication.applicationId;
            setMatchingView('result');
          }}
        />
      ) : null}
    </main>
  );
}
