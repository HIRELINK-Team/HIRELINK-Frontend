import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import { getAccessToken, setAccessToken } from './api/accessToken';
import {
  acceptStudentEmploymentOffer,
  createStudentProfile,
  createStudentRecommendations,
  createStudentApplication,
  getStudentMatchingPreferences,
  getMyStudentApplication,
  getMyStudentApplications,
  getEmploymentMatch,
  getMyEmploymentMatches,
  getStudentProfile,
  getStudentRecommendation,
  getStudentRecommendations,
  loginStudent,
  refreshAccessToken,
  refreshStudentRecommendations,
  rejectStudentEmploymentOffer,
  signupStudent,
  updateStudentProfile,
  updateStudentMatchingPreferences,
  withdrawStudentApplication,
} from './api/student';
import { getStudentJobPosting } from './api/jobPostings';
import {
  mapIndustrySelectionToUpdateRequest,
  mapPriorityOrderToUpdateRequest,
  mapStudentMatchingPreferencesToUiState,
  mapWorkAvailabilityToUpdateRequest,
  mapWorkLocationToUpdateRequest,
} from './adapters/studentMatchingPreferences';
import {
  mapStudentApplicationDetailToCardModel,
  mapStudentEmploymentMatchToCardModel,
  mapStudentApplicationToCardModel,
} from './adapters/studentApplications';
import {
  EMPTY_STUDENT_HOME_SUMMARY,
  mapStudentHomeSummary,
} from './adapters/studentHome';
import {
  mapStudentProfileResponseToValues,
  mapStudentProfileValuesToUpdateRequest,
} from './adapters/studentProfile';
import { mapStudentRecommendationToRecommendedJob } from './adapters/studentRecommendations';
import { mapStudentJobPostingToRecommendedJob } from './adapters/studentJobPostings';
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EmployerApplicantsProvider from './components/employer/EmployerApplicantsProvider';
import EmployerLayout from './components/employer/EmployerLayout';
import EmployerJobsProvider from './components/employer/EmployerJobsProvider';
import EmployerProfileProvider from './components/employer/EmployerProfileProvider';
import EmployerWorkplacesProvider from './components/employer/EmployerWorkplacesProvider';
import EmployerAccountSettingsPage from './pages/employer/EmployerAccountSettingsPage';
import EmployerApplicantDetailPage from './pages/employer/EmployerApplicantDetailPage';
import EmployerApplicantsPage from './pages/employer/EmployerApplicantsPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerEmailLoginPage from './pages/employer/EmployerEmailLoginPage';
import EmployerHiredStudentDetailPage from './pages/employer/EmployerHiredStudentDetailPage';
import EmployerHiredStudentsPage from './pages/employer/EmployerHiredStudentsPage';
import EmployerJobFormPage from './pages/employer/EmployerJobFormPage';
import EmployerJobsPage from './pages/employer/EmployerJobsPage';
import EmployerLoginPage from './pages/employer/EmployerLoginPage';
import EmployerMyPage from './pages/employer/EmployerMyPage';
import EmployerNotificationsPage from './pages/employer/EmployerNotificationsPage';
import EmployerOnboardingPage from './pages/employer/EmployerOnboardingPage';
import EmployerSettingsPage from './pages/employer/EmployerSettingsPage';
import EmployerSignUpPage from './pages/employer/EmployerSignUpPage';
import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentApplicationDetailPage from './pages/student/StudentApplicationDetailPage';
import StudentHiringCompletePage from './pages/student/StudentHiringCompletePage';
import StudentEmailLoginPage from './pages/student/StudentEmailLoginPage';
import StudentEmailSignupPage from './pages/student/StudentEmailSignupPage';
import StudentEntryOnboardingPage from './pages/student/StudentEntryOnboardingPage';
import StudentCustomerCenterPage from './pages/student/StudentCustomerCenterPage';
import StudentDocumentManagementPage from './pages/student/StudentDocumentManagementPage';
import type { StudentDocumentManagementView } from './pages/student/StudentDocumentManagementPage';
import StudentHomePage from './pages/student/StudentHomePage';
import StudentMatchingPage from './pages/student/StudentMatchingPage';
import StudentMatchingConditionManagementPage from './pages/student/StudentMatchingConditionManagementPage';
import StudentMyPage from './pages/student/StudentMyPage';
import StudentNotificationSettingsPage from './pages/student/StudentNotificationSettingsPage';
import StudentOnboardingPage from './pages/student/StudentOnboardingPage';
import StudentProfileManagementPage, {
  type ProfileDetailView,
  type StudentProfileValues,
} from './pages/student/StudentProfileManagementPage';
import StudentSplashPage from './pages/student/StudentSplashPage';
import StudentTermsPrivacyPage from './pages/student/StudentTermsPrivacyPage';
import StudentWorkConditionPage from './pages/student/StudentWorkConditionPage';
import { formatWorkAvailabilityRanges } from './utils/formatWorkAvailability';
import StudentMatchingConditionIndustryPage from './pages/student/StudentMatchingConditionIndustryPage';
import StudentMatchingConditionLocationPage from './pages/student/StudentMatchingConditionLocationPage';
import StudentMatchingConditionPriorityPage from './pages/student/StudentMatchingConditionPriorityPage';
import StudentMatchingConditionStartDatePage from './pages/student/StudentMatchingConditionStartDatePage';
import StudentMatchingConditionWorkTimePage from './pages/student/StudentMatchingConditionWorkTimePage';
import type { StudentNavigationTab } from './types/studentHome';
import type { StudentApplicationCardModel } from './types/studentApplication';
import type { StudentDocument } from './types/studentDocument';
import type { IndustryId } from './types/industry';
import type { MatchingPriorityId } from './types/matchingPriority';
import type { StudentMatchingPreferencesResponse } from './types/studentMatchingPreferences';
import type { RecommendedJob } from './types/studentMatching';
import type {
  StudentNotificationId,
  StudentNotificationSettings,
} from './types/studentNotification';
import type { StudentMyMenuId } from './types/studentMy';
import type { StudentEmploymentMatchContact } from './types/studentMatch';
import type {
  StudentProfileResponse,
  StudentProfileUpdateResponse,
} from './types/studentProfile';
import type { WorkAvailability } from './types/workAvailability';
import type { WorkLocation } from './types/workLocation';

const SPLASH_DURATION_MS = 1800;
const STUDENT_DOCUMENT_GUIDE_SESSION_STORAGE_KEY =
  'hirelink.student.documents.guideAcknowledged';
const STUDENT_DOCUMENT_COMPLETION_SESSION_STORAGE_KEY =
  'hirelink.student.documents.completion';
const STUDENT_DOCUMENT_REGISTRATION_DATES_SESSION_STORAGE_KEY =
  'hirelink.student.documents.registrationDates';
const PUBLIC_STUDENT_ROUTES = new Set([
  '/student',
  '/student/entry',
  '/student/login',
  '/student/signup',
]);

const STUDENT_TAB_ROUTES: Record<StudentNavigationTab, string> = {
  applications: '/student/applications',
  home: '/student/home',
  matching: '/student/matching',
  my: '/student/my',
};

