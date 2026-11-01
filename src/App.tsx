import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import StudentApplicationsPage from './pages/student/StudentApplicationsPage';
import StudentEmailLoginPage from './pages/student/StudentEmailLoginPage';
import StudentEmailSignupPage from './pages/student/StudentEmailSignupPage';
import StudentEntryOnboardingPage from './pages/student/StudentEntryOnboardingPage';
import StudentHomePage from './pages/student/StudentHomePage';
import StudentMatchingPage from './pages/student/StudentMatchingPage';
import StudentMyPage from './pages/student/StudentMyPage';
import StudentOnboardingPage from './pages/student/StudentOnboardingPage';
import StudentSplashPage from './pages/student/StudentSplashPage';

const SPLASH_DURATION_MS = 1200;

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

function App() {
  return (
    <Routes>
      <Route path="/employer/dashboard" element={<div>사업주 대시보드</div>} />

      <Route path="/student" element={<StudentSplashRoute />} />
      <Route path="/student/entry" element={<StudentEntryRoute />} />
      <Route path="/student/login" element={<StudentLoginRoute />} />
      <Route path="/student/signup" element={<StudentSignupRoute />} />
      <Route path="/student/onboarding" element={<StudentOnboardingPage />} />
      <Route path="/student/home" element={<StudentHomePage />} />
      <Route path="/student/matching" element={<StudentMatchingPage />} />
      <Route
        path="/student/applications"
        element={<StudentApplicationsPage />}
      />
      <Route path="/student/my" element={<StudentMyPage />} />
    </Routes>
  );
}

export default App;
