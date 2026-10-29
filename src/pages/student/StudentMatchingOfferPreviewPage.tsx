import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the matching offer state. */
export default function StudentMatchingOfferPreviewPage() {
  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="offer"
    />
  );
}
