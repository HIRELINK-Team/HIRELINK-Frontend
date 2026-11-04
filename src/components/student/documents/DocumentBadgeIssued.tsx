import backIcon from '../../../assets/icons/student/documents/back.svg';
import badgeImage from '../../../assets/images/student/documents/verification/badge-issued.png';

type DocumentBadgeIssuedProps = {
  onConfirm: () => void;
};

export function DocumentBadgeIssued({ onConfirm }: DocumentBadgeIssuedProps) {
  return (
    <main className="relative mx-auto flex h-[844px] w-full max-w-[390px] flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[61px] pb-[86px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <span className="grid size-8 -ml-2 place-items-center" aria-hidden="true">
        <img alt="" src={backIcon} />
      </span>
      <section className="mt-[166px] flex flex-col items-center">
        <img
          alt=""
          className="h-[123px] w-[121px] object-contain"
          src={badgeImage}
        />
        <h1 className="m-0 mt-[23px] text-center text-[26px] leading-[1.5] font-semibold">
          뱃지가 발급되었어요!
        </h1>
        <p className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]">
          이제 더 정확하게 일자리를
          <br />
          추천받을 수 있어요.
        </p>
      </section>
      <button
        className="mt-auto h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}
