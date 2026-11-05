import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmModal from '../../components/common/ConfirmModal';
import EmployerJobCard from '../../components/employer/EmployerJobCard';
import JobStatusTabs, {
  type JobStatusFilter,
} from '../../components/employer/JobStatusTabs';
import PreviousJobModal from '../../components/employer/PreviousJobModal';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import type { JobPostingListItem } from '../../types/jobPosting';
import { formatJobPostingSummary } from '../../utils/jobPosting';

interface JobsRouteState {
  feedback?: string;
}

function getCloseErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 409) {
    return apiError?.code === 'JOB_POSTING_STATE_CONFLICT'
      ? '이미 마감됐거나 모집 중이 아닌 공고예요.'
      : (apiError?.message ?? '현재 공고 상태에서는 마감할 수 없어요.');
  }
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '공고를 마감할 권한이 없습니다.';
  if (status === 404) return '마감할 공고를 찾지 못했습니다.';
  return apiError?.message ?? '공고를 마감하지 못했습니다.';
}

function EmployerJobsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jobs, loadJobs, closeJob } = useEmployerJobs();
  const [selectedFilter, setSelectedFilter] = useState<JobStatusFilter>('ALL');
  const [isNewJobMenuOpen, setIsNewJobMenuOpen] = useState(false);
  const [jobToClose, setJobToClose] = useState<JobPostingListItem | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isPreviousJobModalOpen, setIsPreviousJobModalOpen] = useState(false);
  const [selectedPreviousJobId, setSelectedPreviousJobId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(
    (location.state as JobsRouteState | null)?.feedback ?? null,
  );

  useEffect(() => {
    let isActive = true;
    loadJobs()
      .catch(() => {
        if (isActive) setLoadError('채용공고를 불러오지 못했어요.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [loadJobs]);

  useEffect(() => {
    if (!feedback) return;
    const timeoutId = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  const jobCounts = useMemo(
    () => ({
      ALL: jobs.length,
      RECRUITING: jobs.filter((job) => job.status === 'RECRUITING').length,
      CLOSED: jobs.filter((job) => job.status === 'CLOSED').length,
    }),
    [jobs],
  );

  const filteredJobs = useMemo(
    () =>
      selectedFilter === 'ALL'
        ? jobs
        : jobs.filter((job) => job.status === selectedFilter),
    [jobs, selectedFilter],
  );

  const handleConfirmClose = async () => {
    if (!jobToClose || isClosing) return;
    setIsClosing(true);
    try {
      await closeJob(jobToClose.jobPostingId);
      setFeedback(`${jobToClose.jobRole ?? '채용'} 공고를 마감했어요.`);
      setJobToClose(null);
    } catch (error: unknown) {
      setFeedback(getCloseErrorMessage(error));
    } finally {
      setIsClosing(false);
    }
  };

  const handleOpenPreviousJobModal = () => {
    setIsNewJobMenuOpen(false);
    setSelectedPreviousJobId(jobs[0]?.jobPostingId ?? null);
    setIsPreviousJobModalOpen(true);
  };

  const handleLoadPreviousJob = () => {
    if (selectedPreviousJobId === null) return;
    setIsPreviousJobModalOpen(false);
    navigate('/employer/jobs/new', {
      state: { previousJobId: selectedPreviousJobId },
    });
  };

  return (
    <div className="pt-10 pb-10">
      <header className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
            채용공고 관리
          </h1>
          <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
            공고별 활성 지원자의 모집 상태를 관리합니다
          </p>
        </div>
        <div className="relative mt-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsNewJobMenuOpen((isOpen) => !isOpen)}
            className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl bg-[#00b894] px-6 text-base font-semibold text-white"
          >
            새 공고 등록
          </button>
          {isNewJobMenuOpen && (
            <div className="absolute top-14 right-0 z-10 w-50 overflow-hidden rounded-xl border border-[rgba(112,115,124,0.22)] bg-white p-4 shadow-[0_4px_6px_-1px_rgba(23,23,23,0.1)]">
              <button
                type="button"
                onClick={() => navigate('/employer/jobs/new')}
                className="flex w-full cursor-pointer px-1 py-0.5 text-left text-base font-medium"
              >
                새로 작성하기
              </button>
              <div className="my-[11px] h-px bg-[#e1e2e4]" />
              <button
                type="button"
                onClick={handleOpenPreviousJobModal}
                disabled={jobs.length === 0}
                className="flex w-full cursor-pointer px-1 py-0.5 text-left text-base font-medium disabled:cursor-not-allowed disabled:text-[#8b95a1]"
              >
                이전 공고 불러오기
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="mt-[41px]">
        <JobStatusTabs
          selectedFilter={selectedFilter}
          counts={jobCounts}
          onChange={setSelectedFilter}
        />
      </div>

      <section className="mt-[15px] space-y-3" aria-label="채용공고 목록">
        {isLoading ? (
          <p className="rounded-xl bg-white py-12 text-center text-[#70737c]">
            채용공고를 불러오는 중이에요.
          </p>
        ) : loadError ? (
          <p
            role="alert"
            className="rounded-xl bg-white py-12 text-center text-[#e11e1e]"
          >
            {loadError}
          </p>
        ) : filteredJobs.length === 0 ? (
          <p className="rounded-xl bg-white py-12 text-center text-[#70737c]">
            해당 상태의 채용공고가 없어요.
          </p>
        ) : (
          filteredJobs.map((job) => (
            <EmployerJobCard
              key={job.jobPostingId}
              job={job}
              onViewApplicants={(selectedJob) =>
                navigate(
                  `/employer/jobs/${selectedJob.jobPostingId}/applicants`,
                )
              }
              onEdit={(selectedJob) =>
                navigate(`/employer/jobs/${selectedJob.jobPostingId}/edit`)
              }
              onClose={setJobToClose}
            />
          ))
        )}
      </section>

      {jobToClose && (
        <ConfirmModal
          title="모집을 마감할까요?"
          cancelLabel="취소"
          confirmLabel={isClosing ? '마감 중' : '모집 마감'}
          onCancel={() => {
            if (!isClosing) setJobToClose(null);
          }}
          onConfirm={handleConfirmClose}
        >
          <p className="mt-5 flex h-[35px] items-center overflow-hidden rounded-md bg-[#f2f3f5] px-2.5 text-[13px] font-semibold whitespace-nowrap text-[#171719]">
            {jobToClose.jobRole ?? '직무 미입력'} ·{' '}
            {formatJobPostingSummary(jobToClose)}
          </p>
          <div className="mt-[14px] text-base text-[#70737c]">
            <p className="leading-6 font-semibold text-[#e11e1e]">
              마감된 공고는 되돌릴 수 없어요
            </p>
            <p className="leading-[22px]">
              새 지원을 받지 않고, 추천 목록에서도 빠져요
            </p>
            <p className="leading-[22px]">
              이미 지원한 유학생은 계속 관리할 수 있어요
            </p>
          </div>
        </ConfirmModal>
      )}

      {isPreviousJobModalOpen && (
        <PreviousJobModal
          jobs={jobs}
          selectedJobId={selectedPreviousJobId}
          onSelect={setSelectedPreviousJobId}
          onCancel={() => setIsPreviousJobModalOpen(false)}
          onLoad={handleLoadPreviousJob}
        />
      )}

      {feedback && (
        <button
          type="button"
          role="status"
          onClick={() => setFeedback(null)}
          className="fixed bottom-10 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-[#292a2d] px-6 py-3 text-sm font-medium text-white shadow-lg"
        >
          {feedback}
        </button>
      )}
    </div>
  );
}

export default EmployerJobsPage;
