import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentWorkTimePreviewPage from './pages/student/StudentWorkTimePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-work-time-preview-root');

if (!rootElement) {
  throw new Error('Student work time preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentWorkTimePreviewPage />
  </StrictMode>,
);
