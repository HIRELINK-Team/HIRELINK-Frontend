import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-information-back.svg';
import backGuideImage from '../../../assets/images/student/documents/alien-registration/issue46-back-guide.png';
import { AlienRegistrationOnboardingLayout } from './AlienRegistrationOnboardingLayout';

type AlienRegistrationBackGuideProps = {
  onBack: () => void;
  onConfirm: () => void;
  progressLabel?: string;
};

export function AlienRegistrationBackGuide({
  onBack,
  onConfirm,
  progressLabel = '1/5',
}: AlienRegistrationBackGuideProps) {
  return (
    <AlienRegistrationOnboardingLayout>
      <button
        aria-label="이전 단계로 이동"
        className="flex h-6 w-6 shrink-0 items-center justify-center"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <div className="mt-[9px] shrink-0">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          {progressLabel}
        </strong>
        <span className="block text-[15px] leading-[1.5] text-[#909597]">
          정보 확인
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-[11px] grid shrink-0 grid-cols-2 gap-[5px]"
      >
        <span className="h-0.5 bg-[#00B894]" />
        <span className="h-0.5 bg-[#00B894]" />
      </div>

      <section className="mt-[4.6dvh] shrink-0">
        <h1 className="text-[26px] leading-[1.5] font-semibold">
          외국인 등록증
          <br />
          뒷면을 촬영해주세요.
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          최신 만료일과 주소를 확인해요.
        </p>
      </section>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          alt="외국인등록증 뒷면 촬영 안내"
          className="block h-auto w-[59.4%] max-w-[225px] object-contain"
          src={backGuideImage}
        />
      </div>

      <button
        className="h-[57px] w-full shrink-0 rounded-[15px] bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </AlienRegistrationOnboardingLayout>
  );
}
