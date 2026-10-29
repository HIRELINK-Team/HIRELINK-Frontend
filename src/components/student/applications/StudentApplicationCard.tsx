import type { StudentApplication } from '../../../types/studentApplication';
import offerStatusDotIcon from '../../../assets/icons/student/applications/offer-status-dot.svg';
import activeTimerIcon from '../../../assets/icons/student/matching/timer-active.svg';

type StudentApplicationCardProps = {
  application: StudentApplication;
  isGeneralLayout?: boolean;
  onDeclineOffer?: (application: StudentApplication) => void;
  onDetailClick?: (application: StudentApplication) => void;
  onAcceptOffer?: (application: StudentApplication) => void;
};

const STATUS_COPY = {
  REVIEWING: { color: '#8B95A1', label: '응답 대기' },
  OFFER_WAITING: { color: '#E05260', label: '채용 제안' },
  HIRED: { color: '#387DD6', label: '채용 완료' },
} as const;

type OfferWaitingApplicationCardProps = Pick<
  StudentApplicationCardProps,
  'application' | 'onAcceptOffer' | 'onDeclineOffer' | 'onDetailClick'
>;

function OfferWaitingApplicationCard({
  application,
  onAcceptOffer,
  onDeclineOffer,
  onDetailClick,
}: OfferWaitingApplicationCardProps) {
  return (
    <article className="relative h-[223px] w-full max-w-[342px] overflow-hidden rounded-[20px] border-[0.7px] border-[#B0B8C1]">
      <h2 className="absolute top-[21.3px] left-[23.3px] m-0 text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] whitespace-nowrap text-[#191F28]">
        {application.job.companyName}
      </h2>
      <p className="absolute top-[58.3px] left-[23.3px] m-0 text-[15px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#8B95A1]">
        {application.job.role}
      </p>
      <p className="absolute top-[88.3px] left-[23.3px] m-0 text-[15px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#8B95A1]">
        {application.job.commuteAndWage}
      </p>
      <p className="absolute top-[118.3px] left-[23.3px] m-0 text-[15px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#8B95A1]">
        {application.job.matchDescription}
      </p>

      <div className="absolute top-[26.3px] left-[254.3px] flex items-center gap-[7px] whitespace-nowrap">
        <img alt="" className="block" src={offerStatusDotIcon} />
        <span className="text-[13px] leading-[1.5] font-medium tracking-[-0.02em] text-[#E05260]">
          채용 제안
        </span>
      </div>
      {application.timerLabel ? (
        <div className="absolute top-[46.3px] left-[241.3px] flex items-center gap-[5.75px] whitespace-nowrap">
          <img alt="" className="block" src={activeTimerIcon} />
          <span className="text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#009376]">
            {application.timerLabel}
          </span>
        </div>
      ) : null}
      <button
        className="absolute top-[108.3px] left-[245.3px] flex h-[27px] w-[72.273px] items-center justify-center rounded-[30px] border-0 bg-[#E5E8EB] px-[13.636px] text-[13px] leading-[1.5] tracking-[-0.02em] whitespace-nowrap text-[#191F28]"
        type="button"
        onClick={() => onDetailClick?.(application)}
      >
        상세보기
      </button>

      <div className="absolute top-[153.3px] left-[21.3px] grid grid-cols-[145px_145px] gap-[7px]">
        <button
          className="h-[50px] rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium tracking-[-0.02em] text-[#F5F5F5]"
          type="button"
          onClick={() => onAcceptOffer?.(application)}
        >
          수락
        </button>
        <button
          className="h-[50px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent text-[17px] leading-[1.5] font-medium tracking-[-0.02em] text-[#8B95A1]"
          type="button"
          onClick={() => onDeclineOffer?.(application)}
        >
          거절
        </button>
      </div>
    </article>
  );
}

export function StudentApplicationCard({
  application,
  isGeneralLayout = false,
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
        onAcceptOffer={onAcceptOffer}
        onDeclineOffer={onDeclineOffer}
        onDetailClick={onDetailClick}
      />
    );
  }

  if (!status) {
    return null;
  }

  return (
    <article className="relative h-[164px] w-full rounded-[20px] border-[0.7px] border-[#B0B8C1] px-[23px] pt-[21px]">
      <h2 className="m-0 text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
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

      <p className="mt-[10px] text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.role}
      </p>
      <p className="mt-[6px] text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
        {application.job.commuteAndWage}
      </p>
      <p className="mt-[6px] text-[15px] leading-[1.5] tracking-[-0.02em] text-[#8B95A1]">
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
