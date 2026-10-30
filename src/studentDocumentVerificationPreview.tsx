import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import StudentDocumentVerificationPreviewPage from './pages/student/StudentDocumentVerificationPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-document-verification-preview-root',
);
if (!rootElement)
  throw new Error('Student document verification preview root was not found.');
createRoot(rootElement).render(
  <StrictMode>
    <StudentDocumentVerificationPreviewPage />
  </StrictMode>,
);
