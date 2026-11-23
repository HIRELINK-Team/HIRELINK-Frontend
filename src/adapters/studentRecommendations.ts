import type {
  StudentRecommendation,
  StudentRecommendationDetailResponse,
  StudentRecommendationWorkTime,
} from '../types/studentRecommendation';
import type { RecommendedJob } from '../types/studentMatching';
import {
  formatMatchingComparisonTags,
  formatMatchingSummary,
} from '../utils/studentMatchingDisplay';
import { DAY_LABELS } from '../utils/workSchedule';

const WAGE_TYPE_LABELS: Readonly<Record<string, string>> = {
  HOURLY: '시급',
  MONTHLY: '월급',
};

function formatWorkTime(workTime: StudentRecommendationWorkTime) {
  return `${DAY_LABELS[workTime.dayOfWeek]} ${workTime.startTime.slice(0, 5)}-${workTime.endTime.slice(0, 5)}`;
}

type RecommendationDisplayData =
  StudentRecommendation | StudentRecommendationDetailResponse;

export function mergeRecommendationApplicationState(
  detail: RecommendedJob,
  selected: RecommendedJob,
): RecommendedJob {
  const applicationId =
    detail.applicationId === undefined
      ? selected.applicationId
      : detail.applicationId;
  const applicationStatus =
    detail.applicationStatus === undefined
      ? selected.applicationStatus
      : detail.applicationStatus;
  return {
    ...detail,
    applicationId,
    applicationStatus,
    showsApplyButton:
      applicationStatus !== 'WAITING_RESPONSE' &&
      applicationStatus !== 'OFFERED',
  };
}

function formatWage(recommendation: RecommendationDisplayData) {
  const label =
    WAGE_TYPE_LABELS[recommendation.wageType] ?? recommendation.wageType;
  return `${label} ${recommendation.wageAmount.toLocaleString('ko-KR')}원`;
}

export function mapStudentRecommendationToRecommendedJob(
  recommendation: RecommendationDisplayData,
): RecommendedJob {
  const workTimeLabels = recommendation.workTimes.map(formatWorkTime);
  const wageLabel = formatWage(recommendation);
  const applicationId =
    'applicationId' in recommendation
      ? recommendation.applicationId
      : undefined;
  const applicationStatus =
    'applicationStatus' in recommendation
      ? recommendation.applicationStatus
      : undefined;
  const walkingTimeMinutes =
    'walkingTimeMinutes' in recommendation &&
    typeof recommendation.walkingTimeMinutes === 'number'
      ? recommendation.walkingTimeMinutes
      : null;

  return {
    applicationId,
    applicationStatus,
    countdownLabel: '',
    commuteAndWage: `${recommendation.workplaceAddress} · ${wageLabel}`,
    companyName: recommendation.workplaceName,
    detail: {
      announcement: null,
      comparisonTags: formatMatchingComparisonTags(
        recommendation.recommendationReasons,
      ),
      locationAndDistance: recommendation.workplaceAddress,
      matchRate: recommendation.matchScore,
      metrics: [
        { label: '급여', value: wageLabel },
        ...workTimeLabels.map((workTime, index) => ({
          label: `근무${index + 1}`,
          value: workTime,
        })),
      ],
      tags: workTimeLabels,
      walkingTimeMinutes,
    },
    id: String(recommendation.recommendationId),
    isCountdownActive: false,
    jobPostingId: recommendation.jobPostingId,
    matchDescription: formatMatchingSummary(
      recommendation.recommendationReasons,
      recommendation.recommendationReasons.join(' · '),
    ),
    matchRate: recommendation.matchScore,
    rank: recommendation.rank,
    recommendationId: recommendation.recommendationId,
    role: `직무 | ${recommendation.jobTitle}`,
    showsApplyButton:
      applicationStatus !== 'WAITING_RESPONSE' &&
      applicationStatus !== 'OFFERED',
  };
}