type StudentDocumentFlowId =
  | 'alien-registration-card'
  | 'enrollment-certificate'
  | 'transcript'
  | 'topik-transcript';

type StudentDocumentRouteContext = {
  confirmGuide: () => void;
  documentCompletion: Record<StudentDocumentFlowId, boolean>;
  documentRegistrationDates: Partial<Record<StudentDocumentFlowId, string>>;
  completeDocument: (
    documentId: StudentDocumentFlowId,
    registeredAt: string,
  ) => void;
  registrationView: () => void;
  view: 'guide' | 'registration';
};

const INITIAL_DOCUMENT_COMPLETION: Record<StudentDocumentFlowId, boolean> = {
  'alien-registration-card': false,
  'enrollment-certificate': false,
  'topik-transcript': false,
  transcript: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStoredDocumentCompletion(): Record<StudentDocumentFlowId, boolean> {
  const storedValue = sessionStorage.getItem(
    STUDENT_DOCUMENT_COMPLETION_SESSION_STORAGE_KEY,
  );

  if (!storedValue) {
    return INITIAL_DOCUMENT_COMPLETION;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isRecord(parsedValue)) {
      return INITIAL_DOCUMENT_COMPLETION;
    }

    return {
      'alien-registration-card':
        parsedValue['alien-registration-card'] === true,
      'enrollment-certificate': parsedValue['enrollment-certificate'] === true,
      'topik-transcript': parsedValue['topik-transcript'] === true,
      transcript: parsedValue.transcript === true,
    };
  } catch {
    return INITIAL_DOCUMENT_COMPLETION;
  }
}

function getStoredDocumentRegistrationDates(): Partial<
  Record<StudentDocumentFlowId, string>
> {
  const storedValue = sessionStorage.getItem(
    STUDENT_DOCUMENT_REGISTRATION_DATES_SESSION_STORAGE_KEY,
  );

  if (!storedValue) {
    return {};
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isRecord(parsedValue)) {
      return {};
    }

    return {
      'alien-registration-card':
        typeof parsedValue['alien-registration-card'] === 'string'
          ? parsedValue['alien-registration-card']
          : undefined,
      'enrollment-certificate':
        typeof parsedValue['enrollment-certificate'] === 'string'
          ? parsedValue['enrollment-certificate']
          : undefined,
      'topik-transcript':
        typeof parsedValue['topik-transcript'] === 'string'
          ? parsedValue['topik-transcript']
          : undefined,
      transcript:
        typeof parsedValue.transcript === 'string'
          ? parsedValue.transcript
          : undefined,
    };
  } catch {
    return {};
  }
}

type StudentApplicationsRouteContext = {
  applications: StudentApplicationCardModel[];
  acceptOffer: (
    offerId: number,
  ) => Promise<StudentApplicationCardModel[] | null>;
  declineOffer: (
    offerId: number,
  ) => Promise<StudentApplicationCardModel[] | null>;
  isApplicationsLoading: boolean;
  syncApplicationDetail: (application: StudentApplicationCardModel) => void;
  withdrawApplication: (
    application: StudentApplicationCardModel,
  ) => Promise<boolean>;
};

type StudentProfileRouteContext = {
  isProfileLoading: boolean;
  isProfileUnavailable: boolean;
  profileValues: StudentProfileValues;
  saveProfile: (
    view: ProfileDetailView,
    values: readonly string[],
  ) => Promise<boolean>;
};

function isStudentProfileResponse(
  value: unknown,
): value is StudentProfileResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.studentId === 'number' &&
    typeof profile.name === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.phoneNumber === 'string' &&
    typeof profile.birthDate === 'string' &&
    typeof profile.nationality === 'string' &&
    typeof profile.currentRegion === 'string' &&
    typeof profile.koreanLevel === 'string' &&
    (typeof profile.visaCode === 'string' || profile.visaCode === null) &&
    (typeof profile.universityName === 'string' ||
      profile.universityName === null) &&
    (typeof profile.enrollmentStartDate === 'string' ||
      profile.enrollmentStartDate === null) &&
    (typeof profile.studyProgramId === 'number' ||
      profile.studyProgramId === null) &&
    (typeof profile.gradeLevel === 'number' || profile.gradeLevel === null) &&
    (typeof profile.academicState === 'string' ||
      profile.academicState === null) &&
    (typeof profile.topikLevel === 'number' || profile.topikLevel === null) &&
    (typeof profile.stayStartDate === 'string' ||
      profile.stayStartDate === null) &&
    (typeof profile.stayExpirationDate === 'string' ||
      profile.stayExpirationDate === null) &&
    (typeof profile.profileImageUrl === 'string' ||
      profile.profileImageUrl === null) &&
    (typeof profile.hirelinkBadgeIssuedAt === 'string' ||
      profile.hirelinkBadgeIssuedAt === null) &&
    Array.isArray(profile.careers)
  );
}

function isStudentProfileUpdateResponse(
  value: unknown,
): value is StudentProfileUpdateResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const profile = value as Record<string, unknown>;

  return (
    typeof profile.studentId === 'number' &&
    typeof profile.name === 'string' &&
    typeof profile.email === 'string' &&
    typeof profile.phoneNumber === 'string' &&
    typeof profile.birthDate === 'string' &&
    typeof profile.nationality === 'string' &&
    typeof profile.currentRegion === 'string' &&
    typeof profile.koreanLevel === 'string' &&
    (typeof profile.visaCode === 'string' || profile.visaCode === null) &&
    (typeof profile.universityName === 'string' ||
      profile.universityName === null) &&
    (typeof profile.studyProgramId === 'number' ||
      profile.studyProgramId === null) &&
    (typeof profile.gradeLevel === 'number' || profile.gradeLevel === null) &&
    (typeof profile.academicState === 'string' ||
      profile.academicState === null) &&
    (typeof profile.topikLevel === 'number' || profile.topikLevel === null) &&
    (typeof profile.stayExpirationDate === 'string' ||
      profile.stayExpirationDate === null) &&
    (typeof profile.hirelinkBadgeIssuedAt === 'string' ||
      profile.hirelinkBadgeIssuedAt === null)
  );
}

type StudentMatchingRouteContext = {
  isRecommendationsLoading: boolean;
  recommendations: RecommendedJob[];
  refreshRecommendations: () => Promise<boolean>;
  reloadRecommendations: () => Promise<boolean>;
};

type StudentDocumentRouteConfig = {
  documentId: StudentDocumentFlowId;
  initialView: StudentDocumentManagementView;
};

const STUDENT_DOCUMENT_ROUTE_CONFIG: Record<
  StudentDocumentFlowId,
  StudentDocumentRouteConfig
> = {
  'alien-registration-card': {
    documentId: 'alien-registration-card',
    initialView: 'alien-information',
  },
  'enrollment-certificate': {
    documentId: 'enrollment-certificate',
    initialView: 'enrollment-information',
  },
  'topik-transcript': {
    documentId: 'topik-transcript',
    initialView: 'topik-information',
  },
  transcript: {
    documentId: 'transcript',
    initialView: 'transcript-information',
  },
};

