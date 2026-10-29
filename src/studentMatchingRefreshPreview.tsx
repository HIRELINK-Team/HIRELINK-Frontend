import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingRefreshPreviewPage from './pages/student/StudentMatchingRefreshPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-refresh-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching refresh preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingRefreshPreviewPage />
  </StrictMode>,
);
