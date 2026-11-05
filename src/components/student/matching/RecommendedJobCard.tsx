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
      <img alt="" className="h-4 w-4" src={timerActiveIcon} />
      <span className="text-[20px] leading-[1.5] font-semibold tabular-nums">
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
      className={`relative overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-transparent ${
        showApplyButton ? 'h-[236px]' : 'h-[164px]'
      }`}
    >
      <h2 className="absolute top-[21px] left-[23px] m-0 max-w-[190px] truncate text-[20px] leading-[1.5] font-semibold text-[#191F28]">
        {job.companyName}
      </h2>
      <p className="absolute top-[58px] left-[23px] max-w-[190px] truncate text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.role}
      </p>
      <p className="absolute top-[88px] left-[23px] max-w-[190px] truncate text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.commuteAndWage}
      </p>
      <p className="absolute top-[118px] left-[23px] max-w-[190px] truncate text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.matchDescription}
      </p>
      <span className="absolute top-[24px] right-[23px] text-[13px] leading-[1.5] font-medium text-[#8B95A1]">
        {job.matchRate}% 일치
      </span>
      <div className="absolute top-[45px] right-[23px] min-h-5">
        <ResponseDeadlineTimer application={application} />
      </div>
      <button
        className="absolute top-[108px] right-[23px] h-[27px] rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5] text-[#191F28]"
        type="button"
        onClick={handleDetailClick}
      >
        상세보기
      </button>
      {showApplyButton ? (
        <button
          className="absolute top-[162px] right-[23px] left-[23px] flex h-[51px] items-center justify-center rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      ) : null}
    </article>
  );
}
