import type {
  StudentRecommendation,
  StudentRecommendationWorkTime,
} from '../types/studentRecommendation';
import type { RecommendedJob } from '../types/studentMatching';
import { DAY_LABELS } from '../utils/workSchedule';

const WAGE_TYPE_LABELS: Record<StudentRecommendation['wageType'], string> = {
  HOURLY: '시급',
  MONTHLY: '월급',
};

function formatWorkTime(workTime: StudentRecommendationWorkTime) {
  return `${DAY_LABELS[workTime.dayOfWeek]} ${workTime.startTime.slice(0, 5)}-${workTime.endTime.slice(0, 5)}`;
}

function formatWage(recommendation: StudentRecommendation) {
  return `${WAGE_TYPE_LABELS[recommendation.wageType]} ${recommendation.wageAmount.toLocaleString('ko-KR')}원`;
}

export function mapStudentRecommendationToRecommendedJob(
  recommendation: StudentRecommendation,
): RecommendedJob {
  const workTimeLabels = recommendation.workTimes.map(formatWorkTime);
  const wageLabel = formatWage(recommendation);

  return {
    countdownLabel: '',
    commuteAndWage: `${recommendation.workplaceAddress} · ${wageLabel}`,
    companyName: recommendation.workplaceName,
    detail: {
      comparisonTags: recommendation.recommendationReasons,
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
    },
    id: String(recommendation.recommendationId),
    isCountdownActive: false,
    jobPostingId: recommendation.jobPostingId,
    matchDescription: recommendation.recommendationReasons.join(' · '),
    matchRate: recommendation.matchScore,
    rank: recommendation.rank,
    recommendationId: recommendation.recommendationId,
    role: `직무 | ${recommendation.jobTitle}`,
    showsApplyButton: true,
  };
}
