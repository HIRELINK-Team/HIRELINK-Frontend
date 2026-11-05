import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import progressLine from '../../assets/employer/progress-line.svg';
import ApplicantActionModal, {
  type ApplicantAction,
} from '../../components/employer/ApplicantActionModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import CountdownTimer from '../../components/common/CountdownTimer';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerApplicants } from '../../hooks/useEmployerApplicants';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import type { EmployerApplicantMock } from '../../types/application';
import type { JobPostingListItem } from '../../types/jobPosting';
import { formatJobPostingSummary } from '../../utils/jobPosting';

type DashboardView = 'openJobs' | 'reviewing' | 'pending';

type SummaryItem = {
  id: DashboardView;
  label: string;
  count: number;
  unit: '개' | '명';
};

const dashboardMockData: { summary: SummaryItem[] } = {
  summary: [
    { id: 'openJobs', label: '모집 중 공고', count: 1, unit: '개' },
    { id: 'reviewing', label: '검토 중 지원자', count: 1, unit: '명' },
    { id: 'pending', label: '수락 대기', count: 1, unit: '명' },
  ],
};

const hiringSteps = [
  { title: '공고 등록', description: '조건 작성' },
  { title: '지원, 제안', description: '지원 받기' },
  { title: '면접', description: '대면,전화' },
  { title: '채용 전 확인', description: '체크리스트' },
  { title: '허가 신청', description: '학교, 출입국' },
  { title: '근무 시작', description: '신고 안내' },
] as const;

function SummaryCard({
  item,
  selected,
  onSelect,
}: {
  item: SummaryItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`h-[120px] w-full cursor-pointer rounded-xl border px-[23px] py-[21px] text-left shadow-[0_1px_2px_-1px_rgba(23,23,23,0.1)] transition-colors ${
        selected
          ? 'border-[#2e6c5a] bg-[#e8f7f3]'
          : 'border-[rgba(112,115,124,0.08)] bg-white hover:border-[rgba(46,108,90,0.35)] hover:bg-[#f8fcfb]'
      }`}
    >
      <span className="block text-lg leading-normal font-medium text-[#70737c]">
        {item.label}
      </span>
      <span className="mt-3 flex items-end gap-1 text-[#171719]">
        <span className="text-4xl leading-normal font-semibold">
          {item.count}
        </span>
        <span className="mb-[6px] text-base leading-normal font-normal text-[#37383c]">
          {item.unit}
        </span>
      </span>
    </button>
  );
}

