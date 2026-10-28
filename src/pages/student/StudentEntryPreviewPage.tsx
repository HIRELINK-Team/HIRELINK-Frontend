import { useState } from 'react';

import StudentEntryOnboardingPage from './StudentEntryOnboardingPage';
import StudentOnboardingPage from './StudentOnboardingPage';

/** Development-only bridge for reviewing entry onboarding before routing is added. */
export default function StudentEntryPreviewPage() {
  const [hasStarted, setHasStarted] = useState(false);

  if (hasStarted) {
    return <StudentOnboardingPage />;
  }

  return <StudentEntryOnboardingPage onStart={() => setHasStarted(true)} />;
}
