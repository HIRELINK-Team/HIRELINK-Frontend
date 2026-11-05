import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SelectField from '../../components/common/SelectField';
import EmployerHiredStudentRow from '../../components/employer/EmployerHiredStudentRow';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useEmployerJobs } from '../../hooks/useEmployerJobs';
import { useEmployerMatches } from '../../hooks/useEmployerMatches';
import type { JobPostingListItem } from '../../types/jobPosting';
import { formatJobPostingSummary } from '../../utils/jobPosting';

const ALL_JOBS_VALUE = 'ALL';

function formatJobOption(job: JobPostingListItem) {
  return `${job.jobRole ?? '직무 미입력'}·${formatJobPostingSummary(job)}`;
}

function getMatchErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);
  if (status === 400) return apiError?.message ?? '조회 조건을 확인해 주세요.';
  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '채용 유학생을 조회할 권한이 없습니다.';
  if (status === 404) return '채용공고를 찾지 못했습니다.';
  if (status && status >= 500)
    return '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
  return apiError?.message ?? '채용 유학생을 불러오지 못했습니다.';
}

function EmployerHiredStudentsPage() {
  const navigate = useNavigate();
  const { jobs, loadJobs } = useEmployerJobs();
  const { matches, loadMatches } = useEmployerMatches();
  const [selectedJobValue, setSelectedJobValue] =
    useState<string>(ALL_JOBS_VALUE);
  const [isJobSelectOpen, setIsJobSelectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectableJobs = useMemo(
    () => jobs.filter((job) => job.status !== 'DRAFT'),
    [jobs],
  );
  const jobOptions = useMemo(
    () => [
      { value: ALL_JOBS_VALUE, label: '전체 채용공고' },
      ...selectableJobs.map((job) => ({
        value: String(job.jobPostingId),
        label: formatJobOption(job),
      })),
    ],
    [selectableJobs],
  );

  useEffect(() => {
    void loadJobs().catch(() => undefined);
  }, [loadJobs]);

  useEffect(() => {
    let isActive = true;
    const parsedJobPostingId = Number(selectedJobValue);
    const jobPostingId =
      selectedJobValue === ALL_JOBS_VALUE ||
      !Number.isInteger(parsedJobPostingId)
        ? undefined
        : parsedJobPostingId;

    loadMatches(jobPostingId)
      .catch((error: unknown) => {
        if (isActive) setLoadError(getMatchErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [loadMatches, selectedJobValue]);

  const handleJobChange = (value: string) => {
    setIsLoading(true);
    setLoadError(null);
    setSelectedJobValue(value);
  };

  return (
    <div className="w-full max-w-[970px] pt-10 pb-16">
      <header>
        <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
          채용 유학생
        </h1>
        <p className="mt-1.5 text-xl leading-6 font-semibold text-black/60">
          최종 매칭된 유학생과 채용 정보를 확인합니다
        </p>
      </header>

      <div className="mt-7 w-[430px] max-w-full">
        <SelectField
          value={selectedJobValue}
          options={jobOptions}
          placeholder="공고를 선택해 주세요"
          ariaLabel="채용 공고 선택"
          isOpen={isJobSelectOpen}
          onOpenChange={setIsJobSelectOpen}
          onChange={handleJobChange}
          variant="compact"
        />
      </div>

      <section className="mt-4 space-y-3" aria-label="채용 유학생 목록">
        {!isLoading &&
          !loadError &&
          matches.map((match) => (
            <EmployerHiredStudentRow
              key={match.matchId}
              match={match}
              onViewDetails={(matchId) =>
                navigate(`/employer/hired/${matchId}`)
              }
            />
          ))}

        {isLoading && (
          <div className="flex h-40 items-center justify-center rounded-xl bg-white text-sm text-[#70737c]">
            채용 유학생을 불러오는 중이에요.
          </div>
        )}
        {!isLoading && loadError && (
          <div
            role="alert"
            className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#e05260] text-sm text-[#e11e1e]"
          >
            {loadError}
          </div>
        )}
        {!isLoading && !loadError && matches.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[#c7cbd1] text-sm text-[#70737c]">
            채용 완료된 유학생이 없어요.
          </div>
        )}
      </section>
    </div>
  );
}

export default EmployerHiredStudentsPage;
