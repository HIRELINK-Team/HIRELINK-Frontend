import { Navigate, Route, Routes } from "react-router-dom";
import EmployerLayout from "./components/employer/EmployerLayout";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import EmployerJobsPage from "./pages/employer/EmployerJobsPage";

function App() {
  return (
    <Routes>
      <Route path="/employer" element={<EmployerLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployerDashboard />} />
        <Route path="jobs" element={<EmployerJobsPage />} />
        <Route path="jobs/new" />
        <Route path="jobs/:jobId/edit" />
        <Route path="jobs/:jobId/applicants" />
        <Route path="applicants" />
        <Route path="hired" />
        <Route path="mypage" />
      </Route>
      <Route path="*" element={<Navigate to="/employer/dashboard" replace />} />
    </Routes>
  );
}

export default App;