type MatchingConditionRouteContext = {
  businessTypeFlexible: boolean;
  isMatchingPreferencesLoading: boolean;
  minimumHourlyWage: number | null;
  otherIndustry: string;
  priorityOrder: MatchingPriorityId[];
  selectedIndustries: IndustryId[];
  startDate: string;
  updatedSummaryIds: Set<MatchingConditionSummaryId>;
  workAvailability: WorkAvailability;
  workLocation: WorkLocation;
  setIndustry: (
    industries: IndustryId[],
    otherIndustry: string,
  ) => Promise<boolean>;
  savePriorityOrder: (priorityOrder?: MatchingPriorityId[]) => Promise<boolean>;
  setStartDate: (date: string) => void;
  setWorkAvailability: (workAvailability: WorkAvailability) => Promise<boolean>;
  setWorkLocation: (workLocation: WorkLocation) => Promise<boolean>;
};

type MatchingConditionSummaryId =
  'industry' | 'location' | 'work-time' | 'start-date';

const INITIAL_WORK_AVAILABILITY: WorkAvailability = {
  daytime: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
  nighttime: {
    mon: [],
    tue: [],
    wed: [],
    thu: [],
    fri: [],
    sat: [],
    sun: [],
  },
};

const INDUSTRY_SUMMARY_LABELS: Record<IndustryId, string> = {
  dutyFree: '면세점',
  foodCafe: '음식점·카페',
  internship: '인턴십',
  majorStudy: '전공·학업',
  officeTourism: '사무·행사·관광',
  other: '기타',
  retail: '매장·판매',
  translation: '통·번역',
};

function formatMatchingConditionIndustries(
  industries: readonly IndustryId[],
  otherIndustry: string,
  isFlexible: boolean,
) {
  if (isFlexible) return '상관없음';
  if (industries.length === 0) return '미입력';

  return industries
    .map((industry) =>
      industry === 'other' && otherIndustry
        ? otherIndustry
        : INDUSTRY_SUMMARY_LABELS[industry],
    )
    .join(', ');
}

function formatMatchingConditionStartDate(date: string) {
  return `${date.replaceAll('-', '.')}부터`;
}

function formatMatchingConditionWorkTime(workAvailability: WorkAvailability) {
  const rangeLabels = formatWorkAvailabilityRanges(workAvailability);

  return rangeLabels.length > 0 ? rangeLabels : ['선택한 근무시간 없음'];
}

