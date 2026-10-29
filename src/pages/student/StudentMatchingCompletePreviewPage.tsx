import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the application complete step. */
export default function StudentMatchingCompletePreviewPage() {
  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="complete"
    />
  );
}
