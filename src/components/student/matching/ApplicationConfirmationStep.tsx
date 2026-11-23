import { useState } from 'react';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import backIcon from '../../../assets/icons/student/matching/back.svg';
import checklistImage from '../../../assets/images/student/matching/application-checklist.png';
import experienceImage from '../../../assets/images/student/matching/application-experience.png';
import profileImage from '../../../assets/images/student/matching/application-profile.png';
import { mapStudentProfileResponseToValues } from '../../../adapters/studentProfile';
import type { RecommendedJob } from '../../../types/studentMatching';
import type { StudentProfileResponse } from '../../../types/studentProfile';

type ApplicationConfirmationStepProps = {
  isSubmitting?: boolean;
  job: RecommendedJob;
  studentProfile?: StudentProfileResponse | null;
  onBack: () => void;
  onConfirm: () => void;
};

type InformationCardProps = {
  description: string;
  image: string;
  title: string;
};

function getAge(birthDate: string, today: Date) {
  const birthDateValue = new Date(`${birthDate}T00:00:00`);

  if (Number.isNaN(birthDateValue.getTime())) return null;

  let age = today.getFullYear() - birthDateValue.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDateValue.getMonth() ||
    (today.getMonth() === birthDateValue.getMonth() &&
      today.getDate() < birthDateValue.getDate());

  if (hasNotHadBirthdayThisYear) age -= 1;

  return age;
}

function getCareerSummary(
  studentProfile: StudentProfileResponse | null,
  t: TFunction,
) {
  const careers = studentProfile?.careers ?? [];
  const firstCareer = careers[0];
  if (!firstCareer) return t('matching.careerMissing');

  const [startYear, startMonth] = firstCareer.startMonth.split('-').map(Number);
  const [endYear, endMonth] = firstCareer.endMonth.split('-').map(Number);
  const durationMonths =
    Number.isFinite(startYear) &&
    Number.isFinite(startMonth) &&
    Number.isFinite(endYear) &&
    Number.isFinite(endMonth)
      ? Math.max(1, (endYear - startYear) * 12 + endMonth - startMonth + 1)
      : null;
  const durationLabel = durationMonths
    ? t('matching.careerDuration', { count: durationMonths })
    : '';
  const additionalCareerLabel =
    careers.length > 1
      ? t('matching.careerAdditional', { count: careers.length - 1 })
      : '';

  return t('matching.careerSummary', {
    name: firstCareer.careerName,
    duration: durationLabel,
    additional: additionalCareerLabel,
  });
}

function InformationCard({ description, image, title }: InformationCardProps) {
  return (
    <article className="relative flex h-[clamp(72px,9.8dvh,83px)] items-center rounded-[20px] border-[0.7px] border-[#B3B8B9]">
      <img
        alt=""
        className="ml-[23px] h-[clamp(44px,6.2dvh,52px)] w-[clamp(45px,6.3dvh,53px)] shrink-0 object-cover"
        src={image}
      />
      <div className="ml-[20px] min-w-0">
        <h3 className="m-0 text-[15px] leading-[1.5] font-bold">{title}</h3>
        <p className="mt-[2px] mb-0 text-[13px] leading-[1.5] text-[#8B95A1]">
          {description}
        </p>
      </div>
    </article>
  );
}

/** Final local review step before sending a student application. */
export function ApplicationConfirmationStep({
  isSubmitting = false,
  job,
  studentProfile = null,
  onBack,
  onConfirm,
}: ApplicationConfirmationStepProps) {
  const { t } = useTranslation();
  const [today] = useState(() => new Date());
  const profileValues = studentProfile
    ? mapStudentProfileResponseToValues(studentProfile)
    : undefined;
  const age = studentProfile ? getAge(studentProfile.birthDate, today) : null;
  const profileSummary = [
    profileValues?.basic?.[2],
    age === null ? undefined : t('matching.age', { age }),
    profileValues?.residence?.[0],
    profileValues?.language?.[0],
    profileValues?.academic?.[2],
  ]
    .filter((value): value is string => Boolean(value))
    .join(' | ');

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label={t('matching.backToStartDate')}
        className="absolute top-[clamp(44px,8.2dvh,69px)] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="absolute top-[clamp(79px,13.3dvh,112px)] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        {t('matching.confirmationTitle')}
      </h1>

      <section className="absolute top-[clamp(126px,20.6dvh,174px)] right-6 left-6 h-[clamp(108px,15.6dvh,132px)] rounded-[20px] border-[0.7px] border-[#B0B8C1] text-left">
        <h2 className="absolute top-[20px] left-[23px] m-0 text-left text-[20px] leading-[1.5] font-semibold">
          {studentProfile?.name ?? t('matching.nameMissing')}
        </h2>
        <p className="absolute top-[52px] left-[23px] m-0 text-left text-[15px] leading-[1.5] text-[#8B95A1]">
          {profileSummary || t('matching.profileUnavailable')}
        </p>
        <p className="absolute top-[79px] left-[23px] m-0 text-left text-[15px] leading-[1.5] text-[#8B95A1]">
          {job.companyName}
        </p>
      </section>

      <section className="absolute top-[clamp(246px,38dvh,321px)] right-6 left-6">
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
          {t('matching.sharedInformation')}
        </h2>
        <div className="mt-[clamp(10px,1.9dvh,16px)] space-y-[clamp(7px,1.2dvh,10px)]">
          <InformationCard
            description={t('matching.basicProfileDescription')}
            image={profileImage}
            title={t('matching.basicProfile')}
          />
          <InformationCard
            description={getCareerSummary(studentProfile, t)}
            image={experienceImage}
            title={t('matching.career')}
          />
          <InformationCard
            description={t('matching.jobConditionsDescription')}
            image={checklistImage}
            title={t('matching.jobConditions')}
          />
        </div>
      </section>

      <div className="absolute top-[clamp(557px,78.8dvh,665px)] right-6 left-6 text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        <p className="m-0">
          {t('matching.responseNotice')}
        </p>
        <p className="mt-[2px] mb-0">
          {t('matching.noResponseNotice')}{' '}
          <span className="font-medium text-[#006E59]">
            {t('matching.autoEndNotice')}
          </span>
        </p>
      </div>

      <button
        aria-busy={isSubmitting}
        className="absolute right-6 bottom-[clamp(22px,4.4dvh,37px)] left-6 h-[clamp(52px,6.8dvh,57px)] rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
        disabled={isSubmitting}
        type="button"
        onClick={onConfirm}
      >
        {t('matching.agreeAndApply')}
      </button>
    </main>
  );
}
