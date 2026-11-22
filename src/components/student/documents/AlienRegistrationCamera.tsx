import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-back.svg';
import bulbIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-bulb.svg';
import clarityIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-clarity.svg';
import landscapeIcon from '../../../assets/icons/student/documents/alien-registration/issue46-camera-landscape.svg';
import { AlienRegistrationOnboardingLayout } from '../onboarding/AlienRegistrationOnboardingLayout';

type AlienRegistrationCameraProps = {
  onBack: () => void;
  onCapture: () => void;
  side?: 'front' | 'back';
};

export function AlienRegistrationCamera({
  onBack,
  onCapture,
  side = 'front',
}: AlienRegistrationCameraProps) {
  return (
    <AlienRegistrationOnboardingLayout variant="camera">
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로가기"
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        <img src={backIcon} alt="" />
      </button>

      <p className="mt-[19px] shrink-0 text-center text-[15px] leading-[1.4] font-normal text-[#F5F5F5]">
        영역 안에 등록증이 꽉 차도록 조절하면
        <br />
        자동으로 촬영돼요.
      </p>

      <div
        aria-label={`외국인등록증 ${side === 'front' ? '앞면' : '뒷면'} 촬영 영역`}
        className="mt-[8dvh] aspect-[342/207] w-full max-w-[min(100%,45dvh)] shrink-0 self-center rounded-[10px] border border-white/90 [@media(max-height:700px)]:mt-[4dvh] [@media(max-height:600px)]:max-w-[min(100%,36dvh)]"
      />

      <section className="mt-[8dvh] grid shrink-0 grid-cols-3 gap-1 text-center text-[clamp(12px,3.85vw,15px)] leading-[1.5] font-normal text-[#F5F5F5]/50 [@media(max-height:700px)]:mt-[4dvh]">
        <div className="flex flex-col items-center">
          <img src={bulbIcon} alt="" className="h-[50px] w-[50px]" />
          <p className="mt-4">
            빛 반사가 없도록
            <br />
            촬영해주세요
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img src={clarityIcon} alt="" className="h-[46px] w-[46px]" />
          <p className="mt-5">
            정보를 선명하게
            <br />
            보여주세요
          </p>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={landscapeIcon}
            alt=""
            className="mt-[7px] h-[35px] w-[35px]"
          />
          <p className="mt-6">
            가로 방향으로
            <br />
            촬영해주세요
          </p>
        </div>
      </section>

      <div className="mt-auto grid shrink-0 grid-cols-[165fr_169fr] gap-[7px] pt-6 [@media(max-height:700px)]:pt-3">
        <label className="flex h-[57px] cursor-pointer items-center justify-center rounded-[15px] bg-white/15 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]">
          파일업로드
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) => {
              if (event.target.files?.[0]) onCapture();
            }}
          />
        </label>
        <button
          type="button"
          onClick={onCapture}
          className="h-[58px] rounded-[15px] bg-[#F5F5F5] !text-[20px] !leading-[1.5] !font-normal text-[#1D1F20]"
        >
          등록하기
        </button>
      </div>
    </AlienRegistrationOnboardingLayout>
  );
}
