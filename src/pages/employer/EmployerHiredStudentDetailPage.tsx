import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneNumber from '../../components/employer/PhoneNumber';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerApplicants } from '../../hooks/useEmployerApplicants';
import { useEmployerMatches } from '../../hooks/useEmployerMatches';
import type { EmployerApplicationDetailResponse } from '../../types/application';
import {
  formatApplicationDate,
  formatApplicationWorkTimes,
  formatKoreanLevel,
} from '../../utils/application';
import { formatWage } from '../../utils/jobPosting';

function getMatchErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 400) return apiError?.message ?? '매칭 번호를 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '이 채용 정보를 조회할 권한이 없습니다.';
  if (status === 404) return '채용 완료 정보를 찾지 못했습니다.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '채용 완료 정보를 불러오지 못했습니다.';
}

function getApplicationErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '자격 정보를 확인할 권한이 없습니다.';
  if (status === 404) return '지원자의 자격 정보를 찾지 못했습니다.';
  if (status && status >= 500)
    return '자격 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '지원자의 자격 정보를 불러오지 못했습니다.';
}

function formatCareerSummary(
  careers: EmployerApplicationDetailResponse['applicant']['careers'],
) {
  if (careers.length === 0) return '경력 없음';
  return careers.map((career) => career.careerName).join(', ');
}

function QualificationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-h-[45px] grid-cols-[88px_minmax(0,1fr)] items-center gap-3 border-b border-[#e1e2e4] last:border-b-0">
      <dt className="text-sm font-medium text-[#70737c]">{label}</dt>
      <dd className="min-w-0 text-base font-medium text-[#171719]">{value}</dd>
    </div>
  );
}

