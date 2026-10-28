import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentResidencePreviewPage from './pages/student/StudentResidencePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-residence-preview-root');

if (!rootElement) {
  throw new Error('Student residence preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentResidencePreviewPage />
  </StrictMode>,
);
