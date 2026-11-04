import backIcon from '../../../assets/icons/student/documents/back.svg';
import badgeImage from '../../../assets/images/student/documents/verification/badge-issued.png';

type DocumentBadgeIssuedProps = {
  onConfirm: () => void;
};

export function DocumentBadgeIssued({ onConfirm }: DocumentBadgeIssuedProps) {
  return (
    <main className="relative mx-auto flex h-[100dvh] max-h-[844px] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[clamp(32px,7.2dvh,61px)] pb-[clamp(40px,10.2dvh,86px)] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <span className="grid size-8 -ml-2 place-items-center" aria-hidden="true">
        <img alt="" src={backIcon} />
      </span>
      <section className="mt-[clamp(100px,19.7dvh,166px)] flex flex-col items-center">
        <img
          alt=""
          className="h-[clamp(97px,14.6dvh,123px)] w-[clamp(95px,14.3dvh,121px)] object-contain"
          src={badgeImage}
        />
        <h1 className="m-0 mt-[clamp(18px,2.73dvh,23px)] text-center text-[clamp(21px,3.08dvh,26px)] leading-[1.5] font-semibold">
          뱃지가 발급되었어요!
        </h1>
        <p className="m-0 mt-[clamp(4px,0.71dvh,6px)] text-center text-[clamp(11px,1.54dvh,13px)] leading-[1.5] text-[#8B95A1]">
          이제 더 정확하게 일자리를
          <br />
          추천받을 수 있어요.
        </p>
      </section>
      <button
        className="mt-auto h-[clamp(52px,6.75dvh,57px)] w-full rounded-[15px] border-0 bg-[#00B894] text-[clamp(17px,2.37dvh,20px)] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}
