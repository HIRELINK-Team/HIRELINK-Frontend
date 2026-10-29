import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';

import StudentMatchingPage from './StudentMatchingPage';

/** Development-only entry point for reviewing the work-start date step. */
export default function StudentMatchingStartDatePreviewPage() {
  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="startDate"
    />
  );
}
