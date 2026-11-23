import { useTranslation } from 'react-i18next';
import backIcon from '../../../assets/icons/student/documents/alien-registration/issue46-information-back.svg';
import scanIcon from '../../../assets/icons/student/documents/alien-registration/issue46-review-scan.svg';
import type { AlienRegistrationFormValues } from './AlienRegistrationEdit';
import { AlienRegistrationOnboardingLayout } from './AlienRegistrationOnboardingLayout';

type AlienRegistrationFrontInfoProps = {
  onBack: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  progressLabel?: string;
  values: AlienRegistrationFormValues;
};

const FRONT_INFORMATION_FIELDS: ReadonlyArray<
  readonly [
    string,
    keyof Pick<
      AlienRegistrationFormValues,
      | 'name'
      | 'nationality'
      | 'residenceQualification'
      | 'registrationNumber'
      | 'issueDate'
    >,
  ]
> = [
  ['이름', 'name'],
  ['국적', 'nationality'],
  ['체류자격', 'residenceQualification'],
  ['등록번호', 'registrationNumber'],
  ['발급일자', 'issueDate'],
];

export function AlienRegistrationFrontInfo({
  onBack,
  onConfirm,
  onRetry,
  progressLabel = '1/5',
  values,
}: AlienRegistrationFrontInfoProps) {
  const { t } = useTranslation();
  const reviewTitle = t('my.documents.reviewTitle').split('\n');
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
        <span className="h-0.5 bg-[#B0B8C1]" />
      </div>

      <section className="mt-[4.6dvh] shrink-0">
        <h1 className="text-[26px] leading-[1.5] font-semibold">
          {reviewTitle[0]}
          <br />
          {reviewTitle[1]}
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          {t('my.documents.reviewDescription')}
        </p>
      </section>

      <section
        aria-label={t('my.alienFlow.frontReview')}
        className="mt-[3.3dvh] flex h-[31.3dvh] min-h-[220px] max-h-[264px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-white/10"
      >
        <div className="flex h-[65px] shrink-0 items-center gap-[9px] bg-[#B8EBDD]/65 px-[33px]">
          <img alt="" className="h-7 w-7" src={scanIcon} />
          <strong className="text-[20px] leading-[1.5] font-semibold text-[#006E59]">
            {t('my.alienFlow.registrationCard')}
          </strong>
        </div>
        <dl className="grid min-h-0 flex-1 grid-rows-5 px-[33px] py-3">
          {FRONT_INFORMATION_FIELDS.map(([, field], index) => (
            <div
              className="grid min-h-0 grid-cols-[69px_minmax(0,1fr)] items-center gap-6"
              key={field}
            >
              <dt className="text-[13px] leading-[1.5] text-[#909597]">
                {t(`my.alienFlow.frontFields.${index}`)}
              </dt>
              <dd className="m-0 min-w-0 truncate text-[13px] leading-[1.5] font-medium text-[#1D1F20]">
                {values[field]}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-auto grid shrink-0 grid-cols-2 gap-3 pt-4">
        <button
          className="h-[57px] rounded-[15px] bg-[#B8EBDD] px-3 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          onClick={onRetry}
        >
          {t('my.documents.retake')}
        </button>
        <button
          className="h-[57px] rounded-[15px] bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={onConfirm}
        >
          {t('common.confirm')}
        </button>
      </div>
    </AlienRegistrationOnboardingLayout>
  );
}
