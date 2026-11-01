import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationComplete } from '../../components/student/documents/AlienRegistrationComplete';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import { DocumentManagementGuide } from '../../components/student/documents/DocumentManagementGuide';
import { DocumentRegistrationList } from '../../components/student/documents/DocumentRegistrationList';
import { EnrollmentCertificateCamera } from '../../components/student/documents/EnrollmentCertificateCamera';
import { EnrollmentCertificateComplete } from '../../components/student/documents/EnrollmentCertificateComplete';
import { EnrollmentCertificateInformation } from '../../components/student/documents/EnrollmentCertificateInformation';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { TranscriptCamera } from '../../components/student/documents/TranscriptCamera';
import { TranscriptComplete } from '../../components/student/documents/TranscriptComplete';
import { TranscriptInformation } from '../../components/student/documents/TranscriptInformation';
import { TopikCamera } from '../../components/student/documents/TopikCamera';
import { TopikComplete } from '../../components/student/documents/TopikComplete';
import { TopikInformation } from '../../components/student/documents/TopikInformation';
import { STUDENT_BASIC_DOCUMENTS } from '../../mocks/studentDocuments';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentDocument } from '../../types/studentDocument';

export type StudentDocumentManagementView =
  | 'guide'
  | 'registration'
  | 'alien-information'
  | 'alien-camera'
  | 'alien-complete'
  | 'enrollment-information'
  | 'enrollment-camera'
  | 'enrollment-complete'
  | 'transcript-information'
  | 'transcript-camera'
  | 'transcript-complete'
  | 'topik-information'
  | 'topik-camera'
  | 'topik-complete';

type StudentDocumentManagementPageProps = {
  documentCompletion?: Partial<Record<StudentDocument['id'], boolean>>;
  initialView?: StudentDocumentManagementView;
  onDocumentComplete?: (documentId: StudentDocument['id']) => void;
  onDocumentClick?: (document: StudentDocument) => void;
  onDocumentFlowExit?: () => void;
  onExit?: () => void;
  onGuideStart?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentDocumentManagementPage({
  documentCompletion,
  initialView = 'guide',
  onDocumentComplete,
  onDocumentClick,
  onDocumentFlowExit,
  onExit,
  onGuideStart,
  onTabChange,
}: StudentDocumentManagementPageProps) {
  const [view, setView] = useState<StudentDocumentManagementView>(initialView);
  const [isAlienRegistrationComplete, setIsAlienRegistrationComplete] =
    useState(true);
  const [isEnrollmentCertificateComplete, setIsEnrollmentCertificateComplete] =
    useState(false);
  const [isTranscriptComplete, setIsTranscriptComplete] = useState(true);
  const [isTopikComplete, setIsTopikComplete] = useState(true);

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

    if (onDocumentComplete) {
      onDocumentComplete(documentId);
      return;
    }

    setView('registration');
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

  const basicDocuments = STUDENT_BASIC_DOCUMENTS.map((document) => {
    if (document.id === 'alien-registration-card') {
      return {
        ...document,
        status: isAlienRegistrationRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isAlienRegistrationRegistered
          ? '등록일 25.03.12'
          : undefined,
      };
    }

    if (document.id === 'enrollment-certificate') {
      return {
        ...document,
        status: isEnrollmentCertificateRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isEnrollmentCertificateRegistered
          ? '등록일 25.03.12'
          : undefined,
      };
    }

    if (document.id === 'transcript') {
      return {
        ...document,
        status: isTranscriptRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTranscriptRegistered ? '등록일 25.03.12' : undefined,
      };
    }

    if (document.id === 'topik-transcript') {
      return {
        ...document,
        status: isTopikRegistered
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTopikRegistered ? '등록일 25.03.12' : undefined,
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
      />
    );
  }

  if (view === 'alien-camera') {
    return (
      <AlienRegistrationCamera
        onBack={() => setView('alien-information')}
        onCapture={() => setView('alien-complete')}
      />
    );
  }

  if (view === 'alien-complete') {
    return (
      <AlienRegistrationComplete
        onBack={() => setView('alien-camera')}
        onConfirm={() => handleDocumentComplete('alien-registration-card')}
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
        onCapture={() => setView('enrollment-complete')}
      />
    );
  }

  if (view === 'enrollment-complete') {
    return (
      <EnrollmentCertificateComplete
        onBack={() => setView('enrollment-camera')}
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
        onCapture={() => setView('transcript-complete')}
      />
    );
  }

  if (view === 'transcript-complete') {
    return (
      <TranscriptComplete
        onBack={() => setView('transcript-camera')}
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
        onCapture={() => setView('topik-complete')}
      />
    );
  }

  if (view === 'topik-complete') {
    return (
      <TopikComplete
        onBack={() => setView('topik-camera')}
        onConfirm={() => handleDocumentComplete('topik-transcript')}
      />
    );
  }

  return (
    <main className="relative mx-auto min-h-[989px] w-full max-w-[430px] bg-[#F5F5F5] px-6 pt-[61px] pb-[125px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-2 place-items-center border-0 bg-transparent p-0"
        type="button"
        onClick={handleRegistrationBack}
      >
        <img alt="" src={backIcon} />
      </button>
      <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
        서류 관리
      </h1>
      <div className="mt-[8px]">
        <DocumentRegistrationList
          basicDocuments={basicDocuments}
          onDocumentClick={handleDocumentClick}
        />
      </div>
      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="my"
        bottomOffsetClassName="bottom-7"
        onTabChange={onTabChange}
      />
    </main>
  );
}
