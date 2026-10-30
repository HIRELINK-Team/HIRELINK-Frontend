import { useState } from 'react';

import backIcon from '../../assets/icons/student/documents/back.svg';
import chevronRightIcon from '../../assets/icons/student/my/chevron-right.svg';
import headerBellIcon from '../../assets/icons/student/my/header-bell.svg';
import headerSettingsIcon from '../../assets/icons/student/my/header-settings.svg';
import badgeImage from '../../assets/images/student/documents/verification/badge-issued.png';
import customerCenterMenuIcon from '../../assets/images/student/my/customer-center-menu.png';
import documentMenuIcon from '../../assets/images/student/my/document-menu.png';
import matchingConditionMenuIcon from '../../assets/images/student/my/matching-condition-menu.png';
import notificationMenuIcon from '../../assets/images/student/my/notification-menu.png';
import profileImage from '../../assets/images/student/my/profile.png';
import termsMenuIcon from '../../assets/images/student/my/terms-menu.png';
import verifiedWorkConditionIllustration from '../../assets/images/student/my/verified-work-condition.png';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import {
  STUDENT_MY_PRIMARY_MENUS,
  STUDENT_MY_PROFILE_MOCK,
  STUDENT_MY_SECONDARY_MENUS,
} from '../../mocks/studentMy';
import type { StudentMyMenuId } from '../../types/studentMy';
import StudentWorkConditionPage from './StudentWorkConditionPage';

const VERIFIED_PRIMARY_MENU_ICONS: Record<StudentMyMenuId, string | undefined> =
  {
    'personal-info': profileImage,
    documents: documentMenuIcon,
    'matching-conditions': matchingConditionMenuIcon,
    notifications: undefined,
    'customer-center': undefined,
    terms: undefined,
  };

const VERIFIED_SECONDARY_MENU_ICONS: Record<
  StudentMyMenuId,
  string | undefined
> = {
  'personal-info': undefined,
  documents: undefined,
  'matching-conditions': undefined,
  notifications: notificationMenuIcon,
  'customer-center': customerCenterMenuIcon,
  terms: termsMenuIcon,
};

function VerifiedMyPage({
  onWorkConditionClick,
}: {
  onWorkConditionClick: () => void;
}) {
  return (
    <main
      className="relative mx-auto min-h-[844px] w-full max-w-[430px] overflow-hidden bg-[#F5F5F5] px-6 pt-[62px] pb-[98px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      style={{
        background: '#F5F5F5',
        marginInline: 'auto',
        maxWidth: 430,
        minHeight: 844,
        overflow: 'hidden',
        padding: '62px 24px 98px',
        position: 'relative',
        width: '100%',
      }}
    >
      <header>
        <div className="flex items-start justify-between">
          <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">마이</h1>
          <div className="-mr-2 flex gap-2">
            <button
              aria-label="알림"
              className="grid size-10 place-items-center rounded-lg border-0 bg-transparent p-0"
              type="button"
            >
              <img alt="" className="size-6" src={headerBellIcon} />
            </button>
            <button
              aria-label="설정"
              className="grid size-10 place-items-center rounded-lg border-0 bg-transparent p-0"
              type="button"
            >
              <img alt="" className="size-6" src={headerSettingsIcon} />
            </button>
          </div>
        </div>
        <p className="m-0 text-[15px] leading-[1.5] text-[#8B95A1]">
          오늘도 좋은 일자리를 찾아볼까요?
        </p>
      </header>

      <section
        className="mt-[13px] flex h-[74px] items-start"
        style={{
          alignItems: 'flex-start',
          display: 'flex',
          height: 74,
          marginTop: 13,
        }}
      >
        <img
          alt=""
          className="h-[74px] w-[74px]"
          src={profileImage}
          style={{ height: 74, width: 74 }}
        />
        <div className="ml-4 pt-3" style={{ marginLeft: 16, paddingTop: 12 }}>
          <p className="m-0 text-[20px] leading-[1.5] font-semibold">
            {STUDENT_MY_PROFILE_MOCK.name}
          </p>
          <p className="m-0 text-[13px] leading-[1.5] text-[#8B95A1]">
            {STUDENT_MY_PROFILE_MOCK.visaStatus}&nbsp;&nbsp;|&nbsp;&nbsp;
            {STUDENT_MY_PROFILE_MOCK.topikLevel}
          </p>
        </div>
        <button
          className="ml-auto mt-[27px] flex items-center gap-2 border-0 bg-transparent p-0 text-[13px] leading-[1.5] text-[#8B95A1]"
          type="button"
        >
          프로필 수정
          <img
            alt=""
            className="h-[12px] w-[6px] -scale-x-100"
            src={chevronRightIcon}
          />
        </button>
      </section>

      <section
        className="relative mt-[13px] h-[223px] overflow-hidden rounded-[20px] bg-white"
        style={{
          background: '#FFFFFF',
          borderRadius: 20,
          height: 223,
          marginTop: 13,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          alt=""
          className="absolute top-8 left-2 h-[87px] w-[76px] object-contain"
          src={verifiedWorkConditionIllustration}
          style={{
            height: 87,
            left: 8,
            objectFit: 'contain',
            position: 'absolute',
            top: 32,
            width: 76,
          }}
        />
        <div
          className="absolute top-8 left-[125px]"
          style={{ left: 125, position: 'absolute', top: 32 }}
        >
          <h2 className="m-0 text-[17px] leading-[1.5] font-bold">
            내 근무가능 조건이
            <br />
            확인되었어요!
          </h2>
          <p className="m-0 mt-[6px] text-[13px] leading-[1.5] text-[#8B95A1]">
            나의 근무 가능 조건을 확인하고
            <br />
            나에게 딱 맞는 일자리를 찾아보세요.
          </p>
        </div>
        <button
          className="absolute right-6 bottom-[19px] left-6 h-[54px] rounded-[10px] border-0 bg-[#00B894] text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
          style={{
            background: '#00B894',
            borderRadius: 10,
            bottom: 19,
            color: '#F5F5F5',
            fontSize: 17,
            fontWeight: 500,
            height: 54,
            left: 24,
            position: 'absolute',
            right: 24,
          }}
          type="button"
          onClick={onWorkConditionClick}
        >
          근무 가능 조건 확인하기
        </button>
      </section>

      <section className="-mx-6 mt-[25px] border-t border-[#E5E8EB]">
        {STUDENT_MY_PRIMARY_MENUS.map((menu) => (
          <button
            className="flex h-[79px] w-full items-center border-0 border-b border-[#E5E8EB] bg-transparent px-6 text-left"
            key={menu.id}
            type="button"
          >
            <img
              alt=""
              className="h-[52px] w-[53px] shrink-0 object-contain"
              src={VERIFIED_PRIMARY_MENU_ICONS[menu.id]}
            />
            <span className="ml-[23px] min-w-0 flex-1">
              <span className="block text-[15px] leading-[1.5] font-bold">
                {menu.title}
              </span>
              <span className="mt-[2px] block text-[13px] leading-[1.5] text-[#8B95A1]">
                {menu.description}
              </span>
            </span>
            <img
              alt=""
              className="ml-3 h-[26px] w-[26px] -scale-x-100"
              src={chevronRightIcon}
            />
          </button>
        ))}
      </section>

      <section className="-mx-6 border-t border-[#E5E8EB]">
        {STUDENT_MY_SECONDARY_MENUS.map((menu) => (
          <button
            className="flex h-[35px] w-full items-center border-0 bg-transparent px-6 text-left"
            key={menu.id}
            type="button"
          >
            <img
              alt=""
              className="ml-1 h-[23px] w-[23px] shrink-0 object-contain"
              src={VERIFIED_SECONDARY_MENU_ICONS[menu.id]}
            />
            <span className="ml-[13px] flex-1 text-[15px] leading-[1.5] text-[#8B95A1]">
              {menu.title}
            </span>
            <img
              alt=""
              className="h-[26px] w-[26px] -scale-x-100"
              src={chevronRightIcon}
            />
          </button>
        ))}
      </section>
      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="my"
        bottomOffsetClassName="bottom-7"
      />
    </main>
  );
}

