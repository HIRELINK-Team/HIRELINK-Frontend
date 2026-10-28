import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentWorkLocationPreviewPage from './pages/student/StudentWorkLocationPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-work-location-preview-root',
);

if (!rootElement) {
  throw new Error('Student work location preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentWorkLocationPreviewPage />
  </StrictMode>,
);
