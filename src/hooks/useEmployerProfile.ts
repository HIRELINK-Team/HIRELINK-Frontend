import { createContext, useContext } from 'react';
import type {
  CreateEmployerProfileRequest,
  CreateEmployerProfileResponse,
  EmployerProfile,
  EmployerProfileResponse,
  UpdateEmployerProfileRequest,
} from '../types/employerProfile';

interface EmployerProfileContextValue {
  profile: EmployerProfile;
  loadProfile: () => Promise<EmployerProfileResponse>;
  createProfile: (
    request: CreateEmployerProfileRequest,
  ) => Promise<CreateEmployerProfileResponse>;
  saveProfile: (
    request: UpdateEmployerProfileRequest,
  ) => Promise<EmployerProfileResponse>;
  updateProfile: (profile: EmployerProfile) => void;
}

const EmployerProfileContext =
  createContext<EmployerProfileContextValue | null>(null);

function useEmployerProfile() {
  const context = useContext(EmployerProfileContext);

  if (!context) {
    throw new Error(
      'useEmployerProfile must be used within EmployerProfileProvider',
    );
  }

  return context;
}

export { EmployerProfileContext, useEmployerProfile };
