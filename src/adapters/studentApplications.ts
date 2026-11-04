import type {
  StudentApplication,
  StudentApplicationCardModel,
  StudentApplicationStatus,
} from '../types/studentApplication';

const WAGE_TYPE_LABELS: Record<StudentApplication['wageType'], string> = {
  HOURLY: '시급',
  MONTHLY: '월급',
};

function mapApplicationStatus(
  status: StudentApplication['status'],
): StudentApplicationStatus {
  const statusMap: Record<
    StudentApplication['status'],
    StudentApplicationStatus
  > = {
    WAITING_RESPONSE: 'REVIEWING',
  };

  return statusMap[status];
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
    status: mapApplicationStatus(application.status),
    studentResponseDeadline: application.studentResponseDeadline,
    timerLabel: formatDeadline(responseDeadline),
  };
}
