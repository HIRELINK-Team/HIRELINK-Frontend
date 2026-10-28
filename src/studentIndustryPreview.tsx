import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentIndustryPreviewPage from './pages/student/StudentIndustryPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-industry-preview-root');

if (!rootElement) {
  throw new Error('Student industry preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentIndustryPreviewPage />
  </StrictMode>,
);
