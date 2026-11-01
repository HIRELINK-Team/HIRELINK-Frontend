import { Navigate, Route, Routes } from "react-router-dom";
import EmployerApplicantsProvider from "./components/employer/EmployerApplicantsProvider";
import EmployerLayout from "./components/employer/EmployerLayout";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerApplicantDetailPage from "./pages/employer/EmployerApplicantDetailPage";
import EmployerApplicantsPage from "./pages/employer/EmployerApplicantsPage";
import EmployerHiredStudentDetailPage from "./pages/employer/EmployerHiredStudentDetailPage";
import EmployerHiredStudentsPage from "./pages/employer/EmployerHiredStudentsPage";
import EmployerJobFormPage from "./pages/employer/EmployerJobFormPage";
import EmployerJobsPage from "./pages/employer/EmployerJobsPage";
import EmployerMyPage from "./pages/employer/EmployerMyPage";

function App() {
  return (
    <Routes>
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
      </Route>
      <Route path="*" element={<Navigate to="/employer/dashboard" replace />} />
    </Routes>
  );
}

export default App;
