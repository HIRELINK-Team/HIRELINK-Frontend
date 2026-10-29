import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingConfirmationPreviewPage from './pages/student/StudentMatchingConfirmationPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-confirmation-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching confirmation preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingConfirmationPreviewPage />
  </StrictMode>,
);
