import { useEffect, useState } from 'react';

import type { StudentApplicationCardModel } from '../../../types/studentApplication';
import hiredStatusDotIcon from '../../../assets/icons/student/applications/hired-status-dot.svg';
import offerStatusDotIcon from '../../../assets/icons/student/applications/offer-status-dot.svg';
import activeTimerIcon from '../../../assets/icons/student/matching/timer-active.svg';

type StudentApplicationCardProps = {
  application: StudentApplicationCardModel;
  isGeneralLayout?: boolean;
  isHiredLayout?: boolean;
  isOfferActionPending?: boolean;
  onDeclineOffer?: (application: StudentApplicationCardModel) => void;
  onDetailClick?: (application: StudentApplicationCardModel) => void;
  onAcceptOffer?: (application: StudentApplicationCardModel) => void;
};

const STATUS_COPY = {
  REVIEWING: { color: '#8B95A1', label: '응답 대기' },
  OFFER_WAITING: { color: '#E05260', label: '채용 제안' },
  HIRED: { color: '#387DD6', label: '채용 완료' },
} as const;

type OfferWaitingApplicationCardProps = Pick<
  StudentApplicationCardProps,
  | 'application'
  | 'isOfferActionPending'
  | 'onAcceptOffer'
  | 'onDeclineOffer'
  | 'onDetailClick'
>;

function OfferWaitingApplicationCard({
  application,
  isOfferActionPending = false,
  onAcceptOffer,
  onDeclineOffer,
  onDetailClick,
}: OfferWaitingApplicationCardProps) {
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(Date.now());
    };

    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const canRespondToOffer =
    application.apiStatus === 'OFFERED' &&
    application.offerStatus === 'PENDING' &&
    application.offerId !== null &&
    application.offerId !== undefined &&
    application.studentResponseDeadline !== null &&
    application.studentResponseDeadline !== undefined &&
    currentTime !== null &&
    new Date(application.studentResponseDeadline).getTime() > currentTime;

  return (
    <article
      className={`relative mx-auto w-full max-w-[342px] overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1] ${
        canRespondToOffer ? 'h-[223px]' : 'h-[164px]'
      }`}
    >
      <h2 className="absolute top-[21px] left-[23px] m-0 max-w-[190px] truncate text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {application.job.companyName}
      </h2>
      <p className="absolute top-[58px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.role}
      </p>
      <p className="absolute top-[88px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.commuteAndWage}
      </p>
      <p className="absolute top-[118px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.matchDescription}
      </p>

      <div className="absolute top-[26px] right-[23px] flex items-center gap-[7px] whitespace-nowrap">
        <img alt="" className="block" src={offerStatusDotIcon} />
        <span className="text-[13px] leading-[1.5] font-medium tracking-[-0.02em] text-[#E05260]">
          채용 제안
        </span>
      </div>
      {application.timerLabel ? (
        <div className="absolute top-[46px] right-[23px] flex items-center gap-[5.75px] whitespace-nowrap">
          <img alt="" className="block" src={activeTimerIcon} />
          <span className="text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#009376]">
            {application.timerLabel}
          </span>
        </div>
      ) : null}
      <button
        className="absolute top-[108px] right-[23px] flex h-[27px] w-[72px] items-center justify-center rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#191F28]"
        type="button"
        onClick={() => onDetailClick?.(application)}
      >
        상세보기
      </button>

      {canRespondToOffer ? (
        <div className="absolute right-[21px] bottom-5 left-[21px] grid grid-cols-2 gap-[7px]">
          <button
            className="h-[50px] rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium tracking-[-0.02em] text-[#F5F5F5]"
            disabled={isOfferActionPending}
            type="button"
            onClick={() => onAcceptOffer?.(application)}
          >
            수락
          </button>
          <button
            className="h-[50px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent text-[17px] leading-[1.5] font-medium tracking-[-0.02em] text-[#8B95A1]"
            disabled={isOfferActionPending}
            type="button"
            onClick={() => onDeclineOffer?.(application)}
          >
            거절
          </button>
        </div>
      ) : null}
    </article>
  );
}

