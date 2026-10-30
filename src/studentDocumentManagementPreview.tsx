import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentDocumentManagementPreviewPage from './pages/student/StudentDocumentManagementPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-document-management-preview-root',
);

if (!rootElement) {
  throw new Error(
    'Student document management preview root element was not found.',
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentDocumentManagementPreviewPage />
  </StrictMode>,
);
