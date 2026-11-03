import { useCallback, useMemo, useState, type ReactNode } from "react";
import { EMPLOYER_PROFILE_MOCK } from "../../data/employerProfileData";
import { EmployerProfileContext } from "../../hooks/useEmployerProfile";
import type { EmployerProfile } from "../../types/employerProfile";

function cloneProfile(profile: EmployerProfile): EmployerProfile {
  return { ...profile, business: { ...profile.business } };
}

function EmployerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() =>
    cloneProfile(EMPLOYER_PROFILE_MOCK),
  );

  const updateProfile = useCallback((nextProfile: EmployerProfile) => {
    setProfile(cloneProfile(nextProfile));
  }, []);

  const value = useMemo(
    () => ({ profile, updateProfile }),
    [profile, updateProfile],
  );

  return (
    <EmployerProfileContext.Provider value={value}>
      {children}
    </EmployerProfileContext.Provider>
  );
}

export default EmployerProfileProvider;