function StudentSessionBootstrap() {
  const { pathname } = useLocation();
  const [isSessionReady, setIsSessionReady] = useState(
    () => getAccessToken() !== null,
  );

  useEffect(() => {
    let isActive = true;

    if (getAccessToken()) {
      return () => {
        isActive = false;
      };
    }

    void refreshAccessToken()
      .catch(() => undefined)
      .finally(() => {
        if (isActive) {
          setIsSessionReady(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  if (!isSessionReady && !PUBLIC_STUDENT_ROUTES.has(pathname)) {
    return null;
  }

  return <Outlet />;
}

function StudentSplashRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate('/student/entry', { replace: true });
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return <StudentSplashPage />;
}

function StudentEntryRoute() {
  const navigate = useNavigate();

  return (
    <StudentEntryOnboardingPage
      onEmailLogin={() => navigate('/student/login')}
      onStart={() => navigate('/student/onboarding')}
    />
  );
}

function StudentLoginRoute() {
  const navigate = useNavigate();

  return (
    <StudentEmailLoginPage
      onBack={() => navigate('/student/entry')}
      onLogin={async (request) => {
        const response = await loginStudent(request);
        if (response.role !== 'STUDENT') {
          throw new Error('유학생 계정으로 로그인해 주세요.');
        }

        setAccessToken(response.accessToken);
        navigate('/student/onboarding');
      }}
      onSignup={() => navigate('/student/signup')}
      onSocialLogin={() => navigate('/student/onboarding')}
    />
  );
}

function StudentSignupRoute() {
  const navigate = useNavigate();

  return (
    <StudentEmailSignupPage
      onBack={() => navigate('/student/login')}
      onSignup={async (request) => {
        const { accessToken } = await signupStudent(request);
        setAccessToken(accessToken);
        navigate('/student/onboarding');
      }}
    />
  );
}

function StudentOnboardingRoute() {
  const navigate = useNavigate();

  return (
    <StudentOnboardingPage
      enableCareerApi
      onBack={() => navigate('/student/entry')}
      onComplete={async (requestBody) => {
        try {
          await createStudentProfile(requestBody);
        } catch (error) {
          // An existing student profile must still reflect the values entered again
          // during onboarding instead of leaving the previous profile unchanged.
          if (!axios.isAxiosError(error) || error.response?.status !== 409) {
            throw error;
          }

          await updateStudentProfile({ name: requestBody.name });

          const updatedProfile = await getStudentProfile();
          if (updatedProfile.name !== requestBody.name) {
            throw new Error('Student profile name was not updated.', {
              cause: error,
            });
          }
        }
        navigate('/student/home', { replace: true });
      }}
    />
  );
}

function StudentHomeRoute() {
  const navigate = useNavigate();
  const [homeSummary, setHomeSummary] = useState(EMPTY_STUDENT_HOME_SUMMARY);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      getStudentProfile(),
      getStudentMatchingPreferences(),
      getStudentRecommendations(),
      getMyStudentApplications(),
    ])
      .then(([profile, matchingPreferences, recommendations, applications]) => {
        if (!isActive) return;

        setHomeSummary(
          mapStudentHomeSummary({
            applications: applications.applications,
            matchingPreferences,
            profile,
            recommendations,
          }),
        );
      })
      .catch(() => {
        // Keep the neutral home summary when one of the home APIs fails.
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleTabChange = (tab: StudentNavigationTab) => {
    navigate(STUDENT_TAB_ROUTES[tab]);
  };

  return (
    <StudentHomePage
      homeSummary={homeSummary}
      onEditMatchingCondition={() => navigate('/student/my/matching-condition')}
      onMatchingClick={() => navigate('/student/matching')}
      onTabChange={handleTabChange}
      onViewApplications={() => navigate('/student/applications')}
    />
  );
}

function StudentMatchingLayout() {
  const [recommendations, setRecommendations] = useState<RecommendedJob[]>([]);
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);
  const initialRecommendationRequestRef = useRef<Promise<unknown> | null>(null);

  const loadRecommendations = useCallback(async () => {
    let response = await getStudentRecommendations();

    if (response.refreshRequired) {
      await refreshStudentRecommendations();
      response = await getStudentRecommendations();
    }

    setRecommendations(
      response.recommendations.map(mapStudentRecommendationToRecommendedJob),
    );
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadInitialRecommendations = async () => {
      try {
        await loadRecommendations();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          initialRecommendationRequestRef.current ??=
            createStudentRecommendations();
          await initialRecommendationRequestRef.current;

          if (isActive) {
            await loadRecommendations();
          }

          return;
        }

        if (isActive) {
          setRecommendations([]);
        }
      } finally {
        if (isActive) {
          setIsRecommendationsLoading(false);
        }
      }
    };

    void loadInitialRecommendations();

    return () => {
      isActive = false;
    };
  }, [loadRecommendations]);

  const refreshRecommendations = async () => {
    try {
      await refreshStudentRecommendations();
      await loadRecommendations();
      return true;
    } catch {
      return false;
    }
  };

  const reloadRecommendations = async () => {
    try {
      await loadRecommendations();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Outlet
      context={
        {
          isRecommendationsLoading,
          recommendations,
          refreshRecommendations,
          reloadRecommendations,
        } satisfies StudentMatchingRouteContext
      }
    />
  );
}

function StudentMatchingRoute() {
  const navigate = useNavigate();
  const {
    isRecommendationsLoading,
    recommendations,
    refreshRecommendations,
    reloadRecommendations,
  } = useOutletContext<StudentMatchingRouteContext>();

  return (
    <StudentMatchingPage
      isRecommendationsLoading={isRecommendationsLoading}
      onApplicationSubmit={async (job, desiredStartDate) => {
        if (job.recommendationId === undefined) {
          return 'recommendation-conflict';
        }

        const latestRecommendation = recommendations.find(
          (recommendation) =>
            recommendation.recommendationId === job.recommendationId,
        );
        const latestRecommendationId = latestRecommendation?.recommendationId;
        if (latestRecommendationId === undefined) {
          await reloadRecommendations();
          navigate('/student/matching');
          return 'recommendation-conflict';
        }

        try {
          return await createStudentApplication({
            desiredStartDate,
            recommendationId: latestRecommendationId,
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            await reloadRecommendations();
            navigate('/student/matching');
            return 'recommendation-conflict';
          }

          window.alert('지원에 실패했어요. 잠시 후 다시 시도해주세요.');
          return null;
        }
      }}
      onBack={() => navigate('/student/home')}
      onRecommendationDetailRequest={async (job) => {
        if (job.recommendationId === undefined) return null;

        try {
          const recommendation = mapStudentRecommendationToRecommendedJob(
            await getStudentRecommendation(job.recommendationId),
          );

          if (recommendation.jobPostingId === undefined) return null;

          const response = await getStudentJobPosting(
            recommendation.jobPostingId,
          );

          if (response.status !== 'RECRUITING') return null;

          return mapStudentJobPostingToRecommendedJob(recommendation, response);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 409) {
            await refreshRecommendations();
            navigate('/student/matching');
          }

          return null;
        }
      }}
      onRecommendationRefresh={refreshRecommendations}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
      recommendations={recommendations}
    />
  );
}

function StudentApplicationsLayout() {
  const [applications, setApplications] = useState<
    StudentApplicationCardModel[]
  >([]);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    const [applicationsResponse, matchesResponse] = await Promise.all([
      getMyStudentApplications(),
      getMyEmploymentMatches(),
    ]);
    const nonHiredApplications = applicationsResponse.applications
      .map(mapStudentApplicationToCardModel)
      .filter((application) => application.status !== 'HIRED');

    return [
      ...nonHiredApplications,
      ...matchesResponse.matches.map(mapStudentEmploymentMatchToCardModel),
    ];
  }, []);

  const refreshApplications = useCallback(async () => {
    const nextApplications = await fetchApplications();
    setApplications(nextApplications);
    return nextApplications;
  }, [fetchApplications]);

  useEffect(() => {
    let isActive = true;

    void fetchApplications()
      .then((nextApplications) => {
        if (isActive) {
          setApplications(nextApplications);
          setIsApplicationsLoading(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setApplications([]);
          setIsApplicationsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [fetchApplications]);

  const withdrawApplication = async (
    application: StudentApplicationCardModel,
  ) => {
    if (
      application.applicationId === undefined ||
      application.apiStatus !== 'WAITING_RESPONSE'
    ) {
      return false;
    }

    try {
      await withdrawStudentApplication(application.applicationId);
      await refreshApplications();
      return true;
    } catch {
      return false;
    }
  };

  const acceptOffer = async (offerId: number) => {
    try {
      await acceptStudentEmploymentOffer(offerId);
      return await refreshApplications();
    } catch {
      return null;
    }
  };

  const declineOffer = async (offerId: number) => {
    try {
      await rejectStudentEmploymentOffer(offerId);
      return await refreshApplications();
    } catch {
      return null;
    }
  };

  const syncApplicationDetail = useCallback(
    (applicationDetail: StudentApplicationCardModel) => {
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationDetail.id
            ? applicationDetail
            : application,
        ),
      );
    },
    [],
  );

  return (
    <Outlet
      context={{
        acceptOffer,
        applications,
        declineOffer,
        isApplicationsLoading,
        syncApplicationDetail,
        withdrawApplication,
      }}
    />
  );
}

function StudentApplicationsRoute() {
  const navigate = useNavigate();
  const { acceptOffer, applications, declineOffer, isApplicationsLoading } =
    useOutletContext<StudentApplicationsRouteContext>();

  return (
    <StudentApplicationsPage
      applications={applications}
      isApplicationsLoading={isApplicationsLoading}
      onAcceptOffer={async (application) => {
        if (application.offerId === null || application.offerId === undefined) {
          return false;
        }

        return (await acceptOffer(application.offerId)) !== null;
      }}
      onBack={() => navigate('/student/home')}
      onDeclineOffer={async (application) => {
        if (application.offerId === null || application.offerId === undefined) {
          return false;
        }

        return (await declineOffer(application.offerId)) !== null;
      }}
      onDetailClick={(application) => {
        if (application.status === 'HIRED') {
          if (
            application.matchId !== null &&
            application.matchId !== undefined
          ) {
            navigate(`hiring-complete/${application.matchId}`);
          }
          return;
        }

        navigate(application.id);
      }}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
    />
  );
}

function StudentApplicationDetailRoute() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const {
    acceptOffer,
    declineOffer,
    syncApplicationDetail,
    withdrawApplication,
  } = useOutletContext<StudentApplicationsRouteContext>();
  const [application, setApplication] =
    useState<StudentApplicationCardModel | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [isOfferActionPending, setIsOfferActionPending] = useState(false);
  const [isWithdrawalPending, setIsWithdrawalPending] = useState(false);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(Date.now());
    };

    updateCurrentTime();
    const intervalId = window.setInterval(updateCurrentTime, 1_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (!applicationId) return;

    let isActive = true;

    void getMyStudentApplication(applicationId)
      .then((response) => {
        if (!isActive) return;

        const mappedApplication =
          mapStudentApplicationDetailToCardModel(response);
        setApplication(mappedApplication);
        syncApplicationDetail(mappedApplication);
      })
      .catch(() => {
        if (isActive) setApplication(null);
      })
      .finally(() => {
        if (isActive) {
          setIsDetailLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [applicationId, syncApplicationDetail]);

  if (!application && isDetailLoading) {
    return (
      <main className="mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5]" />
    );
  }

  if (!application) {
    return <Navigate replace to="/student/applications" />;
  }

  const responseDeadline = application.studentResponseDeadline;
  const canRespondToOffer =
    application.apiStatus === 'OFFERED' &&
    application.offerStatus === 'PENDING' &&
    application.offerId !== null &&
    application.offerId !== undefined &&
    responseDeadline !== null &&
    responseDeadline !== undefined &&
    currentTime !== null &&
    new Date(responseDeadline).getTime() > currentTime;

  const handleOfferAction = async (action: 'accept' | 'decline') => {
    if (
      !canRespondToOffer ||
      isOfferActionPending ||
      responseDeadline === null ||
      responseDeadline === undefined ||
      new Date(responseDeadline).getTime() <= Date.now()
    ) {
      return;
    }

    const offerId = application.offerId;
    if (offerId === null || offerId === undefined) return;

    setIsOfferActionPending(true);

    try {
      const nextApplications =
        action === 'accept'
          ? await acceptOffer(offerId)
          : await declineOffer(offerId);

      if (nextApplications === null) return;

      const updatedApplication = nextApplications.find(
        (candidate) => candidate.id === application.id,
      );

      if (updatedApplication) {
        setApplication(updatedApplication);
        syncApplicationDetail(updatedApplication);
      }

      navigate('/student/applications');
    } finally {
      setIsOfferActionPending(false);
    }
  };

  const canWithdraw =
    application.apiStatus === 'WAITING_RESPONSE' &&
    application.applicationId !== undefined;

  const handleWithdraw = async () => {
    if (!canWithdraw || isWithdrawalPending) return;

    setIsWithdrawalPending(true);

    try {
      const didWithdraw = await withdrawApplication(application);

      if (didWithdraw) {
        navigate('/student/applications');
      }
    } finally {
      setIsWithdrawalPending(false);
    }
  };

  return (
    <StudentApplicationDetailPage
      application={application}
      isOfferActionPending={isOfferActionPending}
      onAcceptOffer={() => void handleOfferAction('accept')}
      onBack={() => navigate('/student/applications')}
      onDeclineOffer={() => void handleOfferAction('decline')}
      onWithdraw={() => void handleWithdraw()}
      showOfferActions={canRespondToOffer}
      showWithdrawAction={canWithdraw}
      isWithdrawalPending={isWithdrawalPending}
    />
  );
}

function StudentHiringCompleteRoute() {
  const navigate = useNavigate();
  const { matchId: matchIdParam } = useParams();
  const { applications, isApplicationsLoading } =
    useOutletContext<StudentApplicationsRouteContext>();
  const matchId = Number(matchIdParam);
  const application = applications.find(
    (candidate) => candidate.matchId === matchId,
  );
  const [loadedMatchId, setLoadedMatchId] = useState<number | null>(null);
  const [loadedMatchContact, setLoadedMatchContact] = useState<{
    contact: StudentEmploymentMatchContact;
    matchId: number;
  } | null>(null);
  const isMatchDetailLoading =
    Number.isFinite(matchId) && loadedMatchId !== matchId;

  useEffect(() => {
    if (!Number.isFinite(matchId)) return;

    let isActive = true;

    void getEmploymentMatch(matchId)
      .then((match) => {
        if (isActive) {
          setLoadedMatchContact({ contact: match.contact, matchId });
        }
      })
      .catch(() => {
        // Keep the confirmed application data when match detail cannot load.
      })
      .finally(() => {
        if (isActive) {
          setLoadedMatchId(matchId);
        }
      });

    return () => {
      isActive = false;
    };
  }, [matchId]);

  if (isApplicationsLoading) {
    return (
      <main className="mx-auto h-[844px] w-full max-w-[390px] bg-[#F5F5F5]" />
    );
  }

  if (!application || application.status !== 'HIRED') {
    return <Navigate replace to="/student/applications" />;
  }

  const matchContact =
    loadedMatchContact !== null && loadedMatchContact.matchId === matchId
      ? loadedMatchContact.contact
      : null;

  return (
    <StudentHiringCompletePage
      contactName={matchContact?.name ?? null}
      contactPhone={matchContact?.phoneNumber ?? null}
      isMatchDetailLoading={isMatchDetailLoading}
      job={application.job}
      onBack={() => navigate('/student/applications')}
      onViewApplications={() => navigate('/student/applications')}
    />
  );
}

function StudentMyRoute() {
  const navigate = useNavigate();

  const handleMenuClick = (menuId: StudentMyMenuId) => {
    const menuRoutes: Record<StudentMyMenuId, string> = {
      'customer-center': '/student/my/customer-center',
      documents: '/student/my/documents',
      'matching-conditions': '/student/my/matching-condition',
      notifications: '/student/my/notifications',
      'personal-info': '/student/my/profile',
      terms: '/student/my/terms',
    };

    navigate(menuRoutes[menuId]);
  };

  return (
    <StudentMyPage
      isBottomNavigationFixed
      onMenuClick={handleMenuClick}
      onProfileEditClick={() => navigate('/student/my/profile')}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
      onWorkConditionClick={() => navigate('/student/my/work-condition')}
    />
  );
}

function StudentDocumentsLayout() {
  const [view, setView] = useState<'guide' | 'registration'>(() =>
    sessionStorage.getItem(STUDENT_DOCUMENT_GUIDE_SESSION_STORAGE_KEY) ===
    'true'
      ? 'registration'
      : 'guide',
  );
  const [documentCompletion, setDocumentCompletion] = useState<
    Record<StudentDocumentFlowId, boolean>
  >(getStoredDocumentCompletion);
  const [documentRegistrationDates, setDocumentRegistrationDates] = useState<
    Partial<Record<StudentDocumentFlowId, string>>
  >(getStoredDocumentRegistrationDates);

  return (
    <Outlet
      context={
        {
          confirmGuide: () => {
            sessionStorage.setItem(
              STUDENT_DOCUMENT_GUIDE_SESSION_STORAGE_KEY,
              'true',
            );
            setView('registration');
          },
          completeDocument: (documentId, registeredAt) => {
            setDocumentCompletion((currentCompletion) => ({
              ...currentCompletion,
              [documentId]: true,
            }));
            setDocumentRegistrationDates((currentDates) => ({
              ...currentDates,
              [documentId]: registeredAt,
            }));
            sessionStorage.setItem(
              STUDENT_DOCUMENT_COMPLETION_SESSION_STORAGE_KEY,
              JSON.stringify({
                ...documentCompletion,
                [documentId]: true,
              }),
            );
            sessionStorage.setItem(
              STUDENT_DOCUMENT_REGISTRATION_DATES_SESSION_STORAGE_KEY,
              JSON.stringify({
                ...documentRegistrationDates,
                [documentId]: registeredAt,
              }),
            );
          },
          documentCompletion,
          documentRegistrationDates,
          registrationView: () => setView('registration'),
          view,
        } satisfies StudentDocumentRouteContext
      }
    />
  );
}

function StudentDocumentsRoute() {
  const navigate = useNavigate();
  const {
    confirmGuide,
    documentCompletion,
    documentRegistrationDates,
    registrationView,
    view,
  } = useOutletContext<StudentDocumentRouteContext>();

  const handleDocumentClick = (document: StudentDocument) => {
    const documentRoutes: Partial<Record<StudentDocument['id'], string>> = {
      'alien-registration-card': 'alien-registration',
      'enrollment-certificate': 'enrollment',
      'topik-transcript': 'topik',
      transcript: 'transcript',
    };
    const documentRoute = documentRoutes[document.id];

    if (documentRoute) {
      registrationView();
      navigate(documentRoute);
    }
  };

  return (
    <StudentDocumentManagementPage
      documentCompletion={documentCompletion}
      documentRegistrationDates={documentRegistrationDates}
      initialView={view}
      onDocumentClick={handleDocumentClick}
      onExit={() => navigate('/student/my')}
      onGuideStart={confirmGuide}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
    />
  );
}

function StudentDocumentFlowRoute({
  documentId,
  initialView,
}: StudentDocumentRouteConfig) {
  const navigate = useNavigate();
  const {
    completeDocument,
    documentCompletion,
    documentRegistrationDates,
    registrationView,
  } = useOutletContext<StudentDocumentRouteContext>();

  const handleExit = () => navigate('/student/my/documents');

  return (
    <StudentDocumentManagementPage
      documentCompletion={documentCompletion}
      documentRegistrationDates={documentRegistrationDates}
      initialView={initialView}
      onDocumentComplete={(_, registeredAt) => {
        completeDocument(documentId, registeredAt);
      }}
      onBadgeConfirm={() => {
        registrationView();
        navigate('/student/my');
      }}
      onDocumentFlowExit={handleExit}
    />
  );
}

function StudentWorkConditionRoute() {
  const navigate = useNavigate();

  return (
    <StudentWorkConditionPage
      onBack={() => navigate('/student/my')}
      onEditBasicInfo={() => navigate('/student/my/profile')}
      onEditEligibleFields={() =>
        navigate('/student/my/matching-condition/industry')
      }
      onEditWorkTime={() =>
        navigate('/student/my/matching-condition/work-time')
      }
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
    />
  );
}

function StudentProfileLayout() {
  const [studentProfile, setStudentProfile] =
    useState<StudentProfileResponse | null>(null);
  const [profileValues, setProfileValues] = useState<StudentProfileValues>({});
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileUnavailable, setIsProfileUnavailable] = useState(false);

  useEffect(() => {
    let isActive = true;

    void getStudentProfile()
      .then((profile) => {
        if (!isStudentProfileResponse(profile)) {
          throw new Error('Invalid student profile response.');
        }

        if (isActive) {
          setStudentProfile(profile);
          setProfileValues(mapStudentProfileResponseToValues(profile));
          setIsProfileUnavailable(false);
        }
      })
      .catch(() => {
        if (isActive) {
          setStudentProfile(null);
          setProfileValues({});
          setIsProfileUnavailable(true);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsProfileLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Outlet
      context={
        {
          isProfileLoading,
          isProfileUnavailable,
          profileValues,
          saveProfile: async (view, values) => {
            if (!studentProfile) return false;

            const mappingResult = mapStudentProfileValuesToUpdateRequest(
              view,
              values,
              studentProfile,
            );

            if (mappingResult.status === 'invalid') return false;
            if (mappingResult.status === 'unchanged') return true;

            try {
              const updatedProfile = await updateStudentProfile(
                mappingResult.requestBody,
              );

              if (!isStudentProfileUpdateResponse(updatedProfile)) return false;

              const mergedProfile = { ...studentProfile, ...updatedProfile };

              setStudentProfile(mergedProfile);
              setProfileValues(
                mapStudentProfileResponseToValues(mergedProfile),
              );

              return true;
            } catch {
              return false;
            }
          },
        } satisfies StudentProfileRouteContext
      }
    />
  );
}

function StudentProfileRoute() {
  const navigate = useNavigate();
  const { isProfileLoading, isProfileUnavailable, profileValues } =
    useOutletContext<StudentProfileRouteContext>();

  return (
    <StudentProfileManagementPage
      onApply={() => navigate('/student/my')}
      onBack={() => navigate('/student/my')}
      onViewChange={(view) => navigate(`/student/my/profile/${view}`)}
      profileValues={profileValues}
      isLoading={isProfileLoading}
      isProfileUnavailable={isProfileUnavailable}
    />
  );
}

function StudentProfileDetailRoute({ view }: { view: ProfileDetailView }) {
  const navigate = useNavigate();
  const { isProfileLoading, isProfileUnavailable, profileValues, saveProfile } =
    useOutletContext<StudentProfileRouteContext>();

  return (
    <StudentProfileManagementPage
      initialView={view}
      onBack={() => navigate('/student/my/profile')}
      onSave={saveProfile}
      profileValues={profileValues}
      isLoading={isProfileLoading}
      isProfileUnavailable={isProfileUnavailable}
    />
  );
}

function StudentMatchingConditionLayout() {
  const [businessTypeFlexible, setBusinessTypeFlexible] = useState(false);
  const [minimumHourlyWage, setMinimumHourlyWage] = useState<number | null>(
    null,
  );
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>(
    [],
  );
  const [otherIndustry, setOtherIndustry] = useState('');
  const [priorityOrder, setPriorityOrder] = useState<MatchingPriorityId[]>([]);
  const [workLocation, setWorkLocation] = useState<WorkLocation>({
    address: '',
    radius: 500,
  });
  const [workAvailability, setWorkAvailability] = useState<WorkAvailability>(
    INITIAL_WORK_AVAILABILITY,
  );
  const [startDate, setStartDate] = useState('2027-03-14');
  const [updatedSummaryIds, setUpdatedSummaryIds] = useState<
    Set<MatchingConditionSummaryId>
  >(new Set());
  const [isMatchingPreferencesLoading, setIsMatchingPreferencesLoading] =
    useState(true);

  const applyMatchingPreferences = (
    preferences: StudentMatchingPreferencesResponse,
  ) => {
    const mappedPreferences =
      mapStudentMatchingPreferencesToUiState(preferences);
    setBusinessTypeFlexible(mappedPreferences.businessTypeFlexible);
    setMinimumHourlyWage(mappedPreferences.minimumHourlyWage);
    setSelectedIndustries(mappedPreferences.selectedIndustries);
    setOtherIndustry(mappedPreferences.otherIndustry);
    setPriorityOrder(mappedPreferences.priorityOrder);
    setWorkAvailability(mappedPreferences.workAvailability);
    setWorkLocation(mappedPreferences.workLocation);
  };

  useEffect(() => {
    let isActive = true;

    void getStudentMatchingPreferences()
      .then((preferences) => {
        if (!isActive) return;

        applyMatchingPreferences(preferences);
        setUpdatedSummaryIds(
          new Set<MatchingConditionSummaryId>([
            'industry',
            'location',
            'work-time',
          ]),
        );
      })
      .catch(() => {
        setBusinessTypeFlexible(false);
        setMinimumHourlyWage(null);
        setSelectedIndustries([]);
        setOtherIndustry('');
        setPriorityOrder([]);
        setWorkAvailability(INITIAL_WORK_AVAILABILITY);
        setWorkLocation({ address: '', radius: 500 });
        setUpdatedSummaryIds(new Set());
      })
      .finally(() => {
        if (isActive) {
          setIsMatchingPreferencesLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const markSummaryUpdated = (summaryId: MatchingConditionSummaryId) => {
    setUpdatedSummaryIds((currentSummaryIds) =>
      new Set(currentSummaryIds).add(summaryId),
    );
  };

  const saveIndustry = async (industries: IndustryId[], industry: string) => {
    const requestBody = mapIndustrySelectionToUpdateRequest(
      industries,
      industry,
      false,
    );

    if (!requestBody) {
      return false;
    }

    try {
      const preferences = await updateStudentMatchingPreferences(requestBody);
      applyMatchingPreferences(preferences);
      markSummaryUpdated('industry');
      return true;
    } catch {
      return false;
    }
  };

  const saveWorkAvailability = async (availability: WorkAvailability) => {
    try {
      const preferences = await updateStudentMatchingPreferences(
        mapWorkAvailabilityToUpdateRequest(availability),
      );
      applyMatchingPreferences(preferences);
      markSummaryUpdated('work-time');
      return true;
    } catch {
      return false;
    }
  };

  const saveWorkLocation = async (location: WorkLocation) => {
    const requestBody = mapWorkLocationToUpdateRequest(location);
    if (!requestBody) {
      return false;
    }

    try {
      const preferences = await updateStudentMatchingPreferences(requestBody);
      applyMatchingPreferences(preferences);
      markSummaryUpdated('location');
      return true;
    } catch {
      return false;
    }
  };

  const savePriorityOrder = async (
    nextPriorityOrder: MatchingPriorityId[] = priorityOrder,
  ) => {
    const requestBody = mapPriorityOrderToUpdateRequest(nextPriorityOrder);

    if (!requestBody) return false;

    try {
      const preferences = await updateStudentMatchingPreferences(requestBody);
      applyMatchingPreferences(preferences);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <Outlet
      context={
        {
          businessTypeFlexible,
          isMatchingPreferencesLoading,
          minimumHourlyWage,
          otherIndustry,
          priorityOrder,
          selectedIndustries,
          savePriorityOrder,
          setIndustry: saveIndustry,
          setStartDate: (date) => {
            setStartDate(date);
            markSummaryUpdated('start-date');
          },
          setWorkAvailability: saveWorkAvailability,
          setWorkLocation: saveWorkLocation,
          startDate,
          updatedSummaryIds,
          workAvailability,
          workLocation,
        } satisfies MatchingConditionRouteContext
      }
    />
  );
}

function StudentMatchingConditionRoute() {
  const navigate = useNavigate();
  const {
    businessTypeFlexible,
    isMatchingPreferencesLoading,
    otherIndustry,
    priorityOrder,
    savePriorityOrder,
    selectedIndustries,
    startDate,
    updatedSummaryIds,
    workAvailability,
    workLocation,
  } = useOutletContext<MatchingConditionRouteContext>();

  return (
    <StudentMatchingConditionManagementPage
      isLoading={isMatchingPreferencesLoading}
      onApply={async () => {
        if (priorityOrder.length !== 4) {
          navigate('/student/my/matching-condition/priority');
          return;
        }

        if (await savePriorityOrder()) {
          navigate('/student/my');
        }
      }}
      onBack={() => navigate('/student/my')}
      onConditionClick={(conditionId) => {
        const detailRoutes: Partial<Record<typeof conditionId, string>> = {
          industry: '/student/my/matching-condition/industry',
          location: '/student/my/matching-condition/location',
          priority: '/student/my/matching-condition/priority',
          'start-date': '/student/my/matching-condition/start-date',
          'work-time': '/student/my/matching-condition/work-time',
        };
        const detailRoute = detailRoutes[conditionId];

        if (detailRoute) {
          navigate(detailRoute);
        }
      }}
      priorityOrder={priorityOrder}
      summaryValues={{
        industry: updatedSummaryIds.has('industry')
          ? formatMatchingConditionIndustries(
              selectedIndustries,
              otherIndustry,
              businessTypeFlexible,
            )
          : undefined,
        location: updatedSummaryIds.has('location')
          ? workLocation.address || '주소 미입력'
          : undefined,
        'start-date': formatMatchingConditionStartDate(startDate),
        'work-time': updatedSummaryIds.has('work-time')
          ? formatMatchingConditionWorkTime(workAvailability)
          : undefined,
      }}
    />
  );
}

function StudentMatchingConditionIndustryRoute() {
  const navigate = useNavigate();
  const { otherIndustry, selectedIndustries, setIndustry } =
    useOutletContext<MatchingConditionRouteContext>();

  const handleExit = () => navigate('/student/my/matching-condition');

  return (
    <StudentMatchingConditionIndustryPage
      initialOtherIndustry={otherIndustry}
      initialSelectedIndustries={selectedIndustries}
      onBack={handleExit}
      onSave={async (industries, industry) => {
        const isSaved = await setIndustry(industries, industry);
        if (isSaved) handleExit();
        return isSaved;
      }}
    />
  );
}

function StudentMatchingConditionLocationRoute() {
  const navigate = useNavigate();
  const { setWorkLocation, workLocation } =
    useOutletContext<MatchingConditionRouteContext>();

  const handleExit = () => navigate('/student/my/matching-condition');

  return (
    <StudentMatchingConditionLocationPage
      initialLocation={workLocation}
      onBack={handleExit}
      onSave={async (location) => {
        const isSaved = await setWorkLocation(location);
        if (isSaved) handleExit();
        return isSaved;
      }}
    />
  );
}

function StudentMatchingConditionWorkTimeRoute() {
  const navigate = useNavigate();
  const { setWorkAvailability, workAvailability } =
    useOutletContext<MatchingConditionRouteContext>();

  const handleExit = () => navigate('/student/my/matching-condition');

  return (
    <StudentMatchingConditionWorkTimePage
      initialWorkAvailability={workAvailability}
      onBack={handleExit}
      onSave={async (availability) => {
        const isSaved = await setWorkAvailability(availability);
        if (isSaved) handleExit();
        return isSaved;
      }}
    />
  );
}

function StudentMatchingConditionStartDateRoute() {
  const navigate = useNavigate();
  const { setStartDate, startDate } =
    useOutletContext<MatchingConditionRouteContext>();

  const handleExit = () => navigate('/student/my/matching-condition');

  return (
    <StudentMatchingConditionStartDatePage
      initialDate={startDate}
      onBack={handleExit}
      onSave={(date) => {
        setStartDate(date);
        handleExit();
      }}
    />
  );
}

function StudentMatchingConditionPriorityRoute() {
  const navigate = useNavigate();
  const { priorityOrder, savePriorityOrder } =
    useOutletContext<MatchingConditionRouteContext>();

  const handleExit = () => navigate('/student/my/matching-condition');

  return (
    <StudentMatchingConditionPriorityPage
      initialPriorityOrder={priorityOrder}
      onBack={handleExit}
      onSave={async (nextPriorityOrder) => {
        const isSaved = await savePriorityOrder(nextPriorityOrder);
        if (isSaved) handleExit();
        return isSaved;
      }}
    />
  );
}

function StudentNotificationsRoute() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<StudentNotificationSettings>({
    'application-result': true,
    'document-expiry': true,
    'document-status': true,
    'employment-permit': true,
    'matching-recommendation': true,
    'saved-job': true,
    'service-news': true,
  });

  const handleSettingsChange = (id: StudentNotificationId) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [id]: !currentSettings[id],
    }));
  };

  return (
    <StudentNotificationSettingsPage
      settings={settings}
      onBack={() => navigate('/student/my')}
      onSettingsChange={handleSettingsChange}
    />
  );
}

function StudentCustomerCenterRoute() {
  const navigate = useNavigate();
  const handleSupportItemClick = () => {
    window.alert('상담 기능은 현재 준비 중입니다.');
  };

  return (
    <StudentCustomerCenterPage
      onBack={() => navigate('/student/my')}
      onSupportItemClick={handleSupportItemClick}
    />
  );
}

function StudentTermsRoute() {
  const navigate = useNavigate();
  const handleTermsItemClick = () => {
    window.alert('약관 상세 기능은 현재 준비 중입니다.');
  };

  return (
    <StudentTermsPrivacyPage
      onBack={() => navigate('/student/my')}
      onTermsItemClick={handleTermsItemClick}
    />
  );
}

function EmployerAuthRoute() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function App() {
  return (
    <EmployerProfileProvider>
      <EmployerWorkplacesProvider>
        <Routes>
          <Route element={<EmployerAuthRoute />}>
            <Route path="/" element={<EmployerLoginPage />} />
            <Route
              path="/employer/login"
              element={<EmployerEmailLoginPage />}
            />
            <Route path="/employer/signup" element={<EmployerSignUpPage />} />
            <Route
              path="/employer/onboarding"
              element={
                <ProtectedRoute requiredRole="EMPLOYER">
                  <EmployerOnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer"
              element={
                <ProtectedRoute requiredRole="EMPLOYER">
                  <EmployerJobsProvider>
                    <EmployerApplicantsProvider>
                      <EmployerLayout />
                    </EmployerApplicantsProvider>
                  </EmployerJobsProvider>
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="jobs" element={<EmployerJobsPage />} />
              <Route path="jobs/new" element={<EmployerJobFormPage />} />
              <Route
                path="jobs/:jobId/edit"
                element={<EmployerJobFormPage />}
              />
              <Route
                path="jobs/:jobId/applicants"
                element={<EmployerApplicantsPage />}
              />
              <Route
                path="applicants"
                element={
                  <Navigate
                    to="/employer/jobs/barista-open/applicants"
                    replace
                  />
                }
              />
              <Route
                path="applicants/:applicationId"
                element={<EmployerApplicantDetailPage />}
              />
              <Route path="hired" element={<EmployerHiredStudentsPage />} />
              <Route
                path="hired/:applicationId"
                element={<EmployerHiredStudentDetailPage />}
              />
              <Route path="mypage" element={<EmployerMyPage />} />
              <Route path="settings" element={<EmployerSettingsPage />} />
              <Route
                path="settings/account"
                element={<EmployerAccountSettingsPage />}
              />
              <Route
                path="notifications"
                element={<EmployerNotificationsPage />}
              />
            </Route>
          </Route>

          <Route element={<StudentSessionBootstrap />}>
            <Route path="/student" element={<StudentSplashRoute />} />
            <Route path="/student/entry" element={<StudentEntryRoute />} />
            <Route path="/student/login" element={<StudentLoginRoute />} />
            <Route path="/student/signup" element={<StudentSignupRoute />} />
            <Route
              path="/student/onboarding"
              element={<StudentOnboardingRoute />}
            />
            <Route path="/student/home" element={<StudentHomeRoute />} />
            <Route path="/student/matching" element={<StudentMatchingLayout />}>
              <Route index element={<StudentMatchingRoute />} />
            </Route>
            <Route
              path="/student/applications"
              element={<StudentApplicationsLayout />}
            >
              <Route index element={<StudentApplicationsRoute />} />
              <Route
                path=":applicationId"
                element={<StudentApplicationDetailRoute />}
              />
              <Route
                path="hiring-complete/:matchId"
                element={<StudentHiringCompleteRoute />}
              />
            </Route>
            <Route path="/student/my" element={<StudentMyRoute />} />
            <Route
              path="/student/my/documents"
              element={<StudentDocumentsLayout />}
            >
              <Route index element={<StudentDocumentsRoute />} />
              <Route
                path="alien-registration"
                element={
                  <StudentDocumentFlowRoute
                    {...STUDENT_DOCUMENT_ROUTE_CONFIG[
                      'alien-registration-card'
                    ]}
                  />
                }
              />
              <Route
                path="enrollment"
                element={
                  <StudentDocumentFlowRoute
                    {...STUDENT_DOCUMENT_ROUTE_CONFIG['enrollment-certificate']}
                  />
                }
              />
              <Route
                path="transcript"
                element={
                  <StudentDocumentFlowRoute
                    {...STUDENT_DOCUMENT_ROUTE_CONFIG.transcript}
                  />
                }
              />
              <Route
                path="topik"
                element={
                  <StudentDocumentFlowRoute
                    {...STUDENT_DOCUMENT_ROUTE_CONFIG['topik-transcript']}
                  />
                }
              />
            </Route>
            <Route
              path="/student/my/work-condition"
              element={<StudentWorkConditionRoute />}
            />
            <Route
              path="/student/my/profile"
              element={<StudentProfileLayout />}
            >
              <Route index element={<StudentProfileRoute />} />
              <Route
                path="basic"
                element={<StudentProfileDetailRoute view="basic" />}
              />
              <Route
                path="residence"
                element={<StudentProfileDetailRoute view="residence" />}
              />
              <Route
                path="academic"
                element={<StudentProfileDetailRoute view="academic" />}
              />
              <Route
                path="language"
                element={<StudentProfileDetailRoute view="language" />}
              />
            </Route>
            <Route
              path="/student/my/matching-condition"
              element={<StudentMatchingConditionLayout />}
            >
              <Route index element={<StudentMatchingConditionRoute />} />
              <Route
                path="industry"
                element={<StudentMatchingConditionIndustryRoute />}
              />
              <Route
                path="location"
                element={<StudentMatchingConditionLocationRoute />}
              />
              <Route
                path="work-time"
                element={<StudentMatchingConditionWorkTimeRoute />}
              />
              <Route
                path="start-date"
                element={<StudentMatchingConditionStartDateRoute />}
              />
              <Route
                path="priority"
                element={<StudentMatchingConditionPriorityRoute />}
              />
            </Route>
            <Route
              path="/student/my/notifications"
              element={<StudentNotificationsRoute />}
            />
            <Route
              path="/student/my/customer-center"
              element={<StudentCustomerCenterRoute />}
            />
            <Route path="/student/my/terms" element={<StudentTermsRoute />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </EmployerWorkplacesProvider>
    </EmployerProfileProvider>
  );
}

export default App;
