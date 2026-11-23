import { useTranslation } from 'react-i18next';

import emptyStateIllustration from '../../../assets/images/student/matching/empty-state-illustration.png';

type MatchingEmptyStateProps = {
  onConfirm?: () => void;
};

/** Empty recommendation state reused when student matching has no available jobs. */
export function MatchingEmptyState({ onConfirm }: MatchingEmptyStateProps) {
  const { t } = useTranslation();
  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <section
      aria-labelledby="matching-empty-title"
      className="relative h-full bg-[#F5F5F5]"
    >
      <div className="absolute top-[278px] left-1/2 h-[113px] w-[88px] -translate-x-1/2 drop-shadow-[1px_1px_32px_rgba(0,184,148,0.28)]">
        <img
          alt=""
          className="student-3d-illustration block h-full w-full object-contain"
          src={emptyStateIllustration}
        />
      </div>
      <div className="absolute top-[404px] left-1/2 w-full -translate-x-1/2 text-center">
        <h1
          className="m-0 text-[22px] leading-[1.5] font-semibold text-[#1D1F20]"
          id="matching-empty-title"
        >
          <span className="whitespace-pre-line">{t('matching.emptyTitle')}</span>
        </h1>
        <p className="mt-[15px] text-[13px] leading-[1.5] text-[#8B95A1]">
          <span className="whitespace-pre-line">
            {t('matching.emptyDescription')}
          </span>
        </p>
      </div>
      <button
        className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
        type="button"
        onClick={handleConfirm}
      >
        {t('common.confirm')}
      </button>
    </section>
  );
}
