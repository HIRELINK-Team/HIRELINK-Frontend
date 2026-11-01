import PhoneNumber from "./PhoneNumber";
import type { EmployerApplicantMock } from "../../types/application";

interface EmployerHiredStudentRowProps {
  applicant: EmployerApplicantMock;
  jobSummary: string;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (applicationId: string) => void;
  onViewDetails: (applicationId: string) => void;
}

function EmployerHiredStudentRow({
  applicant,
  jobSummary,
  isSelectionMode,
  isSelected,
  onSelect,
  onViewDetails,
}: EmployerHiredStudentRowProps) {
  const hasExpiryWarning =
    applicant.hiredDetails?.hasQualificationExpiryWarning === true;

  return (
    <article
      className={`grid min-h-24 w-full items-center gap-4 rounded-xl border bg-white px-6 py-4 shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)] transition-colors ${
        isSelected
          ? "border-[#008f73] bg-[#f4fbf9]"
          : "border-[rgba(112,115,124,0.16)]"
      } ${
        isSelectionMode
          ? "grid-cols-[20px_48px_minmax(180px,1fr)_220px_auto]"
          : "grid-cols-[48px_minmax(180px,1fr)_220px_auto]"
      }`}
    >
      {isSelectionMode && (
        <button
          type="button"
          onClick={() => onSelect(applicant.id)}
          aria-label={`${applicant.name} 선택`}
          aria-pressed={isSelected}
          className={`flex size-5 cursor-pointer items-center justify-center rounded-[5px] border transition-colors ${
            isSelected
              ? "border-[#008f73] bg-[#008f73] text-white"
              : "border-[#aeb4bc] bg-white text-transparent"
          }`}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
            <path
              d="m3.5 8 3 3 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <div aria-hidden="true" className="size-12 rounded-full bg-[#e1e2e4]" />

      <div className="min-w-0">
        <h2 className="truncate text-xl font-semibold text-[#171719]">
          {applicant.name}
        </h2>
        <p className="mt-1 truncate text-sm font-semibold text-[#70737c]">
          {jobSummary}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[13px] text-[#70737c]">전화번호</p>
        <PhoneNumber
          value={applicant.phoneNumber ?? "-"}
          className="mt-0.5 text-base font-bold text-[#171719]"
        />
      </div>

      <div className="flex items-center justify-end gap-6">
        {hasExpiryWarning && (
          <span className="shrink-0 text-xs font-medium text-[#c13c2d]">
            ⓘ 만료 임박
          </span>
        )}
        <button
          type="button"
          onClick={() => onViewDetails(applicant.id)}
          disabled={isSelectionMode}
          className="flex h-8 w-[104px] cursor-pointer items-center justify-center rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium whitespace-nowrap text-[#171719] transition-colors hover:bg-[#f4f4f5] disabled:cursor-default disabled:bg-[#f7f7f8] disabled:text-[#aeb4bc]"
        >
          유학생 상세
        </button>
      </div>
    </article>
  );
}

export default EmployerHiredStudentRow;
