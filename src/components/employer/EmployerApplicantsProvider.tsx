import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { subscribeToAuthInvalidation } from '../../api/accessToken';
import {
  createEmploymentOffer,
  getEmployerApplicationDetail,
  getEmployerApplications,
  rejectEmployerApplication,
} from '../../api/applications';
import { EMPLOYER_APPLICANT_MOCKS } from '../../data/employerApplicantsData';
import { EmployerApplicantsContext } from '../../hooks/useEmployerApplicants';
import type {
  CreateEmploymentOfferResponse,
  EmployerApplicationDetailResponse,
  EmployerApplicationListResponse,
  RejectApplicationResponse,
} from '../../types/application';

const RESPONSE_TIME_LIMIT_HOURS = 24;

function EmployerApplicantsProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useState(EMPLOYER_APPLICANT_MOCKS);
  const [applicationLists, setApplicationLists] = useState<
    Record<number, EmployerApplicationListResponse>
  >({});
  const [applicationDetails, setApplicationDetails] = useState<
    Record<number, EmployerApplicationDetailResponse>
  >({});
  const [mutatingApplicationIds, setMutatingApplicationIds] = useState<
    number[]
  >([]);
  const applicationListsRef = useRef<
    Record<number, EmployerApplicationListResponse>
  >({});
  const applicationDetailsRef = useRef<
    Record<number, EmployerApplicationDetailResponse>
  >({});
  const listRequestRef = useRef(
    new Map<number, Promise<EmployerApplicationListResponse>>(),
  );
  const detailRequestRef = useRef(
    new Map<number, Promise<EmployerApplicationDetailResponse>>(),
  );
  const rejectRequestRef = useRef(
    new Map<number, Promise<RejectApplicationResponse>>(),
  );
  const offerRequestRef = useRef(
    new Map<number, Promise<CreateEmploymentOfferResponse>>(),
  );

  useEffect(() => {
    const unsubscribe = subscribeToAuthInvalidation(() => {
      applicationListsRef.current = {};
      applicationDetailsRef.current = {};
      listRequestRef.current.clear();
      detailRequestRef.current.clear();
      rejectRequestRef.current.clear();
      offerRequestRef.current.clear();
      setApplicationLists({});
      setApplicationDetails({});
      setMutatingApplicationIds([]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const setApplicationList = useCallback(
    (jobPostingId: number, response: EmployerApplicationListResponse) => {
      const nextLists = {
        ...applicationListsRef.current,
        [jobPostingId]: response,
      };
      applicationListsRef.current = nextLists;
      setApplicationLists(nextLists);
    },
    [],
  );

  const setApplicationDetail = useCallback(
    (applicationId: number, detail: EmployerApplicationDetailResponse) => {
      const nextDetails = {
        ...applicationDetailsRef.current,
        [applicationId]: detail,
      };
      applicationDetailsRef.current = nextDetails;
      setApplicationDetails(nextDetails);
    },
    [],
  );

  const loadApplicationList = useCallback(
    (jobPostingId: number, force = false) => {
      const cached = applicationListsRef.current[jobPostingId];
      if (!force && cached) return Promise.resolve(cached);
      const pending = listRequestRef.current.get(jobPostingId);
      if (pending) return pending;

      const request = getEmployerApplications(jobPostingId)
        .then((response) => {
          setApplicationList(jobPostingId, response);
          return response;
        })
        .finally(() => {
          listRequestRef.current.delete(jobPostingId);
        });
      listRequestRef.current.set(jobPostingId, request);
      return request;
    },
    [setApplicationList],
  );

  const loadApplicationDetail = useCallback(
    (applicationId: number, force = false) => {
      const cached = applicationDetailsRef.current[applicationId];
      if (!force && cached) return Promise.resolve(cached);
      const pending = detailRequestRef.current.get(applicationId);
      if (pending) return pending;

      const request = getEmployerApplicationDetail(applicationId)
        .then((detail) => {
          setApplicationDetail(applicationId, detail);
          return detail;
        })
        .finally(() => {
          detailRequestRef.current.delete(applicationId);
        });
      detailRequestRef.current.set(applicationId, request);
      return request;
    },
    [setApplicationDetail],
  );

  const setMutationPending = useCallback(
    (applicationId: number, isPending: boolean) => {
      setMutatingApplicationIds((current) =>
        isPending
          ? [...new Set([...current, applicationId])]
          : current.filter((id) => id !== applicationId),
      );
    },
    [],
  );

  const rejectApplication = useCallback(
    (applicationId: number, jobPostingId: number) => {
      const pending = rejectRequestRef.current.get(applicationId);
      if (pending) return pending;

      setMutationPending(applicationId, true);
      const request = rejectEmployerApplication(applicationId)
        .then((response) => {
          const currentList = applicationListsRef.current[jobPostingId];
          if (currentList) {
            const rejected = currentList.applications.find(
              (application) => application.applicationId === applicationId,
            );
            setApplicationList(jobPostingId, {
              ...currentList,
              occupiedCount:
                rejected?.status === 'WAITING_RESPONSE'
                  ? Math.max(0, currentList.occupiedCount - 1)
                  : currentList.occupiedCount,
              waitingResponseCount:
                rejected?.status === 'WAITING_RESPONSE'
                  ? Math.max(0, currentList.waitingResponseCount - 1)
                  : currentList.waitingResponseCount,
              applications: currentList.applications.filter(
                (application) => application.applicationId !== applicationId,
              ),
            });
          }

          const currentDetail = applicationDetailsRef.current[applicationId];
          if (currentDetail) {
            setApplicationDetail(applicationId, {
              ...currentDetail,
              status: response.status,
            });
          }
          void loadApplicationList(jobPostingId, true).catch(() => undefined);
          return response;
        })
        .finally(() => {
          rejectRequestRef.current.delete(applicationId);
          setMutationPending(applicationId, false);
        });
      rejectRequestRef.current.set(applicationId, request);
      return request;
    },
    [
      loadApplicationList,
      setApplicationDetail,
      setApplicationList,
      setMutationPending,
    ],
  );

  const offerApplication = useCallback(
    (applicationId: number, jobPostingId: number) => {
      const pending = offerRequestRef.current.get(applicationId);
      if (pending) return pending;

      setMutationPending(applicationId, true);
      const request = createEmploymentOffer(applicationId)
        .then((response) => {
          const currentList = applicationListsRef.current[jobPostingId];
          if (currentList) {
            setApplicationList(jobPostingId, {
              ...currentList,
              waitingResponseCount: Math.max(
                0,
                currentList.waitingResponseCount - 1,
              ),
              offeredCount: currentList.offeredCount + 1,
              applications: currentList.applications.map((application) =>
                application.applicationId === applicationId
                  ? {
                      ...application,
                      status: 'OFFERED',
                      employerResponseDeadline: null,
                      offerId: response.offerId,
                      studentResponseDeadline: response.studentResponseDeadline,
                    }
                  : application,
              ),
            });
          }

          const currentDetail = applicationDetailsRef.current[applicationId];
          if (currentDetail) {
            setApplicationDetail(applicationId, {
              ...currentDetail,
              status: 'OFFERED',
            });
          }
          void loadApplicationList(jobPostingId, true).catch(() => undefined);
          return response;
        })
        .finally(() => {
          offerRequestRef.current.delete(applicationId);
          setMutationPending(applicationId, false);
        });
      offerRequestRef.current.set(applicationId, request);
      return request;
    },
    [
      loadApplicationList,
      setApplicationDetail,
      setApplicationList,
      setMutationPending,
    ],
  );

  const offerApplicant = useCallback((applicationId: string) => {
    const offerExpiresAt = new Date(
      Date.now() + RESPONSE_TIME_LIMIT_HOURS * 60 * 60 * 1000,
    ).toISOString();

    setApplicants((currentApplicants) =>
      currentApplicants.map((applicant) =>
        applicant.id === applicationId
          ? {
              ...applicant,
              status: 'OFFER_WAITING',
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
          ? { ...applicant, status: 'REJECTED', expiresAt: undefined }
          : applicant,
      ),
    );
  }, []);

  const value = useMemo(
    () => ({
      applicants,
      applicationLists,
      applicationDetails,
      mutatingApplicationIds,
      loadApplicationList,
      loadApplicationDetail,
      rejectApplication,
      offerApplication,
      offerApplicant,
      rejectApplicant,
    }),
    [
      applicants,
      applicationDetails,
      applicationLists,
      loadApplicationDetail,
      loadApplicationList,
      mutatingApplicationIds,
      offerApplicant,
      offerApplication,
      rejectApplicant,
      rejectApplication,
    ],
  );

  return (
    <EmployerApplicantsContext.Provider value={value}>
      {children}
    </EmployerApplicantsContext.Provider>
  );
}

export default EmployerApplicantsProvider;
