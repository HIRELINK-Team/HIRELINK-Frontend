import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  return (
    <AlienRegistrationOnboardingLayout>
      <button
        aria-label={t('common.back')}
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
          {t('my.documents.infoReview')}
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
          {t('my.documents.alienTitle')}
          <br />
          {t('my.alienFlow.backPrompt')}
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          {t('my.alienFlow.backDescription')}
        </p>
      </section>

      <div className="flex min-h-0 flex-1 items-center justify-center py-4">
        <img
          alt={t('my.alienFlow.backGuide')}
          className="block h-auto w-[59.4%] max-w-[225px] object-contain"
          src={backGuideImage}
        />
      </div>

      <button
        className="h-[57px] w-full shrink-0 rounded-[15px] bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </button>
    </AlienRegistrationOnboardingLayout>
  );
}
