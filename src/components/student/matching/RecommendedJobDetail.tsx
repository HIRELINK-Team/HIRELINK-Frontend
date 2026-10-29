import { useState } from 'react';

import detailBackIcon from '../../../assets/icons/student/matching/detail-back.svg';
import detailMapPinIcon from '../../../assets/icons/student/matching/detail-map-pin.svg';
import detailMapImage from '../../../assets/images/student/matching/detail-map.png';
import type { RecommendedJob } from '../../../types/studentMatching';

type RecommendedJobDetailProps = {
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onBack?: () => void;
};

export function RecommendedJobDetail({
  job,
  onApply,
  onBack,
}: RecommendedJobDetailProps) {
  const [isRecommendationDisabled, setIsRecommendationDisabled] =
    useState(false);

  const handleApply = () => {
    onApply?.(job);
  };

  const handleBack = () => {
    onBack?.();
  };

  const handleRecommendationDisabledChange = () => {
    setIsRecommendationDisabled((currentValue) => !currentValue);
  };

  return (
    <section className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="absolute top-0 h-[282px] w-full overflow-hidden">
        <img
          alt=""
          className="absolute top-0 left-[-88px] h-[874px] w-[557px] max-w-none"
          src={detailMapImage}
        />
      </div>

      <button
        aria-label="추천 목록으로 돌아가기"
        className="absolute top-[45px] left-6 z-10 flex h-[44px] w-[42px] items-center justify-center rounded-[33px] border-0 bg-[#F5F5F5] p-0 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]"
        type="button"
        onClick={handleBack}
      >
        <img alt="" src={detailBackIcon} />
      </button>
      <span className="absolute top-[46px] left-[85px] z-10 flex h-[42px] items-center gap-[5px] rounded-[30px] bg-[#F5F5F5] px-[15px] py-2.5 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]">
        <img alt="" src={detailMapPinIcon} />
        <span className="text-[15px] leading-[1.5] font-medium">길찾기</span>
      </span>

      <section className="absolute top-[282px] h-[562px] w-full rounded-t-[30px] bg-[#F5F5F5] shadow-[0px_-3px_35px_rgba(0,0,0,0.15)]">
        <h1 className="absolute top-[26px] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
          {job.companyName}
        </h1>
        <p className="absolute top-[69px] left-6 text-[13px] leading-[1.5] text-[#8B95A1]">
          {job.detail.locationAndDistance}
        </p>

        <div className="absolute top-[106px] left-6 flex gap-[2px]">
          {job.detail.tags.map((tag) => (
            <span
              className="rounded-[30px] bg-[#E5E8EB] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5] font-medium"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="absolute top-[103px] right-[72px] text-[26px] leading-[1.5] font-semibold text-[#009376]">
          {job.detail.matchRate}%
        </span>
        <span className="absolute top-[117px] right-6 text-[13px] leading-[1.5] text-[#8B95A1]">
          적합
        </span>
        <div className="absolute top-[163px] right-6 left-6 border-t-[0.7px] border-[#B0B8C1]" />

        <div className="absolute top-[192px] right-[47px] left-[47px] flex items-start justify-between">
          {job.detail.metrics.map((metric) => (
            <div
              className="flex w-[51px] flex-col items-center gap-[7px]"
              key={metric.label}
            >
              <span className="flex h-[51px] w-[51px] items-center justify-center rounded-[25.5px] bg-[#E5E8EB] text-[13px] leading-[1.5] font-medium">
                {metric.label}
              </span>
              <span className="whitespace-nowrap text-[13px] leading-[1.5] font-medium">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <h2 className="absolute top-[298px] left-6 m-0 text-[20px] leading-[1.5] font-semibold">
          나와의 조건 비교
        </h2>
        <div className="absolute top-[339px] left-6 flex gap-2">
          {job.detail.comparisonTags.map((tag) => (
            <span
              className="rounded-[30px] border-[0.7px] border-[#B0B8C1] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <label className="absolute top-[409px] left-6 flex cursor-pointer items-center gap-2.5 text-[15px] leading-[1.5]">
          <input
            checked={isRecommendationDisabled}
            className="size-[21px] appearance-none rounded-[5px] border border-[#191F28] bg-transparent checked:bg-[#191F28]"
            type="checkbox"
            onChange={handleRecommendationDisabledChange}
          />
          이 일자리는 더 이상 추천받지 않을래요!
        </label>

        <button
          className="absolute top-[468px] right-6 left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      </section>
    </section>
  );
}