type HiredApplicationCardProps = Pick<
  StudentApplicationCardProps,
  'application' | 'onDetailClick'
>;

function HiredApplicationCard({
  application,
  onDetailClick,
}: HiredApplicationCardProps) {
  return (
    <article className="relative mx-auto h-[164px] w-full max-w-[342px] overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1]">
      <h2 className="absolute top-[21px] left-[23px] m-0 max-w-[190px] truncate text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {application.job.companyName}
      </h2>
      <p className="absolute top-[58px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.role}
      </p>
      <p className="absolute top-[88px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.commuteAndWage}
      </p>
      <p className="absolute top-[118px] left-[23px] m-0 max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.matchDescription}
      </p>

      <div className="absolute top-[26px] right-[23px] flex items-center gap-[7px] whitespace-nowrap">
        <img alt="" className="block" src={hiredStatusDotIcon} />
        <span className="text-[13px] leading-[1.5] font-medium tracking-[-0.02em] text-[#387DD6]">
          채용 완료
        </span>
      </div>
      <button
        className="absolute top-[108px] right-[23px] flex h-[27px] w-[72px] items-center justify-center rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#191F28]"
        type="button"
        onClick={() => onDetailClick?.(application)}
      >
        상세보기
      </button>
    </article>
  );
}

export function StudentApplicationCard({
  application,
  isGeneralLayout = false,
  isHiredLayout = false,
  isOfferActionPending = false,
  onAcceptOffer,
  onDeclineOffer,
  onDetailClick,
}: StudentApplicationCardProps) {
  const isOfferWaiting = application.status === 'OFFER_WAITING';
  const status = STATUS_COPY[application.status as keyof typeof STATUS_COPY];

  if (isOfferWaiting) {
    return (
      <OfferWaitingApplicationCard
        application={application}
        isOfferActionPending={isOfferActionPending}
        onAcceptOffer={onAcceptOffer}
        onDeclineOffer={onDeclineOffer}
        onDetailClick={onDetailClick}
      />
    );
  }

  if (isHiredLayout && application.status === 'HIRED') {
    return (
      <HiredApplicationCard
        application={application}
        onDetailClick={onDetailClick}
      />
    );
  }

  if (!status) {
    return null;
  }

  return (
    <article className="relative h-[164px] w-full rounded-[20px] border-[0.7px] border-[#B0B8C1] px-[23px] pt-[21px]">
      <h2 className="m-0 max-w-[190px] truncate text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {application.job.companyName}
      </h2>
      <div className="absolute top-[27px] right-[23px] flex items-center gap-[7px]">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: status.color }}
        />
        <span
          className="text-[13px] leading-[1.5] font-medium tracking-[-0.02em]"
          style={{ color: status.color }}
        >
          {status.label}
        </span>
      </div>

      <p className="mt-[10px] max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.role}
      </p>
      <p className="mt-[6px] max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.commuteAndWage}
      </p>
      <p className="mt-[6px] max-w-[190px] truncate text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.matchDescription}
      </p>
      <button
        className={`absolute top-[109px] right-[23px] flex h-[27px] items-center justify-center rounded-[30px] border-0 bg-[#E5E8EB] px-[13.636px] text-[13px] leading-[1.5] text-[#191F28] ${
          isGeneralLayout ? 'w-[72.273px]' : ''
        }`}
        type="button"
        onClick={() => onDetailClick?.(application)}
      >
        상세보기
      </button>

      {application.timerLabel ? (
        <div className="absolute top-[47px] right-[23px] flex items-center gap-[5.75px]">
          <img
            alt=""
            className="mt-[5.4px] h-[19.166px] w-[19.166px]"
            src={activeTimerIcon}
          />
          <span className="text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#009376]">
            {application.timerLabel}
          </span>
        </div>
      ) : null}
    </article>
  );
}
