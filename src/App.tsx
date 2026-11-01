import { useEffect, useState } from 'react';
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';

import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
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
import { STUDENT_APPLICATIONS_MOCK } from './mocks/studentApplications';
import StudentMatchingConditionIndustryPage from './pages/student/StudentMatchingConditionIndustryPage';
import StudentMatchingConditionLocationPage from './pages/student/StudentMatchingConditionLocationPage';
import StudentMatchingConditionStartDatePage from './pages/student/StudentMatchingConditionStartDatePage';
import StudentMatchingConditionWorkTimePage from './pages/student/StudentMatchingConditionWorkTimePage';
import type { StudentNavigationTab } from './types/studentHome';
import type { StudentApplication } from './types/studentApplication';
import type { StudentDocument } from './types/studentDocument';
import type { IndustryId } from './types/industry';
import type {
  RecommendedJob,
  StudentMatchingView,
  StudentOfferAction,
} from './types/studentMatching';
import type {
  StudentNotificationId,
  StudentNotificationSettings,
} from './types/studentNotification';
import type { StudentMyMenuId } from './types/studentMy';
import type { WorkAvailability } from './types/workAvailability';
import type { WorkLocation } from './types/workLocation';

const SPLASH_DURATION_MS = 1200;
const STUDENT_DOCUMENT_GUIDE_SESSION_STORAGE_KEY =
  'hirelink.student.documents.guideAcknowledged';

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
  completeDocument: (documentId: StudentDocumentFlowId) => void;
  registrationView: () => void;
  view: 'guide' | 'registration';
};

type StudentApplicationsRouteContext = {
  applications: StudentApplication[];
  acceptOffer: (applicationId: string) => void;
  declineOffer: (applicationId: string) => void;
};

type StudentProfileRouteContext = {
  profileValues: StudentProfileValues;
  saveProfile: (view: ProfileDetailView, values: readonly string[]) => void;
};

type StudentMatchingJobState = 'accepted' | 'applied' | 'declined';

type StudentMatchingRouteContext = {
  acceptedJob: RecommendedJob | null;
  recordViewChange: (
    view: Exclude<StudentMatchingView, 'result'>,
    job: RecommendedJob,
  ) => void;
  updateOfferState: (action: StudentOfferAction, job: RecommendedJob) => void;
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
  otherIndustry: string;
  selectedIndustries: IndustryId[];
  startDate: string;
  updatedSummaryIds: Set<MatchingConditionSummaryId>;
  workAvailability: WorkAvailability;
  workLocation: WorkLocation;
  setIndustry: (industries: IndustryId[], otherIndustry: string) => void;
  setStartDate: (date: string) => void;
  setWorkAvailability: (workAvailability: WorkAvailability) => void;
  setWorkLocation: (workLocation: WorkLocation) => void;
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
) {
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
  const modeSummaries = [
    { label: '일반', slots: workAvailability.daytime },
    { label: '야간', slots: workAvailability.nighttime },
  ]
    .map(({ label, slots }) => ({
      label,
      selectedSlotCount: Object.values(slots).reduce(
        (count, daySlots) => count + daySlots.length,
        0,
      ),
    }))
    .filter(({ selectedSlotCount }) => selectedSlotCount > 0)
    .map(
      ({ label, selectedSlotCount }) =>
        `${label} ${selectedSlotCount}개 시간대 선택`,
    );

  return modeSummaries.length > 0 ? modeSummaries : ['선택한 근무시간 없음'];
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
      onLogin={() => navigate('/student/onboarding')}
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
      onSignup={() => navigate('/student/onboarding')}
    />
  );
}

function StudentOnboardingRoute() {
  const navigate = useNavigate();

  return (
    <StudentOnboardingPage
      onComplete={() => navigate('/student/home', { replace: true })}
    />
  );
}

function StudentHomeRoute() {
  const navigate = useNavigate();

  const handleTabChange = (tab: StudentNavigationTab) => {
    navigate(STUDENT_TAB_ROUTES[tab]);
  };

  return (
    <StudentHomePage
      isBottomNavigationFixed
      onEditMatchingCondition={() => navigate('/student/my/matching-condition')}
      onMatchingClick={() => navigate('/student/matching')}
      onTabChange={handleTabChange}
      onViewApplications={() => navigate('/student/applications')}
    />
  );
}

function StudentMatchingLayout() {
  const [acceptedJob, setAcceptedJob] = useState<RecommendedJob | null>(null);
  const [, setJobStates] = useState<Record<string, StudentMatchingJobState>>(
    {},
  );

  const recordViewChange = (
    view: Exclude<StudentMatchingView, 'result'>,
    job: RecommendedJob,
  ) => {
    if (view === 'complete') {
      setJobStates((currentStates) => ({
        ...currentStates,
        [job.id]: 'applied',
      }));
    }
  };

  const updateOfferState = (
    action: StudentOfferAction,
    job: RecommendedJob,
  ) => {
    setJobStates((currentStates) => ({
      ...currentStates,
      [job.id]: action === 'accept' ? 'accepted' : 'declined',
    }));

    if (action === 'accept') {
      setAcceptedJob(job);
    }
  };

  return (
    <Outlet
      context={
        {
          acceptedJob,
          recordViewChange,
          updateOfferState,
        } satisfies StudentMatchingRouteContext
      }
    />
  );
}

