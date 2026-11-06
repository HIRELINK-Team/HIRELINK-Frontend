import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { subscribeToAuthInvalidation } from '../../api/accessToken';
import { getEmployerMatchDetail, getEmployerMatches } from '../../api/matches';
import { EmployerMatchesContext } from '../../hooks/useEmployerMatches';
import type {
  EmployerMatchDetailResponse,
  EmployerMatchListItem,
} from '../../types/match';

const ALL_MATCHES_CACHE_KEY = 'ALL';

function getListCacheKey(jobPostingId?: number) {
  return jobPostingId === undefined
    ? ALL_MATCHES_CACHE_KEY
    : String(jobPostingId);
}

function EmployerMatchesProvider({ children }: { children: ReactNode }) {
  const [matches, setMatches] = useState<EmployerMatchListItem[]>([]);
  const [matchDetails, setMatchDetails] = useState<
    Record<number, EmployerMatchDetailResponse>
  >({});
  const listCacheRef = useRef(new Map<string, EmployerMatchListItem[]>());
  const listRequestRef = useRef(
    new Map<string, Promise<EmployerMatchListItem[]>>(),
  );
  const activeListKeyRef = useRef(ALL_MATCHES_CACHE_KEY);
  const detailCacheRef = useRef(new Map<number, EmployerMatchDetailResponse>());
  const detailRequestRef = useRef(
    new Map<number, Promise<EmployerMatchDetailResponse>>(),
  );

  useEffect(() => {
    const unsubscribe = subscribeToAuthInvalidation(() => {
      listCacheRef.current.clear();
      listRequestRef.current.clear();
      detailCacheRef.current.clear();
      detailRequestRef.current.clear();
      activeListKeyRef.current = ALL_MATCHES_CACHE_KEY;
      setMatches([]);
      setMatchDetails({});
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const loadMatches = useCallback((jobPostingId?: number, force = false) => {
    const cacheKey = getListCacheKey(jobPostingId);
    activeListKeyRef.current = cacheKey;
    const cached = listCacheRef.current.get(cacheKey);
    if (!force && cached) {
      setMatches(cached);
      return Promise.resolve(cached);
    }

    const pending = listRequestRef.current.get(cacheKey);
    if (pending) return pending;

    const request = getEmployerMatches({ jobPostingId })
      .then((response) => {
        listCacheRef.current.set(cacheKey, response.matches);
        if (activeListKeyRef.current === cacheKey) {
          setMatches(response.matches);
        }
        return response.matches;
      })
      .finally(() => {
        listRequestRef.current.delete(cacheKey);
      });
    listRequestRef.current.set(cacheKey, request);
    return request;
  }, []);

  const loadMatchDetail = useCallback((matchId: number, force = false) => {
    const cached = detailCacheRef.current.get(matchId);
    if (!force && cached) return Promise.resolve(cached);
    const pending = detailRequestRef.current.get(matchId);
    if (pending) return pending;

    const request = getEmployerMatchDetail(matchId)
      .then((detail) => {
        detailCacheRef.current.set(matchId, detail);
        setMatchDetails((current) => ({ ...current, [matchId]: detail }));
        return detail;
      })
      .finally(() => {
        detailRequestRef.current.delete(matchId);
      });
    detailRequestRef.current.set(matchId, request);
    return request;
  }, []);

  const value = useMemo(
    () => ({ matches, matchDetails, loadMatches, loadMatchDetail }),
    [loadMatchDetail, loadMatches, matchDetails, matches],
  );

  return (
    <EmployerMatchesContext.Provider value={value}>
      {children}
    </EmployerMatchesContext.Provider>
  );
}

export default EmployerMatchesProvider;
