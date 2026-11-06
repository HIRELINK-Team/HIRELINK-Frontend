import type { EmployerMatchListItem } from '../../types/match';
import {
  formatApplicationDate,
  formatApplicationDateTime,
} from '../../utils/application';
import { formatWage } from '../../utils/jobPosting';

interface EmployerHiredStudentRowProps {
  match: EmployerMatchListItem;
  onViewDetails: (matchId: number) => void;
}

function ProfileImage({ match }: { match: EmployerMatchListItem }) {
  const profileImageUrl = match.student?.profileImageUrl;
  return profileImageUrl ? (
    <img
      src={profileImageUrl}
      alt=""
      className="size-12 rounded-full bg-[#e1e2e4] object-cover"
    />
  ) : (
    <div aria-hidden="true" className="size-12 rounded-full bg-[#e1e2e4]" />
  );
}

function EmployerHiredStudentRow({
  match,
  onViewDetails,
}: EmployerHiredStudentRowProps) {
  const studentName = match.student?.name ?? '유학생 정보 없음';
  const studentSummary = match.student
    ? [
        match.student.nationality,
        match.student.visaType,
        match.student.topikLevel === null
          ? null
          : `TOPIK ${match.student.topikLevel}급`,
      ]
        .filter(Boolean)
        .join(' · ')
    : '-';

  return (
    <article className="grid min-h-28 w-full grid-cols-[48px_minmax(180px,1.3fr)_minmax(180px,1fr)_160px_130px] items-center gap-5 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)]">
      <ProfileImage match={match} />

      <div className="min-w-0">
        <h2 className="truncate text-xl font-semibold text-[#171719]">
          {studentName}
        </h2>
        <p className="mt-1 truncate text-sm font-medium text-[#70737c]">
          {studentSummary}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-[#171719]">
          {match.jobTitle}
        </p>
        <p className="mt-1 truncate text-sm font-medium text-[#70737c]">
          {match.workplaceName} · {formatWage(match.wageType, match.wageAmount)}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-[13px] text-[#70737c]">희망 근무 시작일</p>
        <p className="mt-0.5 text-sm font-semibold text-[#171719]">
          {formatApplicationDate(match.desiredStartDate)}
        </p>
        <p className="mt-1 truncate text-xs text-[#8b95a1]">
          채용 완료 {formatApplicationDateTime(match.matchedAt)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onViewDetails(match.matchId)}
        className="flex h-8 w-[104px] cursor-pointer items-center justify-center justify-self-end rounded-lg border border-[rgba(112,115,124,0.32)] bg-white text-sm font-medium whitespace-nowrap text-[#171719] transition-colors hover:bg-[#f4f4f5]"
      >
        유학생 상세
      </button>
    </article>
  );
}

export default EmployerHiredStudentRow;
