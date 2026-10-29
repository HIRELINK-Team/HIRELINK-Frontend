import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingDetailPreviewPage from './pages/student/StudentMatchingDetailPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-detail-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student matching detail preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingDetailPreviewPage />
  </StrictMode>,
);
