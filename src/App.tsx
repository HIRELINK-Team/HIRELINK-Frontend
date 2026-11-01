import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentEmailLoginPage from './pages/student/StudentEmailLoginPage';
import StudentEmailSignupPage from './pages/student/StudentEmailSignupPage';
import StudentEntryOnboardingPage from './pages/student/StudentEntryOnboardingPage';
import StudentCustomerCenterPage from './pages/student/StudentCustomerCenterPage';
import StudentDocumentManagementPage from './pages/student/StudentDocumentManagementPage';
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
import type { StudentNavigationTab } from './types/studentHome';
import type {
  StudentNotificationId,
  StudentNotificationSettings,
} from './types/studentNotification';
import type { StudentMyMenuId } from './types/studentMy';

const SPLASH_DURATION_MS = 1200;

const STUDENT_TAB_ROUTES: Record<StudentNavigationTab, string> = {
  applications: '/student/applications',
  home: '/student/home',
  matching: '/student/matching',
  my: '/student/my',
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
      isBottomNavigationFixed
      onMenuClick={handleMenuClick}
      onProfileEditClick={() => navigate('/student/my/profile')}
      onTabChange={(tab) => navigate(STUDENT_TAB_ROUTES[tab])}
      onWorkConditionClick={() => navigate('/student/my/work-condition')}
    />
  );
}

function StudentDocumentsRoute() {
  const navigate = useNavigate();

  return (
    <StudentDocumentManagementPage onExit={() => navigate('/student/my')} />
  );
}

function StudentWorkConditionRoute() {
  const navigate = useNavigate();

  return <StudentWorkConditionPage onBack={() => navigate('/student/my')} />;
}

function StudentProfileRoute() {
  const navigate = useNavigate();

  return (
    <StudentProfileManagementPage onBack={() => navigate('/student/my')} />
  );
}

function StudentMatchingConditionRoute() {
  const navigate = useNavigate();

  return (
    <StudentMatchingConditionManagementPage
      onBack={() => navigate('/student/my')}
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
      <Route path="/student/my/documents" element={<StudentDocumentsRoute />} />
      <Route
        path="/student/my/work-condition"
        element={<StudentWorkConditionRoute />}
      />
      <Route path="/student/my/profile" element={<StudentProfileRoute />} />
      <Route
        path="/student/my/matching-condition"
        element={<StudentMatchingConditionRoute />}
      />
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
