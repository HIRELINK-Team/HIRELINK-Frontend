import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EmployerJobsContext } from "../../hooks/useEmployerJobs";
import type { EmployerJobMock } from "../../types/employerJob";

const INITIAL_EMPLOYER_JOB_MOCKS: EmployerJobMock[] = [
  {
    id: "barista-open",
    title: "바리스타",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "OPEN",
    deadlineLabel: "마감 D-22",
    applicantCount: 3,
    applicantCapacity: 5,
  },
  {
    id: "server-open",
    title: "서버",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "OPEN",
    deadlineLabel: "마감 D-22",
    applicantCount: 5,
    applicantCapacity: 5,
  },
  {
    id: "barista-closed",
    title: "바리스타",
    wageAndSchedule: "13,000원 · 월수금 16-22",
    status: "CLOSED",
  },
];

function EmployerJobsProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<EmployerJobMock[]>(
    INITIAL_EMPLOYER_JOB_MOCKS,
  );

  const closeJob = useCallback((jobId: string) => {
    setJobs((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId ? { ...job, status: "CLOSED" } : job,
      ),
    );
  }, []);

  const value = useMemo(() => ({ jobs, closeJob }), [closeJob, jobs]);

  return (
    <EmployerJobsContext.Provider value={value}>
      {children}
    </EmployerJobsContext.Provider>
  );
}

export default EmployerJobsProvider;
