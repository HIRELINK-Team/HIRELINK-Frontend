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
import { STUDENT_BASIC_DOCUMENTS } from '../../mocks/studentDocuments';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentDocument } from '../../types/studentDocument';

type DocumentManagementView =
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
  | 'transcript-complete';

type StudentDocumentManagementPageProps = {
  initialView?: DocumentManagementView;
  onDocumentClick?: (document: StudentDocument) => void;
  onExit?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentDocumentManagementPage({
  initialView = 'guide',
  onDocumentClick,
  onExit,
  onTabChange,
}: StudentDocumentManagementPageProps) {
  const [view, setView] = useState<DocumentManagementView>(initialView);
  const [isAlienRegistrationComplete, setIsAlienRegistrationComplete] =
    useState(true);
  const [isEnrollmentCertificateComplete, setIsEnrollmentCertificateComplete] =
    useState(false);
  const [isTranscriptComplete, setIsTranscriptComplete] = useState(true);

  const handleGuideBack = () => {
    onExit?.();
  };

  const handleRegistrationBack = () => {
    setView('guide');
  };

  const handleDocumentClick = (document: StudentDocument) => {
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

    onDocumentClick?.(document);
  };

  const basicDocuments = STUDENT_BASIC_DOCUMENTS.map((document) => {
    if (document.id === 'alien-registration-card') {
      return {
        ...document,
        status: isAlienRegistrationComplete
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isAlienRegistrationComplete
          ? '등록일 25.03.12'
          : undefined,
      };
    }

    if (document.id === 'enrollment-certificate') {
      return {
        ...document,
        status: isEnrollmentCertificateComplete
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isEnrollmentCertificateComplete
          ? '등록일 25.03.12'
          : undefined,
      };
    }

    if (document.id === 'transcript') {
      return {
        ...document,
        status: isTranscriptComplete
          ? ('registered' as const)
          : ('required' as const),
        registeredAt: isTranscriptComplete ? '등록일 25.03.12' : undefined,
      };
    }

    return document;
  });

  if (view === 'guide') {
    return (
      <DocumentManagementGuide
        onBack={handleGuideBack}
        onStart={() => setView('registration')}
      />
    );
  }

  if (view === 'alien-information') {
    return (
      <AlienRegistrationInformation
        onBack={() => setView('registration')}
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
        onConfirm={() => {
          setIsAlienRegistrationComplete(true);
          setView('registration');
        }}
      />
    );
  }

  if (view === 'enrollment-information') {
    return (
      <EnrollmentCertificateInformation
        onBack={() => setView('registration')}
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
        onConfirm={() => {
          setIsEnrollmentCertificateComplete(true);
          setView('registration');
        }}
      />
    );
  }

  if (view === 'transcript-information') {
    return (
      <TranscriptInformation
        onBack={() => setView('registration')}
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
        onConfirm={() => {
          setIsTranscriptComplete(true);
          setView('registration');
        }}
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
