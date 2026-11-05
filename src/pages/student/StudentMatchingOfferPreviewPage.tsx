import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the matching result layout. */
export default function StudentMatchingOfferPreviewPage() {
  return <StudentMatchingPage recommendations={STUDENT_RECOMMENDED_JOBS} />;
}
