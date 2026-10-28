import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentResidenceExpiryPreviewPage from './pages/student/StudentResidenceExpiryPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-residence-expiry-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student residence expiry preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentResidenceExpiryPreviewPage />
  </StrictMode>,
);
