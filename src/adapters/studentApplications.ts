import type {
  StudentApplication,
  StudentApplicationCardModel,
  StudentApplicationDetail,
  StudentApplicationStatus,
} from '../types/studentApplication';
import type { StudentEmploymentMatchListItem } from '../types/studentMatch';

const WAGE_TYPE_LABELS: Record<StudentApplication['wageType'], string> = {
  HOURLY: '시급',
  MONTHLY: '월급',
};

const DAY_LABELS: Record<
  StudentApplicationDetail['workTimes'][number]['dayOfWeek'],
  string
> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

function mapApplicationStatus(
  application: StudentApplication,
): StudentApplicationStatus {
  if (application.matchId !== null) return 'HIRED';
  if (application.offerId !== null) return 'OFFER_WAITING';

  const statusMap: Record<
    StudentApplication['status'],
    StudentApplicationStatus
  > = {
    WAITING_RESPONSE: 'REVIEWING',
  };

  return statusMap[application.status];
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return undefined;

  const remainingMilliseconds = Math.max(
    0,
    new Date(deadline).getTime() - Date.now(),
  );
  const remainingHours = Math.floor(remainingMilliseconds / 3_600_000);
  const remainingMinutes = Math.floor(
    (remainingMilliseconds % 3_600_000) / 60_000,
  );

  return `${String(remainingHours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

export function mapStudentApplicationToCardModel(
  application: StudentApplication,
): StudentApplicationCardModel {
  const responseDeadline =
    application.studentResponseDeadline ?? application.employerResponseDeadline;
  const wageLabel = `${WAGE_TYPE_LABELS[application.wageType]} ${application.wageAmount.toLocaleString('ko-KR')}원`;

  return {
    apiStatus: application.status,
    applicationId: application.applicationId,
    appliedAt: application.appliedAt,
    desiredStartDate: application.desiredStartDate,
    employerResponseDeadline: application.employerResponseDeadline,
    expiresAt: responseDeadline,
    id: String(application.applicationId),
    job: {
      countdownLabel: '',
      commuteAndWage: wageLabel,
      companyName: application.workplaceName,
      detail: {
        comparisonTags: application.recommendationReasons,
        locationAndDistance: '',
        matchRate: 0,
        metrics: [{ label: '급여', value: wageLabel }],
        tags: [],
      },
      id: String(application.applicationId),
      isCountdownActive: false,
      jobPostingId: application.jobPostingId,
      matchDescription: application.recommendationReasons.join(' · '),
      matchRate: 0,
      role: `직무 | ${application.jobTitle}`,
      showsApplyButton: false,
    },
    matchId: application.matchId,
    offerId: application.offerId,
    offeredAt: application.offeredAt,
    offerStatus: application.offerStatus,
    startedAt: application.offeredAt ?? application.appliedAt,
    status: mapApplicationStatus(application),
    studentResponseDeadline: application.studentResponseDeadline,
    timerLabel: formatDeadline(responseDeadline),
  };
}

export function mapStudentEmploymentMatchToCardModel(
  match: StudentEmploymentMatchListItem,
): StudentApplicationCardModel {
  const wageLabel = `${WAGE_TYPE_LABELS[match.wageType]} ${match.wageAmount.toLocaleString('ko-KR')}원`;

  return {
    applicationId: match.applicationId,
    desiredStartDate: match.desiredStartDate,
    id: String(match.applicationId),
    job: {
      countdownLabel: '',
      commuteAndWage: wageLabel,
      companyName: match.workplaceName,
      detail: {
        comparisonTags: [],
        locationAndDistance: '',
        matchRate: 0,
        metrics: [{ label: '급여', value: wageLabel }],
        tags: [],
      },
      id: String(match.jobPostingId),
      isCountdownActive: false,
      jobPostingId: match.jobPostingId,
      matchDescription: '',
      matchRate: 0,
      role: match.jobTitle,
      showsApplyButton: false,
    },
    matchId: match.matchId,
    offerId: match.offerId,
    startedAt: match.matchedAt,
    status: 'HIRED',
  };
}

function mapDetailStatus(
  application: StudentApplicationDetail,
): StudentApplicationStatus {
  if (application.status === 'COMPLETED') return 'HIRED';
  if (application.status === 'OFFERED') return 'OFFER_WAITING';
  if (application.status === 'WAITING_RESPONSE') return 'REVIEWING';
  if (application.offerStatus === 'REJECTED') return 'REJECTED';
  if (application.offerStatus === 'EXPIRED') return 'STUDENT_EXPIRED';

  return 'CANCELED';
}

export function mapStudentApplicationDetailToCardModel(
  application: StudentApplicationDetail,
): StudentApplicationCardModel {
  const wageLabel = `${WAGE_TYPE_LABELS[application.wageType]} ${application.wageAmount.toLocaleString('ko-KR')}원`;
  const workTimeLabels = application.workTimes.map(
    ({ dayOfWeek, startTime, endTime }) =>
      `${DAY_LABELS[dayOfWeek]} ${startTime}-${endTime}`,
  );
  const responseDeadline =
    application.studentResponseDeadline ?? application.employerResponseDeadline;

  return {
    apiStatus: application.status,
    applicationId: application.applicationId,
    appliedAt: application.appliedAt,
    desiredStartDate: application.desiredStartDate,
    employerResponseDeadline: application.employerResponseDeadline ?? undefined,
    expiresAt: responseDeadline ?? undefined,
    id: String(application.applicationId),
    job: {
      countdownLabel: '',
      commuteAndWage: wageLabel,
      companyName: application.workplaceName,
      detail: {
        comparisonTags: [],
        locationAndDistance: application.workplaceAddress,
        matchRate: 0,
        metrics: [
          { label: '급여', value: wageLabel },
          { label: '시작일', value: application.desiredStartDate },
        ],
        tags: workTimeLabels,
      },
      id: String(application.applicationId),
      isCountdownActive: false,
      jobPostingId: application.jobPostingId,
      matchDescription: workTimeLabels.join(' · '),
      matchRate: 0,
      role: application.jobTitle,
      showsApplyButton: false,
    },
    matchId: application.matchId,
    offerId: application.offerId,
    offeredAt: application.offeredAt,
    offerStatus: application.offerStatus,
    startedAt: application.offeredAt ?? application.appliedAt,
    status: mapDetailStatus(application),
    studentResponseDeadline: application.studentResponseDeadline,
    timerLabel: formatDeadline(responseDeadline),
  };
}
