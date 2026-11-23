import backIcon from '../../assets/icons/student/documents/back.svg';
import { useTranslation } from 'react-i18next';
import approvedStatusIcon from '../../assets/icons/student/my/work-condition-approved.png';
import restrictedStatusIcon from '../../assets/icons/student/my/work-condition-restricted.png';
import reviewStatusIcon from '../../assets/icons/student/my/work-condition-review.png';
import workConditionSummaryImage from '../../assets/images/student/my/work-condition-summary.png';
import { mapStudentProfileResponseToValues } from '../../adapters/studentProfile';
import { StudentBottomNavigation } from '../../components/student/navigation/StudentBottomNavigation';
import type { StudentNavigationTab } from '../../types/studentHome';
import type { StudentProfileResponse } from '../../types/studentProfile';

type StudentWorkConditionPageProps = {
  onBack?: () => void;
  onEditBasicInfo?: () => void;
  onEditWorkTime?: () => void;
  onEditEligibleFields?: () => void;
  onTabChange?: (tab: StudentNavigationTab) => void;
  studentProfile?: StudentProfileResponse | null;
};

const ELIGIBLE_FIELDS = [
  {
    icon: approvedStatusIcon,
    label: '음식점·카페 보조',
    status: 'approved',
  },
  {
    icon: approvedStatusIcon,
    label: '통역·번역 보조',
    status: 'approved',
  },
  {
    icon: approvedStatusIcon,
    label: '매장·판매 보조',
    status: 'approved',
  },
  {
    icon: reviewStatusIcon,
    label: '제조업 (별도 심사 필요)',
    status: 'review',
  },
  {
    icon: restrictedStatusIcon,
    label: '배달대행',
    status: 'restricted',
  },
] as const;

export default function StudentWorkConditionPage({
  onBack,
  onEditBasicInfo,
  onEditWorkTime,
  onEditEligibleFields,
  onTabChange,
  studentProfile = null,
}: StudentWorkConditionPageProps) {
  const { t } = useTranslation();
  const profileValues = studentProfile
    ? mapStudentProfileResponseToValues(studentProfile)
    : undefined;
  const visaStatus = profileValues?.residence?.[0] ?? t('my.notRegistered');
  const academicStatus = profileValues?.academic?.[2] ?? t('my.notRegistered');
  const topikLevel = profileValues?.language?.[0] ?? t('my.topikNotRegistered');

  return (
    <main className="relative mx-auto h-[914px] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <div className="h-full overflow-y-auto px-6 pt-[61px] pb-[126px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          aria-label={t('common.back')}
          className="grid size-8 -ml-[10px] place-items-center border-0 bg-transparent p-0"
          type="button"
          onClick={onBack}
        >
          <img alt="" className="h-4 w-2" src={backIcon} />
        </button>
        <h1 className="m-0 mt-2 text-[26px] leading-[1.5] font-semibold">
          {t('my.workCondition.title')}
        </h1>

        <section className="relative mt-[17px] h-[82px] overflow-hidden rounded-[20px] bg-[#E5E8EB]">
          <img
            alt=""
            className="absolute top-[7px] left-[18px] h-[68px] w-[69px] object-contain"
            src={workConditionSummaryImage}
          />
          <p className="absolute top-[18px] left-24 m-0 text-[15px] leading-[1.5] font-bold">
            {t('my.workCondition.prompt').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}
          </p>
        </section>
        <p className="m-0 mt-[6px] text-[12px] leading-[1.5] text-[#8B95A1]">
          {t('my.workCondition.disclaimer')}
        </p>

        <section className="mt-[28px] h-[138px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px] pb-[17px]">
          <CardHeader title={t('my.workCondition.basic')} onEdit={onEditBasicInfo} />
          <InfoRow label={t('my.profile.visa')} value={visaStatus} />
          <InfoRow label={t('my.workCondition.academicStatus')} value={academicStatus} />
          <InfoRow label={t('my.workCondition.koreanAbility')} value={topikLevel} />
        </section>

        <section className="mt-[16px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px] pb-[17px]">
          <CardHeader title={t('my.workCondition.hours')} onEdit={onEditWorkTime} />
          <InfoRow label={t('my.workCondition.semester')} value={t('my.workCondition.semesterValue')} />
          <InfoRow label={t('my.workCondition.vacation')} value={t('my.workCondition.conditional')} />
          <InfoRow label={t('my.workCondition.weekends')} value={t('my.workCondition.conditional')} />
          <p className="m-0 mt-[10px] text-[12px] leading-[1.5] text-[#8B95A1]">
            {t('my.workCondition.hoursDisclaimer')}
          </p>
        </section>

        <section className="mt-[16px] rounded-[20px] bg-[#E5E8EB] px-[30px] pt-[19px] pb-7">
          <CardHeader title={t('my.workCondition.eligible')} onEdit={onEditEligibleFields} />
          <ul className="m-0 mt-[12px] space-y-[7px] p-0">
            {ELIGIBLE_FIELDS.map((field, index) => (
              <li
                className="flex items-center gap-4 text-[13px] leading-[1.5]"
                key={field.label}
              >
                <span
                  aria-hidden="true"
                  className="relative size-[16px] shrink-0"
                >
                  <img
                    alt=""
                    className={`absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 ${
                      field.status === 'approved'
                        ? 'size-[29px]'
                        : 'size-[26px]'
                    }`}
                    src={field.icon}
                  />
                </span>
                {t(`my.workCondition.fields.${index}`)}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <StudentBottomNavigation
        activeTab="my"
        bottomOffset={23}
        onTabChange={onTabChange}
      />
    </main>
  );
}

function CardHeader({ title, onEdit }: { title: string; onEdit?: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <h2 className="m-0 text-[15px] leading-[1.5] font-bold">{title}</h2>
      <button
        className="h-[27px] rounded-[30px] border border-[#B0B8C1] px-[13px] text-[13px] leading-[1.5] text-[#4E5968]"
        type="button"
        onClick={onEdit}
      >
        {t('my.profile.edit')}
      </button>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-[4px] grid grid-cols-[69px_1fr] text-[13px] leading-[1.5]">
      <span className="text-[#8B95A1]">{label}</span>
      <span>{value}</span>
    </div>
  );
}
