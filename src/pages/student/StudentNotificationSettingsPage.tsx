import backIcon from '../../assets/icons/student/notification-settings-back.svg';
import applicationResultIcon from '../../assets/images/student/notification-settings/application-result.png';
import documentExpiryIcon from '../../assets/images/student/notification-settings/document-expiry.png';
import documentStatusIcon from '../../assets/images/student/notification-settings/document-status.png';
import employmentPermitIcon from '../../assets/images/student/notification-settings/employment-permit.png';
import matchingRecommendationIcon from '../../assets/images/student/notification-settings/matching-recommendation.png';
import notificationNoticeImage from '../../assets/images/student/notification-settings/notice.png';
import savedJobIcon from '../../assets/images/student/notification-settings/saved-job.png';
import serviceNewsIcon from '../../assets/images/student/notification-settings/service-news.png';
import type {
  StudentNotificationId,
  StudentNotificationSettings,
} from '../../types/studentNotification';

type NotificationRow = {
  description: string;
  iconHeight: number;
  iconImage: string;
  iconLeft: number;
  iconWidth: number;
  id: StudentNotificationId;
  textLeft: number;
  title: string;
};

type NotificationSection = {
  rows: readonly NotificationRow[];
  title: string;
};

const NOTIFICATION_SECTIONS: readonly NotificationSection[] = [
  {
    title: '매칭 관련 알림',
    rows: [
      {
        id: 'matching-recommendation',
        title: '맞춤 공고 추천',
        description: '내 조건에 맞는 새로운 공고가 등록되면 알려드려요.',
        iconHeight: 47,
        iconImage: matchingRecommendationIcon,
        iconLeft: 22,
        iconWidth: 47,
        textLeft: 81,
      },
      {
        id: 'application-result',
        title: '지원 결과 알림',
        description: '지원한 공고의 결과를 알려드려요.',
        iconHeight: 47,
        iconImage: applicationResultIcon,
        iconLeft: 22,
        iconWidth: 47,
        textLeft: 81,
      },
      {
        id: 'saved-job',
        title: '관심 공고 알림',
        description: '관심 공고의 마감, 수정 사항을 알려드려요.',
        iconHeight: 46.819,
        iconImage: savedJobIcon,
        iconLeft: 22,
        iconWidth: 47,
        textLeft: 81,
      },
    ],
  },
  {
    title: '근무 조건 및 서류',
    rows: [
      {
        id: 'document-status',
        title: '서류 확인 상태 변경',
        description: '등록한 서류의 인증 상태가 변경되면 알려드려요.',
        iconHeight: 39,
        iconImage: documentStatusIcon,
        iconLeft: 27,
        iconWidth: 39,
        textLeft: 81,
      },
      {
        id: 'document-expiry',
        title: '체류/학업 정보 만료 알림',
        description: '외국인등록증, 재학증명서 등의 만료일 전에 알려드려요.',
        iconHeight: 47,
        iconImage: documentExpiryIcon,
        iconLeft: 24,
        iconWidth: 47,
        textLeft: 81,
      },
      {
        id: 'employment-permit',
        title: '취업 허가 관련 안내',
        description: '채용 후 필요한 서류와 절차에 대한 정보를 알려드려요.',
        iconHeight: 42,
        iconImage: employmentPermitIcon,
        iconLeft: 27,
        iconWidth: 42.162,
        textLeft: 81,
      },
    ],
  },
  {
    title: '서비스 알림',
    rows: [
      {
        id: 'service-news',
        title: '서비스 소식',
        description: '새로운 기능, 이벤트, 중요 공지를 알려드려요.',
        iconHeight: 37.854,
        iconImage: serviceNewsIcon,
        iconLeft: 27,
        iconWidth: 38,
        textLeft: 81,
      },
    ],
  },
];

function NotificationIcon({
  height,
  image,
  style,
  width,
}: {
  height: number;
  image: string;
  style: { left: number };
  width: number;
}) {
  return (
    <img
      alt=""
      className="absolute top-1/2 -translate-y-1/2 object-cover"
      src={image}
      style={{ height, width, ...style }}
    />
  );
}

function NotificationToggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={`${label} ${checked ? '켜짐' : '꺼짐'}`}
      className={`relative h-[23.428px] w-[41px] shrink-0 overflow-hidden rounded-full border-0 p-0 transition-colors duration-150 ${
        checked ? 'bg-[#00B894]' : 'bg-[#D1D6DB]'
      }`}
      role="switch"
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onChange();
      }}
    >
      <span
        className={`absolute top-[2px] left-[2px] size-[19px] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.14)] transition-transform duration-150 ${
          checked ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

type StudentNotificationSettingsPageProps = {
  onBack: () => void;
  onSettingsChange: (id: StudentNotificationId) => void;
  settings: StudentNotificationSettings;
};

export default function StudentNotificationSettingsPage({
  onBack,
  onSettingsChange,
  settings,
}: StudentNotificationSettingsPageProps) {
  return (
    <main className="mx-auto min-h-[1053px] w-full max-w-[430px] bg-[#F5F5F5] pt-[61px] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="px-6">
        <button
          aria-label="뒤로가기"
          className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>
        <h1 className="m-0 mt-[19px] text-[26px] leading-[1.5] font-semibold">
          알림 설정
        </h1>

        <section className="relative mt-3 flex h-[82px] items-center overflow-hidden rounded-[20px] bg-[#E5E8EB] pl-[72px] pr-4">
          <img
            alt=""
            className="absolute left-[19px] top-[13px] h-[55.475px] w-[55.475px] object-cover"
            src={notificationNoticeImage}
          />
          <p className="m-0 text-[15px] leading-[1.5] font-semibold">
            나에게 중요한 소식을 HIRELINK에서
            <br />
            빠짐없이 받아보세요!
          </p>
        </section>

        <p className="m-0 mt-[6px] text-[12px] leading-[1.5] text-[#8B95A1]">
          원하는 알림만 선택해서 편리하게 관리할 수 있어요.
        </p>
      </div>

      {NOTIFICATION_SECTIONS.map((section, sectionIndex) => (
        <section
          className={`mt-[21px] ${sectionIndex === 0 ? '' : 'mt-[21px]'}`}
          key={section.title}
        >
          <h2 className="m-0 px-6 text-[20px] leading-[1.5] font-semibold">
            {section.title}
          </h2>
          <div
            className={`-mx-[7px] border-y border-[#E5E8EB] ${
              sectionIndex === 0 ? 'mt-6' : 'mt-[21px]'
            }`}
          >
            {section.rows.map((row) => (
              <div
                className="relative h-[75px] border-b border-[#E5E8EB] last:border-b-0"
                key={row.id}
              >
                <NotificationIcon
                  height={row.iconHeight}
                  image={row.iconImage}
                  width={row.iconWidth}
                  style={{ left: row.iconLeft }}
                />
                <div
                  className="absolute top-[15px]"
                  style={{ left: row.textLeft }}
                >
                  <p className="m-0 text-[15px] leading-[1.5] font-semibold">
                    {row.title}
                  </p>
                  <p className="m-0 text-[11px] leading-[17px] text-[#8B95A1]">
                    {row.description}
                  </p>
                </div>
                <div className="absolute top-[26px] right-[31px]">
                  <NotificationToggle
                    checked={settings[row.id]}
                    label={row.title}
                    onChange={() => onSettingsChange(row.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
