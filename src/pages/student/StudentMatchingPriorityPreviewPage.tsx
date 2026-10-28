import StudentOnboardingPage from './StudentOnboardingPage';

/** Development-only entry point for reviewing student matching-priority onboarding. */
export default function StudentMatchingPriorityPreviewPage() {
  return <StudentOnboardingPage initialStep="matchingPriority" />;
}
