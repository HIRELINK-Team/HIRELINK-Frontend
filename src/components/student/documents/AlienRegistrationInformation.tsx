import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-information-back.svg';
import frontGuideImage from '../../../assets/images/student/documents/alien-registration/issue46-front-guide.png';
import { AlienRegistrationOnboardingLayout } from '../onboarding/AlienRegistrationOnboardingLayout';

type AlienRegistrationInformationProps = {
  onBack: () => void;
  onRegister: () => void;
};

export function AlienRegistrationInformation({
  onBack,
  onRegister,
}: AlienRegistrationInformationProps) {
  return (
    <AlienRegistrationOnboardingLayout>
      <button
        aria-label="뒤로 가기"
        className="-ml-1 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <div className="mt-[9px] shrink-0">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          1/6
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
        <span className="h-0.5 bg-[#B3B8B9]" />
      </div>

      <section className="mt-[4.6dvh] shrink-0">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold tracking-[-0.02em]">
          외국인 등록증
          <br />
          앞면을 촬영해주세요.
        </h1>
        <p className="mt-[10px] mb-0 text-[15px] leading-[1.5] text-[#939393]">
          이름과 체류자격을 확인해요.
        </p>
      </section>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          alt="외국인등록증 앞면 촬영 안내"
          className="block h-auto w-[55.3%] max-w-[210px] object-contain"
          src={frontGuideImage}
        />
      </div>

      <button
        className="h-[57px] w-full shrink-0 rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        촬영하기
      </button>
    </AlienRegistrationOnboardingLayout>
  );
}