function StudentMatchingRoute() {
  const navigate = useNavigate();
  const { recordViewChange, updateOfferState } =
    useOutletContext<StudentMatchingRouteContext>();

  return (
    <StudentMatchingPage
      isBottomNavigationFixed
      onBack={() => navigate('/student/home')}
      onOfferAction={(action, job) => {
        updateOfferState(action, job);

        if (action === 'accept') {
          navigate('hiring-complete');
        }
      }}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
      onViewChange={recordViewChange}
    />
  );
}

function StudentMatchingHiringCompleteRoute() {
  const navigate = useNavigate();
  const { acceptedJob } = useOutletContext<StudentMatchingRouteContext>();

  if (!acceptedJob) {
    return <Navigate replace to="/student/matching" />;
  }

  return (
    <StudentHiringCompletePage
      job={acceptedJob}
      onBack={() => navigate('/student/matching')}
      onViewApplications={() => navigate('/student/applications')}
    />
  );
}

function StudentApplicationsLayout() {
  const [applications, setApplications] = useState<StudentApplication[]>(
    STUDENT_APPLICATIONS_MOCK,
  );

  const acceptOffer = (applicationId: string) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              expiresAt: undefined,
              status: 'HIRED',
              timerLabel: undefined,
            }
          : application,
      ),
    );
  };

  const declineOffer = (applicationId: string) => {
    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? {
              ...application,
              expiresAt: undefined,
              status: 'REJECTED',
              timerLabel: undefined,
            }
          : application,
      ),
    );
  };

  return (
    <Outlet
      context={{
        acceptOffer,
        applications,
        declineOffer,
      }}
    />
  );
}

function StudentApplicationsRoute() {
  const navigate = useNavigate();
  const { acceptOffer, applications, declineOffer } =
    useOutletContext<StudentApplicationsRouteContext>();

  return (
    <StudentApplicationsPage
      applications={applications}
      isBottomNavigationFixed
      onAcceptOffer={(application) => acceptOffer(application.id)}
      onBack={() => navigate('/student/home')}
      onDeclineOffer={(application) => declineOffer(application.id)}
      onDetailClick={(application) => {
        if (application.status === 'HIRED') {
          navigate(`hiring-complete/${application.id}`);
        }
      }}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
    />
  );
}

function StudentHiringCompleteRoute() {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { applications } = useOutletContext<StudentApplicationsRouteContext>();
  const application = applications.find(
    (candidate) => candidate.id === applicationId,
  );

  if (!application || application.status !== 'HIRED') {
    return <Navigate replace to="/student/applications" />;
  }

  return (
    <StudentHiringCompletePage
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
  >({
    'alien-registration-card': true,
    'enrollment-certificate': false,
    'topik-transcript': true,
    transcript: true,
  });

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
          completeDocument: (documentId) => {
            setDocumentCompletion((currentCompletion) => ({
              ...currentCompletion,
              [documentId]: true,
            }));
          },
          documentCompletion,
          registrationView: () => setView('registration'),
          view,
        } satisfies StudentDocumentRouteContext
      }
    />
  );
}

function StudentDocumentsRoute() {
  const navigate = useNavigate();
  const { confirmGuide, documentCompletion, registrationView, view } =
    useOutletContext<StudentDocumentRouteContext>();

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
  const { completeDocument, documentCompletion, registrationView } =
    useOutletContext<StudentDocumentRouteContext>();

  const handleExit = () => navigate('/student/my/documents');

  return (
    <StudentDocumentManagementPage
      documentCompletion={documentCompletion}
      initialView={initialView}
      onDocumentComplete={() => {
        completeDocument(documentId);
        registrationView();
        handleExit();
      }}
      onDocumentFlowExit={handleExit}
    />
  );
}

function StudentWorkConditionRoute() {
  const navigate = useNavigate();

  return <StudentWorkConditionPage onBack={() => navigate('/student/my')} />;
}

function StudentProfileLayout() {
  const [profileValues, setProfileValues] = useState<StudentProfileValues>({});

  return (
    <Outlet
      context={
        {
          profileValues,
          saveProfile: (view, values) => {
            setProfileValues((currentValues) => ({
              ...currentValues,
              [view]: values,
            }));
          },
        } satisfies StudentProfileRouteContext
      }
    />
  );
}

