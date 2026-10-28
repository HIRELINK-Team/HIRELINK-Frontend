import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentTopikPreviewPage from './pages/student/StudentTopikPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-topik-preview-root');

if (!rootElement) {
  throw new Error('Student TOPIK preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentTopikPreviewPage />
  </StrictMode>,
);
