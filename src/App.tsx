import { useEffect, useState } from 'react';
import {
  Outlet,
  Route,
  Routes,
  useNavigate,
  useOutletContext,
} from 'react-router-dom';

import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
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
import StudentProfileManagementPage from './pages/student/StudentProfileManagementPage';
import StudentSplashPage from './pages/student/StudentSplashPage';
import StudentTermsPrivacyPage from './pages/student/StudentTermsPrivacyPage';
import StudentWorkConditionPage from './pages/student/StudentWorkConditionPage';
import StudentMatchingConditionIndustryPage from './pages/student/StudentMatchingConditionIndustryPage';
import StudentMatchingConditionLocationPage from './pages/student/StudentMatchingConditionLocationPage';
import StudentMatchingConditionStartDatePage from './pages/student/StudentMatchingConditionStartDatePage';
import StudentMatchingConditionWorkTimePage from './pages/student/StudentMatchingConditionWorkTimePage';
import type { StudentNavigationTab } from './types/studentHome';
import type { StudentDocument } from './types/studentDocument';
import type { IndustryId } from './types/industry';
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

type ProfileDetailView = 'basic' | 'residence' | 'academic' | 'language';

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
  workAvailability: WorkAvailability;
  workLocation: WorkLocation;
  setIndustry: (industries: IndustryId[], otherIndustry: string) => void;
  setStartDate: (date: string) => void;
  setWorkAvailability: (workAvailability: WorkAvailability) => void;
  setWorkLocation: (workLocation: WorkLocation) => void;
};

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

function StudentHomeRoute() {
  const navigate = useNavigate();

  const handleTabChange = (tab: StudentNavigationTab) => {
    navigate(STUDENT_TAB_ROUTES[tab]);
  };

  return (
    <StudentHomePage
      isBottomNavigationFixed
      onMatchingClick={() => navigate('/student/matching')}
      onTabChange={handleTabChange}
    />
  );
}

function StudentMatchingRoute() {
  const navigate = useNavigate();

  return (
    <StudentMatchingPage
      isBottomNavigationFixed
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
    />
  );
}

function StudentApplicationsRoute() {
  const navigate = useNavigate();

  return (
    <StudentApplicationsPage
      isBottomNavigationFixed
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
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
    sessionStorage.getItem(STUDENT_DOCUMENT_GUIDE_SESSION_STORAGE_KEY) === 'true'
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

function StudentProfileRoute() {
  const navigate = useNavigate();

  return (
    <StudentProfileManagementPage
      onBack={() => navigate('/student/my')}
      onViewChange={(view) => navigate(`/student/my/profile/${view}`)}
    />
  );
}

function StudentProfileDetailRoute({ view }: { view: ProfileDetailView }) {
  const navigate = useNavigate();

  return (
    <StudentProfileManagementPage
      initialView={view}
      onBack={() => navigate('/student/my/profile')}
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

  return (
    <Outlet
      context={
        {
          otherIndustry,
          selectedIndustries,
          setIndustry: (industries, industry) => {
            setSelectedIndustries(industries);
            setOtherIndustry(industry);
          },
          setStartDate,
          setWorkAvailability,
          setWorkLocation,
          startDate,
          workAvailability,
          workLocation,
        } satisfies MatchingConditionRouteContext
      }
    />
  );
}

function StudentMatchingConditionRoute() {
  const navigate = useNavigate();

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
      <Route path="/student/onboarding" element={<StudentOnboardingPage />} />
      <Route path="/student/home" element={<StudentHomeRoute />} />
      <Route path="/student/matching" element={<StudentMatchingRoute />} />
      <Route
        path="/student/applications"
        element={<StudentApplicationsRoute />}
      />
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
      <Route path="/student/my/profile" element={<StudentProfileRoute />} />
      <Route
        path="/student/my/profile/basic"
        element={<StudentProfileDetailRoute view="basic" />}
      />
      <Route
        path="/student/my/profile/residence"
        element={<StudentProfileDetailRoute view="residence" />}
      />
      <Route
        path="/student/my/profile/academic"
        element={<StudentProfileDetailRoute view="academic" />}
      />
      <Route
        path="/student/my/profile/language"
        element={<StudentProfileDetailRoute view="language" />}
      />
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
