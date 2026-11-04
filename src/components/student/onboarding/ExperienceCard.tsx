import deleteIcon from '../../../assets/icons/student/delete.svg';
import type { Experience } from '../../../types/experience';

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
  return (
    <article className="relative min-h-[110px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] px-4 py-[14px]">
      <h2 className="m-0 pr-14 text-[17px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {experience.workplace}
      </h2>
      <p className="mt-0.5 mb-0 text-[13px] leading-[1.5] tracking-[-0.02em] text-[#6B7684]">
        {experience.startMonth} - {experience.endMonth}
      </p>
      <p className="mt-0 mb-0 pr-7 text-[13px] leading-[1.5] tracking-[-0.02em] text-[#6B7684]">
        {experience.duties}
      </p>
      <button
        className="absolute top-[14px] right-4 flex h-[25px] items-center justify-center rounded-[30px] bg-[#E5E8EB] px-3 text-[12px] leading-[1.5] tracking-[-0.02em] text-[#191F28]"
        type="button"
        onClick={() => onEdit(experience.id)}
      >
        변경
      </button>
      <button
        aria-label={`${experience.workplace} 경력 삭제`}
        className="absolute right-4 bottom-[14px] flex size-[18px] items-center justify-center border-0 bg-transparent p-0"
        disabled={isDeleting}
        type="button"
        onClick={() => onDelete(experience.id)}
      >
        <img alt="" src={deleteIcon} />
      </button>
    </article>
  );
}
