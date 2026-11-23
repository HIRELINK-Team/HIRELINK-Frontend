import { useTranslation } from 'react-i18next';

import refreshIllustration from '../../../assets/images/student/matching/recommendation-refresh-illustration.png';

type RecommendationRefreshModalProps = {
  isSubmitting?: boolean;
  onConfirm: () => void | Promise<void>;
};

/** Modal shown after the matching recommendations have been refreshed. */
export function RecommendationRefreshModal({
  isSubmitting = false,
  onConfirm,
}: RecommendationRefreshModalProps) {
  const { t } = useTranslation();
  return (
    <section
      aria-label={t('matching.refreshDialog')}
      aria-modal="true"
      className="absolute inset-0 z-40 bg-black/50"
      role="dialog"
    >
      <div className="absolute top-[271px] left-1/2 h-[360px] w-[313px] -translate-x-1/2 overflow-hidden rounded-[20px] bg-[#F5F5F5]">
        <img
          alt=""
          className="student-3d-illustration absolute top-[47px] left-[106px] h-[106px] w-[93px]"
          src={refreshIllustration}
        />
        <h2 className="absolute top-[170px] left-0 m-0 w-full text-center text-[20px] leading-[1.5] font-semibold text-[#191F28]">
          {t('matching.refreshTitle')}
        </h2>
        <p className="absolute top-[208px] left-0 m-0 w-full text-center text-[15px] leading-[1.5] text-[#8B95A1]">
          <span className="whitespace-pre-line">
            {t('matching.refreshDescription')}
          </span>
        </p>
        <button
          className="absolute right-[19px] bottom-6 left-[19px] h-[54px] rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
          type="button"
          onClick={onConfirm}
        >
          {t('common.confirm')}
        </button>
      </div>
    </section>
  );
}
