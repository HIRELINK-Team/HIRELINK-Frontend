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
import { EmployerJobsContext } from '../../hooks/useEmployerJobs';
import type {
  CreateJobPostingRequest,
  JobPostingDetailResponse,
  JobPostingListItem,
  UpdateJobPostingRequest,
} from '../../types/jobPosting';

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

    const request = getMyJobPostings({ includeDraft: true })
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

    const request = getJobPostingDetail(jobPostingId)
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
      const detail = await updateJobPosting(jobPostingId, request);
      detailCacheRef.current.set(jobPostingId, detail);
      setJobDetails((current) => ({ ...current, [jobPostingId]: detail }));
      await refreshJobs();
      return detail;
    },
    [refreshJobs],
  );

  const closeJob = useCallback(async (jobPostingId: number) => {
    const response = await closeJobPosting(jobPostingId);
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
