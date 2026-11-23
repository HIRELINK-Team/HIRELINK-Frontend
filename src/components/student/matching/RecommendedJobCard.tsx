import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import timerActiveIcon from '../../../assets/icons/student/matching/timer-active.svg';
import type { StudentApplication } from '../../../types/studentApplication';
import type {
  RecommendedJob,
  StudentOfferAction,
} from '../../../types/studentMatching';
import { translateMatchingText } from './translateMatchingText';

type RecommendationApplication = Pick<
  StudentApplication,
  'employerResponseDeadline' | 'status'
> &
  Partial<Pick<StudentApplication, 'studentResponseDeadline'>>;

type RecommendedJobCardProps = {
  application?: RecommendationApplication;
  isOffer?: boolean;
  isSelected?: boolean;
  isSubmitting?: boolean;
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onCardClick?: (job: RecommendedJob) => void;
  onDetailClick?: (job: RecommendedJob) => void;
  onOfferAction?: (action: StudentOfferAction) => void;
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
  application?: RecommendationApplication;
}) {
  const deadline =
    application?.status === 'WAITING_RESPONSE'
      ? application.employerResponseDeadline
      : application?.status === 'OFFERED'
        ? application.studentResponseDeadline
        : null;
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) return undefined;

    const updateCurrentTime = () => setCurrentTime(Date.now());
    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 1_000);

    return () => window.clearInterval(intervalId);
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
      <span className="text-[20px] leading-[1.5] font-semibold tabular-nums">
        {label}
      </span>
    </div>
  );
}

export function RecommendedJobCard({
  application,
  isOffer = false,
  isSelected = false,
  isSubmitting = false,
  job,
  onApply,
  onCardClick,
  onDetailClick,
  onOfferAction,
  showApplyButton = false,
}: RecommendedJobCardProps) {
  const { t } = useTranslation();
  const isExpanded = isSelected || isOffer;

  return (
    <article
      aria-pressed={isSelected}
      className={`relative w-full overflow-hidden rounded-[20px] bg-white px-6 pt-[21px] pb-4 text-[#1D1F20] shadow-[1px_1px_20px_rgba(0,0,0,0.04)] transition-[height,border-color] duration-150 ${
        isExpanded ? 'h-[198px]' : 'h-[132px]'
      } ${
        isSelected
          ? 'border-[1.5px] border-[#00B894] px-[22.5px] pt-[19.5px]'
          : 'border border-transparent'
      } ${isOffer ? 'cursor-default' : 'cursor-pointer'}`}
      onClick={() => {
        if (!isOffer) onCardClick?.(job);
      }}
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h2 className="m-0 min-w-0 truncate text-[20px] leading-[1.5] font-semibold tracking-[-0.02em]">
          {job.companyName}
        </h2>
        <ResponseDeadlineTimer application={application} />
      </div>

      <p className="mt-[1px] mb-0 text-[15px] leading-[1.5] whitespace-nowrap">
        <span className="font-semibold text-[#009376]">{job.matchRate}% </span>
        <span className="text-[#909597]">{t('common.match')}</span>
      </p>

      <div className="mt-[3px] flex min-w-0 items-center justify-between gap-3">
        <p className="m-0 min-w-0 truncate text-[15px] leading-[1.5] text-[#909597]">
          {job.matchDescription
            ? translateMatchingText(job.matchDescription, t)
            : t('matching.recommendationFallback')}
        </p>
        <button
          className="h-[27px] shrink-0 rounded-[30px] border-[0.7px] border-[#D3D6D7] bg-white px-[14px] text-[13px] leading-[1.5] text-[#55595B]"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDetailClick?.(job);
          }}
        >
          {t('common.viewDetails')}
        </button>
      </div>

      {isOffer ? (
        <div className="absolute right-[23px] bottom-[19px] left-[23px] grid h-[50px] grid-cols-2 gap-[7px]">
          <button
            className="rounded-[15px] border-0 bg-[#B8EBDD] text-[17px] leading-[1.5] font-medium text-[#006E59] disabled:opacity-60"
            disabled={isSubmitting}
            type="button"
            onClick={() => onOfferAction?.('decline')}
          >
            {t('common.decline')}
          </button>
          <button
            className="rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5] disabled:opacity-60"
            disabled={isSubmitting}
            type="button"
            onClick={() => onOfferAction?.('accept')}
          >
            {t('common.accept')}
          </button>
        </div>
      ) : isSelected && showApplyButton ? (
        <button
          className="absolute right-[22.5px] bottom-[16.5px] left-[22.5px] h-[51px] rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onApply?.(job);
          }}
        >
          {t('common.apply')}
        </button>
      ) : null}
    </article>
  );
}
