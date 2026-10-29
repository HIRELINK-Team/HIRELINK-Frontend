import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import StudentMatchingOfferPreviewPage from './pages/student/StudentMatchingOfferPreviewPage';
import './studentPreview.css';

const rootElement = document.getElementById(
  'student-matching-offer-preview-root',
);

if (!rootElement) {
  throw new Error('Student matching offer preview root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentMatchingOfferPreviewPage />
  </StrictMode>,
);
