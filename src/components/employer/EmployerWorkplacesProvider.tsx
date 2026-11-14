import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { subscribeToAuthInvalidation } from '../../api/accessToken';
import { IS_DEMO_MODE } from '../../config/demoMode';
import {
  getMyWorkplaces,
  getWorkplaceDetail,
  updateWorkplace,
} from '../../api/workplaces';
import { EmployerWorkplacesContext } from '../../hooks/useEmployerWorkplaces';
import {
  getDemoWorkplaceDetail,
  getDemoWorkplaces,
} from '../../mocks/employerDemoData';
import type {
  EmployerWorkplaceListItem,
  UpdateWorkplaceRequest,
  WorkplaceDetailResponse,
} from '../../types/workplace';

function EmployerWorkplacesProvider({ children }: { children: ReactNode }) {
  const [workplaces, setWorkplaces] = useState<EmployerWorkplaceListItem[]>([]);
  const [workplaceDetails, setWorkplaceDetails] = useState<
    Record<number, WorkplaceDetailResponse>
  >({});
  const workplacesRef = useRef<EmployerWorkplaceListItem[]>([]);
  const isListLoadedRef = useRef(false);
  const listRequestRef = useRef<Promise<EmployerWorkplaceListItem[]> | null>(
    null,
  );
  const detailRequestRefs = useRef(
    new Map<number, Promise<WorkplaceDetailResponse>>(),
  );
  const detailCacheRef = useRef(new Map<number, WorkplaceDetailResponse>());

  useEffect(() => {
    workplacesRef.current = workplaces;
  }, [workplaces]);

  useEffect(() => {
    const unsubscribe = subscribeToAuthInvalidation(() => {
      workplacesRef.current = [];
      isListLoadedRef.current = false;
      listRequestRef.current = null;
      detailRequestRefs.current.clear();
      detailCacheRef.current.clear();
      setWorkplaces([]);
      setWorkplaceDetails({});
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadWorkplaces = useCallback(() => {
    if (isListLoadedRef.current) {
      return Promise.resolve(workplacesRef.current);
    }

    if (listRequestRef.current) {
      return listRequestRef.current;
    }

    const request = (
      IS_DEMO_MODE
        ? Promise.resolve({ workplaces: getDemoWorkplaces() })
        : getMyWorkplaces()
    )
      .then(({ workplaces: nextWorkplaces }) => {
        workplacesRef.current = nextWorkplaces;
        isListLoadedRef.current = true;
        setWorkplaces(nextWorkplaces);
        return nextWorkplaces;
      })
      .finally(() => {
        listRequestRef.current = null;
      });

    listRequestRef.current = request;
    return request;
  }, []);

  const loadWorkplaceDetail = useCallback((workplaceId: number) => {
    const cachedDetail = detailCacheRef.current.get(workplaceId);
    if (cachedDetail) return Promise.resolve(cachedDetail);

    const existingRequest = detailRequestRefs.current.get(workplaceId);
    if (existingRequest) return existingRequest;

    const demoDetail = IS_DEMO_MODE
      ? getDemoWorkplaceDetail(workplaceId)
      : undefined;
    const request = (
      IS_DEMO_MODE
        ? demoDetail
          ? Promise.resolve(demoDetail)
          : Promise.reject(new Error('Demo workplace not found'))
        : getWorkplaceDetail(workplaceId)
    )
      .then((detail) => {
        detailCacheRef.current.set(workplaceId, detail);
        setWorkplaceDetails((current) => ({
          ...current,
          [workplaceId]: detail,
        }));
        return detail;
      })
      .finally(() => {
        detailRequestRefs.current.delete(workplaceId);
      });

    detailRequestRefs.current.set(workplaceId, request);
    return request;
  }, []);

  const saveWorkplace = useCallback(
    async (workplaceId: number, request: UpdateWorkplaceRequest) => {
      const currentDetail =
        detailCacheRef.current.get(workplaceId) ??
        getDemoWorkplaceDetail(workplaceId);
      const detail = IS_DEMO_MODE
        ? currentDetail
          ? { ...currentDetail, ...request }
          : await Promise.reject<WorkplaceDetailResponse>(
              new Error('Demo workplace not found'),
            )
        : await updateWorkplace(workplaceId, request);
      detailCacheRef.current.set(workplaceId, detail);
      setWorkplaceDetails((current) => ({
        ...current,
        [workplaceId]: detail,
      }));
      const nextWorkplaces = workplacesRef.current.map((workplace) =>
        workplace.workplaceId === workplaceId
          ? {
              workplaceId: detail.workplaceId,
              workplaceName: detail.workplaceName,
              businessTypeId: detail.businessTypeId,
              businessTypeName: detail.businessTypeName,
              workplaceAddress: detail.workplaceAddress,
              employeeCountRange: detail.employeeCountRange,
            }
          : workplace,
      );
      workplacesRef.current = nextWorkplaces;
      setWorkplaces(nextWorkplaces);
      return detail;
    },
    [],
  );

  const value = useMemo(
    () => ({
      workplaces,
      workplaceDetails,
      loadWorkplaces,
      loadWorkplaceDetail,
      saveWorkplace,
    }),
    [
      loadWorkplaceDetail,
      loadWorkplaces,
      saveWorkplace,
      workplaceDetails,
      workplaces,
    ],
  );

  return (
    <EmployerWorkplacesContext.Provider value={value}>
      {children}
    </EmployerWorkplacesContext.Provider>
  );
}

export default EmployerWorkplacesProvider;
