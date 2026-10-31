import { useState } from 'react';

import entryIllustration from '../../assets/images/student/entry/entry-illustration.png';
import googleIcon from '../../assets/images/student/entry/google.png';
import hirelinkLogoIcon from '../../assets/images/student/entry/hirelink-logo.svg';
import kakaoIcon from '../../assets/images/student/entry/kakao.png';
import { EmployerEntryNotice } from '../../components/student/onboarding/EmployerEntryNotice';

type StudentEntryOnboardingPageProps = {
  onStart?: () => void;
};

/** Renders pre-profile student entry choices. */
export default function StudentEntryOnboardingPage({
  onStart,
}: StudentEntryOnboardingPageProps) {
  const [isEmployerNoticeOpen, setIsEmployerNoticeOpen] = useState(false);

  const handleStart = () => {
    onStart?.();
  };

  const handleEmployerNoticeOpen = () => {
    setIsEmployerNoticeOpen(true);
  };

  const handleEmployerNoticeClose = () => {
    setIsEmployerNoticeOpen(false);
  };

  return (
    <main className="relative mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-bottom"
        src={entryIllustration}
      />

      <div className="relative z-10 mt-[171px] flex items-center justify-center gap-2 text-[#F5F5F5]">
        <img
          alt=""
          className="h-[35.67px] w-[37.44px]"
          src={hirelinkLogoIcon}
        />
        <span className="text-[39.76px] leading-none font-black italic tracking-[-0.04em]">
          HIRELINK
        </span>
      </div>

      <section className="relative z-10 mt-auto rounded-t-[30px] bg-[#F5F5F5] px-6 pt-6 pb-[calc(23px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
        <button
          className="mx-auto block border-0 bg-transparent p-0 text-[15px] leading-normal underline"
          type="button"
          onClick={handleEmployerNoticeOpen}
        >
          사장님 이신가요?
        </button>

        <div className="mt-[23px] space-y-[14px]">
          <button
            className="flex h-[57px] w-full items-center justify-center gap-[13px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleStart}
          >
            <img alt="" className="size-[19px]" src={googleIcon} />
            구글로 계속하기
          </button>
          <button
            className="flex h-[57px] w-full items-center justify-center gap-[13px] rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleStart}
          >
            <img alt="" className="size-[21px]" src={kakaoIcon} />
            카카오로 계속하기
          </button>
          <button
            className="h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleStart}
          >
            이메일 로그인·회원가입
          </button>
        </div>
      </section>
      {isEmployerNoticeOpen ? (
        <EmployerEntryNotice onClose={handleEmployerNoticeClose} />
      ) : null}
    </main>
  );
}
