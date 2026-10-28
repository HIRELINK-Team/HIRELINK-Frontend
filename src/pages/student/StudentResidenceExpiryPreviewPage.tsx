import StudentOnboardingPage from './StudentOnboardingPage';

/** Development-only entry point for reviewing student residence-expiry onboarding. */
export default function StudentResidenceExpiryPreviewPage() {
  return <StudentOnboardingPage initialStep="residenceExpiry" />;
}
