import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentApplicationsPreviewPage from './pages/student/StudentApplicationsPreviewPage';
import type { StudentApplicationsScenario } from './types/studentApplication';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-applications-preview-root',
);

if (!rootElement) {
  throw new Error('Student applications preview root element was not found.');
}

const SCENARIOS = new Set<StudentApplicationsScenario>([
  'all',
  'reviewing',
  'offer',
  'hired',
  'empty',
]);
const requestedScenario = new URLSearchParams(window.location.search).get(
  'scenario',
);
const initialScenario = SCENARIOS.has(
  requestedScenario as StudentApplicationsScenario,
)
  ? (requestedScenario as StudentApplicationsScenario)
  : 'all';

createRoot(rootElement).render(
  <StrictMode>
    <StudentApplicationsPreviewPage initialScenario={initialScenario} />
  </StrictMode>,
);
