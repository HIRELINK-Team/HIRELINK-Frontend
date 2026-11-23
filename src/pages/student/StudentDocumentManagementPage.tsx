import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import { DocumentBadgeIssued } from '../../components/student/documents/DocumentBadgeIssued';
import { DocumentManagementGuide } from '../../components/student/documents/DocumentManagementGuide';
import { DocumentRegistrationList } from '../../components/student/documents/DocumentRegistrationList';
import { EnrollmentCertificateCamera } from '../../components/student/documents/EnrollmentCertificateCamera';
import { EnrollmentCertificateComplete } from '../../components/student/documents/EnrollmentCertificateComplete';
import { EnrollmentCertificateInformation } from '../../components/student/documents/EnrollmentCertificateInformation';
import { EnrollmentCertificateReview } from '../../components/student/documents/EnrollmentCertificateReview';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { TranscriptCamera } from '../../components/student/documents/TranscriptCamera';
import { TranscriptComplete } from '../../components/student/documents/TranscriptComplete';
import { TranscriptInformation } from '../../components/student/documents/TranscriptInformation';
import { TranscriptReview } from '../../components/student/documents/TranscriptReview';
import { TopikCamera } from '../../components/student/documents/TopikCamera';
import { TopikComplete } from '../../components/student/documents/TopikComplete';
import { TopikInformation } from '../../components/student/documents/TopikInformation';
import { TopikReview } from '../../components/student/documents/TopikReview';
import { AlienRegistrationBackCamera } from '../../components/student/onboarding/AlienRegistrationBackCamera';
import {
  AlienRegistrationBackInfo,
  type AlienRegistrationBackInfoValues,
} from '../../components/student/onboarding/AlienRegistrationBackInfo';
import { AlienRegistrationBackGuide } from '../../components/student/onboarding/AlienRegistrationBackGuide';
import { AlienRegistrationFrontComplete } from '../../components/student/onboarding/AlienRegistrationFrontComplete';
import { AlienRegistrationFrontInfo } from '../../components/student/onboarding/AlienRegistrationFrontInfo';
import type { AlienRegistrationFormValues } from '../../components/student/onboarding/AlienRegistrationEdit';
import {
  STUDENT_ALIEN_REGISTRATION_DETAILS,
  STUDENT_BASIC_DOCUMENTS,
} from '../../mocks/studentDocuments';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentDocument } from '../../types/studentDocument';

export type StudentDocumentManagementView =
  | 'guide'
  | 'registration'
  | 'alien-information'
  | 'alien-camera'
  | 'alien-front-info'
  | 'alien-back-guide'
  | 'alien-back-camera'
  | 'alien-back-info'
  | 'alien-complete'
  | 'enrollment-information'
  | 'enrollment-camera'
  | 'enrollment-review'
  | 'enrollment-complete'
  | 'transcript-information'
  | 'transcript-camera'
  | 'transcript-review'
  | 'transcript-complete'
  | 'topik-information'
  | 'topik-camera'
  | 'topik-review'
  | 'topik-complete'
  | 'badge-issued';

const ALIEN_REGISTRATION_VALUES: AlienRegistrationFormValues = {
  name: STUDENT_ALIEN_REGISTRATION_DETAILS[0]?.value ?? '-',
  nationality: STUDENT_ALIEN_REGISTRATION_DETAILS[1]?.value ?? '-',
  residenceQualification: STUDENT_ALIEN_REGISTRATION_DETAILS[2]?.value ?? '-',
  registrationNumber: STUDENT_ALIEN_REGISTRATION_DETAILS[4]?.value ?? '-',
  issueDate: '-',
  serialNumber: '-',
  expiryDate:
    STUDENT_ALIEN_REGISTRATION_DETAILS[3]?.value.split(' - ')[1] ?? '-',
};

const ALIEN_REGISTRATION_BACK_VALUES: AlienRegistrationBackInfoValues = {
  permissionDate: '-',
  expirationDate: ALIEN_REGISTRATION_VALUES.expiryDate,
  reportDate: '-',
  serialNumber: '-',
};

