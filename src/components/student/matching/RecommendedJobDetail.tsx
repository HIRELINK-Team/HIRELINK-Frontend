import calendarIcon from '../../../assets/icons/student/matching/job-calendar.svg';
import roleIcon from '../../../assets/icons/student/matching/job-role.svg';
import timeIcon from '../../../assets/icons/student/matching/job-time.svg';
import wageIcon from '../../../assets/icons/student/matching/job-wage.svg';
import detailBackIcon from '../../../assets/icons/student/matching/detail-back.svg';
import detailMapPinIcon from '../../../assets/icons/student/matching/detail-map-pin.svg';
import detailMapImage from '../../../assets/images/student/matching/detail-map.png';
import type { RecommendedJob } from '../../../types/studentMatching';
import {
  formatDistrictAndWalkingTime,
  formatMatchingComparisonTags,
} from '../../../utils/studentMatchingDisplay';

type RecommendedJobDetailProps = {
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onBack?: () => void;
};

function getRoleLabel(role: string) {
  return role.replace(/^직무\s*\|\s*/, '') || '직무 정보 없음';
}

function getWorkTimeSummary(job: RecommendedJob) {
  const values = job.detail.metrics
    .filter((metric) => metric.label.startsWith('근무'))
    .map((metric) => metric.value);
  const days = values.map((value) => value.split(' ')[0]).filter(Boolean);
  const times = values
    .map((value) => value.split(' ').slice(1).join(' '))
    .filter(Boolean);

  return {
    dayLabel: days.length > 0 ? days.join(' · ') : '근무 요일 정보 없음',
    timeLabel:
      times.length > 0 ? [...new Set(times)].join(', ') : '근무 시간 정보 없음',
  };
}

function JobInformationRow({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-[22px]">
      <span className="flex size-4 shrink-0 items-center justify-center">
        <img alt="" className="block max-h-4 max-w-4" src={icon} />
      </span>
      <span className="min-w-0 truncate text-[15px] leading-[1.5]">
        {value}
      </span>
    </div>
  );
}

export function RecommendedJobDetail({
  job,
  onApply,
  onBack,
}: RecommendedJobDetailProps) {
  const applicationStatusLabel =
    job.applicationStatus === 'WAITING_RESPONSE'
      ? '지원 완료'
      : job.applicationStatus === 'OFFERED'
        ? '채용 제안 확인 중'
        : null;
  const wageLabel =
    job.detail.metrics.find((metric) => metric.label === '급여')?.value ??
    '급여 정보 없음';
  const { dayLabel, timeLabel } = getWorkTimeSummary(job);
  const comparisonTags = formatMatchingComparisonTags(
    job.detail.comparisonTags,
  ).slice(0, 2);
  const locationLabel = formatDistrictAndWalkingTime(
    job.detail.locationAndDistance,
    job.detail.walkingTimeMinutes,
  );

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#1D1F20]">
      <div className="absolute top-0 h-[282px] w-full overflow-hidden">
        <img
          alt="근무지 주변 지도"
          className="absolute top-0 left-[-88px] h-[874px] w-[557px] max-w-none"
          src={detailMapImage}
        />
      </div>

      <button
        aria-label="추천 목록으로 돌아가기"
        className="absolute top-[45px] left-6 z-10 flex size-[44px] items-center justify-center rounded-full border-0 bg-[#F5F5F5] p-0 shadow-[0_1px_3.25px_rgba(0,0,0,0.25)]"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={detailBackIcon} />
      </button>
      <span className="absolute top-[46px] right-6 z-10 flex h-[42px] items-center gap-[5px] rounded-[30px] bg-[#F5F5F5] px-[15px] text-[15px] leading-[1.5] font-medium shadow-[0_1px_3.25px_rgba(0,0,0,0.25)]">
        <img alt="" src={detailMapPinIcon} />
        지도보기
      </span>

      <section className="absolute top-[282px] right-0 bottom-0 left-0 rounded-t-[30px] bg-[#F5F5F5] px-6 pt-[26px] shadow-[0_-3px_35px_rgba(0,0,0,0.15)]">
        <h1 className="m-0 truncate text-[26px] leading-[1.5] font-semibold">
          {job.companyName || '근무지 정보'}
        </h1>
        <p className="mt-[-1px] mb-0 truncate text-[13px] leading-[1.5] text-[#909597]">
          {locationLabel}
        </p>

        <div className="mt-[17px] grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 gap-[5px] overflow-hidden">
            {comparisonTags.map((tag) => (
              <span
                className="flex h-[34px] shrink-0 items-center justify-center rounded-[30px] bg-[#E6E8E9] px-[13.636px] text-[13px] leading-[1.5] font-medium whitespace-nowrap"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="m-0 flex shrink-0 items-baseline gap-1 whitespace-nowrap">
            <span className="text-[26px] leading-[1.5] font-semibold text-[#009376]">
              {job.detail.matchRate}%
            </span>
            <span className="text-[13px] leading-[1.5] text-[#909597]">
              적합
            </span>
          </p>
        </div>

        <div className="mt-[19px] border-t-[0.7px] border-[#D3D6D7]" />

        <h2 className="mt-[17px] mb-0 text-[17px] leading-[1.5] font-semibold">
          가게 정보
        </h2>
        <div className="mt-[13px] flex flex-col gap-1">
          <JobInformationRow icon={roleIcon} value={getRoleLabel(job.role)} />
          <JobInformationRow icon={wageIcon} value={wageLabel} />
          <JobInformationRow icon={calendarIcon} value={dayLabel} />
          <JobInformationRow icon={timeIcon} value={timeLabel} />
        </div>

        <h2 className="mt-[18px] mb-0 text-[17px] leading-[1.5] font-semibold">
          공고
        </h2>
        <p className="mt-[9px] mb-0 line-clamp-3 text-[15px] leading-[1.5]">
          {job.detail.announcement ??
            '사업주가 등록한 상세 공고 내용이 없습니다.'}
        </p>

        <div className="absolute right-0 bottom-0 left-0 h-[115px] bg-[#F5F5F5] px-6 pt-[21px] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
          <button
            className="h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[#F5F5F5] disabled:cursor-default disabled:bg-[#B3B8B9]"
            disabled={applicationStatusLabel !== null}
            type="button"
            onClick={() => onApply?.(job)}
          >
            <span className="text-[20px] leading-[1.5] font-medium">
              {applicationStatusLabel ?? '지원하기'}
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
