import { createContext, useContext } from "react";
import type { EmployerJobMock } from "../types/employerJob";

interface EmployerJobsContextValue {
  jobs: EmployerJobMock[];
  closeJob: (jobId: string) => void;
}

const EmployerJobsContext = createContext<EmployerJobsContextValue | null>(
  null,
);

function useEmployerJobs() {
  const context = useContext(EmployerJobsContext);

  if (!context) {
    throw new Error("useEmployerJobs must be used within EmployerJobsProvider");
  }

  return context;
}

export { EmployerJobsContext, useEmployerJobs };
