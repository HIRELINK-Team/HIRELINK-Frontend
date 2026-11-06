import offerBackIcon from '../../../assets/icons/student/matching/offer-back.svg';
import offerIllustration from '../../../assets/images/student/matching/matching-offer-illustration.png';
import type {
  RecommendedJob,
  StudentOfferAction,
} from '../../../types/studentMatching';

type MatchingOfferOverlayProps = {
  isSubmitting?: boolean;
  job: RecommendedJob;
  onAction: (action: StudentOfferAction) => void;
  onBack: () => void;
};

/** Offer-state overlay presented above the student matching result list. */
export function MatchingOfferOverlay({
  isSubmitting = false,
  job,
  onAction,
  onBack,
}: MatchingOfferOverlayProps) {
  return (
    <section
      aria-label="채용 제안"
      className="absolute inset-0 z-30 h-full overflow-hidden bg-black/[0.66] backdrop-blur-[14.35px] text-[#F5F5F5]"
    >
      <button
        aria-label="매칭 목록으로 돌아가기"
        className="absolute top-[69px] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={offerBackIcon} />
      </button>

      <h1 className="absolute top-[105px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        채용 제안이 도착했어요!
      </h1>

      <article className="absolute top-[169px] left-1/2 h-[329px] w-[271px] -translate-x-1/2 overflow-hidden rounded-[30px] bg-gradient-to-t from-[#CEFFF6]/92 to-[#00D1A8]/92 text-[#004A3B]">
        <img
          alt=""
          className="absolute top-[55px] left-[63px] h-[145px] w-[145px] object-cover"
          src={offerIllustration}
        />
        <h2 className="absolute top-[209px] right-6 left-6 m-0 flex h-[60px] items-center justify-center overflow-hidden text-center text-[20px] leading-[1.4] font-semibold break-keep [overflow-wrap:anywhere] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
          {job.companyName}
        </h2>
        <p className="absolute top-[274px] right-6 left-6 m-0 h-[42px] overflow-hidden text-center text-[14px] leading-[1.5] font-medium break-keep [overflow-wrap:anywhere] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
          {job.role}
        </p>
      </article>

      <div className="absolute top-[524px] right-6 left-6 h-[75px] text-center">
        <p className="m-0 overflow-hidden text-[20px] leading-[1.35] font-semibold break-keep [overflow-wrap:anywhere] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] [display:-webkit-box]">
          {job.companyName}가 함께 일하고 싶대요.
        </p>
        <p className="absolute top-[55px] right-0 left-0 m-0 text-[11px] leading-[1.5] whitespace-nowrap">
          수락하면 다른 활성 지원은 자동으로 종료돼요.
        </p>
      </div>

      <div className="absolute top-[615px] right-[26px] left-[26px] grid h-[64px] grid-cols-[1.675fr_1fr] gap-[9px]">
        <button
          className="rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium"
          disabled={isSubmitting}
          type="button"
          onClick={() => onAction('accept')}
        >
          수락할래요
        </button>
        <button
          className="rounded-[15px] border-0 bg-white/15 text-[20px] leading-[1.5] font-medium"
          disabled={isSubmitting}
          type="button"
          onClick={() => onAction('decline')}
        >
          거절
        </button>
      </div>
    </section>
  );
}
