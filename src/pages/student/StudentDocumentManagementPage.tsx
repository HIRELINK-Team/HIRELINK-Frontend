import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import { DocumentManagementGuide } from '../../components/student/documents/DocumentManagementGuide';
import { DocumentRegistrationList } from '../../components/student/documents/DocumentRegistrationList';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentDocument } from '../../types/studentDocument';

type DocumentManagementView = 'guide' | 'registration';

type StudentDocumentManagementPageProps = {
  onDocumentClick?: (document: StudentDocument) => void;
  onExit?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
};

export default function StudentDocumentManagementPage({
  onDocumentClick,
  onExit,
  onTabChange,
}: StudentDocumentManagementPageProps) {
  const [view, setView] = useState<DocumentManagementView>('guide');

  const handleGuideBack = () => {
    onExit?.();
  };

  const handleRegistrationBack = () => {
    setView('guide');
  };

  if (view === 'guide') {
    return (
      <DocumentManagementGuide
        onBack={handleGuideBack}
        onStart={() => setView('registration')}
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
        <DocumentRegistrationList onDocumentClick={onDocumentClick} />
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
