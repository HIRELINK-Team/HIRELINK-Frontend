import chevronRightIcon from '../../assets/icons/student/my/chevron-right.svg';
import headerBellIcon from '../../assets/icons/student/my/header-bell.svg';
import headerSettingsIcon from '../../assets/icons/student/my/header-settings.svg';
import customerCenterMenuIcon from '../../assets/images/student/my/customer-center-menu.png';
import documentMenuIcon from '../../assets/images/student/my/document-menu.png';
import matchingConditionMenuIcon from '../../assets/images/student/my/matching-condition-menu.png';
import notificationMenuIcon from '../../assets/images/student/my/notification-menu.png';
import profileImage from '../../assets/images/student/my/profile.png';
import termsMenuIcon from '../../assets/images/student/my/terms-menu.png';
import workConditionIllustration from '../../assets/images/student/my/work-condition-illustration.png';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import {
  STUDENT_MY_PRIMARY_MENUS,
  STUDENT_MY_PROFILE_MOCK,
  STUDENT_MY_PROGRESS_MOCK,
  STUDENT_MY_SECONDARY_MENUS,
} from '../../mocks/studentMy';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentMyMenu, StudentMyMenuId } from '../../types/studentMy';

type StudentMyPageProps = {
  isBottomNavigationFixed?: boolean;
  onDocumentManagementClick?: () => void;
  onMatchingClick?: () => void;
  onMenuClick?: (menuId: StudentMyMenuId) => void;
  onProfileEditClick?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
  onWorkConditionClick?: () => void;
};

const PRIMARY_MENU_ICONS: Record<StudentMyMenuId, string | undefined> = {
  'personal-info': profileImage,
  documents: documentMenuIcon,
  'matching-conditions': matchingConditionMenuIcon,
  notifications: undefined,
  'customer-center': undefined,
  terms: undefined,
};

const SECONDARY_MENU_ICONS: Record<StudentMyMenuId, string | undefined> = {
  'personal-info': undefined,
  documents: undefined,
  'matching-conditions': undefined,
  notifications: notificationMenuIcon,
  'customer-center': customerCenterMenuIcon,
  terms: termsMenuIcon,
};

export default function StudentMyPage({
  isBottomNavigationFixed = false,
  onDocumentManagementClick,
  onMatchingClick,
  onMenuClick,
  onProfileEditClick,
  onTabChange,
  onWorkConditionClick,
}: StudentMyPageProps) {
  const handleMenuClick = (menu: StudentMyMenu) => {
    if (menu.id === 'documents') {
      onDocumentManagementClick?.();
    }

    onMenuClick?.(menu.id);
  };

  return (
    <main
      className={`relative mx-auto w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28] ${
        isBottomNavigationFixed
          ? 'h-[844px]'
          : 'h-[940px] px-6 pt-[62px] pb-[85px]'
      }`}
    >
      <div
        className={
          isBottomNavigationFixed
            ? 'h-full overflow-y-auto px-6 pt-[62px] pb-[130px]'
            : 'contents'
        }
      >
        <header>
          <div className="flex items-start justify-between">
            <h1 className="m-0 text-[26px] leading-[1.5] font-semibold">
              마이
            </h1>
            <div className="-mr-2 -mt-1 flex gap-2">
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

        <section className="mt-[13px] flex items-center">
          <img alt="" className="h-[74px] w-[75px]" src={profileImage} />
          <div className="ml-[15px] min-w-0 pt-[7px]">
            <p className="m-0 text-[20px] leading-[1.5] font-semibold">
              {STUDENT_MY_PROFILE_MOCK.name}
            </p>
            <p className="m-0 mt-[1px] flex items-center gap-[6px] text-[13px] leading-[1.5] text-[#8B95A1]">
              <span>{STUDENT_MY_PROFILE_MOCK.visaStatus}</span>
              <span aria-hidden="true">|</span>
              <span>{STUDENT_MY_PROFILE_MOCK.topikLevel}</span>
            </p>
          </div>
          <button
            className="ml-auto mt-[12px] flex items-center gap-2 border-0 bg-transparent p-0 text-[13px] leading-[1.5] text-[#8B95A1]"
            type="button"
            onClick={onProfileEditClick}
          >
            프로필 수정
            <img
              alt=""
              className="h-[12px] w-[6px] -scale-x-100"
              src={chevronRightIcon}
            />
          </button>
        </section>

        <section className="relative mt-[13px] h-[263px] overflow-hidden rounded-[20px] bg-white">
          <img
            alt=""
            className="absolute top-[47px] left-6 h-[86px] w-[82px] object-contain"
            src={workConditionIllustration}
          />
          <div className="absolute top-[29px] left-[125px]">
            <h2 className="m-0 text-[17px] leading-[1.5] font-bold">
              {STUDENT_MY_PROGRESS_MOCK.title}
            </h2>
            <div className="mt-[3px] text-[13px] leading-[1.5] text-[#8B95A1]">
              {STUDENT_MY_PROGRESS_MOCK.descriptionLines.map((line) => (
                <p className="m-0" key={line}>
                  {line}
                </p>
              ))}
            </div>
          </div>
          <p className="absolute top-[119px] right-[24px] m-0 text-[20px] leading-[1.5] font-semibold text-[#009376]">
            {STUDENT_MY_PROGRESS_MOCK.percent}%
          </p>
          <div className="absolute top-[159px] right-6 left-6 h-[9px] overflow-hidden rounded-[40px] bg-[#B8EBDD]">
            <div
              className="h-full rounded-[40px] bg-[#00B894]"
              style={{ width: `${STUDENT_MY_PROGRESS_MOCK.percent}%` }}
            />
          </div>
          <button
            className="absolute right-6 bottom-[19px] left-6 h-[54px] rounded-[10px] border-0 bg-[#00B894] p-0 text-[17px] leading-[1.5] font-medium text-[#F5F5F5]"
            type="button"
            onClick={onWorkConditionClick ?? onMatchingClick}
          >
            매칭하러 가기
          </button>
        </section>

        <section className="-mx-6 mt-[25px] border-t border-[#E5E8EB]">
          {STUDENT_MY_PRIMARY_MENUS.map((menu) => (
            <button
              className="flex h-[79px] w-full items-center border-0 border-b border-[#E5E8EB] bg-transparent px-6 text-left"
              key={menu.id}
              type="button"
              onClick={() => handleMenuClick(menu)}
            >
              <img
                alt=""
                className="h-[52px] w-[53px] shrink-0 object-contain"
                src={PRIMARY_MENU_ICONS[menu.id]}
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

        <section className="-mx-6 border-b border-[#E5E8EB]">
          {STUDENT_MY_SECONDARY_MENUS.map((menu) => (
            <button
              className="flex h-[35px] w-full items-center border-0 bg-transparent px-6 text-left"
              key={menu.id}
              type="button"
              onClick={() => handleMenuClick(menu)}
            >
              <img
                alt=""
                className="ml-1 h-[23px] w-[23px] shrink-0 object-contain"
                src={SECONDARY_MENU_ICONS[menu.id]}
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
      </div>

      {isBottomNavigationFixed ? (
        <div className="absolute right-0 bottom-0 left-0 z-10 h-[118px] bg-[#F5F5F5]" />
      ) : null}

      <StudentBottomNavigation
        activeBackgroundClassName="bg-[#E5E8EB]/90"
        activeTab="my"
        bottomOffsetClassName={
          isBottomNavigationFixed ? 'bottom-9' : 'bottom-[22px]'
        }
        isFixed={false}
        onTabChange={onTabChange}
      />
    </main>
  );
}
