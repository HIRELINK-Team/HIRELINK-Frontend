import StudentApplicationsPage from './StudentApplicationsPage';
import type { StudentApplicationsScenario } from '../../types/studentApplication';

type StudentApplicationsPreviewPageProps = {
  initialScenario?: StudentApplicationsScenario;
};

/** Development-only preview wrapper for every student applications state. */
export default function StudentApplicationsPreviewPage({
  initialScenario,
}: StudentApplicationsPreviewPageProps) {
  return <StudentApplicationsPage initialScenario={initialScenario} />;
}
