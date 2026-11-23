import { useTranslation } from 'react-i18next';
import backIcon from '../../../assets/icons/student/documents/alien-registration/information-back.svg';
import scanIcon from '../../../assets/icons/student/documents/alien-registration/review-scan.svg';
import { AlienRegistrationOnboardingLayout } from './AlienRegistrationOnboardingLayout';

export type AlienRegistrationBackInfoValues = {
  expirationDate: string;
  permissionDate: string;
  reportDate: string;
  serialNumber: string;
};

type AlienRegistrationBackInfoProps = {
  onBack: () => void;
  onConfirm: () => void;
  onRetry: () => void;
  progressLabel?: string;
  values: AlienRegistrationBackInfoValues;
};

const FIELD_LABELS: ReadonlyArray<
  readonly [string, keyof AlienRegistrationBackInfoValues]
> = [
  ['허가일자', 'permissionDate'],
  ['만료일자', 'expirationDate'],
  ['신고일', 'reportDate'],
  ['일련번호', 'serialNumber'],
];

export function AlienRegistrationBackInfo({
  onBack,
  onConfirm,
  onRetry,
  progressLabel = '1/5',
  values,
}: AlienRegistrationBackInfoProps) {
  const { t } = useTranslation();
  const reviewTitle = t('my.documents.reviewTitle').split('\n');
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
        {Array.from({ length: 2 }, (_, index) => (
          <span className="h-0.5 bg-[#00B894]" key={index} />
        ))}
      </div>

      <section className="mt-[4.6dvh] shrink-0">
        <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
          {reviewTitle[0]}
          <br />
          {reviewTitle[1]}
        </h1>
        <p className="mt-[10px] text-[15px] leading-[1.5] text-[#939393]">
          {t('my.documents.reviewDescription')}
        </p>

        <section
          aria-label={t('my.alienFlow.backReview')}
          className="mt-[28px] overflow-hidden rounded-[20px] border-[0.7px] border-white bg-white/10"
        >
          <div className="flex items-center gap-[9px] rounded-t-[20px] bg-[#B8EBDD]/65 px-[33px] py-[18px]">
            <img alt="" className="size-7" src={scanIcon} />
            <strong className="text-[20px] leading-[1.5] font-semibold text-[#006E59]">
              {t('my.alienFlow.registrationCard')}
            </strong>
          </div>
          <dl className="grid gap-2 px-[33px] py-[17px]">
            {FIELD_LABELS.map(([, field], index) => (
              <div
                className="grid min-h-6 grid-cols-[69px_minmax(0,1fr)] items-center gap-6"
                key={field}
              >
                <dt className="text-[13px] leading-[1.5] text-[#909597]">
                  {t(`my.alienFlow.backFields.${index}`)}
                </dt>
                <dd className="m-0 min-w-0 truncate text-[13px] leading-[1.5] font-medium">
                  {values[field]}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </section>

      <div className="mt-auto grid shrink-0 grid-cols-2 gap-3 pt-4">
        <button
          className="min-h-[57px] rounded-[15px] border-0 bg-[#B8EBDD] px-3 text-[20px] leading-[1.5] font-medium text-[#006E59]"
          type="button"
          onClick={onRetry}
        >
          {t('my.documents.retake')}
        </button>
        <button
          className="min-h-[57px] rounded-[15px] border-0 bg-[#00B894] px-3 text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={onConfirm}
        >
          {t('common.confirm')}
        </button>
      </div>
    </AlienRegistrationOnboardingLayout>
  );
}
