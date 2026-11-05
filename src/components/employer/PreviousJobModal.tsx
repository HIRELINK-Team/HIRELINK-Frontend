import type {
  JobPostingListItem,
  JobPostingStatus,
} from '../../types/jobPosting';
import { formatJobPostingSummary } from '../../utils/jobPosting';

interface PreviousJobModalProps {
  jobs: JobPostingListItem[];
  selectedJobId: number | null;
  onSelect: (jobId: number) => void;
  onCancel: () => void;
  onLoad: () => void;
}

const STATUS_LABELS: Record<JobPostingStatus, string> = {
  RECRUITING: '모집중',
  CLOSED: '마감',
  DRAFT: '임시 저장',
};

function PreviousJobModal({
  jobs,
  selectedJobId,
  onSelect,
  onCancel,
  onLoad,
}: PreviousJobModalProps) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/55 p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="previous-job-modal-title"
    >
      <div className="w-full max-w-[560px] rounded-2xl bg-white px-8 pt-8 pb-8 shadow-[0_8px_12px_rgba(23,23,26,0.14),0_2px_3px_rgba(23,23,26,0.06)]">
        <h2
          id="previous-job-modal-title"
          className="text-[22px] leading-normal font-semibold text-[#171719]"
        >
          이전 공고 불러오기
        </h2>
        <p className="mt-1.5 text-sm leading-normal font-normal text-[#70737c]">
          불러올 공고를 선택해주세요
        </p>

        <div
          className="mt-4 space-y-[11px]"
          role="radiogroup"
          aria-label="이전 공고"
        >
          {jobs.map((job) => {
            const isSelected = job.jobPostingId === selectedJobId;
            const statusTextClass =
              job.status === 'RECRUITING' ? 'text-[#007a63]' : 'text-[#70737c]';

            return (
              <button
                key={job.jobPostingId}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(job.jobPostingId)}
                className={`flex h-[82px] w-full cursor-pointer items-center rounded-xl bg-white px-5 text-left transition-colors ${
                  isSelected
                    ? 'border-[1.5px] border-[#00b894]'
                    : 'border border-[#e1e2e4] hover:border-[#9fded3]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? 'border-[#00b894]' : 'border-[#70737c]'
                  }`}
                >
                  {isSelected && (
                    <span className="size-2.5 rounded-full bg-[#00b894]" />
                  )}
                </span>
                <span className="ml-5 flex min-w-0 flex-1 items-center justify-between gap-4">
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="flex items-center gap-2.5">
                      <span className="text-lg leading-normal font-semibold text-[#171719]">
                        {job.jobRole ?? '직무 미입력'}
                      </span>
                      <span
                        className={`flex items-center gap-[5px] text-xs font-normal whitespace-nowrap ${statusTextClass}`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {STATUS_LABELS[job.status]}
                      </span>
                    </span>
                    <span className="text-sm leading-normal font-medium text-[#70737c]">
                      {formatJobPostingSummary(job)}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm leading-normal font-normal text-[#8b95a1]">
                    등록 {job.createdAt.slice(0, 10).replaceAll('-', '.')}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-7 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-[rgba(112,115,124,0.32)] bg-white px-6 text-base font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onLoad}
            className="flex h-12 cursor-pointer items-center justify-center rounded-xl bg-[#00b894] px-6 text-base font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
          >
            불러오기
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreviousJobModal;