function OutlineButton({
  children,
  compact = false,
  onClick,
}: {
  children: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-8 w-24 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-[rgba(112,115,124,0.22)] bg-white px-3 font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed] ${compact ? 'text-xs' : 'text-sm'}`}
    >
      {children}
    </button>
  );
}

function JobList({
  jobs,
  onViewApplicants,
  onEdit,
  onClose,
}: {
  jobs: JobPostingListItem[];
  onViewApplicants: (job: JobPostingListItem) => void;
  onEdit: (job: JobPostingListItem) => void;
  onClose: (job: JobPostingListItem) => void;
}) {
  return (
    <section aria-labelledby="dashboard-list-title">
      <h2
        id="dashboard-list-title"
        className="text-lg leading-[21px] font-semibold text-black"
      >
        모집 중 공고
      </h2>
      <div className="mt-[13px] flex flex-col gap-1.5">
        {jobs.map((job) => (
          <article
            key={job.jobPostingId}
            className="flex h-[104px] items-center justify-between gap-6 rounded-xl border border-[rgba(112,115,124,0.08)] bg-white px-6 shadow-[0_1px_2px_-1px_rgba(23,23,23,0.1)]"
          >
            <div className="flex min-w-0 items-center gap-[22px]">
              <div
                aria-hidden="true"
                className="size-12 rounded-full bg-[#e1e2e4]"
              />
              <div className="min-w-0">
                <div className="flex items-start gap-2">
                  <h3 className="text-[22px] leading-[26px] font-semibold text-black">
                    {job.jobRole ?? '직무 미입력'}
                  </h3>
                  <span className="flex h-[23px] items-center rounded-md bg-[#f4f4f5] px-1.5 text-[10px] font-semibold text-black">
                    모집 중
                  </span>
                </div>
                <p className="mt-1 text-sm leading-[17px] font-semibold text-[#8b8888]">
                  {formatJobPostingSummary(job)}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5 pr-5">
              <OutlineButton compact onClick={() => onViewApplicants(job)}>
                지원자
              </OutlineButton>
              <OutlineButton compact onClick={() => onEdit(job)}>
                수정
              </OutlineButton>
              <OutlineButton compact onClick={() => onClose(job)}>
                모집 마감
              </OutlineButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ApplicantList({
  view,
  applicants,
  onViewDetail,
  onAction,
}: {
  view: Exclude<DashboardView, 'openJobs'>;
  applicants: EmployerApplicantMock[];
  onViewDetail: (applicant: EmployerApplicantMock) => void;
  onAction: (action: ApplicantAction, applicant: EmployerApplicantMock) => void;
}) {
  const isReviewing = view === 'reviewing';

  return (
    <section aria-labelledby="dashboard-list-title">
      <h2
        id="dashboard-list-title"
        className="text-lg leading-[21px] font-semibold text-black"
      >
        {isReviewing ? '검토 중 지원자' : '수락 대기'}
      </h2>
      <div className="mt-[7px] grid h-8 grid-cols-[56px_repeat(5,minmax(64px,104px))_minmax(322px,1fr)] items-center rounded-lg bg-[#f7f7f8] px-2 text-center text-xs font-semibold text-[#171719] xl:grid-cols-[80px_repeat(5,104px)_1fr] xl:px-6">
        <span aria-hidden="true" />
        <span>이름</span>
        <span>국적</span>
        <span>비자</span>
        <span>공고 일치율</span>
        <span>남은 시간</span>
        <span className="ml-[18px] flex w-24 justify-center">관리</span>
      </div>
      {applicants.map((applicant) => (
        <article
          key={applicant.id}
          className="mt-[15px] grid h-24 grid-cols-[56px_repeat(5,minmax(64px,104px))_minmax(322px,1fr)] items-center rounded-xl border border-[rgba(112,115,124,0.08)] bg-white px-2 text-center shadow-[0_1px_2px_-1px_rgba(23,23,23,0.1)] xl:grid-cols-[80px_repeat(5,104px)_1fr] xl:px-6"
        >
          <div
            aria-hidden="true"
            className="size-12 rounded-full bg-[#e1e2e4]"
          />
          <strong className="text-xl font-semibold text-[#171719]">
            {applicant.name}
          </strong>
          <span className="text-base font-medium text-[#70737c]">
            {applicant.nationality}
          </span>
          <span className="text-base font-medium text-[#70737c]">
            {applicant.visa}
          </span>
          <span className="text-xl font-medium text-[#d97706]">
            {applicant.matchRate}%
          </span>
          <div className="text-xl font-medium text-[#171719]">
            {applicant.expiresAt ? (
              <CountdownTimer expiresAt={applicant.expiresAt} />
            ) : (
              '-'
            )}
          </div>
          <div className="ml-[18px] flex items-center gap-2">
            <OutlineButton onClick={() => onViewDetail(applicant)}>
              상세
            </OutlineButton>
            {isReviewing && (
              <>
                <OutlineButton onClick={() => onAction('REJECT', applicant)}>
                  채용 거절
                </OutlineButton>
                <button
                  type="button"
                  onClick={() => onAction('OFFER', applicant)}
                  className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg bg-[#00b894] px-3 text-xs font-medium text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
                >
                  채용 제안
                </button>
              </>
            )}
          </div>
        </article>
      ))}
    </section>
  );
}

function HiringProcess() {
  return (
    <section aria-labelledby="hiring-process-title">
      <h2
        id="hiring-process-title"
        className="text-lg leading-[21px] font-semibold text-black"
      >
        외국인 유학생 채용, 이렇게 진행돼요
      </h2>
      <div className="relative mt-3 h-[119px] rounded-xl border border-[rgba(112,115,124,0.08)] bg-white shadow-[0_1px_2px_-1px_rgba(23,23,23,0.1)]">
        <div className="absolute top-[37px] right-[6.5%] left-[6.4%] h-[2px] overflow-hidden">
          <img
            src={progressLine}
            alt=""
            width={845}
            height={1}
            className="block max-w-none"
          />
        </div>
        <ol className="absolute top-[22px] right-[17px] left-0 flex items-start justify-between">
          {hiringSteps.map((step, index) => (
            <li
              key={step.title}
              className="flex w-[92px] flex-col items-center text-center"
            >
              <span className="relative z-[1] flex size-[31px] items-center justify-center rounded-full border border-[#e1e2e4] bg-white text-[15px] font-semibold text-[#70737c]">
                {index + 1}
              </span>
              <strong className="mt-2 text-[15px] leading-[18px] font-semibold text-black">
                {step.title}
              </strong>
              <span className="mt-0.5 text-[13px] leading-4 font-medium text-[#7e7e7e]">
                {step.description}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function EmployerDashboard() {
  const navigate = useNavigate();
  const { jobs, loadJobs, closeJob } = useEmployerJobs();
  const { applicants, offerApplicant, rejectApplicant } =
    useEmployerApplicants();
  const openJobs = jobs.filter((job) => job.status === 'RECRUITING');
  const reviewingApplicants = applicants.filter(
    (applicant) => applicant.status === 'REVIEWING',
  );
  const pendingApplicants = applicants.filter(
    (applicant) => applicant.status === 'OFFER_WAITING',
  );
  const [selectedView, setSelectedView] = useState<DashboardView>('openJobs');
  const [jobToClose, setJobToClose] = useState<JobPostingListItem | null>(null);
  const [isClosingJob, setIsClosingJob] = useState(false);
  const [jobCloseError, setJobCloseError] = useState<string | null>(null);
  const [applicantAction, setApplicantAction] = useState<{
    action: ApplicantAction;
    applicant: EmployerApplicantMock;
  } | null>(null);

  useEffect(() => {
    void loadJobs().catch(() => undefined);
  }, [loadJobs]);

  const handleConfirmCloseJob = async () => {
    if (!jobToClose || isClosingJob) return;
    setIsClosingJob(true);
    setJobCloseError(null);
    try {
      await closeJob(jobToClose.jobPostingId);
      setJobToClose(null);
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const apiError = getApiErrorResponse(error);
      setJobCloseError(
        status === 409
          ? apiError?.code === 'JOB_POSTING_STATE_CONFLICT'
            ? '이미 마감됐거나 모집 중이 아닌 공고예요.'
            : (apiError?.message ?? '현재 공고 상태에서는 마감할 수 없어요.')
          : (apiError?.message ??
              '공고를 마감하지 못했어요. 잠시 후 다시 시도해 주세요.'),
      );
    } finally {
      setIsClosingJob(false);
    }
  };

  const handleApplicantActionConfirm = () => {
    if (!applicantAction) {
      return;
    }

    if (applicantAction.action === 'OFFER') {
      offerApplicant(applicantAction.applicant.id);
    } else {
      rejectApplicant(applicantAction.applicant.id);
    }

    setApplicantAction(null);
  };

  return (
    <div className="pb-10 pt-10">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          안녕하세요, 사장님!
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          필요한 조건에 맞는 유학생을 빠르게 만나보세요.
        </p>
      </header>

      <div
        className="mt-[43px] grid grid-cols-3 gap-4"
        aria-label="대시보드 요약"
      >
        {dashboardMockData.summary.map((item) => (
          <SummaryCard
            key={item.id}
            item={
              item.id === 'openJobs'
                ? { ...item, count: openJobs.length }
                : item.id === 'reviewing'
                  ? { ...item, count: reviewingApplicants.length }
                  : { ...item, count: pendingApplicants.length }
            }
            selected={selectedView === item.id}
            onSelect={() => setSelectedView(item.id)}
          />
        ))}
      </div>

      <div className="mt-[22px]">
        {selectedView === 'openJobs' ? (
          <JobList
            jobs={openJobs}
            onViewApplicants={(job) =>
              navigate(`/employer/jobs/${job.jobPostingId}/applicants`)
            }
            onEdit={(job) =>
              navigate(`/employer/jobs/${job.jobPostingId}/edit`)
            }
            onClose={(job) => {
              setJobCloseError(null);
              setJobToClose(job);
            }}
          />
        ) : (
          <ApplicantList
            view={selectedView}
            applicants={
              selectedView === 'reviewing'
                ? reviewingApplicants
                : pendingApplicants
            }
            onViewDetail={(applicant) =>
              navigate(`/employer/applicants/${applicant.id}`)
            }
            onAction={(action, applicant) =>
              setApplicantAction({ action, applicant })
            }
          />
        )}
      </div>

      <div className={selectedView === 'openJobs' ? 'mt-7' : 'mt-[41px]'}>
        <HiringProcess />
      </div>

      {jobToClose && (
        <ConfirmModal
          title="모집을 마감할까요?"
          cancelLabel="취소"
          confirmLabel={isClosingJob ? '마감 중' : '모집 마감'}
          onCancel={() => {
            if (!isClosingJob) setJobToClose(null);
          }}
          onConfirm={handleConfirmCloseJob}
        >
          <p className="mt-5 flex h-[35px] items-center overflow-hidden rounded-md bg-[#f2f3f5] px-2.5 text-[13px] font-semibold whitespace-nowrap text-[#171719]">
            {jobToClose.jobRole ?? '직무 미입력'} ·{' '}
            {formatJobPostingSummary(jobToClose)}
          </p>
          <div className="mt-[14px] text-base text-[#70737c]">
            <p className="leading-6 font-semibold text-[#e11e1e]">
              마감한 공고는 되돌릴 수 없어요
            </p>
            <p className="leading-[22px] font-normal">
              새 지원자를 받지 않고, 추천 목록에서도 빠져요
            </p>
            <p className="leading-[22px] font-normal">
              이미 지원한 유학생은 계속 관리할 수 있어요
            </p>
            {jobCloseError && (
              <p
                role="alert"
                className="mt-2 text-sm font-medium text-[#e11e1e]"
              >
                {jobCloseError}
              </p>
            )}
          </div>
        </ConfirmModal>
      )}

      {applicantAction && (
        <ApplicantActionModal
          action={applicantAction.action}
          applicantName={applicantAction.applicant.name}
          onCancel={() => setApplicantAction(null)}
          onConfirm={handleApplicantActionConfirm}
        />
      )}
    </div>
  );
}

export default EmployerDashboard;
