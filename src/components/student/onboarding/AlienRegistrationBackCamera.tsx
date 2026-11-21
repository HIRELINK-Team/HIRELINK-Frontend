import backIcon from '../../../assets/icons/student/documents/alien-registration/camera-back.svg';
import bulbIcon from '../../../assets/icons/student/documents/alien-registration/camera-bulb.svg';
import clarityIcon from '../../../assets/icons/student/documents/alien-registration/camera-clarity.svg';
import landscapeIcon from '../../../assets/icons/student/documents/alien-registration/camera-landscape.svg';

type AlienRegistrationBackCameraProps = {
  onBack: () => void;
  onCapture: () => void;
};

const CAMERA_GUIDES = [
  { icon: bulbIcon, label: '빛 반사가 없도록\n촬영해주세요', size: 'size-[50px]' },
  { icon: clarityIcon, label: '정보를 선명하게\n보여주세요', size: 'size-[46px]' },
  { icon: landscapeIcon, label: '가로 방향으로\n촬영해주세요', size: 'size-[35px]' },
] as const;

export function AlienRegistrationBackCamera({
  onBack,
  onCapture,
}: AlienRegistrationBackCameraProps) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[430px] flex-col overflow-y-auto bg-[#3F3F3F] px-6 pt-[calc(61px+env(safe-area-inset-top))] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#F5F5F5] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <button
        aria-label="이전 단계로 이동"
        className="-ml-1 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <p className="mt-8 text-center text-[15px] leading-[1.4]">
        영역 안에 등록증이 꽉 차도록 조절하면
        <br />
        자동으로 촬영돼요.
      </p>

      <div className="mt-[62px] aspect-[342/207] w-full rounded-[10px] border border-[#F5F5F5]" />

      <section aria-label="촬영 가이드" className="mt-[66px] grid grid-cols-3 gap-2">
        {CAMERA_GUIDES.map(({ icon, label, size }) => (
          <div className="flex min-w-0 flex-col items-center" key={label}>
            <img alt="" className={size} src={icon} />
            <p className="mt-5 whitespace-pre-line text-center text-[15px] leading-[1.5] text-[#F5F5F5]/50">
              {label}
            </p>
          </div>
        ))}
      </section>

      <div className="mt-auto grid grid-cols-2 gap-[7px] pt-10">
        <label className="flex min-h-[57px] cursor-pointer items-center justify-center rounded-[15px] bg-white/15 px-3 text-[20px] leading-[1.5] font-medium">
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
          className="min-h-[58px] rounded-[15px] border-0 bg-[#F5F5F5] px-3 text-[20px] leading-[1.5] text-[#1D1F20]"
          type="button"
          onClick={onCapture}
        >
          등록하기
        </button>
      </div>
    </main>
  );
}
