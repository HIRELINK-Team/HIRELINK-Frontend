import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingPriorityPreviewPage from './pages/student/StudentMatchingPriorityPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-priority-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching priority preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingPriorityPreviewPage />
  </StrictMode>,
);
