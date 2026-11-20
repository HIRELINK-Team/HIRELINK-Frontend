import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import cameraGuideImage from '../../../assets/images/student/documents/alien-registration/camera-guide.png';

type AlienRegistrationInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

export function AlienRegistrationInformation({
  onBack,
  onRegister,
}: AlienRegistrationInformationProps) {
  return (
    <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로 가기"
        className="absolute top-[61px] left-[18px] grid size-8 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <div className="absolute top-[102px] left-6">
        <p className="m-0 text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          1/6
        </p>
        <p className="m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          정보 확인
        </p>
      </div>

      <div
        aria-label="온보딩 진행 단계"
        className="absolute top-[162px] left-6 flex w-[342px] gap-[5px]"
      >
        {Array.from({ length: 2 }, (_, index) => (
          <span
            className={`h-0.5 flex-1 ${index === 0 ? 'bg-[#00B894]' : 'bg-[#B0B8C1]'}`}
            key={index}
          />
        ))}
      </div>

      <h1 className="absolute top-[210px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        외국인 등록증
        <br />
        앞면을 촬영해주세요.
      </h1>
      <p className="absolute top-[299px] left-6 m-0 text-[15px] leading-[1.5] text-[#939393]">
        이름과 체류자격을 확인해요.
      </p>

      <img
        alt="외국인 등록증 앞면 촬영 가이드"
        className="absolute top-[423px] left-1/2 h-[129px] w-[190px] -translate-x-1/2 object-contain"
        src={cameraGuideImage}
      />

      <button
        className="absolute top-[750px] left-6 h-[57px] w-[342px] rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        촬영하기
      </button>
    </main>
  );
}
