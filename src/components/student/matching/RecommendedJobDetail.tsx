import { useTranslation } from 'react-i18next';

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
import { translateMatchingText } from './translateMatchingText';

type RecommendedJobDetailProps = {
  job: RecommendedJob;
  onApply?: (job: RecommendedJob) => void;
  onBack?: () => void;
};

function getRoleLabel(role: string, fallback: string) {
  return role.replace(/^직무\s*\|\s*/, '') || fallback;
}

function getWorkTimeSummary(
  job: RecommendedJob,
  missingDays: string,
  missingHours: string,
) {
  const values = job.detail.metrics
    .filter((metric) => metric.label.startsWith('근무'))
    .map((metric) => metric.value);
  const days = values.map((value) => value.split(' ')[0]).filter(Boolean);
  const times = values
    .map((value) => value.split(' ').slice(1).join(' '))
    .filter(Boolean);

  return {
    dayLabel: days.length > 0 ? days.join(' · ') : missingDays,
    timeLabel:
      times.length > 0 ? [...new Set(times)].join(', ') : missingHours,
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
  const { i18n, t } = useTranslation();
  const isEnglish = i18n.resolvedLanguage === 'en';
  const applicationStatusLabel =
    job.applicationStatus === 'WAITING_RESPONSE'
      ? t('matching.applicationCompleteStatus')
      : job.applicationStatus === 'OFFERED'
        ? t('matching.offerPendingStatus')
        : null;
  const wageLabel =
    job.detail.metrics.find((metric) => metric.label === '급여')?.value ??
    t('matching.wageFallback');
  const { dayLabel, timeLabel } = getWorkTimeSummary(
    job,
    t('matching.workDaysFallback'),
    t('matching.workHoursFallback'),
  );
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
          alt={t('matching.nearbyMap')}
          className="absolute top-0 left-[-88px] h-[874px] w-[557px] max-w-none"
          src={detailMapImage}
        />
      </div>

      <button
        aria-label={t('matching.backToRecommendations')}
        className="absolute top-[45px] left-6 z-10 flex size-[44px] items-center justify-center rounded-full border-0 bg-[#F5F5F5] p-0 shadow-[0_1px_3.25px_rgba(0,0,0,0.25)]"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={detailBackIcon} />
      </button>
      <span className="absolute top-[46px] right-6 z-10 flex h-[42px] items-center gap-[5px] rounded-[30px] bg-[#F5F5F5] px-[15px] text-[15px] leading-[1.5] font-medium shadow-[0_1px_3.25px_rgba(0,0,0,0.25)]">
        <img alt="" src={detailMapPinIcon} />
        {t('matching.viewMap')}
      </span>

      <section className="absolute top-[282px] right-0 bottom-0 left-0 rounded-t-[30px] bg-[#F5F5F5] px-6 pt-[26px] shadow-[0_-3px_35px_rgba(0,0,0,0.15)]">
        <h1 className="m-0 truncate text-[26px] leading-[1.5] font-semibold">
          {job.companyName || t('matching.workplaceFallback')}
        </h1>
        <p className="mt-[-1px] mb-0 truncate text-[13px] leading-[1.5] text-[#909597]">
          {locationLabel}
        </p>

        <div className="mt-[17px] grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 gap-[5px] overflow-hidden">
            {comparisonTags.map((tag) => (
              <span
                className={`flex h-[34px] shrink-0 items-center justify-center rounded-[30px] bg-[#E6E8E9] leading-[1.5] font-medium whitespace-nowrap ${isEnglish ? 'px-2 text-[11px]' : 'px-[13.636px] text-[13px]'}`}
                key={tag}
              >
                {translateMatchingText(tag, t)}
              </span>
            ))}
          </div>
          <p className="m-0 flex shrink-0 items-baseline gap-1 whitespace-nowrap">
            <span className="text-[26px] leading-[1.5] font-semibold text-[#009376]">
              {job.detail.matchRate}%
            </span>
            <span className="text-[13px] leading-[1.5] text-[#909597]">
              {t('matching.matchFit')}
            </span>
          </p>
        </div>

        <div className="mt-[19px] border-t-[0.7px] border-[#D3D6D7]" />

        <h2 className="mt-[17px] mb-0 text-[17px] leading-[1.5] font-semibold">
          {t('matching.storeInformation')}
        </h2>
        <div className="mt-[13px] flex flex-col gap-1">
          <JobInformationRow
            icon={roleIcon}
            value={getRoleLabel(job.role, t('matching.roleFallback'))}
          />
          <JobInformationRow icon={wageIcon} value={wageLabel} />
          <JobInformationRow icon={calendarIcon} value={dayLabel} />
          <JobInformationRow icon={timeIcon} value={timeLabel} />
        </div>

        <h2 className="mt-[18px] mb-0 text-[17px] leading-[1.5] font-semibold">
          {t('matching.jobPosting')}
        </h2>
        <p className="mt-[9px] mb-0 line-clamp-3 text-[15px] leading-[1.5]">
          {job.detail.announcement ?? t('matching.noAnnouncement')}
        </p>

        <div className="absolute right-0 bottom-0 left-0 h-[115px] bg-[#F5F5F5] px-6 pt-[21px] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
          <button
            className="h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[#F5F5F5] disabled:cursor-default disabled:bg-[#B3B8B9]"
            disabled={applicationStatusLabel !== null}
            type="button"
            onClick={() => onApply?.(job)}
          >
            <span className="text-[20px] leading-[1.5] font-medium">
              {applicationStatusLabel ?? t('common.apply')}
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
