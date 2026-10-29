import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the application confirmation step. */
export default function StudentMatchingConfirmationPreviewPage() {
  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="confirm"
    />
  );
}
