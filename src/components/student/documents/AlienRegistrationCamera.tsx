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
    <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-hidden bg-[#3F3F3F] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#F5F5F5]">
      <button
        aria-label="뒤로 가기"
        className="absolute top-[61px] left-[18px] grid size-8 place-items-center border-0 bg-transparent p-0"
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
      <div className="absolute top-[222px] right-6 left-6 h-[208px] rounded-[10px] border border-[#F5F5F5]" />

      <section
        aria-label="촬영 가이드"
        className="absolute top-[497px] right-6 left-6 grid grid-cols-3"
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

      <div className="absolute top-[694px] left-[25px] flex items-center gap-[7px]">
        <label className="relative h-[57px] w-[165px] cursor-pointer overflow-hidden rounded-[15px] bg-white/15">
          <span className="absolute top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[20px] leading-[1.5] font-medium tracking-[-0.02em] text-[#F5F5F5]">
            파일업로드
          </span>
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
          className="relative h-[58px] w-[169px] overflow-hidden rounded-[15px] border-0 bg-[#F5F5F5] p-0"
          type="button"
          onClick={onCapture}
        >
          <span className="absolute top-[14px] left-1/2 -translate-x-1/2 whitespace-nowrap text-[20px] leading-[1.5] font-normal tracking-[-0.02em] text-[#1D1F20]">
            등록하기
          </span>
        </button>
      </div>
    </main>
  );
}
