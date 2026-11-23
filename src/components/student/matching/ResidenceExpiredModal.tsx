import { useTranslation } from 'react-i18next';

import warningIcon from '../../../assets/icons/student/matching/expired-warning.svg';

type ResidenceExpiredModalProps = {
  onBack: () => void;
  onUpdate: () => void;
};

/** Blocks matching when the server-backed residence expiration date has passed. */
export function ResidenceExpiredModal({
  onBack,
  onUpdate,
}: ResidenceExpiredModalProps) {
  const { t } = useTranslation();
  return (
    <section
      aria-labelledby="residence-expired-title"
      aria-modal="true"
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 px-[38px]"
      role="dialog"
    >
      <div className="relative h-[332px] w-full max-w-[313px] rounded-[20px] bg-[#F5F5F5] px-[19px] pt-[42px] text-center">
        <img alt="" className="mx-auto block size-[38px]" src={warningIcon} />
        <h2
          className="mt-[25px] mb-0 text-[20px] leading-[1.5] font-semibold text-[#1D1F20]"
          id="residence-expired-title"
        >
          {t('matching.residenceExpiredTitle')}
        </h2>
        <p className="mt-[7px] mb-0 text-[15px] leading-[1.5] text-[#909597]">
          <span className="whitespace-pre-line">
            {t('matching.residenceExpiredDescription')}
          </span>
        </p>
        <div className="absolute right-[19px] bottom-[18px] left-[19px] grid gap-2">
          <button
            className="h-[46px] rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
            type="button"
            onClick={onUpdate}
          >
            {t('matching.updateResidence')}
          </button>
          <button
            className="h-[46px] rounded-[15px] border-0 bg-[#B8EBDD] text-[17px] leading-[1.5] font-medium text-[#006E59]"
            type="button"
            onClick={onBack}
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    </section>
  );
}
