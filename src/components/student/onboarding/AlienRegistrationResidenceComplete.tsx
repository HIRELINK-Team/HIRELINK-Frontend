import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import completeIllustration from '../../../assets/images/student/documents/alien-registration/residence-verification-complete.png';

type AlienRegistrationResidenceCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function AlienRegistrationResidenceComplete({
  onBack,
  onConfirm,
}: AlienRegistrationResidenceCompleteProps) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-y-auto bg-[#F5F5F5] px-6 pt-[calc(61px+env(safe-area-inset-top))] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        aria-label="이전 단계로 이동"
        className="-ml-1 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <section className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <img
          alt="체류기간 인증 완료"
          className="w-[min(26vw,102px)] min-w-[88px] drop-shadow-[1px_1px_38px_rgba(0,184,148,0.28)]"
          src={completeIllustration}
        />
        <h1 className="mt-8 text-[22px] leading-[1.5] font-semibold">
          체류기간 인증이
          <br />
          완료되었어요!
        </h1>
      </section>

      <button
        className="min-h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}
