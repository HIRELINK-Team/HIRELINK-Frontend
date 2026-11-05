import type { RecommendedJob } from '../types/studentMatching';
import type { SalaryType } from '../types/jobForm';
import type {
  StudentJobPostingDetail,
  StudentJobPostingWorkTime,
} from '../types/studentJobPosting';
import { DAY_LABELS } from '../utils/workSchedule';

const WAGE_TYPE_LABELS: Record<
  SalaryType,
  string
> = {
  HOURLY: '시급',
  MONTHLY: '월급',
};

function formatWorkTime(workTime: StudentJobPostingWorkTime) {
  return `${DAY_LABELS[workTime.dayOfWeek]} ${workTime.startTime.slice(0, 5)}-${workTime.endTime.slice(0, 5)}`;
}

function formatWage(jobPosting: StudentJobPostingDetail) {
  const { wageAmount, wageType } = jobPosting;

  if (wageType === null || wageAmount === null) return '급여 정보 없음';

  return `${WAGE_TYPE_LABELS[wageType]} ${wageAmount.toLocaleString('ko-KR')}원`;
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return '마감일 미정';

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const deadlineDate = new Date(deadline);
  const deadlineStart = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  );
  const remainingDays = Math.ceil(
    (deadlineStart.getTime() - todayStart.getTime()) / 86_400_000,
  );

  if (remainingDays < 0) return '마감';
  if (remainingDays === 0) return 'D-DAY';

  return `D-${remainingDays}`;
}

export function mapStudentJobPostingToRecommendedJob(
  recommendation: RecommendedJob,
  jobPosting: StudentJobPostingDetail,
): RecommendedJob {
  const wageLabel = formatWage(jobPosting);
  const workTimeLabels = jobPosting.workTimes.map(formatWorkTime);
  const deadlineLabel = formatDeadline(jobPosting.applicationDeadlineDate);

  return {
    ...recommendation,
    countdownLabel: deadlineLabel,
    commuteAndWage: `${jobPosting.workplace.address} · ${wageLabel}`,
    companyName: jobPosting.workplace.name,
    detail: {
      ...recommendation.detail,
      locationAndDistance: jobPosting.workplace.address,
      metrics: [
        { label: '급여', value: wageLabel },
        { label: '마감', value: deadlineLabel },
      ],
      tags: workTimeLabels,
    },
    isCountdownActive:
      jobPosting.applicationDeadlineDate !== null && deadlineLabel !== '마감',
    role: jobPosting.title ? `직무 | ${jobPosting.title}` : recommendation.role,
  };
}
