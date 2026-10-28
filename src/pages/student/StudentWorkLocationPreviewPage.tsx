import StudentOnboardingPage from './StudentOnboardingPage';

/** Development-only entry point for reviewing student work-location onboarding. */
export default function StudentWorkLocationPreviewPage() {
  return <StudentOnboardingPage initialStep="workLocationSelection" />;
}
