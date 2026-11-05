import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  createEmployerProfile as requestEmployerProfileCreation,
  getEmployerProfile,
  updateEmployerProfile as requestEmployerProfileUpdate,
} from '../../api/employers';
import { subscribeToAuthInvalidation } from '../../api/accessToken';
import { EMPLOYER_PROFILE_MOCK } from '../../data/employerProfileData';
import { EmployerProfileContext } from '../../hooks/useEmployerProfile';
import type {
  CreateEmployerProfileRequest,
  EmployerProfile,
  EmployerProfileResponse,
  UpdateEmployerProfileRequest,
} from '../../types/employerProfile';

function cloneProfile(profile: EmployerProfile): EmployerProfile {
  return { ...profile, business: { ...profile.business } };
}

function mergeProfileResponse(
  current: EmployerProfile,
  response: EmployerProfileResponse,
): EmployerProfile {
  return {
    ...current,
    name: response.name,
    email: response.email,
    phone: response.phoneNumber,
    position: response.position,
  };
}

function EmployerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() =>
    cloneProfile(EMPLOYER_PROFILE_MOCK),
  );
  const profileRequestRef = useRef<Promise<EmployerProfileResponse> | null>(
    null,
  );
  const loadedProfileRef = useRef<EmployerProfileResponse | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToAuthInvalidation(() => {
      profileRequestRef.current = null;
      loadedProfileRef.current = null;
      setProfile(cloneProfile(EMPLOYER_PROFILE_MOCK));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadProfile = useCallback(() => {
    if (loadedProfileRef.current) {
      return Promise.resolve(loadedProfileRef.current);
    }

    if (profileRequestRef.current) {
      return profileRequestRef.current;
    }

    const request = getEmployerProfile()
      .then((response) => {
        loadedProfileRef.current = response;
        setProfile((current) => mergeProfileResponse(current, response));
        return response;
      })
      .finally(() => {
        profileRequestRef.current = null;
      });

    profileRequestRef.current = request;
    return request;
  }, []);

  const saveProfile = useCallback(
    async (request: UpdateEmployerProfileRequest) => {
      const response = await requestEmployerProfileUpdate(request);
      loadedProfileRef.current = response;
      setProfile((current) => mergeProfileResponse(current, response));
      return response;
    },
    [],
  );

  const createProfile = useCallback(
    async (request: CreateEmployerProfileRequest) => {
      const response = await requestEmployerProfileCreation(request);
      loadedProfileRef.current = response;
      setProfile((current) => mergeProfileResponse(current, response));
      return response;
    },
    [],
  );

  const updateProfile = useCallback((nextProfile: EmployerProfile) => {
    setProfile(cloneProfile(nextProfile));
  }, []);

  const value = useMemo(
    () => ({ profile, loadProfile, createProfile, saveProfile, updateProfile }),
    [createProfile, loadProfile, profile, saveProfile, updateProfile],
  );

  return (
    <EmployerProfileContext.Provider value={value}>
      {children}
    </EmployerProfileContext.Provider>
  );
}

export default EmployerProfileProvider;
