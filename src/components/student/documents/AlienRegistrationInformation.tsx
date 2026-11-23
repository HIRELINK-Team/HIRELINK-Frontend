import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-information-back.svg';
import { useTranslation } from 'react-i18next';
import frontGuideImage from '../../../assets/images/student/documents/alien-registration/issue46-front-guide.png';
import { AlienRegistrationOnboardingLayout } from '../onboarding/AlienRegistrationOnboardingLayout';

type AlienRegistrationInformationProps = {
  onBack: () => void;
  onRegister: () => void;
  progressLabel?: string;
};

export function AlienRegistrationInformation({
  onBack,
  onRegister,
  progressLabel = '1/5',
}: AlienRegistrationInformationProps) {
  const { t } = useTranslation();
  return (
    <AlienRegistrationOnboardingLayout>
      <button
        aria-label={t('common.back')}
        className="-ml-1 grid size-8 shrink-0 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <div className="mt-[9px] shrink-0">
        <strong className="block text-[17px] leading-[1.5] font-semibold text-[#00B894]">
          {progressLabel}
        </strong>
        <span className="block text-[15px] leading-[1.5] text-[#909597]">
          {t('my.documents.infoReview')}
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
          {t('my.documents.alienTitle')}
          <br />
          {t('my.documents.alienFrontPrompt')}
        </h1>
        <p className="mt-[10px] mb-0 text-[15px] leading-[1.5] text-[#939393]">
          {t('my.documents.alienDescription')}
        </p>
      </section>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          alt={t('my.alien.frontGuide')}
          className="block h-auto w-[55.3%] max-w-[210px] object-contain"
          src={frontGuideImage}
        />
      </div>

      <button
        className="h-[57px] w-full shrink-0 rounded-[15px] border-0 bg-[#00B894] p-0 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onRegister}
      >
        {t('my.documents.takePhoto')}
      </button>
    </AlienRegistrationOnboardingLayout>
  );
}
