import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentExperiencePreviewPage from './pages/student/StudentExperiencePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-experience-preview-root');

if (!rootElement) {
  throw new Error('Student experience preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentExperiencePreviewPage />
  </StrictMode>,
);
