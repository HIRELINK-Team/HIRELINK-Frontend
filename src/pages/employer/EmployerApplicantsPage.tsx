import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SelectField from '../../components/common/SelectField';
import Toast from '../../components/common/Toast';
import ApplicantActionModal, {
  type ApplicantAction,
} from '../../components/employer/ApplicantActionModal';
import ApplicantStatusTabs, {
  type ApplicantStatusFilter,
} from '../../components/employer/ApplicantStatusTabs';
import EmployerApplicantRow, {
  APPLICANT_ROW_GRID,
  HIRED_APPLICANT_ROW_GRID,
} from '../../components/employer/EmployerApplicantRow';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerApplicants } from '../../hooks/useEmployerApplicants';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import type {
  EmployerApplicationListItem,
  EmployerApplicationListStatus,
} from '../../types/application';
import type { JobPostingListItem } from '../../types/jobPosting';
import { formatJobPostingSummary } from '../../utils/jobPosting';

const FILTER_STATUS: Partial<
  Record<ApplicantStatusFilter, EmployerApplicationListStatus>
> = {
  REVIEWING: 'WAITING_RESPONSE',
  OFFER_WAITING: 'OFFERED',
  HIRED: 'COMPLETED',
};

const APPLICATION_POLL_INTERVAL_MS = 7000;

interface PendingAction {
  type: ApplicantAction;
  applicant: EmployerApplicationListItem;
}

function formatJobOption(job: JobPostingListItem) {
  return `${job.jobRole ?? '직무 미입력'}·${formatJobPostingSummary(job)}`;
}

function getApplicationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 409)
    return apiError?.message ?? '이미 처리됐거나 응답기한이 지난 지원이에요.';
  if (status === 400)
    return apiError?.message ?? '지원자 상태를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '지원자를 관리할 권한이 없습니다.';
  if (status === 404) return '지원자 또는 채용공고를 찾지 못했습니다.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '요청을 처리하지 못했습니다.';
}

