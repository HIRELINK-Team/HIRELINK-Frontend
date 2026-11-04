import { createContext, useContext } from 'react';
import type {
  EmployerProfile,
  EmployerProfileResponse,
} from '../types/employerProfile';

interface EmployerProfileContextValue {
  profile: EmployerProfile;
  loadProfile: () => Promise<EmployerProfileResponse>;
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
