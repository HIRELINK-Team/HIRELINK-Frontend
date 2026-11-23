import type { Experience } from '../../../types/experience';
import { useTranslation } from 'react-i18next';

type ExperienceCardProps = {
  experience: Experience;
  isDeleting?: boolean;
  onDelete: (experienceId: string) => void;
  onEdit: (experienceId: string) => void;
};

/** Displays a saved experience entry in the student onboarding list. */
export function ExperienceCard({
  experience,
  isDeleting = false,
  onDelete,
  onEdit,
}: ExperienceCardProps) {
  const { t } = useTranslation();
  return (
    <article className="relative min-h-[132px] rounded-[20px] bg-white px-6 pt-5 pb-4 shadow-[1px_1px_20px_rgba(0,0,0,0.04)]">
      <h2 className="m-0 pr-9 text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {experience.workplace}
      </h2>
      <p className="mt-2 mb-0 text-[15px] leading-[1.5] tracking-[-0.02em] text-[#909597]">
        {experience.startMonth} - {experience.endMonth}
      </p>
      <p className="mt-2 mb-0 pr-[86px] text-[15px] leading-[1.5] font-medium tracking-[-0.02em] text-[#009376]">
        {experience.duties}
      </p>
      <button
        className="absolute right-6 bottom-[21px] flex h-[27px] items-center justify-center rounded-[30px] border-[0.7px] border-[#D3D6D7] bg-transparent px-[13px] text-[13px] leading-[1.5] tracking-[-0.02em] text-[#55595B]"
        type="button"
        onClick={() => onEdit(experience.id)}
      >
        {t('my.experience.change')}
      </button>
      <button
        aria-label={t('my.experience.delete', { name: experience.workplace })}
        className="absolute top-[25px] right-6 flex size-5 items-center justify-center border-0 bg-transparent p-0 text-[#909597]"
        disabled={isDeleting}
        type="button"
        onClick={() => onDelete(experience.id)}
      >
        <span
          aria-hidden="true"
          className="absolute h-[1.5px] w-[14px] rotate-45 rounded-full bg-current"
        />
        <span
          aria-hidden="true"
          className="absolute h-[1.5px] w-[14px] -rotate-45 rounded-full bg-current"
        />
      </button>
    </article>
  );
}
