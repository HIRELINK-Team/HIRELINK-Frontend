import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import activeTimerIcon from '../../../assets/icons/student/matching/timer-active.svg';
import type { StudentApplicationCardModel } from '../../../types/studentApplication';

type StudentApplicationCardProps = {
  application: StudentApplicationCardModel;
  isOfferActionPending?: boolean;
  onDeclineOffer?: (application: StudentApplicationCardModel) => void;
  onDetailClick?: (application: StudentApplicationCardModel) => void;
  onAcceptOffer?: (application: StudentApplicationCardModel) => void;
};

function formatRemainingTime(deadline: string, now: number | null) {
  if (now === null) return null;
  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return null;
  const seconds = Math.max(0, Math.floor((deadlineTime - now) / 1000));
  return `${String(Math.floor(seconds / 3600)).padStart(2, '0')}:${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')}`;
}

function ApplicationDeadlineTimer({
  deadline,
  fallbackLabel,
}: {
  deadline?: string | null;
  fallbackLabel?: string;
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    if (!deadline) return undefined;
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [deadline]);
  const label = deadline
    ? formatRemainingTime(deadline, now)
    : fallbackLabel ?? null;
  if (!label) return null;
  return (
    <div className="flex items-center gap-[6px] whitespace-nowrap text-[#00A884]">
      <img alt="" className="h-[18px] w-[18px]" src={activeTimerIcon} />
      <span className="text-[20px] leading-none font-semibold tabular-nums">{label}</span>
    </div>
  );
}

export function StudentApplicationCard({
  application,
  isOfferActionPending = false,
  onAcceptOffer,
  onDeclineOffer,
  onDetailClick,
}: StudentApplicationCardProps) {
  const { t } = useTranslation();
  const isOffer = application.status === 'OFFER_WAITING';
  const isHired = application.status === 'HIRED';
  const canRespond =
    isOffer && application.offerStatus === 'PENDING' && application.offerId != null;
  const isExpandedOffer = canRespond;
  const cardHeight = isExpandedOffer
    ? 'h-[198px]'
    : isHired
      ? 'h-[132px]'
      : 'h-[132px]';
  const titlePosition = isOffer || isHired ? 'top-[22px]' : 'top-[18px]';
  const scorePosition = isOffer || isHired ? 'top-[61px]' : 'top-[57px]';
  const descriptionPosition = isOffer || isHired ? 'top-[92px]' : 'top-[87px]';
  const detailPosition = isOffer || isHired ? 'top-[89px]' : 'top-[84px]';

  return (
    <article className={`relative mx-auto w-full max-w-[343px] overflow-hidden rounded-[20px] bg-white shadow-[1px_1px_20px_rgba(0,0,0,0.04)] ${cardHeight}`}>
      <h2 className={`absolute left-[24px] m-0 max-w-[185px] truncate text-[20px] leading-[1.5] font-semibold text-[#191F28] ${titlePosition}`}>
        {application.job.companyName}
      </h2>
      <div className="absolute top-[26px] right-[24px]">
        <ApplicationDeadlineTimer
          deadline={application.expiresAt}
          fallbackLabel={application.timerLabel}
        />
      </div>
      <div className={`absolute left-[24px] flex items-baseline gap-[5px] ${scorePosition}`}>
        <strong className="text-[15px] font-semibold text-[#00A884]">{application.job.matchRate || 0}%</strong>
        <span className="text-[15px] text-[#909597]">{t('common.match')}</span>
      </div>
      {!isHired ? (
        <p className={`absolute left-[24px] m-0 max-w-[205px] truncate text-[15px] text-[#909597] ${descriptionPosition}`}>
          {t('common.timeAndDistanceMatch')}
        </p>
      ) : null}
      {isHired && application.employerPhoneNumber ? (
        <p className="absolute top-[94px] left-[24px] m-0 text-[15px] font-semibold text-[#00A884] underline underline-offset-2">
          T. {application.employerPhoneNumber}
        </p>
      ) : null}
      <button className={`absolute right-[24px] h-[24px] rounded-[30px] border-[0.7px] border-[#D3D6D7] bg-white px-[10px] text-[10px] text-[#55595B] ${isHired ? 'top-[91px]' : detailPosition}`} type="button" onClick={() => onDetailClick?.(application)}>
        {t('common.viewDetails')}
      </button>
      {canRespond ? (
        <div className="absolute right-[24px] bottom-[20px] left-[24px] grid grid-cols-2 gap-[8px]">
          <button className="h-[50px] rounded-[15px] bg-[#B2E8DC] text-[17px] font-medium text-[#007A68]" disabled={isOfferActionPending} type="button" onClick={() => onDeclineOffer?.(application)}>{t('common.decline')}</button>
          <button className="h-[50px] rounded-[15px] bg-[#00B894] text-[17px] font-medium text-white" disabled={isOfferActionPending} type="button" onClick={() => onAcceptOffer?.(application)}>{t('common.accept')}</button>
        </div>
      ) : null}
    </article>
  );
}
