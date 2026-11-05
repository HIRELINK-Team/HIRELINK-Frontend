import backIcon from '../../../assets/icons/student/documents/alien-registration/camera-back.svg';
import bulbIcon from '../../../assets/icons/student/documents/alien-registration/camera-bulb.svg';
import clarityIcon from '../../../assets/icons/student/documents/alien-registration/camera-clarity.svg';
import landscapeIcon from '../../../assets/icons/student/documents/alien-registration/camera-landscape.svg';

type AlienRegistrationCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

export function AlienRegistrationCamera({
  onBack,
  onCapture,
}: AlienRegistrationCameraProps) {
  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#3F3F3F] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#F5F5F5]">
      <button
        aria-label="뒤로가기"
        className="absolute top-[61px] left-4 grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <p className="absolute top-[112px] right-6 left-6 m-0 text-center text-[15px] leading-[1.4]">
        영역 안에 신분증이 꽉 차도록 조절하면
        <br />
        자동으로 촬영돼요.
      </p>
      <div className="absolute top-[198px] right-6 left-6 h-[190px] rounded-[10px] border border-[#F5F5F5]" />

      <section
        aria-label="촬영 가이드"
        className="absolute top-[442px] right-6 left-6 grid grid-cols-3"
      >
        <div className="flex flex-col items-center">
          <img alt="" className="h-[50px] w-[50px]" src={bulbIcon} />
          <p className="m-0 mt-[20px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
            빛 반사가 없도록
            <br />
            촬영해주세요
          </p>
        </div>
        <div className="flex flex-col items-center pt-1">
          <img alt="" className="h-[46px] w-[46px]" src={clarityIcon} />
          <p className="m-0 mt-[20px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
            정보를 선명하게
            <br />
            보여주세요
          </p>
        </div>
        <div className="flex flex-col items-center pt-2">
          <img alt="" className="h-[35px] w-[35px]" src={landscapeIcon} />
          <p className="m-0 mt-[27px] text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
            가로 방향으로
            <br />
            촬영해주세요
          </p>
        </div>
      </section>

      <div className="absolute right-6 bottom-[37px] left-6 flex gap-[7px]">
        <label className="flex h-[57px] flex-1 cursor-pointer items-center justify-center rounded-[15px] bg-white/15 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]">
          파일업로드
          <input
            accept="application/pdf,image/*"
            className="sr-only"
            type="file"
            onChange={(event) => {
              if (event.currentTarget.files?.length) onCapture();
            }}
          />
        </label>
        <button
          className="h-[58px] flex-[1.024] rounded-[15px] border-0 bg-[#F5F5F5] p-0 text-[20px] leading-[1.5] text-[#191F28]"
          type="button"
          onClick={onCapture}
        >
          등록하기
        </button>
      </div>
    </main>
  );
}
