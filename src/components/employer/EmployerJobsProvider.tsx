import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { subscribeToAuthInvalidation } from '../../api/accessToken';
import {
  closeJobPosting,
  createJobPosting,
  getJobPostingDetail,
  getMyJobPostings,
  updateJobPosting,
} from '../../api/jobPostings';
import { IS_DEMO_MODE } from '../../config/demoMode';
import { EmployerJobsContext } from '../../hooks/useEmployerJobs';
import {
  getDemoJobDetail,
  getDemoJobs,
  getDemoWorkplaceDetail,
} from '../../mocks/employerDemoData';
import type {
  CreateJobPostingRequest,
  JobPostingDetailResponse,
  JobPostingListItem,
  UpdateJobPostingRequest,
} from '../../types/jobPosting';

function toJobListItem(
  detail: JobPostingDetailResponse,
  createdAt = new Date().toISOString(),
): JobPostingListItem {
  return {
    jobPostingId: detail.jobPostingId,
    workplaceId: detail.workplaceId,
    workplaceName: detail.workplaceName,
    jobRole: detail.jobRole,
    wageType: detail.wageType,
    wageAmount: detail.wageAmount,
    status: detail.status,
    applicationDeadlineDate: detail.applicationDeadlineDate,
    workTimes: detail.workTimes,
    createdAt,
  };
}

function EmployerJobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<JobPostingListItem[]>([]);
  const [jobDetails, setJobDetails] = useState<
    Record<number, JobPostingDetailResponse>
  >({});
  const jobsRef = useRef<JobPostingListItem[]>([]);
  const isListLoadedRef = useRef(false);
  const listRequestRef = useRef<Promise<JobPostingListItem[]> | null>(null);
  const detailCacheRef = useRef(new Map<number, JobPostingDetailResponse>());
  const detailRequestRef = useRef(
    new Map<number, Promise<JobPostingDetailResponse>>(),
  );

  useEffect(() => {
    const unsubscribe = subscribeToAuthInvalidation(() => {
      jobsRef.current = [];
      isListLoadedRef.current = false;
      listRequestRef.current = null;
      detailCacheRef.current.clear();
      detailRequestRef.current.clear();
      setJobs([]);
      setJobDetails({});
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const loadJobs = useCallback((force = false) => {
    if (!force && isListLoadedRef.current) {
      return Promise.resolve(jobsRef.current);
    }
    if (listRequestRef.current) return listRequestRef.current;

    const request = (
      IS_DEMO_MODE
        ? Promise.resolve({ jobPostings: getDemoJobs() })
        : getMyJobPostings({ includeDraft: true })
    )
      .then(({ jobPostings }) => {
        jobsRef.current = jobPostings;
        isListLoadedRef.current = true;
        setJobs(jobPostings);
        return jobPostings;
      })
      .finally(() => {
        listRequestRef.current = null;
      });
    listRequestRef.current = request;
    return request;
  }, []);

  const loadJobDetail = useCallback((jobPostingId: number, force = false) => {
    const cached = detailCacheRef.current.get(jobPostingId);
    if (!force && cached) return Promise.resolve(cached);
    const pending = detailRequestRef.current.get(jobPostingId);
    if (pending) return pending;

    const demoDetail = IS_DEMO_MODE
      ? getDemoJobDetail(jobPostingId)
      : undefined;
    const request = (
      IS_DEMO_MODE
        ? demoDetail
          ? Promise.resolve(demoDetail)
          : Promise.reject(new Error('Demo job posting not found'))
        : getJobPostingDetail(jobPostingId)
    )
      .then((detail) => {
        detailCacheRef.current.set(jobPostingId, detail);
        setJobDetails((current) => ({
          ...current,
          [jobPostingId]: detail,
        }));
        return detail;
      })
      .finally(() => {
        detailRequestRef.current.delete(jobPostingId);
      });
    detailRequestRef.current.set(jobPostingId, request);
    return request;
  }, []);

  const refreshJobs = useCallback(async () => loadJobs(true), [loadJobs]);

  const createJob = useCallback(
    async (request: CreateJobPostingRequest) => {
      if (IS_DEMO_MODE) {
        const workplace = getDemoWorkplaceDetail(request.workplaceId);
        if (!workplace) throw new Error('Demo workplace not found');
        const jobPostingId =
          Math.max(0, ...jobsRef.current.map((job) => job.jobPostingId)) + 1;
        const detail: JobPostingDetailResponse = {
          jobPostingId,
          title: request.jobRole ?? null,
          status: request.status,
          workplaceId: workplace.workplaceId,
          workplaceName: workplace.workplaceName,
          workplaceAddress: workplace.workplaceAddress,
          latitude: workplace.latitude,
          longitude: workplace.longitude,
          businessTypeId:
            request.businessTypeId ?? workplace.businessTypeId ?? null,
          businessTypeName: workplace.businessTypeName,
          jobRole: request.jobRole ?? null,
          wageType: request.wageType ?? null,
          wageAmount: request.wageAmount ?? null,
          recruitmentCount: request.recruitmentCount ?? null,
          workStartDate: request.workStartDate ?? null,
          requiredKoreanLevel: request.requiredKoreanLevel ?? null,
          preferredExperience: request.preferredExperience ?? null,
          workTimeNegotiable: request.workTimeNegotiable ?? null,
          applicationDeadlineDate: request.applicationDeadlineDate ?? null,
          workTimes: request.workTimes ?? [],
        };
        detailCacheRef.current.set(jobPostingId, detail);
        setJobDetails((current) => ({ ...current, [jobPostingId]: detail }));
        const nextJobs = [toJobListItem(detail), ...jobsRef.current];
        jobsRef.current = nextJobs;
        setJobs(nextJobs);
        return detail;
      }

      const detail = await createJobPosting(request);
      detailCacheRef.current.set(detail.jobPostingId, detail);
      setJobDetails((current) => ({
        ...current,
        [detail.jobPostingId]: detail,
      }));
      await refreshJobs();
      return detail;
    },
    [refreshJobs],
  );

  const updateJob = useCallback(
    async (jobPostingId: number, request: UpdateJobPostingRequest) => {
      if (IS_DEMO_MODE) {
        const currentDetail =
          detailCacheRef.current.get(jobPostingId) ??
          getDemoJobDetail(jobPostingId);
        if (!currentDetail) throw new Error('Demo job posting not found');
        const detail: JobPostingDetailResponse = {
          ...currentDetail,
          ...request,
        };
        detailCacheRef.current.set(jobPostingId, detail);
        setJobDetails((current) => ({ ...current, [jobPostingId]: detail }));
        const nextJobs = jobsRef.current.map((job) =>
          job.jobPostingId === jobPostingId
            ? toJobListItem(detail, job.createdAt)
            : job,
        );
        jobsRef.current = nextJobs;
        setJobs(nextJobs);
        return detail;
      }

      const detail = await updateJobPosting(jobPostingId, request);
      detailCacheRef.current.set(jobPostingId, detail);
      setJobDetails((current) => ({ ...current, [jobPostingId]: detail }));
      await refreshJobs();
      return detail;
    },
    [refreshJobs],
  );

  const closeJob = useCallback(async (jobPostingId: number) => {
    const response = IS_DEMO_MODE
      ? {
          jobPostingId,
          status: 'CLOSED' as const,
          closedAt: new Date().toISOString(),
        }
      : await closeJobPosting(jobPostingId);
    const nextJobs = jobsRef.current.map((job) =>
      job.jobPostingId === jobPostingId
        ? { ...job, status: response.status }
        : job,
    );
    jobsRef.current = nextJobs;
    setJobs(nextJobs);
    const cachedDetail = detailCacheRef.current.get(jobPostingId);
    if (cachedDetail) {
      const nextDetail = { ...cachedDetail, status: response.status };
      detailCacheRef.current.set(jobPostingId, nextDetail);
      setJobDetails((current) => ({
        ...current,
        [jobPostingId]: nextDetail,
      }));
    }
    return response;
  }, []);

  const value = useMemo(
    () => ({
      jobs,
      jobDetails,
      loadJobs,
      loadJobDetail,
      createJob,
      updateJob,
      closeJob,
    }),
    [closeJob, createJob, jobDetails, jobs, loadJobDetail, loadJobs, updateJob],
  );

  return (
    <EmployerJobsContext.Provider value={value}>
      {children}
    </EmployerJobsContext.Provider>
  );
}

export default EmployerJobsProvider;
