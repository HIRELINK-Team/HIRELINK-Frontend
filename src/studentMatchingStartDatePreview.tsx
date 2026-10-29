import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingStartDatePreviewPage from './pages/student/StudentMatchingStartDatePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-start-date-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching start-date preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingStartDatePreviewPage />
  </StrictMode>,
);
