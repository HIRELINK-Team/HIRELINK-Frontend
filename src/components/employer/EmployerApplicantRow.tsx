import CountdownTimer from '../common/CountdownTimer';
import type { EmployerApplicationListItem } from '../../types/application';
import { formatApplicationDate } from '../../utils/application';

interface EmployerApplicantRowProps {
  applicant: EmployerApplicationListItem;
  isMutating?: boolean;
  onViewDetails: (applicant: EmployerApplicationListItem) => void;
  onReject: (applicant: EmployerApplicationListItem) => void;
  onOffer: (applicant: EmployerApplicationListItem) => void;
}

const APPLICANT_ROW_GRID =
  'grid-cols-[73px_104px_104px_104px_104px_104px_minmax(0,1fr)]';
const HIRED_APPLICANT_ROW_GRID =
  'grid-cols-[73px_104px_104px_104px_128px_160px_minmax(0,1fr)]';

function getMatchRateClassName(matchRate: number) {
  if (matchRate >= 80) return 'text-[#009e80]';
  if (matchRate >= 60) return 'text-[#d97706]';
  return 'text-[#ff4242]';
}

function ActionButton({
  children,
  onClick,
  disabled = false,
}: {
  children: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg border border-[rgba(112,115,124,0.32)] bg-white px-3 text-sm font-medium whitespace-nowrap text-[#171719] transition-colors hover:bg-[#f4f4f5] active:bg-[#e8eaed] disabled:cursor-not-allowed disabled:text-[#8b95a1]"
    >
      {children}
    </button>
  );
}

function ProfileImage({
  applicant,
}: {
  applicant: EmployerApplicationListItem;
}) {
  return applicant.profileImageUrl ? (
    <img
      src={applicant.profileImageUrl}
      alt=""
      className="size-12 rounded-full bg-[#e1e2e4] object-cover"
    />
  ) : (
    <div aria-hidden="true" className="size-12 rounded-full bg-[#e1e2e4]" />
  );
}

function EmployerApplicantRow({
  applicant,
  isMutating = false,
  onViewDetails,
  onReject,
  onOffer,
}: EmployerApplicantRowProps) {
  const isCompleted = applicant.status === 'COMPLETED';
  const isWaitingResponse = applicant.status === 'WAITING_RESPONSE';
  const deadline = isWaitingResponse
    ? applicant.employerResponseDeadline
    : applicant.studentResponseDeadline;

  if (isCompleted) {
    return (
      <article
        className={`grid h-24 w-full items-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-[23px] text-center shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)] ${HIRED_APPLICANT_ROW_GRID}`}
      >
        <ProfileImage applicant={applicant} />
        <strong className="text-lg font-semibold text-[#171719]">
          {applicant.applicantName}
        </strong>
        <span className="text-base font-medium text-[#70737c]">
          {applicant.nationality}
        </span>
        <span className="text-base font-medium text-[#70737c]">
          {applicant.visaType}
        </span>
        <span className="text-base font-normal text-[#70737c]">
          {formatApplicationDate(applicant.desiredStartDate)}
        </span>
        <span className="text-base font-medium text-[#007a63]">채용 완료</span>
        <div className="flex justify-start pl-6">
          <ActionButton onClick={() => onViewDetails(applicant)}>
            상세
          </ActionButton>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`grid h-24 w-full items-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-[23px] text-center shadow-[0_2px_4px_rgba(23,23,25,0.1),0_1px_1px_rgba(23,23,25,0.06)] ${APPLICANT_ROW_GRID}`}
    >
      <ProfileImage applicant={applicant} />
      <strong className="text-lg font-semibold text-[#171719]">
        {applicant.applicantName}
      </strong>
      <span className="text-base font-medium text-[#70737c]">
        {applicant.nationality}
      </span>
      <span className="text-base font-medium text-[#70737c]">
        {applicant.visaType}
      </span>
      <span
        className={`text-xl font-medium ${getMatchRateClassName(applicant.matchScore)}`}
      >
        {applicant.matchScore}%
      </span>
      {deadline ? (
        <CountdownTimer expiresAt={deadline} />
      ) : (
        <span className="text-xl font-medium text-[#171719]">--:--:--</span>
      )}
      <div className="flex justify-start gap-2 pl-6">
        <ActionButton onClick={() => onViewDetails(applicant)}>
          상세
        </ActionButton>
        {isWaitingResponse && (
          <>
            <ActionButton
              disabled={isMutating}
              onClick={() => onReject(applicant)}
            >
              채용 거절
            </ActionButton>
            <button
              type="button"
              onClick={() => onOffer(applicant)}
              disabled={isMutating}
              className="flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg bg-[#00b894] px-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a] disabled:cursor-not-allowed disabled:bg-[#c7cbd1]"
            >
              채용 제안
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export { APPLICANT_ROW_GRID, HIRED_APPLICANT_ROW_GRID };
export default EmployerApplicantRow;
