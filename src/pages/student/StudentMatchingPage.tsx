import { useEffect, useRef, useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { studentDataSource } from '../../services/studentDataSource';
import backIcon from '../../assets/icons/student/matching/back.svg';
import { MatchingEmptyState } from '../../components/student/matching/MatchingEmptyState';
import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import { RecommendedJobCard } from '../../components/student/matching/RecommendedJobCard';
import { ApplicationConfirmationStep } from '../../components/student/matching/ApplicationConfirmationStep';
import { ApplicationCompleteStep } from '../../components/student/matching/ApplicationCompleteStep';
import { RecommendationRefreshModal } from '../../components/student/matching/RecommendationRefreshModal';
import { ResidenceExpiredModal } from '../../components/student/matching/ResidenceExpiredModal';
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
import { formatMatchingSummary } from '../../utils/studentMatchingDisplay';

const MAX_RECOMMENDED_JOBS = 3;
const APPLICATIONS_POLLING_INTERVAL_MS = 10_000;

type ApplicationSubmissionResult =
  CreateStudentApplicationResponse | 'recommendation-conflict' | null;

type RecommendationApplication = Pick<
  StudentApplication,
  'applicationId' | 'employerResponseDeadline' | 'jobPostingId' | 'status'
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
      | 'studentResponseDeadline'
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

function getRecommendationKey(job: RecommendedJob) {
  return String(job.recommendationId ?? job.id);
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

      return (application.employerResponseDeadline
        ? new Date(application.employerResponseDeadline).getTime()
        : -Infinity) >
        (latest.employerResponseDeadline
          ? new Date(latest.employerResponseDeadline).getTime()
          : -Infinity)
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
  recommendation: RecommendedJob | undefined,
  t: TFunction,
): RecommendedJob {
  const amount = application.wageAmount.toLocaleString('ko-KR');
  const wageLabel = t(
    application.wageType === 'HOURLY'
      ? 'matching.offerHourly'
      : 'matching.offerMonthly',
    { amount },
  );

  return {
    applicationId: application.applicationId,
    applicationStatus: 'OFFERED',
    countdownLabel: '',
    commuteAndWage: wageLabel,
    companyName: application.workplaceName,
    detail: recommendation?.detail ?? {
      announcement: null,
      comparisonTags: application.recommendationReasons,
      locationAndDistance: '',
      matchRate: 0,
      metrics: [{ label: '급여', value: wageLabel }],
      tags: [],
    },
    id: `offer:${application.applicationId}`,
    isCountdownActive: false,
    jobPostingId: application.jobPostingId,
    matchDescription: formatMatchingSummary(
      application.recommendationReasons,
      application.recommendationReasons.join(' · '),
    ),
    matchRate: recommendation?.matchRate ?? 0,
    recommendationId: recommendation?.recommendationId,
    role: `직무 | ${application.jobTitle}`,
    showsApplyButton: false,
  };
}

function hasResidenceExpired(expirationDate: string | null | undefined) {
  if (!expirationDate) return false;

  const expiration = new Date(`${expirationDate}T00:00:00`);
  if (Number.isNaN(expiration.getTime())) return false;

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return expiration < todayStart;
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
  onResidenceUpdate?: () => void;
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
  onResidenceUpdate,
  onTabChange,
  onViewChange,
  recommendations = [],
  studentProfile = null,
}: StudentMatchingPageProps) {
  const { t } = useTranslation();
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
  const selectedJobRef = useRef<RecommendedJob | null>(initialSelectedJob);
  const latestRecommendationIdsRef = useRef<Set<number>>(new Set());
  const pendingApplicationIdsRef = useRef<Set<number>>(new Set());
  const isOfferActionSubmittingRef = useRef(false);
  const recommendedJobs = recommendations.slice(0, MAX_RECOMMENDED_JOBS);
  const offeredApplication = applications.find(isPendingOfferApplication);
  const offeredJob = offeredApplication
    ? mapOfferApplicationToRecommendedJob(
        offeredApplication,
        recommendations.find(
          (job) =>
            getJobPostingIdKey(job.jobPostingId) ===
            getJobPostingIdKey(offeredApplication.jobPostingId),
        ),
        t,
      )
    : null;
  const displayedJobs = offeredJob
    ? [
        ...recommendedJobs
          .filter(
            (job) =>
              getJobPostingIdKey(job.jobPostingId) !==
              getJobPostingIdKey(offeredJob.jobPostingId),
          )
          .slice(0, 1),
        offeredJob,
      ]
    : recommendedJobs;
  const isResidenceExpired = hasResidenceExpired(
    studentProfile?.stayExpirationDate,
  );

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
        const response = await studentDataSource.getApplications();
        if (!isActive) return;

        const pendingOffer = response.applications.find(
          isPendingOfferApplication,
        );
        if (pendingOffer) {
          setMatchingView((currentView) =>
            currentView === 'result' || currentView === 'offer'
              ? 'offer'
              : currentView,
          );
        } else if (!pendingOffer) {
          setMatchingView((currentView) =>
            currentView === 'offer' ? 'result' : currentView,
          );
        }

        setApplications((currentApplications) => {
          const serverApplicationIds = new Set(
            response.applications.map(
              (application) => application.applicationId,
            ),
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
    displayedJobs.length === 0 &&
    !isResidenceExpired
  ) {
    return (
      <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em]">
        <MatchingEmptyState onConfirm={handleBack} />
      </main>
    );
  }

  return (
    <main
      className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]"
      data-matching-view={matchingView}
      data-selected-job-id={selectedJob?.id}
    >
      <button
        aria-label={t('matching.backToPrevious')}
        className="absolute top-[69px] left-[26px] flex h-[16px] w-[8px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleBack}
      >
        <img alt="" className="block" src={backIcon} />
      </button>

      <h1 className="absolute top-[112px] left-6 m-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold">
        {t('matching.recommendationTitle')}
      </h1>

      <p className="absolute top-[198px] left-6 text-[15px] leading-[1.5] text-[#B0B8C1]">
        {t('matching.timerNotice')}
      </p>

      <section
        aria-label={t('matching.recommendationList')}
        className="absolute top-[243px] right-6 left-[23px] flex flex-col gap-[10px]"
      >
        {displayedJobs.map((job) => {
          const isOffer = offeredJob?.id === job.id;
          const application = isOffer
            ? offeredApplication
            : getWaitingApplicationForRecommendation(
                applications,
                job.jobPostingId,
              );
          const isSelected =
            expandedRecommendationKey === getRecommendationKey(job);
          const showApplyButton =
            job.showsApplyButton && application === undefined;

          return (
            <RecommendedJobCard
              application={application}
              isOffer={isOffer}
              isSelected={isSelected}
              isSubmitting={isOfferActionSubmitting}
              job={job}
              key={job.id}
              onApply={handleApply}
              onCardClick={handleCardClick}
              onDetailClick={handleDetailClick}
              onOfferAction={(action) => void handleOfferAction(action)}
              showApplyButton={showApplyButton}
            />
          );
        })}
      </section>

      <StudentBottomNavigation
        activeTab="matching"
        bottomOffset={31}
        isFixed={isBottomNavigationFixed}
        onTabChange={handleTabChange}
      />
      {matchingView === 'result' && isRefreshPopupOpen ? (
        <RecommendationRefreshModal
          isSubmitting={isRecommendationRefreshing}
          onConfirm={handleRecommendationRefreshConfirm}
        />
      ) : null}
      {isResidenceExpired ? (
        <ResidenceExpiredModal
          onBack={handleBack}
          onUpdate={() => onResidenceUpdate?.()}
        />
      ) : null}
    </main>
  );
}
