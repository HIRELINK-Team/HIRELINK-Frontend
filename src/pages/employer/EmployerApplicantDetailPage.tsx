import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import matchCheckIcon from '../../assets/employer/match-check.svg';
import matchNegotiableIcon from '../../assets/employer/match-negotiable.svg';
import CountdownTimer from '../../components/common/CountdownTimer';
import Toast from '../../components/common/Toast';
import ApplicantActionModal, {
  type ApplicantAction,
} from '../../components/employer/ApplicantActionModal';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerApplicants } from '../../hooks/useEmployerApplicants';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import {
  formatApplicationDate,
  formatApplicationStatus,
  formatKoreanLevel,
} from '../../utils/application';

function DetailActionButton({
  children,
  variant = 'secondary',
  disabled = false,
  onClick,
}: {
  children: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  onClick: () => void;
}) {
  const variantClassName =
    variant === 'primary'
      ? 'bg-[#00b894] text-white hover:bg-[#00a886] active:bg-[#00997a] disabled:bg-[#c7cbd1]'
      : 'border border-[rgba(112,115,124,0.32)] bg-white text-[#171719] hover:bg-[#f4f4f5] active:bg-[#e8eaed] disabled:text-[#8b95a1]';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 w-24 cursor-pointer items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors disabled:cursor-not-allowed ${variantClassName}`}
    >
      {children}
    </button>
  );
}

function getApplicationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 409)
    return apiError?.message ?? '이미 처리됐거나 응답기한이 지난 지원이에요.';
  if (status === 400)
    return apiError?.message ?? '지원자 상태를 다시 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '지원자 정보를 확인할 권한이 없습니다.';
  if (status === 404) return '지원자 정보를 찾지 못했습니다.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '지원자 정보를 불러오지 못했습니다.';
}

function EmployerApplicantDetailPage() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const numericApplicationId = Number(applicationId);
  const {
    applicationDetails,
    applicationLists,
    mutatingApplicationIds,
    loadApplicationDetail,
    loadApplicationList,
    offerApplication,
    rejectApplication,
  } = useEmployerApplicants();
  const { jobDetails, loadJobDetail } = useEmployerJobs();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<ApplicantAction | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const applicant = Number.isInteger(numericApplicationId)
    ? applicationDetails[numericApplicationId]
    : undefined;
  const isMutating = mutatingApplicationIds.includes(numericApplicationId);

  useEffect(() => {
    if (!Number.isInteger(numericApplicationId)) return;
    let isActive = true;
    loadApplicationDetail(numericApplicationId)
      .then(async (detail) => {
        await Promise.all([
          loadJobDetail(detail.jobPostingId),
          loadApplicationList(detail.jobPostingId),
        ]);
        if (isActive) setLoadError(null);
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(getApplicationErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [
    loadApplicationDetail,
    loadApplicationList,
    loadJobDetail,
    numericApplicationId,
  ]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeoutId = window.setTimeout(() => setToastMessage(null), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  const listItem = applicant
    ? applicationLists[applicant.jobPostingId]?.applications.find(
        (application) => application.applicationId === applicant.applicationId,
      )
    : undefined;
  const selectedJob = applicant
    ? jobDetails[applicant.jobPostingId]
    : undefined;
  const deadline = applicant
    ? applicant.status === 'WAITING_RESPONSE'
      ? applicant.employerResponseDeadline
      : applicant.status === 'OFFERED'
        ? (listItem?.studentResponseDeadline ?? null)
        : null
    : null;

  const matchItems = useMemo(() => {
    if (!applicant) return [];
    const { matchResult } = applicant;
    return [
      {
        id: 'work-time',
        label: '근무 시간',
        matched: matchResult.workTimeMatched,
      },
      {
        id: 'experience',
        label: '경력',
        matched: matchResult.experienceMatched,
      },
      {
        id: 'location',
        label: '근무 지역',
        matched: matchResult.locationMatched,
      },
      {
        id: 'wage',
        label: '급여',
        matched: matchResult.wageMatched,
      },
      {
        id: 'korean-level',
        label: '한국어',
        matched: matchResult.koreanLevelMatched,
      },
    ];
  }, [applicant]);
  const matchedCount = matchItems.filter((item) => item.matched).length;

  const handleConfirmAction = async () => {
    if (!pendingAction || !applicant || isMutating) return;
    try {
      if (pendingAction === 'OFFER') {
        await offerApplication(applicant.applicationId, applicant.jobPostingId);
        setToastMessage(
          `${applicant.applicant.name}님에게 채용제안을 보냈어요. 24시간 안에 응답을 기다려요`,
        );
      } else {
        await rejectApplication(
          applicant.applicationId,
          applicant.jobPostingId,
        );
        setToastMessage(`${applicant.applicant.name}님의 지원을 거절했어요.`);
      }
      setPendingAction(null);
    } catch (error: unknown) {
      setToastMessage(getApplicationErrorMessage(error));
    }
  };

  if (!Number.isInteger(numericApplicationId) || (!isLoading && !applicant)) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#171719]">
          지원자 정보를 찾을 수 없어요.
        </h1>
        <p className="mt-2 text-base text-[#70737c]">
          {loadError ?? '지원자 목록에서 다시 확인해 주세요.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/employer/jobs')}
          className="mt-6 h-10 rounded-lg bg-[#00b894] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00a886] active:bg-[#00997a]"
        >
          채용공고 목록으로
        </button>
      </div>
    );
  }

  if (isLoading || !applicant) {
    return (
      <p className="pt-16 text-center text-[#70737c]">
        지원자 정보를 불러오는 중이에요.
      </p>
    );
  }

  const isWaitingResponse = applicant.status === 'WAITING_RESPONSE';

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
            지원자 상세
          </h1>
          <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
            공고 조건과 지원자 조건을 비교하고 채용을 제안하세요
          </p>
        </div>

        {isWaitingResponse && (
          <div className="flex shrink-0 items-center gap-2">
            <DetailActionButton
              disabled={isMutating}
              onClick={() => setPendingAction('REJECT')}
            >
              채용 거절
            </DetailActionButton>
            <DetailActionButton
              variant="primary"
              disabled={isMutating}
              onClick={() => setPendingAction('OFFER')}
            >
              채용 제안
            </DetailActionButton>
          </div>
        )}
      </header>

      <section className="mt-7 grid min-h-[183px] items-center gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-6 shadow-[0_2px_8px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)] md:grid-cols-[96px_minmax(0,1fr)] lg:grid-cols-[96px_minmax(0,1fr)_180px] lg:px-8">
        {applicant.applicant.profileImageUrl ? (
          <img
            src={applicant.applicant.profileImageUrl}
            alt=""
            className="size-24 rounded-full bg-[#e1e2e4] object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="size-24 rounded-full bg-[#e1e2e4]"
          />
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-[#171719]">
              {applicant.applicant.name}
            </h2>
            <span className="rounded-full bg-[#e8f7f3] px-2.5 py-1 text-xs font-semibold text-[#007a63]">
              {formatApplicationStatus(applicant.status)}
            </span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-3 xl:grid-cols-6">
            <div>
              <dt className="text-[#8b95a1]">국적</dt>
              <dd className="mt-0.5 text-[#171719]">
                {applicant.applicant.nationality}
              </dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">비자</dt>
              <dd className="mt-0.5 text-[#171719]">
                {applicant.applicant.visaType}
              </dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">TOPIK</dt>
              <dd className="mt-0.5 text-[#171719]">
                {applicant.applicant.topikLevel === null
                  ? '-'
                  : `${applicant.applicant.topikLevel}급`}
              </dd>
            </div>
            <div className="xl:col-span-2">
              <dt className="text-[#8b95a1]">체류기간 만료일</dt>
              <dd className="mt-0.5 text-[#171719]">
                {formatApplicationDate(applicant.applicant.visaExpirationDate)}
              </dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">한국어</dt>
              <dd className="mt-0.5 text-[#171719]">
                {formatKoreanLevel(applicant.applicant.koreanLevel)}
              </dd>
            </div>
            <div>
              <dt className="text-[#8b95a1]">희망 근무 시작일</dt>
              <dd className="mt-0.5 text-[#171719]">
                {formatApplicationDate(applicant.desiredStartDate)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex min-h-8 max-w-[540px] items-center gap-3 rounded-lg bg-[#e8f7f3] px-4 py-2 text-sm">
            <span className="shrink-0 text-[#70737c]">지원 공고</span>
            <span className="truncate text-[#006e59]">
              {selectedJob
                ? `${selectedJob.jobRole ?? '직무 미입력'} · ${selectedJob.workplaceName}`
                : `공고 #${applicant.jobPostingId}`}
            </span>
          </div>
        </div>

        {deadline && (
          <div className="min-w-[150px] text-left md:col-start-2 lg:col-start-auto lg:text-center">
            <p className="text-base font-medium text-[#70737c]">
              {applicant.status === 'OFFERED'
                ? '유학생 응답까지 남은 시간'
                : '응답까지 남은 시간'}
            </p>
            <CountdownTimer
              expiresAt={deadline}
              urgentThresholdHours={24}
              sizeClassName="text-[32px]"
              className="font-semibold"
            />
          </div>
        )}
      </section>

      <div className="mt-9 grid items-stretch gap-6 lg:grid-cols-2">
        <section className="flex flex-col">
          <h2 className="text-xl font-semibold text-[#171719]">
            증빙 서류 상태
          </h2>
          <div className="mt-2 flex min-h-[340px] flex-1 items-center justify-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-7 text-center shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <p className="text-sm leading-6 text-[#70737c]">
              등록된 증빙 서류 정보를 확인할 수 없습니다.
            </p>
          </div>
        </section>

        <section className="flex flex-col">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-semibold text-[#171719]">
              공고 일치율
            </h2>
            <span className="text-sm font-medium text-[#70737c]">
              {matchedCount}/{matchItems.length} 일치
            </span>
          </div>
          <div className="mt-2 min-h-[340px] flex-1 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-7 shadow-[0_2px_8px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <div className="flex items-center gap-4">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#f2f3f5]">
                <div
                  className="h-full rounded-full bg-[#00b894]"
                  style={{ width: `${applicant.matchResult.matchScore}%` }}
                />
              </div>
              <strong className="text-[28px] font-semibold text-[#007a63]">
                {applicant.matchResult.matchScore}%
              </strong>
            </div>

            <ul className="mt-5">
              {matchItems.map((item) => (
                <li
                  key={item.id}
                  className="grid min-h-[46px] grid-cols-[20px_minmax(0,1fr)_64px] items-center gap-3 border-b border-[#f2f3f5] last:border-b-0"
                >
                  <img
                    src={item.matched ? matchCheckIcon : matchNegotiableIcon}
                    alt=""
                    className="size-5"
                  />
                  <strong className="text-base font-bold text-[#171719]">
                    {item.label}
                  </strong>
                  <span
                    className={`text-right text-sm font-semibold ${item.matched ? 'text-[#007a63]' : 'text-[#c26a00]'}`}
                  >
                    {item.matched ? '일치' : '불일치'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {pendingAction && (
        <ApplicantActionModal
          action={pendingAction}
          applicantName={applicant.applicant.name}
          isSubmitting={isMutating}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default EmployerApplicantDetailPage;
