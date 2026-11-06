import type { JobPostingListItem } from '../../types/jobPosting';
import {
  formatJobPostingSummary,
  getSeoulTodayIsoDate,
} from '../../utils/jobPosting';

interface EmployerJobCardProps {
  job: JobPostingListItem;
  onViewApplicants: (job: JobPostingListItem) => void;
  onEdit: (job: JobPostingListItem) => void;
  onClose: (job: JobPostingListItem) => void;
}

function getDeadlineLabel(deadline: string | null) {
  if (!deadline) return '마감일 미입력';
  const today = new Date(`${getSeoulTodayIsoDate()}T00:00:00Z`);
  const deadlineDate = new Date(`${deadline}T00:00:00Z`);
  const days = Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000),
  );
  return days >= 0 ? `마감 D-${days}` : '마감일 경과';
}

function EmployerJobCard({
  job,
  onViewApplicants,
  onEdit,
  onClose,
}: EmployerJobCardProps) {
  const isRecruiting = job.status === 'RECRUITING';
  const isDraft = job.status === 'DRAFT';
  const statusLabel = isDraft
    ? '임시 저장'
    : isRecruiting
      ? getDeadlineLabel(job.applicationDeadlineDate)
      : '마감';

  return (
    <article className="flex min-h-24 items-center justify-between gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)]">
      <div className="flex min-w-0 items-center gap-[22px]">
        <div
          aria-hidden="true"
          className="size-12 shrink-0 rounded-full bg-[#e1e2e4]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl leading-normal font-semibold text-[#171719]">
              {job.jobRole ?? '직무 미입력'}
            </h2>
            <span className="flex h-[23px] items-center rounded-md bg-[#f2f3f5] px-1.5 text-xs font-semibold whitespace-nowrap text-[#70737c]">
              {statusLabel}
            </span>
          </div>
          <p
            className={`mt-1 font-semibold ${isRecruiting ? 'text-base text-[#8b8888]' : 'text-sm text-[#70737c]'}`}
          >
            {formatJobPostingSummary(job)}
          </p>
        </div>
      </div>

      {job.status !== 'CLOSED' && (
        <div className="flex shrink-0 items-center gap-2.5 pr-5">
          {isRecruiting && (
            <button
              type="button"
              onClick={() => onViewApplicants(job)}
              className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-2.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
            >
              지원자
            </button>
          )}
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
          >
            {isDraft ? '이어서 작성' : '수정'}
          </button>
          {isRecruiting && (
            <button
              type="button"
              onClick={() => onClose(job)}
              className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5]"
            >
              모집 마감
            </button>
          )}
        </div>
      )}
    </article>
  );
}

export default EmployerJobCard;