function BadgeIssuedPage({ onConfirm }: { onConfirm: () => void }) {
  return (
    <main
      className="mx-auto flex w-full max-w-[430px] flex-col bg-[#F5F5F5] px-6 pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      style={{
        background: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        marginInline: 'auto',
        maxWidth: 430,
        minHeight: 'max(100vh, 844px)',
        padding: '61px 24px 0',
        width: '100%',
      }}
    >
      <button
        aria-label="뒤로가기"
        className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
        style={{
          display: 'grid',
          height: 32,
          marginLeft: -10,
          placeItems: 'center',
          width: 32,
        }}
        type="button"
      >
        <img
          alt=""
          className="h-4 w-2"
          src={backIcon}
          style={{ height: 16, width: 8 }}
        />
      </button>
      <section
        className="mt-[166px] flex flex-col items-center"
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 166,
        }}
      >
        <img
          alt=""
          className="h-[123px] w-[121px] object-contain"
          style={{ height: 123, objectFit: 'contain', width: 121 }}
          src={badgeImage}
        />
        <h1
          className="m-0 mt-[23px] text-center text-[26px] leading-[1.5] font-semibold"
          style={{
            fontSize: 26,
            fontWeight: 600,
            lineHeight: 1.5,
            margin: '23px 0 0',
            textAlign: 'center',
          }}
        >
          뱃지가 발급되었어요!
        </h1>
        <p
          className="m-0 mt-[6px] text-center text-[13px] leading-[1.5] text-[#8B95A1]"
          style={{
            color: '#8B95A1',
            fontSize: 13,
            lineHeight: 1.5,
            margin: '6px 0 0',
            textAlign: 'center',
          }}
        >
          이제 더 정확하게 일자리를
          <br />
          추천받을 수 있어요!
        </p>
      </section>
      <button
        className="mt-auto mb-[86px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] font-medium text-[#F5F5F5]"
        style={{
          background: '#00B894',
          borderRadius: 15,
          color: '#F5F5F5',
          fontSize: 20,
          fontWeight: 500,
          height: 57,
          lineHeight: 1.5,
          marginBottom: 86,
          marginTop: 'auto',
          width: '100%',
        }}
        type="button"
        onClick={onConfirm}
      >
        확인
      </button>
    </main>
  );
}

export default function StudentDocumentVerificationPreviewPage() {
  const [view, setView] = useState<'badge' | 'my' | 'work-condition'>('badge');

  if (view === 'badge') {
    return <BadgeIssuedPage onConfirm={() => setView('my')} />;
  }

  if (view === 'work-condition') {
    return <StudentWorkConditionPage onBack={() => setView('my')} />;
  }

  return (
    <VerifiedMyPage onWorkConditionClick={() => setView('work-condition')} />
  );
}
