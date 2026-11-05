import backIcon from '../../assets/icons/student/matching/back.svg';

import type { StudentApplicationCardModel } from '../../types/studentApplication';

type StudentApplicationDetailPageProps = {
  application: StudentApplicationCardModel;
  isOfferActionPending?: boolean;
  isWithdrawalPending?: boolean;
  onAcceptOffer?: () => void;
  onBack?: () => void;
  onDeclineOffer?: () => void;
  onWithdraw?: () => void;
  showOfferActions?: boolean;
  showWithdrawAction?: boolean;
};

export default function StudentApplicationDetailPage({
  application,
  isOfferActionPending = false,
  isWithdrawalPending = false,
  onAcceptOffer,
  onBack,
  onDeclineOffer,
  onWithdraw,
  showOfferActions = false,
  showWithdrawAction = false,
}: StudentApplicationDetailPageProps) {
  return (
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="지원 내역으로 돌아가기"
        className="absolute top-[49px] left-[26px] flex h-4 w-2 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="block h-4 w-2" src={backIcon} />
      </button>

      <section className="absolute top-[112px] right-6 left-6">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          {application.job.companyName}
        </h1>
        <p className="mt-1 text-[15px] leading-[1.5] text-[#8B95A1]">
          {application.job.role}
        </p>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#8B95A1]">
          {application.job.detail.locationAndDistance}
        </p>
      </section>

      <section className="absolute top-[226px] right-6 left-6 rounded-[20px] border-[0.7px] border-[#B0B8C1] px-6 py-6">
        <dl className="m-0 space-y-5">
          {application.job.detail.metrics.map((metric) => (
            <div
              className="flex items-center justify-between"
              key={metric.label}
            >
              <dt className="text-[15px] text-[#8B95A1]">{metric.label}</dt>
              <dd className="m-0 text-[15px] font-medium">{metric.value}</dd>
            </div>
          ))}
          <div className="flex items-start justify-between gap-6">
            <dt className="shrink-0 text-[15px] text-[#8B95A1]">근무시간</dt>
            <dd className="m-0 text-right text-[15px] font-medium">
              {application.job.detail.tags.length > 0
                ? application.job.detail.tags.join(', ')
                : '미정'}
            </dd>
          </div>
        </dl>
      </section>

      {showOfferActions ? (
        <div className="absolute right-6 bottom-[57px] left-6 grid grid-cols-2 gap-2">
          <button
            className="h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] disabled:opacity-50"
            disabled={isOfferActionPending}
            type="button"
            onClick={onAcceptOffer}
          >
            수락
          </button>
          <button
            className="h-[57px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent text-[20px] leading-[1.5] font-medium text-[#8B95A1] disabled:opacity-50"
            disabled={isOfferActionPending}
            type="button"
            onClick={onDeclineOffer}
          >
            거절
          </button>
        </div>
      ) : null}
      {showWithdrawAction ? (
        <div className="absolute right-6 bottom-[57px] left-6">
          <button
            className="h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-transparent text-[20px] leading-[1.5] font-medium text-[#8B95A1] disabled:opacity-50"
            disabled={isWithdrawalPending}
            type="button"
            onClick={onWithdraw}
          >
            지원 취소
          </button>
        </div>
      ) : null}
    </main>
  );
}
