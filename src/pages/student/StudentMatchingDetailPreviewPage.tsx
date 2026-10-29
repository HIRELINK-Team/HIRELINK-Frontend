import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the recommended-job detail view. */
export default function StudentMatchingDetailPreviewPage() {
  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="detail"
    />
  );
}
