import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import StudentOnboardingPage from './pages/student/StudentOnboardingPage'
import './student-preview.css'

const rootElement = document.getElementById('student-preview-root')

if (!rootElement) {
  throw new Error('Student preview root element was not found.')
}

createRoot(rootElement).render(
  <StrictMode>
    <StudentOnboardingPage />
  </StrictMode>,
)
