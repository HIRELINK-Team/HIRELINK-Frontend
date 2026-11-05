import { Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import EmployerApplicantsProvider from './components/employer/EmployerApplicantsProvider';
import EmployerLayout from './components/employer/EmployerLayout';
import EmployerJobsProvider from './components/employer/EmployerJobsProvider';
import EmployerMatchesProvider from './components/employer/EmployerMatchesProvider';
import EmployerProfileProvider from './components/employer/EmployerProfileProvider';
import EmployerWorkplacesProvider from './components/employer/EmployerWorkplacesProvider';
import EmployerAccountSettingsPage from './pages/employer/EmployerAccountSettingsPage';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerApplicantDetailPage from './pages/employer/EmployerApplicantDetailPage';
import EmployerApplicantsPage from './pages/employer/EmployerApplicantsPage';
import EmployerHiredStudentDetailPage from './pages/employer/EmployerHiredStudentDetailPage';
import EmployerHiredStudentsPage from './pages/employer/EmployerHiredStudentsPage';
import EmployerJobFormPage from './pages/employer/EmployerJobFormPage';
import EmployerJobsPage from './pages/employer/EmployerJobsPage';
import EmployerEmailLoginPage from './pages/employer/EmployerEmailLoginPage';
import EmployerLoginPage from './pages/employer/EmployerLoginPage';
import EmployerMyPage from './pages/employer/EmployerMyPage';
import EmployerNotificationsPage from './pages/employer/EmployerNotificationsPage';
import EmployerOnboardingPage from './pages/employer/EmployerOnboardingPage';
import EmployerSettingsPage from './pages/employer/EmployerSettingsPage';
import EmployerSignUpPage from './pages/employer/EmployerSignUpPage';

function App() {
  return (
    <AuthProvider>
      <EmployerProfileProvider>
        <EmployerWorkplacesProvider>
          <Routes>
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
                      <EmployerMatchesProvider>
                        <EmployerLayout />
                      </EmployerMatchesProvider>
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
              <Route path="applicants" element={<EmployerApplicantsPage />} />
              <Route
                path="applicants/:applicationId"
                element={<EmployerApplicantDetailPage />}
              />
              <Route path="hired" element={<EmployerHiredStudentsPage />} />
              <Route
                path="hired/:matchId"
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </EmployerWorkplacesProvider>
      </EmployerProfileProvider>
    </AuthProvider>
  );
}

export default App;
