import { Navigate, Route, Routes } from "react-router-dom";
import EmployerApplicantsProvider from "./components/employer/EmployerApplicantsProvider";
import EmployerLayout from "./components/employer/EmployerLayout";
import EmployerProfileProvider from "./components/employer/EmployerProfileProvider";
import EmployerAccountSettingsPage from "./pages/employer/EmployerAccountSettingsPage";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerApplicantDetailPage from "./pages/employer/EmployerApplicantDetailPage";
import EmployerApplicantsPage from "./pages/employer/EmployerApplicantsPage";
import EmployerHiredStudentDetailPage from "./pages/employer/EmployerHiredStudentDetailPage";
import EmployerHiredStudentsPage from "./pages/employer/EmployerHiredStudentsPage";
import EmployerJobFormPage from "./pages/employer/EmployerJobFormPage";
import EmployerJobsPage from "./pages/employer/EmployerJobsPage";
import EmployerLoginPage from "./pages/employer/EmployerLoginPage";
import EmployerMyPage from "./pages/employer/EmployerMyPage";
import EmployerNotificationsPage from "./pages/employer/EmployerNotificationsPage";
import EmployerOnboardingPage from "./pages/employer/EmployerOnboardingPage";
import EmployerSettingsPage from "./pages/employer/EmployerSettingsPage";

function App() {
  return (
    <EmployerProfileProvider>
      <Routes>
        <Route path="/" element={<EmployerLoginPage />} />
        <Route
          path="/employer/onboarding"
          element={<EmployerOnboardingPage />}
        />
        <Route
          path="/employer"
          element={
            <EmployerApplicantsProvider>
              <EmployerLayout />
            </EmployerApplicantsProvider>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployerDashboard />} />
          <Route path="jobs" element={<EmployerJobsPage />} />
          <Route path="jobs/new" element={<EmployerJobFormPage />} />
          <Route path="jobs/:jobId/edit" element={<EmployerJobFormPage />} />
          <Route
            path="jobs/:jobId/applicants"
            element={<EmployerApplicantsPage />}
          />
          <Route
            path="applicants"
            element={
              <Navigate to="/employer/jobs/barista-open/applicants" replace />
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
          <Route path="notifications" element={<EmployerNotificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </EmployerProfileProvider>
  );
}

export default App;
