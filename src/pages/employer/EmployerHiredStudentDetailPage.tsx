import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PhoneNumber from '../../components/employer/PhoneNumber';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerMatches } from '../../hooks/useEmployerMatches';
import {
  formatApplicationDate,
  formatApplicationDateTime,
  formatApplicationWorkTimes,
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

function EmployerHiredStudentDetailPage() {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const { matchDetails, loadMatchDetail } = useEmployerMatches();
  const numericMatchId = Number(matchId);
  const isValidMatchId = Number.isInteger(numericMatchId) && numericMatchId > 0;
  const detail = isValidMatchId ? matchDetails[numericMatchId] : undefined;
  const [loadError, setLoadError] = useState<string | null>(
    isValidMatchId ? null : '올바른 채용 완료 번호가 아니에요.',
  );

  useEffect(() => {
    if (!isValidMatchId || detail) return;
    let isActive = true;
    loadMatchDetail(numericMatchId)
      .then(() => {
        if (isActive) setLoadError(null);
      })
      .catch((error: unknown) => {
        if (isActive) setLoadError(getMatchErrorMessage(error));
      })
      .finally(() => undefined);
    return () => {
      isActive = false;
    };
  }, [detail, isValidMatchId, loadMatchDetail, numericMatchId]);

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
  const studentSummary = detail.student
    ? [
        detail.student.nationality,
        detail.student.visaType,
        detail.student.topikLevel === null
          ? null
          : `TOPIK ${detail.student.topikLevel}급`,
      ]
        .filter(Boolean)
        .join(' · ')
    : '유학생 상세 정보 없음';

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          채용 유학생 상세
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          최종 매칭 정보와 공개된 연락처를 확인합니다
        </p>
      </header>

      <section className="mt-7 grid min-h-[146px] grid-cols-[75px_minmax(0,1fr)_220px] items-center gap-6 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-8 py-6 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
        {detail.student?.profileImageUrl ? (
          <img
            src={detail.student.profileImageUrl}
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
            {studentSummary}
          </p>
          <div className="mt-2 inline-flex max-w-full items-center gap-2.5 rounded-lg bg-[#e8f7f3] px-3 py-1.5 text-[15px] font-medium">
            <span className="shrink-0 text-[#2e6c5a]">채용 공고</span>
            <span className="truncate text-base text-[#171719]">
              {detail.jobTitle} · {detail.workplaceName}
            </span>
          </div>
        </div>

        <div className="justify-self-end">
          <p className="text-base text-[#70737c]">전화번호</p>
          <PhoneNumber
            value={detail.contact.phoneNumber}
            className="mt-1 text-[21px] font-semibold text-[#171719]"
          />
        </div>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section>
          <h3 className="text-xl font-semibold text-[#171719]">채용 정보</h3>
          <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <dl className="divide-y divide-[#e1e2e4]">
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">직무</dt>
                <dd className="text-base font-semibold text-[#171719]">
                  {detail.jobTitle}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">사업장</dt>
                <dd className="text-base font-medium text-[#171719]">
                  {detail.workplaceName}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">주소</dt>
                <dd className="text-base font-medium text-[#171719]">
                  {detail.workplaceAddress}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">급여</dt>
                <dd className="text-base font-medium text-[#171719]">
                  {formatWage(detail.wageType, detail.wageAmount)}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">
                  근무 시간
                </dt>
                <dd className="text-base font-medium text-[#171719]">
                  {formatApplicationWorkTimes(detail.workTimes)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-[#171719]">매칭 정보</h3>
          <div className="mt-2 rounded-xl border border-[rgba(112,115,124,0.16)] bg-white px-6 py-4 shadow-[0_2px_8px_-2px_rgba(23,23,25,0.1),0_1px_2px_rgba(23,23,25,0.06)]">
            <dl className="divide-y divide-[#e1e2e4]">
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">
                  희망 시작일
                </dt>
                <dd className="text-base font-semibold text-[#171719]">
                  {formatApplicationDate(detail.desiredStartDate)}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">
                  채용 완료 시각
                </dt>
                <dd className="text-base font-medium text-[#171719]">
                  {formatApplicationDateTime(detail.matchedAt)}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">
                  연락 가능 이름
                </dt>
                <dd className="text-base font-medium text-[#171719]">
                  {detail.contact.name}
                </dd>
              </div>
              <div className="grid min-h-14 grid-cols-[118px_minmax(0,1fr)] items-center gap-3">
                <dt className="text-sm font-medium text-[#70737c]">전화번호</dt>
                <dd>
                  <PhoneNumber
                    value={detail.contact.phoneNumber}
                    className="text-base font-semibold text-[#171719]"
                  />
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EmployerHiredStudentDetailPage;
