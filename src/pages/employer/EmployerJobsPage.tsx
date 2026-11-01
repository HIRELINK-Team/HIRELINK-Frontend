import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import EmployerJobCard from "../../components/employer/EmployerJobCard";
import JobStatusTabs, {
  type JobStatusFilter,
} from "../../components/employer/JobStatusTabs";
import PreviousJobModal from "../../components/employer/PreviousJobModal";
import type { EmployerJobMock, PreviousJobMock } from "../../types/employerJob";

const INITIAL_JOB_MOCKS: EmployerJobMock[] = [
  {
    id: "barista-open",
    title: "바리스타",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "OPEN",
    deadlineLabel: "마감 D-22",
    applicantCount: 3,
    applicantCapacity: 5,
  },
  {
    id: "server-open",
    title: "서버",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "OPEN",
    deadlineLabel: "마감 D-22",
    applicantCount: 5,
    applicantCapacity: 5,
  },
  {
    id: "barista-closed",
    title: "바리스타",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "CLOSED",
  },
];

const PREVIOUS_JOB_MOCKS: PreviousJobMock[] = [
  {
    id: "previous-barista-open",
    title: "바리스타",
    wageAndSchedule: "시급 13,000원 월수금 12-14",
    status: "OPEN",
    registeredAt: "2026.01.01",
  },
  {
    id: "previous-server-closed",
    title: "서버",
    wageAndSchedule: "시급 13,000원 월수금 16-22",
    status: "CLOSED",
    registeredAt: "2025.12.24",
  },
  {
    id: "previous-barista-draft",
    title: "바리스타",
    wageAndSchedule: "시급 13,000원 월수금 12-14",
    status: "DRAFT",
    registeredAt: "2026.01.01",
  },
];

function EmployerJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EmployerJobMock[]>(INITIAL_JOB_MOCKS);
  const [selectedFilter, setSelectedFilter] = useState<JobStatusFilter>("ALL");
  const [isNewJobMenuOpen, setIsNewJobMenuOpen] = useState(false);
  const [jobToClose, setJobToClose] = useState<EmployerJobMock | null>(null);
  const [isPreviousJobModalOpen, setIsPreviousJobModalOpen] = useState(false);
  const [selectedPreviousJobId, setSelectedPreviousJobId] = useState(
    PREVIOUS_JOB_MOCKS[0].id,
  );
  const [closedJobTitle, setClosedJobTitle] = useState<string | null>(null);

  const jobCounts = useMemo(
    () => ({
      ALL: jobs.length,
      OPEN: jobs.filter((job) => job.status === "OPEN").length,
      CLOSED: jobs.filter((job) => job.status === "CLOSED").length,
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    if (selectedFilter === "ALL") {
      return jobs;
    }

    return jobs.filter((job) => job.status === selectedFilter);
  }, [jobs, selectedFilter]);

  const handleViewApplicants = (job: EmployerJobMock) => {
    navigate(`/employer/jobs/${job.id}/applicants`);
  };

  const handleEditJob = (job: EmployerJobMock) => {
    navigate(`/employer/jobs/${job.id}/edit`);
  };

  const handleCloseJob = (job: EmployerJobMock) => {
    setJobToClose(job);
  };

  const handleConfirmClose = () => {
    if (!jobToClose) {
      return;
    }

    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobToClose.id ? { ...job, status: "CLOSED" } : job,
      ),
    );
    setClosedJobTitle(jobToClose.title);
    setJobToClose(null);
  };

  const handleOpenNewJobMenu = () => {
    setIsNewJobMenuOpen((isOpen) => !isOpen);
  };

  const handleCreateNewJob = () => {
    setIsNewJobMenuOpen(false);
    navigate("/employer/jobs/new");
  };

  const handleOpenPreviousJobModal = () => {
    setIsNewJobMenuOpen(false);
    setIsPreviousJobModalOpen(true);
  };

  const handleLoadPreviousJob = () => {
    const selectedPreviousJob = PREVIOUS_JOB_MOCKS.find(
      (job) => job.id === selectedPreviousJobId,
    );

    setIsPreviousJobModalOpen(false);
    navigate("/employer/jobs/new", {
      state: { previousJob: selectedPreviousJob },
    });
  };

  return (
    <div className="pb-10 pt-10">
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
            onClick={handleOpenNewJobMenu}
            aria-expanded={isNewJobMenuOpen}
            aria-controls="new-job-menu"
            className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-xl bg-[#00b894] px-6 text-base font-semibold whitespace-nowrap text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
          >
            새 공고 등록
          </button>

          {isNewJobMenuOpen && (
            <div
              id="new-job-menu"
              className="absolute top-14 right-0 z-10 w-50 overflow-hidden rounded-xl border border-[rgba(112,115,124,0.22)] bg-white p-4 shadow-[0_4px_6px_-1px_rgba(23,23,23,0.1)]"
            >
              <button
                type="button"
                onClick={handleCreateNewJob}
                className="flex w-full cursor-pointer px-1 py-0.5 text-left text-base font-medium text-[#171719] transition-colors hover:text-[#007a63]"
              >
                새로 작성하기
              </button>
              <div className="my-[11px] h-px bg-[#e1e2e4]" />
              <button
                type="button"
                onClick={handleOpenPreviousJobModal}
                className="flex w-full cursor-pointer px-1 py-0.5 text-left text-base font-medium text-[#171719] transition-colors hover:text-[#007a63]"
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
        {filteredJobs.map((job) => (
          <EmployerJobCard
            key={job.id}
            job={job}
            onViewApplicants={handleViewApplicants}
            onEdit={handleEditJob}
            onClose={handleCloseJob}
          />
        ))}
      </section>

      {jobToClose && (
        <ConfirmModal
          title="모집을 마감할까요?"
          cancelLabel="취소"
          confirmLabel="모집 마감"
          onCancel={() => setJobToClose(null)}
          onConfirm={handleConfirmClose}
        >
          <p className="mt-5 flex h-[35px] items-center overflow-hidden rounded-md bg-[#f2f3f5] px-2.5 text-[13px] font-semibold whitespace-nowrap text-[#171719]">
            {jobToClose.title}·{jobToClose.wageAndSchedule.replace(" · ", "·")}
          </p>
          <div className="mt-[14px] text-base text-[#70737c]">
            <p className="leading-6 font-semibold text-[#e11e1e]">
              마감된 공고는 되돌릴 수 없어요
            </p>
            <p className="leading-[22px] font-normal">
              새 지원을 받지 않고, 추천 목록에서도 빠져요
            </p>
            <p className="leading-[22px] font-normal">
              이미 지원한 유학생은 계속 관리할 수 있어요
            </p>
          </div>
        </ConfirmModal>
      )}

      {isPreviousJobModalOpen && (
        <PreviousJobModal
          jobs={PREVIOUS_JOB_MOCKS}
          selectedJobId={selectedPreviousJobId}
          onSelect={setSelectedPreviousJobId}
          onCancel={() => setIsPreviousJobModalOpen(false)}
          onLoad={handleLoadPreviousJob}
        />
      )}

      {closedJobTitle && (
        <div
          role="status"
          className="fixed bottom-10 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-[#d8d8d8] px-[79px] py-[9px] text-center text-sm font-medium text-black"
        >
          {closedJobTitle} 공고를 마감했어요
        </div>
      )}
    </div>
  );
}

export default EmployerJobsPage;
