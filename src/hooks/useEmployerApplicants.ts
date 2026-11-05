import { createContext, useContext } from 'react';
import type {
  CreateEmploymentOfferResponse,
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
