import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingEmptyPreviewPage from './pages/student/StudentMatchingEmptyPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-empty-preview-root',
);

if (!rootElement) {
  throw new Error('Student matching empty preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingEmptyPreviewPage />
  </StrictMode>,
);
