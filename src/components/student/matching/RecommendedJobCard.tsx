import type { RecommendedJob } from '../../../types/studentMatching';
import timerActiveIcon from '../../../assets/icons/student/matching/timer-active.svg';
import timerInactiveIcon from '../../../assets/icons/student/matching/timer-inactive.svg';

type RecommendedJobCardProps = {
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onDetailClick?: (job: RecommendedJob) => void;
};

export function RecommendedJobCard({
  job,
  onApply,
  onDetailClick,
}: RecommendedJobCardProps) {
  const handleApply = () => {
    onApply?.(job);
  };

  const handleDetailClick = () => {
    onDetailClick?.(job);
  };

  return (
    <article
      className={`relative rounded-[20px] border-[0.7px] border-[#B0B8C1] bg-transparent ${
        job.showsApplyButton ? 'h-[236px]' : 'h-[164px]'
      }`}
    >
      <h2 className="absolute top-[21px] left-[23px] m-0 pr-20 text-[20px] leading-[1.5] font-semibold text-[#191F28]">
        {job.companyName}
      </h2>
      <p className="absolute top-[58px] left-[23px] text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.role}
      </p>
      <p className="absolute top-[88px] left-[23px] text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.commuteAndWage}
      </p>
      <p className="absolute top-[118px] left-[23px] text-[15px] leading-[1.5] text-[#8B95A1]">
        {job.matchDescription}
      </p>
      <span className="absolute top-[24px] right-[23px] text-[13px] leading-[1.5] font-medium text-[#8B95A1]">
        {job.matchRate}% 일치
      </span>
      <div className="absolute top-[44px] right-[23px] flex items-center gap-[5.75px]">
        <img
          alt=""
          src={job.isCountdownActive ? timerActiveIcon : timerInactiveIcon}
        />
        <span
          className={`text-[20px] leading-[1.5] font-semibold ${
            job.isCountdownActive ? 'text-[#009376]' : 'text-[#8B95A1]'
          }`}
        >
          {job.countdownLabel}
        </span>
      </div>
      <button
        className="absolute top-[108px] right-[23px] h-[27px] rounded-[30px] border-0 bg-[#E5E8EB] px-[13px] text-[13px] leading-[1.5] text-[#191F28]"
        type="button"
        onClick={handleDetailClick}
      >
        상세보기
      </button>
      {job.showsApplyButton ? (
        <button
          className="absolute top-[162px] right-[23px] left-[23px] flex h-[51px] items-center justify-center rounded-[15px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      ) : null}
    </article>
  );
}
