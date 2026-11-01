import { createContext, useContext } from "react";
import type { EmployerApplicantMock } from "../types/application";

interface EmployerApplicantsContextValue {
  applicants: EmployerApplicantMock[];
  offerApplicant: (applicationId: string) => void;
  rejectApplicant: (applicationId: string) => void;
}

const EmployerApplicantsContext =
  createContext<EmployerApplicantsContextValue | null>(null);

function useEmployerApplicants() {
  const context = useContext(EmployerApplicantsContext);

  if (!context) {
    throw new Error(
      "useEmployerApplicants must be used within EmployerApplicantsProvider",
    );
  }

  return context;
}

export { EmployerApplicantsContext, useEmployerApplicants };