function ApplicantTableHeader({ isCompleted }: { isCompleted: boolean }) {
  const labels = isCompleted
    ? ['', '이름', '국적', '비자', '희망 시작일', '상태', '관리']
    : ['', '이름', '국적', '비자', '공고 일치율', '남은 시간', '관리'];

  return (
    <div
      className={`grid h-8 w-full items-center rounded-lg bg-[#f7f7f8] px-[23px] text-center text-sm font-semibold text-[#171719] ${isCompleted ? HIRED_APPLICANT_ROW_GRID : APPLICANT_ROW_GRID}`}
      role="row"
    >
      {labels.map((label, index) => (
        <span
          key={`${label}-${index}`}
          className={index === labels.length - 1 ? 'pl-6 text-left' : ''}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function EmployerApplicantsPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { jobs, loadJobs } = useEmployerJobs();
  const {
    applicationLists,
    mutatingApplicationIds,
    loadApplicationList,
    offerApplication,
    rejectApplication,
  } = useEmployerApplicants();
  const routeJobId = Number(jobId);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    Number.isInteger(routeJobId) ? routeJobId : null,
  );
  const [selectedFilter, setSelectedFilter] =
    useState<ApplicantStatusFilter>('REVIEWING');
  const [isJobSelectOpen, setIsJobSelectOpen] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isApplicantMutationPending =
    isConfirmingAction || mutatingApplicationIds.length > 0;
  const isApplicantMutationPendingRef = useRef(isApplicantMutationPending);

  const selectableJobs = useMemo(
    () => jobs.filter((job) => job.status !== 'DRAFT'),
    [jobs],
  );

  useEffect(() => {
    let isActive = true;
    loadJobs()
      .then((loadedJobs) => {
        if (!isActive) return;
        const availableJobs = loadedJobs.filter(
          (job) => job.status !== 'DRAFT',
        );
        const requestedJobId = Number(jobId);
        const nextJob = availableJobs.find(
          (job) => job.jobPostingId === requestedJobId,
        );
        const nextJobId =
          nextJob?.jobPostingId ?? availableJobs[0]?.jobPostingId;
        setSelectedJobId(nextJobId ?? null);
        if (nextJobId && nextJobId !== requestedJobId) {
          navigate(`/employer/jobs/${nextJobId}/applicants`, { replace: true });
        }
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(getApplicationErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoadingJobs(false);
      });
    return () => {
      isActive = false;
    };
  }, [jobId, loadJobs, navigate]);

  useEffect(() => {
    isApplicantMutationPendingRef.current = isApplicantMutationPending;
  }, [isApplicantMutationPending]);

  useEffect(() => {
    if (selectedJobId === null) return;

    let isActive = true;
    let isRequestPending = false;

    const refetchApplicationList = () => {
      if (
        !isActive ||
        isRequestPending ||
        isApplicantMutationPendingRef.current ||
        document.visibilityState !== 'visible'
      ) {
        return;
      }

      isRequestPending = true;
      void loadApplicationList(selectedJobId, true)
        .then(() => {
          if (isActive) setLoadError(null);
        })
        .catch((error: unknown) => {
          if (isActive) setLoadError(getApplicationErrorMessage(error));
        })
        .finally(() => {
          isRequestPending = false;
        });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refetchApplicationList();
      }
    };

    const handleWindowFocus = () => {
      refetchApplicationList();
    };

    refetchApplicationList();
    const intervalId = window.setInterval(
      refetchApplicationList,
      APPLICATION_POLL_INTERVAL_MS,
    );
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [loadApplicationList, selectedJobId]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const applicationList =
    selectedJobId === null ? undefined : applicationLists[selectedJobId];
  const counts = useMemo<Record<ApplicantStatusFilter, number>>(
    () => ({
      ALL: applicationList?.applications.length ?? 0,
      REVIEWING: applicationList?.waitingResponseCount ?? 0,
      OFFER_WAITING: applicationList?.offeredCount ?? 0,
      HIRED: applicationList?.completedCount ?? 0,
    }),
    [applicationList],
  );
  const filteredApplicants = useMemo(() => {
    const applications = applicationList?.applications ?? [];
    const status = FILTER_STATUS[selectedFilter];
    return status
      ? applications.filter((application) => application.status === status)
      : applications;
  }, [applicationList, selectedFilter]);
  const isReviewCapacityVisible =
    selectedFilter === 'ALL' || selectedFilter === 'REVIEWING';
  const isReviewCapacityFull = Boolean(
    applicationList &&
    applicationList.occupiedCount >= applicationList.capacity,
  );
  const selectedJob = selectableJobs.find(
    (job) => job.jobPostingId === selectedJobId,
  );
  const isLoadingApplications =
    selectedJobId !== null && !applicationList && !loadError;

  const handleJobChange = (nextJobId: string) => {
    const numericJobId = Number(nextJobId);
    setSelectedJobId(numericJobId);
    setSelectedFilter('REVIEWING');
    setIsJobSelectOpen(false);
    setLoadError(null);
    navigate(`/employer/jobs/${numericJobId}/applicants`, { replace: true });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || isConfirmingAction || selectedJobId === null) return;
    const { applicant, type } = pendingAction;
    setIsConfirmingAction(true);
    try {
      if (type === 'OFFER') {
        await offerApplication(applicant.applicationId, selectedJobId);
        setToastMessage(
          `${applicant.applicantName}님에게 채용제안을 보냈어요. 24시간 안에 응답을 기다려요`,
        );
      } else {
        await rejectApplication(applicant.applicationId, selectedJobId);
        setToastMessage(`${applicant.applicantName}님의 지원을 거절했어요.`);
      }
      setPendingAction(null);
    } catch (error: unknown) {
      setToastMessage(getApplicationErrorMessage(error));
    } finally {
      setIsConfirmingAction(false);
    }
  };

  return (
    <div className="w-full max-w-[970px] pt-10 pb-12">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          지원자 관리
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          우리 공고와 지원자의 조건을 함께 살펴보세요
        </p>
      </header>

      <div className="relative mt-7 w-[360px] max-w-full">
        <SelectField
          value={selectedJobId === null ? '' : String(selectedJobId)}
          options={selectableJobs.map((job) => ({
            value: String(job.jobPostingId),
            label: formatJobOption(job),
          }))}
          placeholder={
            isLoadingJobs ? '공고를 불러오는 중이에요' : '공고를 선택해 주세요'
          }
          ariaLabel="관리할 채용공고"
          isOpen={isJobSelectOpen}
          onOpenChange={setIsJobSelectOpen}
          onChange={handleJobChange}
          variant="compact"
        />
      </div>

      <div className="mt-6 flex w-full items-end justify-between gap-6">
        <ApplicantStatusTabs
          selectedFilter={selectedFilter}
          counts={counts}
          onChange={setSelectedFilter}
        />
        {isReviewCapacityVisible && applicationList && (
          <div className="flex shrink-0 items-end gap-3 whitespace-nowrap">
            <span className="text-sm text-[#70737c]">검토 정원</span>
            <strong
              className={`text-base font-medium ${isReviewCapacityFull ? 'text-[#ff4242]' : 'text-[#171719]'}`}
            >
              {applicationList.occupiedCount}/{applicationList.capacity}
            </strong>
          </div>
        )}
      </div>

      {isReviewCapacityVisible && isReviewCapacityFull && applicationList && (
        <p className="mt-3 flex items-center gap-1 text-sm font-medium text-[#e11e1e]">
          <span
            aria-hidden="true"
            className="flex size-3.5 items-center justify-center rounded-full border border-current text-[10px] leading-none"
          >
            !
          </span>
          검토 중이거나 수락을 기다리는 지원자가 {applicationList.capacity}
          명이에요. 자리를 비우면 새 지원자를 받을 수 있어요.
        </p>
      )}

      <section
        className={`w-full ${
          isReviewCapacityFull && isReviewCapacityVisible ? 'mt-3' : 'mt-4'
        }`}
        aria-label={`${selectedJob ? formatJobOption(selectedJob) : '선택 공고'} 지원자 목록`}
      >
        {selectedFilter !== 'ALL' && (
          <ApplicantTableHeader isCompleted={selectedFilter === 'HIRED'} />
        )}

        <div className={`${selectedFilter === 'ALL' ? '' : 'mt-4'} space-y-3`}>
          {filteredApplicants.map((applicant) => (
            <EmployerApplicantRow
              key={applicant.applicationId}
              applicant={applicant}
              isMutating={mutatingApplicationIds.includes(
                applicant.applicationId,
              )}
              onViewDetails={(selectedApplicant) => {
                if (
                  selectedApplicant.status === 'COMPLETED' &&
                  selectedApplicant.matchId !== null
                ) {
                  navigate(`/employer/hired/${selectedApplicant.matchId}`);
                  return;
                }
                navigate(
                  `/employer/applicants/${selectedApplicant.applicationId}`,
                );
              }}
              onReject={(selectedApplicant) =>
                setPendingAction({
                  type: 'REJECT',
                  applicant: selectedApplicant,
                })
              }
              onOffer={(selectedApplicant) =>
                setPendingAction({
                  type: 'OFFER',
                  applicant: selectedApplicant,
                })
              }
            />
          ))}
        </div>

        {(isLoadingJobs || isLoadingApplications) && (
          <div className="mt-4 flex h-32 items-center justify-center rounded-xl bg-white text-sm text-[#70737c]">
            지원자를 불러오는 중이에요.
          </div>
        )}
        {!isLoadingJobs && loadError && (
          <div
            role="alert"
            className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#e05260] text-sm text-[#e11e1e]"
          >
            {loadError}
          </div>
        )}
        {!isLoadingJobs &&
          !isLoadingApplications &&
          !loadError &&
          filteredApplicants.length === 0 && (
            <div className="mt-4 flex h-32 items-center justify-center rounded-xl border border-dashed border-[#c7cbd1] text-sm text-[#70737c]">
              해당 상태의 지원자가 없어요.
            </div>
          )}
      </section>

      {selectedFilter === 'OFFER_WAITING' && (
        <p className="mt-4 text-xs leading-[18px] text-[#8b95a1]">
          채용제안은 개별로 철회할 수 없어요. 유학생이 24시간 안에 응답하지
          않으면 제안이 종료돼요.
        </p>
      )}
      {selectedFilter === 'HIRED' && (
        <p className="mt-4 text-xs leading-[18px] text-[#8b95a1]">
          연락처는 추후 채용 매칭 상세에서 확인할 수 있어요.
        </p>
      )}

      {pendingAction && (
        <ApplicantActionModal
          action={pendingAction.type}
          applicantName={pendingAction.applicant.applicantName}
          isSubmitting={isConfirmingAction}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerApplicantsPage;
