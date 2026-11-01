import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EMPLOYER_APPLICANT_MOCKS } from "../../data/employerApplicantsData";
import { EmployerApplicantsContext } from "../../hooks/useEmployerApplicants";

const RESPONSE_TIME_LIMIT_HOURS = 24;

function EmployerApplicantsProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useState(EMPLOYER_APPLICANT_MOCKS);

  const offerApplicant = useCallback((applicationId: string) => {
    const offerExpiresAt = new Date(
      Date.now() + RESPONSE_TIME_LIMIT_HOURS * 60 * 60 * 1000,
    ).toISOString();

    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.id === applicationId
          ? {
              ...applicant,
              status: "OFFER_WAITING",
              expiresAt: offerExpiresAt,
            }
          : applicant,
      ),
    );
  }, []);

  const rejectApplicant = useCallback((applicationId: string) => {
    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.id === applicationId
          ? { ...applicant, status: "REJECTED", expiresAt: undefined }
          : applicant,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({ applicants, offerApplicant, rejectApplicant }),
    [applicants, offerApplicant, rejectApplicant],
  );

  return (
    <EmployerApplicantsContext.Provider value={value}>
      {children}
    </EmployerApplicantsContext.Provider>
  );
}

export default EmployerApplicantsProvider;