function QualificationCard({
  application,
  errorMessage,
  isLoading,
}: {
  application: EmployerApplicationDetailResponse | undefined;
  errorMessage: string | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex min-h-[271px] items-center justify-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 text-center text-sm text-[#70737c] shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
        자격 정보를 불러오는 중이에요.
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-[271px] items-center justify-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 text-center text-sm leading-6 text-[#70737c] shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
        {errorMessage ?? '자격 정보를 확인할 수 없습니다.'}
      </div>
    );
  }

  const { applicant } = application;
  const koreanLevel =
    applicant.topikLevel === null
      ? formatKoreanLevel(applicant.koreanLevel)
      : `TOPIK ${applicant.topikLevel}급`;

  return (
    <div className="min-h-[271px] rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
      <dl>
        <QualificationRow
          label="자격 만료일"
          value={formatApplicationDate(applicant.visaExpirationDate)}
        />
        <QualificationRow label="비자 유형" value={applicant.visaType} />
        <QualificationRow label="한국어" value={koreanLevel} />
        <QualificationRow
          label="우대 경력"
          value={formatCareerSummary(applicant.careers)}
        />
        <QualificationRow
          label="근무 가능 시간"
          value={formatApplicationWorkTimes(applicant.availableWorkTimes)}
        />
      </dl>
    </div>
  );
}

function DocumentsEmptyCard() {
  return (
    <div className="flex min-h-[271px] items-center justify-center rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 text-center shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
      <p className="text-sm leading-6 text-[#70737c]">
        등록된 증빙 서류 정보를 확인할 수 없습니다.
      </p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 18"
      className="size-[18px] shrink-0"
      fill="none"
    >
      <path
        d="M5.25 8.25V5.625a3.75 3.75 0 0 1 7.5 0V6.75M4.5 8.25h9a1.5 1.5 0 0 1 1.5 1.5v5.25H3V9.75a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmployerHiredStudentDetailPage() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { matchDetails, loadMatchDetail } = useEmployerMatches();
  const { applicationDetails, loadApplicationDetail } = useEmployerApplicants();
  const numericMatchId = Number(matchId);
  const isValidMatchId = Number.isInteger(numericMatchId) && numericMatchId > 0;
  const detail = isValidMatchId ? matchDetails[numericMatchId] : undefined;
  const applicationId = detail?.applicationId;
  const application = applicationId
    ? applicationDetails[applicationId]
    : undefined;
  const [loadError, setLoadError] = useState<string | null>(
    isValidMatchId ? null : '올바른 채용 완료 번호가 아니에요.',
  );
  const [applicationLoadFailure, setApplicationLoadFailure] = useState<{
    applicationId: number;
    message: string;
  } | null>(null);
  const applicationLoadError =
    applicationLoadFailure &&
    applicationLoadFailure.applicationId === applicationId
      ? applicationLoadFailure.message
      : null;

  useEffect(() => {
    if (!isValidMatchId || detail) return;
    let isActive = true;
    loadMatchDetail(numericMatchId)
      .then(() => {
        if (isActive) setLoadError(null);
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(getMatchErrorMessage(error));
      });
    return () => {
      isActive = false;
    };
  }, [detail, isValidMatchId, loadMatchDetail, numericMatchId]);

  useEffect(() => {
    if (!applicationId || application) return;
    let isActive = true;
    loadApplicationDetail(applicationId)
      .then(() => {
        if (isActive) setApplicationLoadFailure(null);
      })
      .catch((error: unknown) => {
        if (isActive) {
          setApplicationLoadFailure({
            applicationId,
            message: getApplicationErrorMessage(error),
          });
        }
      });
    return () => {
      isActive = false;
    };
  }, [application, applicationId, loadApplicationDetail]);

  if (isValidMatchId && !detail && !loadError) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center text-sm text-[#70737c]">
        채용 완료 정보를 불러오는 중이에요.
      </div>
    );
  }

  if (loadError || !detail) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-semibold text-[#171719]">
          채용 완료 정보를 확인할 수 없어요
        </h1>
        <p className="mt-2 text-base text-[#70737c]">
          {loadError ?? '채용 유학생 목록에서 다시 확인해 주세요.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/employer/hired')}
          className="mt-6 h-10 rounded-lg bg-[#00b894] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#00a886]"
        >
          채용 유학생 목록으로
        </button>
      </div>
    );
  }

  const studentName = detail.student?.name ?? detail.contact.name;
  const profileImageUrl =
    detail.student?.profileImageUrl ?? application?.applicant.profileImageUrl;
  const nationality =
    detail.student?.nationality ?? application?.applicant.nationality ?? '-';
  const visaType =
    detail.student?.visaType ?? application?.applicant.visaType ?? '-';
  const topikLevel =
    detail.student?.topikLevel ?? application?.applicant.topikLevel ?? null;
  const jobSummary = `${detail.jobTitle} · ${formatWage(
    detail.wageType,
    detail.wageAmount,
  )} · ${formatApplicationWorkTimes(detail.workTimes)}`;
  const isQualificationLoading = Boolean(
    applicationId && !application && !applicationLoadError,
  );

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          채용 유학생 상세
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          {studentName}의 근무 시간과 서류 유효기간을 확인합니다
        </p>
      </header>

      <section className="mt-7 grid min-h-[146px] items-center gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)] md:grid-cols-[75px_minmax(0,1fr)] lg:grid-cols-[75px_minmax(0,1fr)_220px] lg:px-8">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt=""
            className="size-[75px] rounded-full bg-[#f2f3f5] object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="size-[75px] rounded-full bg-[#f2f3f5]"
          />
        )}

        <div className="min-w-0">
          <h2 className="text-[26px] font-semibold text-[#171719]">
            {studentName}
          </h2>
          <p className="mt-1 text-base font-medium text-[#4e5968]">
            {nationality} · {visaType}
            {topikLevel === null ? '' : ` · TOPIK ${topikLevel}급`}
          </p>
          <div className="mt-2 flex max-w-[540px] items-center gap-2.5 rounded-lg bg-[#e8f7f3] px-3 py-1.5 text-[15px] font-medium">
            <span className="shrink-0 text-[#2e6c5a]">지원 공고</span>
            <span className="truncate text-base text-[#171719]">
              {jobSummary}
            </span>
          </div>
        </div>

        <div className="md:col-start-2 lg:col-start-auto lg:justify-self-end">
          <p className="text-base text-[#70737c]">전화번호</p>
          <PhoneNumber
            value={detail.contact.phoneNumber}
            className="mt-1 text-[21px] font-semibold text-[#171719]"
          />
        </div>
      </section>

      <div className="mt-10 flex items-end gap-5 border-b border-[#e1e2e4]">
        <div className="border-b-2 border-[#00b894] px-3 pb-2 text-lg font-semibold text-[#171719]">
          자격 정보
        </div>
        <div className="flex items-center gap-1 px-3 pb-2 text-lg text-[#b0b5bd]">
          <span>근로자격 확인 분석</span>
          <LockIcon />
        </div>
      </div>

      <div className="mt-6 grid items-stretch gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="flex flex-col">
          <h3 className="text-xl font-semibold text-[#171719]">자격 정보</h3>
          <div className="mt-2 flex-1">
            <QualificationCard
              application={application}
              errorMessage={applicationLoadError}
              isLoading={isQualificationLoading}
            />
          </div>
        </section>

        <section className="flex flex-col">
          <h3 className="text-xl font-semibold text-[#171719]">
            증빙 서류 상태
          </h3>
          <div className="mt-2 flex-1">
            <DocumentsEmptyCard />
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmployerHiredStudentDetailPage;
