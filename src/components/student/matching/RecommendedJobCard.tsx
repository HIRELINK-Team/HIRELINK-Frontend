import { useEffect, useState } from 'react';

import type { RecommendedJob } from '../../../types/studentMatching';
import type { StudentApplication } from '../../../types/studentApplication';
import timerActiveIcon from '../../../assets/icons/student/matching/timer-active.svg';

type RecommendedJobCardProps = {
  application?: Pick<StudentApplication, 'employerResponseDeadline' | 'status'>;
  isExpanded?: boolean;
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onCardClick?: (job: RecommendedJob) => void;
  onDetailClick?: (job: RecommendedJob) => void;
  showApplyButton?: boolean;
};

function formatRemainingTime(deadline: string, currentTime: number | null) {
  if (currentTime === null) return null;

  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return null;

  const remainingSeconds = Math.max(
    0,
    Math.floor((deadlineTime - currentTime) / 1_000),
  );
  const hours = Math.floor(remainingSeconds / 3_600);
  const minutes = Math.floor((remainingSeconds % 3_600) / 60);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function ResponseDeadlineTimer({
  application,
}: {
  application?: Pick<StudentApplication, 'employerResponseDeadline' | 'status'>;
}) {
  const deadline =
    application?.status === 'WAITING_RESPONSE'
      ? application.employerResponseDeadline
      : null;
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) return undefined;

    const updateCurrentTime = () => setCurrentTime(Date.now());
    const timeoutId = window.setTimeout(updateCurrentTime, 0);
    const intervalId = window.setInterval(updateCurrentTime, 1_000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [deadline]);

  const label = deadline ? formatRemainingTime(deadline, currentTime) : null;
  if (!label) return null;

  return (
    <div className="flex h-[30px] items-center gap-[6px] whitespace-nowrap text-[#009376]">
      <img
        alt=""
        className="block h-[19px] w-[19px] shrink-0"
        src={timerActiveIcon}
      />
      <span className="block text-[20px] leading-none font-semibold tabular-nums">
        {label}
      </span>
    </div>
  );
}

export function RecommendedJobCard({
  application,
  isExpanded = false,
  job,
  onApply,
  onCardClick,
  onDetailClick,
  showApplyButton = false,
}: RecommendedJobCardProps) {
  const applicationStatus = job.applicationStatus ?? application?.status;
  const applicationStatusLabel =
    applicationStatus === 'WAITING_RESPONSE'
      ? '채용 제안 대기'
      : applicationStatus === 'OFFERED'
        ? '채용 수락 대기'
        : null;

  const handleApply = () => {
    onApply?.(job);
  };

  const handleCardClick = () => {
    onCardClick?.(job);
  };

  const handleDetailClick = () => {
    onDetailClick?.(job);
  };

  return (
    <article
      className={`relative cursor-pointer overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-transparent transition-[height] duration-200 ease-out ${
        isExpanded ? 'h-[206px]' : 'h-[140px]'
      }`}
      onClick={handleCardClick}
    >
      <h2 className="absolute top-[17px] left-[19px] m-0 max-w-[190px] truncate text-[18px] leading-[1.5] font-semibold text-[#191F28]">
        {job.companyName}
      </h2>
      <p className="absolute top-[47px] left-[19px] max-w-[190px] truncate text-[13px] leading-[1.5] text-[#8B95A1]">
        {job.role}
      </p>
      <p className="absolute top-[70px] left-[19px] max-w-[190px] truncate text-[13px] leading-[1.5] text-[#8B95A1]">
        {job.commuteAndWage}
      </p>
      <p className="absolute top-[93px] left-[19px] max-w-[190px] truncate text-[13px] leading-[1.5] text-[#8B95A1]">
        {job.matchDescription}
      </p>
      <span className="absolute top-[20px] right-[19px] text-[13px] leading-[1.5] font-medium text-[#8B95A1]">
        {job.matchRate}% 일치
      </span>
      <div className="absolute top-[39px] right-[19px] z-10 flex h-[30px] items-center justify-end">
        <ResponseDeadlineTimer application={application} />
      </div>
      <button
        aria-expanded={isExpanded}
        className="absolute top-[99px] right-[19px] h-[25px] rounded-[30px] border-0 bg-[#E5E8EB] px-[11px] text-[12px] leading-[1.5] text-[#191F28]"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          handleDetailClick();
        }}
      >
        상세보기
      </button>

      {isExpanded && applicationStatusLabel ? (
        <div className="absolute right-[19px] bottom-[16px] left-[19px] flex h-[42px] items-center justify-center rounded-[13px] bg-[#E5E8EB] text-[16px] leading-[1.5] font-medium text-[#8B95A1]">
          {applicationStatusLabel}
        </div>
      ) : null}

      {isExpanded && showApplyButton ? (
        <button
          className="absolute right-[19px] bottom-[16px] left-[19px] flex h-[42px] items-center justify-center rounded-[13px] border-0 bg-[#00B894] text-[16px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleApply();
          }}
        >
          지원하기
        </button>
      ) : null}
    </article>
  );
}
