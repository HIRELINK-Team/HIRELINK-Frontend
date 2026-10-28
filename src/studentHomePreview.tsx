import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentHomePreviewPage from './pages/student/StudentHomePreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-home-preview-root');

if (!rootElement) {
  throw new Error('Student home preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentHomePreviewPage />
  </StrictMode>,
);
