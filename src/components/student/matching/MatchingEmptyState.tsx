import emptyStateIllustration from '../../../assets/images/student/matching/empty-state-illustration.png';

type MatchingEmptyStateProps = {
  onConfirm?: () => void;
};

/** Empty recommendation state reused when student matching has no available jobs. */
export function MatchingEmptyState({ onConfirm }: MatchingEmptyStateProps) {
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <section
      aria-labelledby="matching-empty-title"
      className="relative h-[844px] bg-[#F5F5F5]"
    >
      <div className="absolute top-[262px] left-1/2 h-[127px] w-[106px] -translate-x-1/2">
        <img
          alt=""
          className="block h-full w-full object-contain"
          src={emptyStateIllustration}
        />
      </div>
      <div className="absolute top-[404px] left-1/2 w-full -translate-x-1/2 text-center">
        <h1
          className="m-0 text-[26px] leading-[1.5] font-semibold text-[#191F28]"
          id="matching-empty-title"
        >
          현재 조건에 맞는
          <br />
          일자리가 없어요.
        </h1>
        <p className="mt-[15px] text-[13px] leading-[1.5] text-[#8B95A1]">
          조건에 맞는 일자리를 찾으면
          <br />
          알림으로 알려드려요.
        </p>
      </div>
      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={handleConfirm}
      >
        확인
      </button>
    </section>
  );
}
