import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import uploadCompleteIllustration from '../../../assets/images/student/documents/alien-registration/pdf-upload-complete.svg';

type AlienRegistrationBUploadCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
};

export function AlienRegistrationBUploadComplete({
  onBack,
  onConfirm,
}: AlienRegistrationBUploadCompleteProps) {
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

      <section className="mt-[39px] text-center">
        <h1 className="text-left text-[26px] leading-[1.5] font-semibold">
          최신 만료일이 담긴
          <br />
          PDF를 올려주세요.
        </h1>
        <p className="mt-[10px] text-left text-[15px] leading-[1.5] text-[#939393]">
          정보가 다르면 다시 촬영해주세요.
        </p>

        <img
          alt="PDF 업로드 완료"
          className="mx-auto mt-[62px] block aspect-[178/214] w-full max-w-[178px] drop-shadow-[1px_1px_28px_rgba(0,184,148,0.45)]"
          src={uploadCompleteIllustration}
        />
        <p className="mt-4 text-[15px] leading-[1.5] text-[#8B95A1]">
          클릭해서 하이코리아 또는
          <br />
          정부 24에서 발급한 문서를 올려보세요!
        </p>
      </section>

      <button
        className="mt-auto min-h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}
