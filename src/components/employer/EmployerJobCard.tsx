import type { EmployerJobMock } from "../../types/employerJob";

interface EmployerJobCardProps {
  job: EmployerJobMock;
  onViewApplicants: (job: EmployerJobMock) => void;
  onEdit: (job: EmployerJobMock) => void;
  onClose: (job: EmployerJobMock) => void;
}

function EmployerJobCard({
  job,
  onViewApplicants,
  onEdit,
  onClose,
}: EmployerJobCardProps) {
  const isOpen = job.status === "OPEN";
  const applicantLabel = `지원자(${job.applicantCount}/${job.applicantCapacity})`;

  return (
    <article className="flex h-24 items-center justify-between gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)]">
      <div className="flex min-w-0 items-center gap-[22px]">
        <div
          aria-hidden="true"
          className="size-12 shrink-0 rounded-full bg-[#e1e2e4]"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl leading-normal font-semibold text-[#171719]">
              {job.title}
            </h2>
            <span className="flex h-[23px] items-center rounded-md bg-[#f2f3f5] px-1.5 text-xs font-semibold whitespace-nowrap text-[#70737c]">
              {isOpen ? job.deadlineLabel : "마감"}
            </span>
          </div>
          <p
            className={`mt-1 font-semibold ${isOpen ? "text-base text-[#8b8888]" : "text-sm text-[#70737c]"}`}
          >
            {job.wageAndSchedule}
          </p>
        </div>
      </div>

      {isOpen && (
        <div className="flex shrink-0 items-center gap-2.5 pr-5">
          <button
            type="button"
            onClick={() => onViewApplicants(job)}
            className="flex h-8 w-24 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-2.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed]"
          >
            {applicantLabel}
          </button>
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="flex h-8 w-24 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed]"
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => onClose(job)}
            className="flex h-8 w-24 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3.5 text-sm font-medium text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed]"
          >
            모집 마감
          </button>
        </div>
      )}
    </article>
  );
}

export default EmployerJobCard;
