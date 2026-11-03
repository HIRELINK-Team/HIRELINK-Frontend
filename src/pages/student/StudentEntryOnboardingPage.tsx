import { useState } from 'react';

import entryIllustration from '../../assets/images/student/entry/entry-illustration.png';
import googleIcon from '../../assets/images/student/entry/google.png';
import hirelinkWordmark from '../../assets/images/student/entry/hirelink-wordmark.svg';
import kakaoIcon from '../../assets/images/student/entry/kakao.png';
import { EmployerEntryNotice } from '../../components/student/onboarding/EmployerEntryNotice';

type StudentEntryOnboardingPageProps = {
  onEmailLogin?: () => void;
  onStart?: () => void;
};

/** Renders pre-profile student entry choices. */
export default function StudentEntryOnboardingPage({
  onEmailLogin,
  onStart,
}: StudentEntryOnboardingPageProps) {
  const [isEmployerNoticeOpen, setIsEmployerNoticeOpen] = useState(false);

  const handleStart = () => {
    onStart?.();
  };

  const handleEmailLogin = () => {
    onEmailLogin?.();
  };

  const handleEmployerNoticeOpen = () => {
    setIsEmployerNoticeOpen(true);
  };

  const handleEmployerNoticeClose = () => {
    setIsEmployerNoticeOpen(false);
  };

  return (
    <main className="relative mx-auto flex h-[min(844px,100dvh)] w-[390px] max-w-none flex-col overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="absolute top-[min(0px,calc(100dvh-820px))] left-0 h-[844px] w-[390px] max-w-none object-cover object-bottom"
        src={entryIllustration}
      />

      <img
        alt="HIRELINK"
        className="absolute top-[clamp(40px,calc(100dvh-649px),171px)] left-1/2 z-10 h-[28px] w-[212px] -translate-x-1/2"
        src={hirelinkWordmark}
      />

      <section className="relative z-10 mt-auto h-[274px] rounded-t-[30px] bg-[#F5F5F5] px-6 pt-[18px] pb-[calc(11px+env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
        <button
          className="mx-auto block border-0 bg-transparent p-0 text-[15px] leading-normal underline"
          type="button"
          onClick={handleEmployerNoticeOpen}
        >
          사장님이신가요?
        </button>

        <div className="mt-[18px] space-y-[14px]">
          <button
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleStart}
          >
            <img
              alt=""
              className="absolute top-[19.3px] left-[calc(50%-68.7px)] size-[19px]"
              src={googleIcon}
            />
            <span className="absolute top-[15.3px] left-[calc(50%+14.8px)] -translate-x-1/2 whitespace-nowrap">
              구글로 계속하기
            </span>
          </button>
          <button
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleStart}
          >
            <img
              alt=""
              className="absolute top-[18.3px] left-[calc(50%-77.7px)] size-[21px]"
              src={kakaoIcon}
            />
            <span className="absolute top-[15.3px] left-[calc(50%+16.8px)] -translate-x-1/2 whitespace-nowrap">
              카카오로 계속하기
            </span>
          </button>
          <button
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B0B8C1] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium"
            type="button"
            onClick={handleEmailLogin}
          >
            <span className="absolute top-[15.3px] left-[calc(50%-0.7px)] -translate-x-1/2 whitespace-nowrap">
              이메일 로그인·회원가입
            </span>
          </button>
        </div>
      </section>

      {isEmployerNoticeOpen ? (
        <EmployerEntryNotice onClose={handleEmployerNoticeClose} />
      ) : null}
    </main>
  );
}
