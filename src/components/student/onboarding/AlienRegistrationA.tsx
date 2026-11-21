import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import cardBackGuideImage from '../../../assets/images/student/documents/alien-registration/residence-period-card-back.png';

type AlienRegistrationAProps = {
  onBack: () => void;
};

export function AlienRegistrationA({ onBack }: AlienRegistrationAProps) {
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

      <div className="mt-9">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">1/6</strong>
        <span className="block text-[15px] leading-[1.5] text-[#909597]">정보 확인</span>
      </div>
      <div aria-hidden="true" className="mt-[11px] grid grid-cols-6 gap-[5px]">
        {Array.from({ length: 6 }, (_, index) => (
          <span className={index === 0 ? 'h-0.5 bg-[#00B894]' : 'h-0.5 bg-[#B0B8C1]'} key={index} />
        ))}
      </div>

      <section className="mt-[39px]">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          외국인 등록증
          <br />
          뒷면을 촬영해주세요.
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          최신 만료일과 주소를 확인해요.
        </p>
        <img
          alt="외국인등록증 뒷면 촬영 안내"
          className="mx-auto mt-[78px] block w-full max-w-[263px] object-contain"
          src={cardBackGuideImage}
        />
      </section>

      <button
        className="mt-auto min-h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
      >
        확인
      </button>
    </main>
  );
}