function StudentProfileRoute() {
  const navigate = useNavigate();
  const { profileValues } = useOutletContext<StudentProfileRouteContext>();

  return (
    <StudentProfileManagementPage
      onBack={() => navigate('/student/my')}
      onViewChange={(view) => navigate(`/student/my/profile/${view}`)}
      profileValues={profileValues}
    />
  );
}

function StudentProfileDetailRoute({ view }: { view: ProfileDetailView }) {
  const navigate = useNavigate();
  const { profileValues, saveProfile } =
    useOutletContext<StudentProfileRouteContext>();

  return (
    <StudentProfileManagementPage
      initialView={view}
      onBack={() => navigate('/student/my/profile')}
      onSave={(profileView, values) => {
        saveProfile(profileView, values);
      }}
      profileValues={profileValues}
    />
  );
}

function StudentMatchingConditionLayout() {
  const [selectedIndustries, setSelectedIndustries] = useState<IndustryId[]>([
    'foodCafe',
  ]);
  const [otherIndustry, setOtherIndustry] = useState('');
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

  const markSummaryUpdated = (summaryId: MatchingConditionSummaryId) => {
    setUpdatedSummaryIds((currentSummaryIds) =>
      new Set(currentSummaryIds).add(summaryId),
    );
  };

  return (
    <Outlet
      context={
        {
          otherIndustry,
          selectedIndustries,
          setIndustry: (industries, industry) => {
            setSelectedIndustries(industries);
            setOtherIndustry(industry);
            markSummaryUpdated('industry');
          },
          setStartDate: (date) => {
            setStartDate(date);
            markSummaryUpdated('start-date');
          },
          setWorkAvailability: (availability) => {
            setWorkAvailability(availability);
            markSummaryUpdated('work-time');
          },
          setWorkLocation: (location) => {
            setWorkLocation(location);
            markSummaryUpdated('location');
          },
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
    otherIndustry,
    selectedIndustries,
    startDate,
    updatedSummaryIds,
    workAvailability,
    workLocation,
  } = useOutletContext<MatchingConditionRouteContext>();

  return (
    <StudentMatchingConditionManagementPage
      onBack={() => navigate('/student/my')}
      onConditionClick={(conditionId) => {
        const detailRoutes: Record<string, string> = {
          industry: 'industry',
          location: 'location',
          'start-date': 'start-date',
          'work-time': 'work-time',
        };
        const detailRoute = detailRoutes[conditionId];

        if (detailRoute) {
          navigate(detailRoute);
        }
      }}
      summaryValues={{
        industry: updatedSummaryIds.has('industry')
          ? formatMatchingConditionIndustries(selectedIndustries, otherIndustry)
          : undefined,
        location: updatedSummaryIds.has('location')
          ? workLocation.address || '주소 미입력'
          : undefined,
        'start-date': updatedSummaryIds.has('start-date')
          ? formatMatchingConditionStartDate(startDate)
          : undefined,
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
      onSave={(industries, industry) => {
        setIndustry(industries, industry);
        handleExit();
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
      onSave={(location) => {
        setWorkLocation(location);
        handleExit();
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
      onSave={(availability) => {
        setWorkAvailability(availability);
        handleExit();
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

  return <StudentCustomerCenterPage onBack={() => navigate('/student/my')} />;
}

function StudentTermsRoute() {
  const navigate = useNavigate();

  return <StudentTermsPrivacyPage onBack={() => navigate('/student/my')} />;
}

function App() {
  return (
    <Routes>
      <Route path="/employer/dashboard" element={<div>사업주 대시보드</div>} />

      <Route path="/student" element={<StudentSplashRoute />} />
      <Route path="/student/entry" element={<StudentEntryRoute />} />
      <Route path="/student/login" element={<StudentLoginRoute />} />
      <Route path="/student/signup" element={<StudentSignupRoute />} />
      <Route path="/student/onboarding" element={<StudentOnboardingRoute />} />
      <Route path="/student/home" element={<StudentHomeRoute />} />
      <Route path="/student/matching" element={<StudentMatchingLayout />}>
        <Route index element={<StudentMatchingRoute />} />
        <Route
          path="hiring-complete"
          element={<StudentMatchingHiringCompleteRoute />}
        />
      </Route>
      <Route
        path="/student/applications"
        element={<StudentApplicationsLayout />}
      >
        <Route index element={<StudentApplicationsRoute />} />
        <Route
          path="hiring-complete/:applicationId"
          element={<StudentHiringCompleteRoute />}
        />
      </Route>
      <Route path="/student/my" element={<StudentMyRoute />} />
      <Route path="/student/my/documents" element={<StudentDocumentsLayout />}>
        <Route index element={<StudentDocumentsRoute />} />
        <Route
          path="alien-registration"
          element={
            <StudentDocumentFlowRoute
              {...STUDENT_DOCUMENT_ROUTE_CONFIG['alien-registration-card']}
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
      <Route path="/student/my/profile" element={<StudentProfileLayout />}>
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
    </Routes>
  );
}

export default App;
