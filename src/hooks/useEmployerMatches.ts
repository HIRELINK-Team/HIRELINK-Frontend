import { createContext, useContext } from 'react';
import type {
  EmployerMatchDetailResponse,
  EmployerMatchListItem,
} from '../types/match';

interface EmployerMatchesContextValue {
  matches: EmployerMatchListItem[];
  matchDetails: Record<number, EmployerMatchDetailResponse>;
  loadMatches: (
    jobPostingId?: number,
    force?: boolean,
  ) => Promise<EmployerMatchListItem[]>;
  loadMatchDetail: (
    matchId: number,
    force?: boolean,
  ) => Promise<EmployerMatchDetailResponse>;
}

const EmployerMatchesContext =
  createContext<EmployerMatchesContextValue | null>(null);

function useEmployerMatches() {
  const context = useContext(EmployerMatchesContext);
  if (!context) {
    throw new Error(
      'useEmployerMatches must be used within EmployerMatchesProvider',
    );
  }
  return context;
}

export { EmployerMatchesContext, useEmployerMatches };
