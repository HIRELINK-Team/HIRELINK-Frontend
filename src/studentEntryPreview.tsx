import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentEntryPreviewPage from './pages/student/StudentEntryPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-entry-preview-root');

if (!rootElement) {
  throw new Error('Student entry preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentEntryPreviewPage />
  </StrictMode>,
);
