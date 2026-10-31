import { useEffect, useState } from 'react';

import StudentEntryOnboardingPage from './StudentEntryOnboardingPage';
import StudentOnboardingPage from './StudentOnboardingPage';
import StudentSplashPage from './StudentSplashPage';

type EntryPreviewStep = 'splash' | 'entry';

const SPLASH_DURATION_MS = 1200;

/** Development-only bridge for reviewing entry onboarding before routing is added. */
export default function StudentEntryPreviewPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState<EntryPreviewStep>('splash');

  useEffect(() => {
    if (step !== 'splash') return undefined;

    const timeoutId = window.setTimeout(() => {
      setStep('entry');
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [step]);

  if (hasStarted) {
    return <StudentOnboardingPage />;
  }

  if (step === 'splash') {
    return <StudentSplashPage />;
  }

  return <StudentEntryOnboardingPage onStart={() => setHasStarted(true)} />;
}
