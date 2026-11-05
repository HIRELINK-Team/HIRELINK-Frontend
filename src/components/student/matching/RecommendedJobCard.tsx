import { useEffect, useState } from 'react';

import type { RecommendedJob } from '../../../types/studentMatching';
import type { StudentApplication } from '../../../types/studentApplication';
import timerActiveIcon from '../../../assets/icons/student/matching/timer-active.svg';

type RecommendedJobCardProps = {
  application?: StudentApplication;
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
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
  application?: StudentApplication;
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
    <div className="flex items-center justify-end gap-1 text-[#009376]">
      <img alt="" className="h-3.5 w-3.5" src={timerActiveIcon} />
      <span className="text-[15px] leading-5 font-semibold tabular-nums">
        {label}
      </span>
    </div>
  );
}

export function RecommendedJobCard({
  application,
  job,
  onApply,
  onDetailClick,
  showApplyButton = false,
}: RecommendedJobCardProps) {
  const handleApply = () => {
    onApply?.(job);
  };

  const handleDetailClick = () => {
    onDetailClick?.(job);
  };

  return (
    <article
      className={`relative overflow-hidden rounded-[18px] border border-[#D7DDE3] bg-[#F8FAFB] ${
        showApplyButton ? 'h-[184px]' : 'h-[128px]'
      }`}
    >
      <h2 className="absolute top-[14px] left-4 m-0 max-w-[205px] truncate text-[16px] leading-5 font-semibold text-[#191F28]">
        {job.companyName}
      </h2>
      <p className="absolute top-[40px] left-4 max-w-[210px] truncate text-[12px] leading-4 text-[#8B95A1]">
        {job.role}
      </p>
      <p className="absolute top-[61px] left-4 max-w-[210px] truncate text-[12px] leading-4 text-[#8B95A1]">
        {job.commuteAndWage}
      </p>
      <p className="absolute top-[82px] left-4 max-w-[210px] truncate text-[12px] leading-4 text-[#8B95A1]">
        {job.matchDescription}
      </p>
      <span className="absolute top-[14px] right-4 text-[11px] leading-4 font-medium text-[#8B95A1]">
        {job.matchRate}% 일치
      </span>
      <div className="absolute top-[34px] right-4 min-h-5">
        <ResponseDeadlineTimer application={application} />
      </div>
      <button
        className={`absolute right-4 h-6 rounded-[30px] border-0 bg-[#E5E8EB] px-2.5 text-[11px] leading-4 text-[#4E5968] ${
          showApplyButton ? 'bottom-[62px]' : 'bottom-3.5'
        }`}
        type="button"
        onClick={handleDetailClick}
      >
        상세보기
      </button>
      {showApplyButton ? (
        <button
          className="absolute right-4 bottom-3.5 left-4 flex h-11 items-center justify-center rounded-[12px] border-0 bg-[#00B894] text-[15px] leading-5 font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      ) : null}
    </article>
  );
}
