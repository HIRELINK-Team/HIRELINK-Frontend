import { createContext, useContext } from 'react';
import type {
  CreateEmploymentOfferResponse,
  EmployerApplicantMock,
  EmployerApplicationDetailResponse,
  EmployerApplicationListResponse,
  RejectApplicationResponse,
} from '../types/application';

interface EmployerApplicantsContextValue {
  applicationLists: Record<number, EmployerApplicationListResponse>;
  applicationDetails: Record<number, EmployerApplicationDetailResponse>;
  mutatingApplicationIds: number[];
  loadApplicationList: (
    jobPostingId: number,
    force?: boolean,
  ) => Promise<EmployerApplicationListResponse>;
  loadApplicationDetail: (
    applicationId: number,
    force?: boolean,
  ) => Promise<EmployerApplicationDetailResponse>;
  rejectApplication: (
    applicationId: number,
    jobPostingId: number,
  ) => Promise<RejectApplicationResponse>;
  offerApplication: (
    applicationId: number,
    jobPostingId: number,
  ) => Promise<CreateEmploymentOfferResponse>;
  /** 아직 Backend Match API 범위 밖인 Dashboard/Hired 화면용 legacy mock state입니다. */
  applicants: EmployerApplicantMock[];
  offerApplicant: (applicationId: string) => void;
  rejectApplicant: (applicationId: string) => void;
  removeHiredApplicants: (applicationIds: string[]) => void;
}

const EmployerApplicantsContext =
  createContext<EmployerApplicantsContextValue | null>(null);

function useEmployerApplicants() {
  const context = useContext(EmployerApplicantsContext);

  if (!context) {
    throw new Error(
      'useEmployerApplicants must be used within EmployerApplicantsProvider',
    );
  }

  return context;
}

export { EmployerApplicantsContext, useEmployerApplicants };
