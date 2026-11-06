import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getApiErrorResponse, getApiErrorStatus } from '../api/errors';
import { getMyJobPostings } from '../api/jobPostings';
import { useEmployerApplicants } from './useEmployerApplicants';
import type { EmployerDashboardData } from '../types/employerDashboard';
import type { JobPostingListItem } from '../types/jobPosting';

function getDashboardErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error);
  const apiError = getApiErrorResponse(error);

  if (status === 401) return '로그인 정보를 확인하지 못했습니다.';
  if (status === 403) return '대시보드 정보를 조회할 권한이 없습니다.';
  if (status && status >= 500)
    return '서버 오류로 대시보드 정보를 불러오지 못했어요.';
  return apiError?.message ?? '대시보드 정보를 불러오지 못했어요.';
}

function getAppliedAtTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function useEmployerDashboard() {
  const { applicationLists, loadApplicationList } = useEmployerApplicants();
  const [recruitingJobPostings, setRecruitingJobPostings] = useState<
    JobPostingListItem[]
  >([]);
  const [failedApplicationJobIds, setFailedApplicationJobIds] = useState<
    number[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const requestRef = useRef<Promise<void> | null>(null);

  const loadDashboard = useCallback(
    (force = false) => {
      if (requestRef.current) return requestRef.current;

      setIsLoading(true);
      setLoadError(null);
      const request = getMyJobPostings({ status: 'RECRUITING' })
        .then(async ({ jobPostings }) => {
          setRecruitingJobPostings(jobPostings);

          // Beta Dashboard는 모집 중 공고 N개에 대해 Application GET N개를 병렬 호출한다.
          const results = await Promise.allSettled(
            jobPostings.map((jobPosting) =>
              loadApplicationList(jobPosting.jobPostingId, force),
            ),
          );
          setFailedApplicationJobIds(
            results.flatMap((result, index) =>
              result.status === 'rejected'
                ? [jobPostings[index].jobPostingId]
                : [],
            ),
          );
        })
        .catch((error: unknown) => {
          setLoadError(getDashboardErrorMessage(error));
          throw error;
        })
        .finally(() => {
          setIsLoading(false);
          requestRef.current = null;
        });

      requestRef.current = request;
      return request;
    },
    [loadApplicationList],
  );

  useEffect(() => {
    void loadDashboard().catch(() => undefined);
  }, [loadDashboard]);

  const removeRecruitingJob = useCallback((jobPostingId: number) => {
    setRecruitingJobPostings((current) =>
      current.filter((job) => job.jobPostingId !== jobPostingId),
    );
    setFailedApplicationJobIds((current) =>
      current.filter((id) => id !== jobPostingId),
    );
  }, []);

  const data = useMemo<EmployerDashboardData>(() => {
    const failedJobIds = new Set(failedApplicationJobIds);
    const availableLists = recruitingJobPostings.flatMap((jobPosting) => {
      if (failedJobIds.has(jobPosting.jobPostingId)) return [];
      const applicationList = applicationLists[jobPosting.jobPostingId];
      return applicationList ? [applicationList] : [];
    });
    const applications = availableLists.flatMap((applicationList) =>
      applicationList.applications.map((application) => ({
        jobPostingId: applicationList.jobPostingId,
        application,
      })),
    );
    const sortLatestFirst = (
      left: (typeof applications)[number],
      right: (typeof applications)[number],
    ) =>
      getAppliedAtTimestamp(right.application.appliedAt) -
      getAppliedAtTimestamp(left.application.appliedAt);

    return {
      recruitingCount: recruitingJobPostings.length,
      waitingResponseCount: availableLists.reduce(
        (sum, applicationList) => sum + applicationList.waitingResponseCount,
        0,
      ),
      offeredCount: availableLists.reduce(
        (sum, applicationList) => sum + applicationList.offeredCount,
        0,
      ),
      recentApplications: applications
        .filter(({ application }) => application.status === 'WAITING_RESPONSE')
        .sort(sortLatestFirst),
      offeredApplications: applications
        .filter(({ application }) => application.status === 'OFFERED')
        .sort(sortLatestFirst),
      recruitingJobPostings,
      failedApplicationJobIds,
    };
  }, [applicationLists, failedApplicationJobIds, recruitingJobPostings]);

  return {
    data,
    isLoading,
    loadError,
    reloadDashboard: () => loadDashboard(true),
    removeRecruitingJob,
  };
}

export { useEmployerDashboard };
