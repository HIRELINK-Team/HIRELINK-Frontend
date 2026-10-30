import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMyPreviewPage from './pages/student/StudentMyPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById('student-my-preview-root');

if (!rootElement) {
  throw new Error('Student My preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMyPreviewPage />
  </StrictMode>,
);
