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
  const companyName = job.companyName || '근무지 정보';
  const comparisonTags = (
    job.detail.comparisonTags.length > 0
      ? job.detail.comparisonTags
      : job.detail.tags
  ).slice(0, 2);
  const detailMetrics = job.detail.metrics.slice(0, 4);
  const detailTags = job.detail.tags.slice(0, 2);
  const metricGridClassName =
    detailMetrics.length === 1
      ? 'grid-cols-1'
      : detailMetrics.length === 2
        ? 'grid-cols-2'
        : detailMetrics.length === 3
          ? 'grid-cols-3'
          : 'grid-cols-4';
  const locationAndDistance =
    job.detail.locationAndDistance || '위치 정보 없음';

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
    <section className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="absolute top-0 h-[282px] w-full overflow-hidden">
        <img
          alt=""
          className="absolute top-0 left-[-88px] h-[874px] w-[557px] max-w-none"
          src={detailMapImage}
        />
      </div>

      <button
        aria-label="추천 목록으로 돌아가기"
        className="absolute top-9 left-6 z-10 flex h-[44px] w-[42px] items-center justify-center rounded-[33px] border-0 bg-[#F5F5F5] p-0 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]"
        type="button"
        onClick={handleBack}
      >
        <img alt="" src={detailBackIcon} />
      </button>
      <span className="absolute top-[37px] left-[85px] z-10 flex h-[42px] items-center gap-[5px] rounded-[30px] bg-[#F5F5F5] px-[15px] py-2.5 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]">
        <img alt="" src={detailMapPinIcon} />
        <span className="text-[15px] leading-[1.5] font-medium">길찾기</span>
      </span>

      <section className="absolute top-[282px] right-0 bottom-0 left-0 rounded-t-[30px] bg-[#F5F5F5] shadow-[0px_-3px_35px_rgba(0,0,0,0.15)]">
        <h1 className="absolute top-[26px] right-6 left-6 m-0 truncate text-[26px] leading-[1.5] font-semibold">
          {companyName}
        </h1>
        <p className="absolute top-[69px] right-6 left-6 m-0 truncate text-[13px] leading-[1.5] text-[#8B95A1]">
          {locationAndDistance}
        </p>

        <div className="absolute top-[106px] right-[146px] left-6 flex gap-[2px] overflow-hidden whitespace-nowrap">
          {detailTags.map((tag) => (
            <span
              className="shrink-0 rounded-[30px] bg-[#E5E8EB] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5] font-medium"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="absolute top-[103px] right-6 flex items-end gap-2">
          <span className="text-[26px] leading-[1.5] font-semibold text-[#009376]">
            {job.detail.matchRate}%
          </span>
          <span className="mb-1 text-[13px] leading-[1.5] text-[#8B95A1]">
            적합
          </span>
        </div>
        <div className="absolute top-[163px] right-6 left-6 border-t-[0.7px] border-[#B0B8C1]" />

        <div
          className={`absolute top-[192px] right-[47px] left-[47px] grid items-start ${metricGridClassName}`}
        >
          {detailMetrics.map((metric, index) => (
            <div
              className="flex min-w-0 flex-col items-center gap-[7px]"
              key={`${metric.label}-${index}`}
            >
              <span className="flex h-[51px] w-[51px] shrink-0 items-center justify-center truncate rounded-[25.5px] bg-[#E5E8EB] px-1 text-[13px] leading-[1.5] font-medium">
                {metric.label}
              </span>
              <span className="w-full truncate text-center text-[13px] leading-[1.5] font-medium">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        <h2 className="absolute top-[298px] left-6 m-0 text-[20px] leading-[1.5] font-semibold">
          나와의 조건 비교
        </h2>
        <div className="absolute top-[339px] right-6 left-6 flex gap-2 overflow-hidden whitespace-nowrap">
          {comparisonTags.map((tag) => (
            <span
              className="shrink-0 rounded-[30px] border-[0.7px] border-[#B0B8C1] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <label className="absolute top-[409px] left-6 flex cursor-pointer items-center gap-2.5 text-[15px] leading-[1.5]">
          <input
            checked={isRecommendationDisabled}
            className="peer sr-only"
            type="checkbox"
            onChange={handleRecommendationDisabledChange}
          />
          <span
            aria-hidden="true"
            className="flex size-[21px] shrink-0 items-center justify-center rounded-[5px] border border-[#191F28] bg-transparent text-[13px] text-white peer-checked:border-[#00B894] peer-checked:bg-[#00B894]"
          >
            {isRecommendationDisabled ? '✓' : ''}
          </span>
          이 일자리는 더 이상 추천받지 않을래요!
        </label>

        <button
          className="absolute right-6 bottom-[37px] left-6 h-[57px] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      </section>
    </section>
  );
}
