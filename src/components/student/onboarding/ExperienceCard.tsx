import deleteIcon from '../../../assets/icons/student/delete.svg';
import type { Experience } from '../../../types/experience';

type ExperienceCardProps = {
  experience: Experience;
  onDelete: (experienceId: string) => void;
  onEdit: (experienceId: string) => void;
};

/** Displays a saved experience entry in the student onboarding list. */
export function ExperienceCard({
  experience,
  onDelete,
  onEdit,
}: ExperienceCardProps) {
  return (
    <article className="relative min-h-[132px] rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] px-[23px] py-5">
      <h2 className="m-0 pr-16 text-[20px] leading-[1.5] font-semibold tracking-[-0.02em] text-[#191F28]">
        {experience.workplace}
      </h2>
      <p className="mt-1.5 mb-0 text-[15px] leading-[1.5] tracking-[-0.02em] text-[#6B7684]">
        {experience.startMonth} - {experience.endMonth}
      </p>
      <p className="mt-[5px] mb-0 pr-8 text-[15px] leading-[1.5] tracking-[-0.02em] text-[#6B7684]">
        {experience.duties}
      </p>
      <button
        className="absolute top-[23px] right-[23px] flex h-[27px] items-center justify-center rounded-[30px] bg-[#E5E8EB] px-[13.64px] text-[13px] leading-[1.5] tracking-[-0.02em] text-[#191F28]"
        type="button"
        onClick={() => onEdit(experience.id)}
      >
        변경
      </button>
      <button
        aria-label={`${experience.workplace} 경력 삭제`}
        className="absolute right-[22px] bottom-[21px] flex size-[21px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={() => onDelete(experience.id)}
      >
        <img alt="" src={deleteIcon} />
      </button>
    </article>
  );
}
