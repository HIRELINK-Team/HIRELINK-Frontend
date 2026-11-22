import { useState } from 'react';

import StudentEntryOnboardingPage from './StudentEntryOnboardingPage';
import StudentEmailLoginPage from './StudentEmailLoginPage';
import StudentEmailSignupPage from './StudentEmailSignupPage';
import StudentOnboardingPage from './StudentOnboardingPage';

type EntryPreviewStep = 'entry' | 'email-login' | 'email-signup';

/** Development-only bridge for reviewing entry onboarding before routing is added. */
export default function StudentEntryPreviewPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState<EntryPreviewStep>('entry');

  if (hasStarted) {
    return <StudentOnboardingPage />;
  }

  if (step === 'email-login') {
    return (
      <StudentEmailLoginPage
        onBack={() => setStep('entry')}
        onLogin={() => setHasStarted(true)}
        onSignup={() => setStep('email-signup')}
        onSocialLogin={() => setHasStarted(true)}
      />
    );
  }

  if (step === 'email-signup') {
    return (
      <StudentEmailSignupPage
        onBack={() => setStep('email-login')}
        onSignup={() => setHasStarted(true)}
      />
    );
  }

  return (
    <StudentEntryOnboardingPage
      onEmailLogin={() => setStep('email-login')}
      onStart={() => setHasStarted(true)}
    />
  );
}
