import type { RecommendedJob } from '../../../types/studentMatching';

type RecommendedJobCardProps = {
  job: RecommendedJob;
  onDetailClick?: (job: RecommendedJob) => void;
};

export function RecommendedJobCard({
  job,
  onDetailClick,
}: RecommendedJobCardProps) {
  const handleDetailClick = () => {
    onDetailClick?.(job);
  };

  return (
    <article className="relative h-[144px] rounded-[20px] border-[0.7px] border-[#B0B8C1] px-[23px] py-[21px]">
      <h2 className="m-0 pr-20 text-[20px] leading-[1.5] font-semibold text-[#191F28]">
        {job.companyName}
      </h2>
      <p className="mt-1 text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.role}
      </p>
      <p className="mt-[6px] text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.commuteAndWage}
      </p>
      <p className="mt-[6px] text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.matchDescription}
      </p>
      <span className="absolute top-[24px] right-[23px] text-[13px] leading-[1.5] font-medium text-[#8B95A1]">
        {job.matchRate}% 일치
      </span>
      <button
        className="absolute right-[23px] bottom-[19px] h-[27px] rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5] text-[#191F28]"
        type="button"
        onClick={handleDetailClick}
      >
        상세보기
      </button>
    </article>
  );
}