type StudentDocumentManagementPageProps = {
  documentCompletion?: Partial<Record<StudentDocument['id'], boolean>>;
  documentRegistrationDates?: Partial<Record<StudentDocument['id'], string>>;
  initialView?: StudentDocumentManagementView;
  onDocumentComplete?: (
    documentId: StudentDocument['id'],
    registeredAt: string,
  ) => void;
  onDocumentClick?: (document: StudentDocument) => void;
  onDocumentFlowExit?: () => void;
  onExit?: () => void;
  onGuideStart?: () => void;
  onBadgeConfirm?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentDocumentManagementPage({
  documentCompletion,
  documentRegistrationDates: externalDocumentRegistrationDates,
  initialView = 'guide',
  onDocumentComplete,
  onDocumentClick,
  onDocumentFlowExit,
  onExit,
  onGuideStart,
  onBadgeConfirm,
  onTabChange,
}: StudentDocumentManagementPageProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<StudentDocumentManagementView>(initialView);
  const [isAlienRegistrationComplete, setIsAlienRegistrationComplete] =
    useState(true);
  const [isEnrollmentCertificateComplete, setIsEnrollmentCertificateComplete] =
    useState(false);
  const [isTranscriptComplete, setIsTranscriptComplete] = useState(true);
  const [isTopikComplete, setIsTopikComplete] = useState(true);
  const [documentRegistrationDates, setDocumentRegistrationDates] = useState<
    Partial<Record<StudentDocument['id'], string>>
  >({});

  const handleGuideBack = () => {
    onExit?.();
  };

  const handleGuideStart = () => {
    onGuideStart?.();
    setView('registration');
  };

  const handleRegistrationBack = () => {
    setView('guide');
  };

  const handleDocumentFlowExit = () => {
    if (onDocumentFlowExit) {
      onDocumentFlowExit();
      return;
    }

    setView('registration');
  };

  const handleDocumentComplete = (documentId: StudentDocument['id']) => {
    const now = new Date();
    const registeredAt = t('my.documents.registeredAt', { date: `${String(now.getFullYear()).slice(-2)}.${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}` });

    if (documentId === 'alien-registration-card') {
      setIsAlienRegistrationComplete(true);
    }

    if (documentId === 'enrollment-certificate') {
      setIsEnrollmentCertificateComplete(true);
    }

    if (documentId === 'transcript') {
      setIsTranscriptComplete(true);
    }

    if (documentId === 'topik-transcript') {
      setIsTopikComplete(true);
    }

    setDocumentRegistrationDates((currentDates) => ({
      ...currentDates,
      [documentId]: registeredAt,
    }));
    onDocumentComplete?.(documentId, registeredAt);

    const nextCompletion = {
      'alien-registration-card': isAlienRegistrationRegistered,
      'enrollment-certificate': isEnrollmentCertificateRegistered,
      transcript: isTranscriptRegistered,
      'topik-transcript': isTopikRegistered,
      [documentId]: true,
    };

    if (Object.values(nextCompletion).every(Boolean)) {
      setView('badge-issued');
      return;
    }

    handleDocumentFlowExit();
  };

  const handleDocumentClick = (document: StudentDocument) => {
    if (onDocumentClick) {
      onDocumentClick(document);
      return;
    }

    if (document.id === 'alien-registration-card') {
      setView('alien-information');
      return;
    }

    if (document.id === 'enrollment-certificate') {
      setView('enrollment-information');
      return;
    }

    if (document.id === 'transcript') {
      setView('transcript-information');
      return;
    }

    if (document.id === 'topik-transcript') {
      setView('topik-information');
      return;
    }
  };

  const isAlienRegistrationRegistered =
    documentCompletion?.['alien-registration-card'] ??
    isAlienRegistrationComplete;
  const isEnrollmentCertificateRegistered =
    documentCompletion?.['enrollment-certificate'] ??
    isEnrollmentCertificateComplete;
  const isTranscriptRegistered =
    documentCompletion?.transcript ?? isTranscriptComplete;
  const isTopikRegistered =
    documentCompletion?.['topik-transcript'] ?? isTopikComplete;

  if (view === 'badge-issued') {
    return (
      <DocumentBadgeIssued
        onConfirm={onBadgeConfirm ?? (() => setView('registration'))}
      />
    );
  }

  const basicDocuments = STUDENT_BASIC_DOCUMENTS.map((document) => {
    const registeredAt =
      externalDocumentRegistrationDates?.[document.id] ??
      documentRegistrationDates[document.id] ??
      document.registeredAt;

    if (document.id === 'alien-registration-card') {
      return {
        ...document,
        status: isAlienRegistrationRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isAlienRegistrationRegistered ? registeredAt : undefined,
      };
    }

    if (document.id === 'enrollment-certificate') {
      return {
        ...document,
        status: isEnrollmentCertificateRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isEnrollmentCertificateRegistered
          ? registeredAt
          : undefined,
      };
    }

    if (document.id === 'transcript') {
      return {
        ...document,
        status: isTranscriptRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTranscriptRegistered ? registeredAt : undefined,
      };
    }

    if (document.id === 'topik-transcript') {
      return {
        ...document,
        status: isTopikRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTopikRegistered ? registeredAt : undefined,
      };
    }

    return document;
  });

  if (view === 'guide') {
    return (
      <DocumentManagementGuide
        onBack={handleGuideBack}
        onStart={handleGuideStart}
      />
    );
  }

  if (view === 'alien-information') {
    return (
      <AlienRegistrationInformation
        onBack={handleDocumentFlowExit}
        onRegister={() => setView('alien-camera')}
        progressLabel="1/6"
      />
    );
  }

  if (view === 'alien-camera') {
    return (
      <AlienRegistrationCamera
        onBack={() => setView('alien-information')}
        onCapture={() => setView('alien-front-info')}
      />
    );
  }

  if (view === 'alien-front-info') {
    return (
      <AlienRegistrationFrontInfo
        onBack={() => setView('alien-camera')}
        onConfirm={() => setView('alien-back-guide')}
        onRetry={() => setView('alien-camera')}
        progressLabel="1/6"
        values={ALIEN_REGISTRATION_VALUES}
      />
    );
  }

  if (view === 'alien-back-guide') {
    return (
      <AlienRegistrationBackGuide
        onBack={() => setView('alien-front-info')}
        onConfirm={() => setView('alien-back-camera')}
        progressLabel="1/6"
      />
    );
  }

  if (view === 'alien-back-camera') {
    return (
      <AlienRegistrationBackCamera
        onBack={() => setView('alien-back-guide')}
        onCapture={() => setView('alien-back-info')}
      />
    );
  }

  if (view === 'alien-back-info') {
    return (
      <AlienRegistrationBackInfo
        onBack={() => setView('alien-back-camera')}
        onConfirm={() => setView('alien-complete')}
        onRetry={() => setView('alien-back-camera')}
        progressLabel="1/6"
        values={ALIEN_REGISTRATION_BACK_VALUES}
      />
    );
  }

  if (view === 'alien-complete') {
    return (
      <AlienRegistrationFrontComplete
        onBack={() => setView('alien-back-info')}
        onConfirm={() => handleDocumentComplete('alien-registration-card')}
        showDescription={false}
      />
    );
  }

  if (view === 'enrollment-information') {
    return (
      <EnrollmentCertificateInformation
        onBack={handleDocumentFlowExit}
        onRegister={() => setView('enrollment-camera')}
      />
    );
  }

  if (view === 'enrollment-camera') {
    return (
      <EnrollmentCertificateCamera
        onBack={() => setView('enrollment-information')}
        onCapture={() => setView('enrollment-review')}
      />
    );
  }

  if (view === 'enrollment-review') {
    return (
      <EnrollmentCertificateReview
        onBack={() => setView('enrollment-camera')}
        onConfirm={() => setView('enrollment-complete')}
        onRetry={() => setView('enrollment-camera')}
      />
    );
  }

  if (view === 'enrollment-complete') {
    return (
      <EnrollmentCertificateComplete
        onBack={() => setView('enrollment-review')}
        onConfirm={() => handleDocumentComplete('enrollment-certificate')}
      />
    );
  }

  if (view === 'transcript-information') {
    return (
      <TranscriptInformation
        onBack={handleDocumentFlowExit}
        onRegister={() => setView('transcript-camera')}
      />
    );
  }

  if (view === 'transcript-camera') {
    return (
      <TranscriptCamera
        onBack={() => setView('transcript-information')}
        onCapture={() => setView('transcript-review')}
      />
    );
  }

  if (view === 'transcript-review') {
    return (
      <TranscriptReview
        onBack={() => setView('transcript-camera')}
        onConfirm={() => setView('transcript-complete')}
        onRetry={() => setView('transcript-camera')}
      />
    );
  }

  if (view === 'transcript-complete') {
    return (
      <TranscriptComplete
        onBack={() => setView('transcript-review')}
        onConfirm={() => handleDocumentComplete('transcript')}
      />
    );
  }

  if (view === 'topik-information') {
    return (
      <TopikInformation
        onBack={handleDocumentFlowExit}
        onRegister={() => setView('topik-camera')}
      />
    );
  }

  if (view === 'topik-camera') {
    return (
      <TopikCamera
        onBack={() => setView('topik-information')}
        onCapture={() => setView('topik-review')}
      />
    );
  }

  if (view === 'topik-review') {
    return (
      <TopikReview
        onBack={() => setView('topik-camera')}
        onConfirm={() => setView('topik-complete')}
        onRetry={() => setView('topik-camera')}
      />
    );
  }

  if (view === 'topik-complete') {
    return (
      <TopikComplete
        onBack={() => setView('topik-review')}
        onConfirm={() => handleDocumentComplete('topik-transcript')}
      />
    );
  }

  return (
    <main className="relative mx-auto h-[844px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="h-full overflow-y-auto px-6 pt-[61px] pb-[113px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          aria-label={t('common.back')}
          className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={handleRegistrationBack}
        >
          <img alt="" src={backIcon} />
        </button>
        <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
          {t('my.documents.title')}
        </h1>
        <div className="mt-[8px]">
          <DocumentRegistrationList
            basicDocuments={basicDocuments}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </div>
      <StudentBottomNavigation
        activeTab="my"
        bottomOffset={27}
        onTabChange={onTabChange}
      />
    </main>
  );
}
