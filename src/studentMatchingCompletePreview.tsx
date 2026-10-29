import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingCompletePreviewPage from './pages/student/StudentMatchingCompletePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-complete-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching complete preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingCompletePreviewPage />
  </StrictMode>,
);
