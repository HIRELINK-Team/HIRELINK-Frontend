import { useTranslation } from 'react-i18next';
import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import completeIllustration from '../../../assets/images/student/documents/alien-registration/front-verification-complete.png';
import { AlienRegistrationOnboardingLayout } from './AlienRegistrationOnboardingLayout';

type AlienRegistrationFrontCompleteProps = {
  onBack: () => void;
  onConfirm: () => void;
  showDescription?: boolean;
};

export function AlienRegistrationFrontComplete({
  onBack,
  onConfirm,
  showDescription = true,
}: AlienRegistrationFrontCompleteProps) {
  const { t } = useTranslation();
  const description = t('my.alienFlow.frontDoneDescription').split('\n');
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

      <section className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <img
          alt={t('my.alienFlow.frontDoneImage')}
          className="student-3d-illustration w-[min(26vw,102px)] min-w-[88px]"
          src={completeIllustration}
        />
        <h1 className="mt-8 m-0 text-[22px] leading-[1.5] font-semibold">
          {t('my.alienFlow.frontDone')}
        </h1>
        {showDescription ? (
          <p className="mt-1 text-center text-[13px] leading-[1.5] text-[#909597]">
            {description[0]}
            <br />
            {description[1]}
          </p>
        ) : null}
      </section>

      <button
        className="min-h-[57px] w-full shrink-0 rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </button>
    </AlienRegistrationOnboardingLayout>
  );
}
