import { useState } from 'react';

import { RecommendedJobDetail } from '../../components/student/matching/RecommendedJobDetail';
import type { StudentApplicationCardModel } from '../../types/studentApplication';
import StudentApplicationsPage from './StudentApplicationsPage';
import StudentHiringCompletePage from './StudentHiringCompletePage';
import type { StudentApplicationsScenario } from '../../types/studentApplication';

type StudentApplicationsPreviewPageProps = {
  initialScenario?: StudentApplicationsScenario;
};

type ApplicationsPreviewView = 'applications' | 'hiring-complete' | 'detail';

/** Development-only preview wrapper for every student applications state. */
export default function StudentApplicationsPreviewPage({
  initialScenario = 'all',
}: StudentApplicationsPreviewPageProps) {
  const [scenario, setScenario] =
    useState<StudentApplicationsScenario>(initialScenario);
  const [view, setView] = useState<ApplicationsPreviewView>('applications');
  const [acceptedApplication, setAcceptedApplication] =
    useState<StudentApplicationCardModel | null>(null);

  if (view === 'hiring-complete' && acceptedApplication) {
    return (
      <StudentHiringCompletePage
        job={acceptedApplication.job}
        onBack={() => setView('applications')}
        onDetailClick={() => setView('detail')}
        onViewApplications={() => {
          setScenario('hired');
          setView('applications');
        }}
      />
    );
  }

  if (view === 'detail' && acceptedApplication) {
    return (
      <RecommendedJobDetail
        job={acceptedApplication.job}
        onBack={() => setView('hiring-complete')}
      />
    );
  }

  return (
    <StudentApplicationsPage
      initialScenario={scenario}
      key={scenario}
      onAcceptOffer={(application) => {
        setAcceptedApplication(application);
        setView('hiring-complete');
      }}
    />
  );
}
