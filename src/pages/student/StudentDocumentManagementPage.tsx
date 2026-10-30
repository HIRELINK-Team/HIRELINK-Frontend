import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { AlienRegistrationCamera } from '../../components/student/documents/AlienRegistrationCamera';
import { AlienRegistrationComplete } from '../../components/student/documents/AlienRegistrationComplete';
import { AlienRegistrationInformation } from '../../components/student/documents/AlienRegistrationInformation';
import { DocumentManagementGuide } from '../../components/student/documents/DocumentManagementGuide';
import { DocumentRegistrationList } from '../../components/student/documents/DocumentRegistrationList';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import { STUDENT_BASIC_DOCUMENTS } from '../../mocks/studentDocuments';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentDocument } from '../../types/studentDocument';

type DocumentManagementView =
  | 'guide'
  | 'registration'
  | 'alien-information'
  | 'alien-camera'
  | 'alien-complete';

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

    onDocumentClick?.(document);
  };

  const basicDocuments = STUDENT_BASIC_DOCUMENTS.map((document) =>
    document.id === 'alien-registration-card'
      ? {
          ...document,
          status: isAlienRegistrationComplete
            ? ('registered' as const)
            : ('required' as const),
          registeredAt: isAlienRegistrationComplete
            ? '등록일 25.03.12'
            : undefined,
        }
      : document,
  );

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
