import { useState } from 'react';

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
  workStartDate: string;
  onBack: () => void;
  onConfirm: () => void;
};

type InformationCardProps = {
  description: string;
  image: string;
  title: string;
};

function formatWorkStartDate(date: string) {
  return date.replaceAll('-', '.');
}

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

function InformationCard({ description, image, title }: InformationCardProps) {
  return (
    <article className="relative flex h-[clamp(72px,9.8dvh,83px)] items-center rounded-[20px] border border-[#D9D9D9]">
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
  workStartDate,
  onBack,
  onConfirm,
}: ApplicationConfirmationStepProps) {
  const [today] = useState(() => new Date());
  const profileValues = studentProfile
    ? mapStudentProfileResponseToValues(studentProfile)
    : undefined;
  const age = studentProfile ? getAge(studentProfile.birthDate, today) : null;
  const profileSummary = [
    profileValues?.basic?.[2],
    age === null ? undefined : `${age}세`,
    profileValues?.residence?.[0],
    profileValues?.language?.[0],
    profileValues?.academic?.[2],
  ]
    .filter((value): value is string => Boolean(value))
    .join(' | ');

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-full max-w-[390px] overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="근무 시작일 선택으로 돌아가기"
        className="absolute top-[clamp(44px,8.2dvh,69px)] left-[26px] flex h-[19px] w-[11px] items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <h1 className="absolute top-[clamp(79px,13.3dvh,112px)] left-6 m-0 text-[26px] leading-[1.5] font-semibold">
        지원 전 꼭 확인해주세요!
      </h1>

      <section className="absolute top-[clamp(126px,20.6dvh,174px)] right-6 left-6 h-[clamp(108px,15.6dvh,132px)] rounded-[20px] border-[0.7px] border-[#B0B8C1] text-left">
        <h2 className="absolute top-[20px] left-[23px] m-0 text-left text-[20px] leading-[1.5] font-semibold">
          {studentProfile?.name ?? '이름 미등록'}
        </h2>
        <p className="absolute top-[52px] left-[23px] m-0 text-left text-[15px] leading-[1.5] text-[#8B95A1]">
          {profileSummary || '프로필 정보를 불러오지 못했어요.'}
        </p>
        <p className="absolute top-[79px] left-[23px] m-0 text-left text-[15px] leading-[1.5] text-[#8B95A1]">
          {job.companyName} | {formatWorkStartDate(workStartDate)}부터
        </p>
      </section>

      <section className="absolute top-[clamp(246px,38dvh,321px)] right-6 left-6">
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">
          사업주에게 전달되는 정보
        </h2>
        <div className="mt-[clamp(10px,1.9dvh,16px)] space-y-[clamp(7px,1.2dvh,10px)]">
          <InformationCard
            description="국적, 지역 한국어 수준이에요."
            image={profileImage}
            title="기본 프로필"
          />
          <InformationCard
            description="카페 8개월 외 1건이에요."
            image={experienceImage}
            title="경력"
          />
          <InformationCard
            description="시간, 급여, 직종 내용이에요."
            image={checklistImage}
            title="구직조건"
          />
        </div>
      </section>

      <div className="absolute top-[clamp(557px,78.8dvh,665px)] right-6 left-6 text-center text-[13px] leading-[1.5] text-[#8B95A1]">
        <p className="m-0">
          지원 후 사업주는 24시간 안에 채용 진행 여부를 결정해야 해요.
        </p>
        <p className="mt-[2px] mb-0">
          사업주가 응답하지 않으면{' '}
          <span className="font-medium text-[#006E59]">
            24시간 후 지원이 자동 종료 돼요.
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
        동의하고 지원할래요
      </button>
    </main>
  );
}
