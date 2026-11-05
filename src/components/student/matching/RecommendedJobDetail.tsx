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
  const comparisonTags = job.detail.comparisonTags.slice(0, 2);
  const detailMetrics = job.detail.metrics.slice(0, 4);
  const detailTags = job.detail.tags.slice(0, 2);
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
    <section className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="absolute top-0 h-[clamp(234px,33.4dvh,282px)] w-full overflow-hidden">
        <img
          alt=""
          className="absolute top-0 left-[-88px] h-[874px] w-[557px] max-w-none"
          src={detailMapImage}
        />
      </div>

      <button
        aria-label="추천 목록으로 돌아가기"
        className="absolute top-[clamp(36px,5.33dvh,45px)] left-6 z-10 flex h-[44px] w-[42px] items-center justify-center rounded-[33px] border-0 bg-[#F5F5F5] p-0 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]"
        type="button"
        onClick={handleBack}
      >
        <img alt="" src={detailBackIcon} />
      </button>
      <span className="absolute top-[clamp(37px,5.45dvh,46px)] left-[85px] z-10 flex h-[42px] items-center gap-[5px] rounded-[30px] bg-[#F5F5F5] px-[15px] py-2.5 shadow-[0px_1px_3.25px_rgba(0,0,0,0.25)]">
        <img alt="" src={detailMapPinIcon} />
        <span className="text-[15px] leading-[1.5] font-medium">길찾기</span>
      </span>

      <section className="absolute top-[clamp(234px,33.4dvh,282px)] right-0 bottom-0 left-0 rounded-t-[30px] bg-[#F5F5F5] shadow-[0px_-3px_35px_rgba(0,0,0,0.15)]">
        <h1 className="absolute top-[clamp(20px,3.08dvh,26px)] right-6 left-6 m-0 truncate text-[26px] leading-[1.5] font-semibold">
          {companyName}
        </h1>
        <p className="absolute top-[clamp(56px,8.18dvh,69px)] right-6 left-6 m-0 truncate text-[13px] leading-[1.5] text-[#8B95A1]">
          {locationAndDistance}
        </p>

        <div className="absolute top-[clamp(84px,12.56dvh,106px)] right-[132px] left-6 flex gap-[2px] overflow-hidden whitespace-nowrap">
          {detailTags.map((tag) => (
            <span
              className="shrink-0 rounded-[30px] bg-[#E5E8EB] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5] font-medium"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="absolute top-[clamp(82px,12.2dvh,103px)] right-[72px] text-[26px] leading-[1.5] font-semibold text-[#009376]">
          {job.detail.matchRate}%
        </span>
        <span className="absolute top-[clamp(93px,13.86dvh,117px)] right-6 text-[13px] leading-[1.5] text-[#8B95A1]">
          적합
        </span>
        <div className="absolute top-[clamp(137px,19.31dvh,163px)] right-6 left-6 border-t-[0.7px] border-[#B0B8C1]" />

        <div className="absolute top-[clamp(156px,22.75dvh,192px)] right-[47px] left-[47px] flex items-start justify-between">
          {detailMetrics.map((metric, index) => (
            <div
              className="flex w-[51px] flex-col items-center gap-[7px]"
              key={`${metric.label}-${index}`}
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

        <h2 className="absolute top-[clamp(242px,35.31dvh,298px)] left-6 m-0 text-[20px] leading-[1.5] font-semibold">
          나와의 조건 비교
        </h2>
        <div className="absolute top-[clamp(282px,40.17dvh,339px)] right-6 left-6 flex gap-2 overflow-hidden whitespace-nowrap">
          {comparisonTags.map((tag) => (
            <span
              className="shrink-0 rounded-[30px] border-[0.7px] border-[#B0B8C1] px-[13.636px] py-[6.818px] text-[13px] leading-[1.5]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <label className="absolute top-[clamp(340px,48.46dvh,409px)] left-6 flex cursor-pointer items-center gap-2.5 text-[15px] leading-[1.5]">
          <input
            checked={isRecommendationDisabled}
            className="size-[21px] appearance-none rounded-[5px] border border-[#191F28] bg-transparent checked:bg-[#191F28]"
            type="checkbox"
            onChange={handleRecommendationDisabledChange}
          />
          이 일자리는 더 이상 추천받지 않을래요!
        </label>

        <button
          className="absolute right-6 bottom-[clamp(22px,4.38dvh,37px)] left-6 h-[clamp(52px,6.75dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
          type="button"
          onClick={handleApply}
        >
          지원하기
        </button>
      </section>
    </section>
  );
}
