import { useState } from 'react';

import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import { STUDENT_RECOMMENDED_JOBS } from '../../mocks/studentMatching';
import type { RecommendedJob } from '../../types/studentMatching';

import StudentApplicationsPage from './StudentApplicationsPage';
import StudentHiringCompletePage from './StudentHiringCompletePage';
import StudentMatchingPage from './StudentMatchingPage';

type MatchingOfferPreviewView =
  'offer' | 'hiring-complete' | 'detail' | 'hired';

/** Development-only entry point for reviewing the matching offer state. */
export default function StudentMatchingOfferPreviewPage() {
  const [view, setView] = useState<MatchingOfferPreviewView>('offer');
  const [acceptedJob, setAcceptedJob] = useState<RecommendedJob | null>(null);

  if (view === 'hiring-complete' && acceptedJob) {
    return (
      <StudentHiringCompletePage
        job={acceptedJob}
        onBack={() => setView('offer')}
        onDetailClick={() => setView('detail')}
        onViewApplications={() => setView('hired')}
      />
    );
  }

  if (view === 'detail' && acceptedJob) {
    return (
      <RecommendedJobDetail
        job={acceptedJob}
        onBack={() => setView('hiring-complete')}
      />
    );
  }

  if (view === 'hired') {
    return (
      <StudentApplicationsPage
        initialScenario="hired"
        onBack={() => setView('hiring-complete')}
      />
    );
  }

  return (
    <StudentMatchingPage
      initialSelectedJob={STUDENT_RECOMMENDED_JOBS[0]}
      initialView="offer"
      onOfferAction={(action, job) => {
        if (action === 'accept') {
          setAcceptedJob(job);
          setView('hiring-complete');
        }
      }}
    />
  );
}
