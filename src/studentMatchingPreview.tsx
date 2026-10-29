import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingPreviewPage from './pages/student/StudentMatchingPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-matching-preview-root');

if (!rootElement) {
  throw new Error('Student matching preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingPreviewPage />
  </StrictMode>,
);
