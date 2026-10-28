import StudentOnboardingPage from './StudentOnboardingPage';

/** Development-only entry point for reviewing student work-time onboarding. */
export default function StudentWorkTimePreviewPage() {
  return <StudentOnboardingPage initialStep="workTimeSelection" />;
}
