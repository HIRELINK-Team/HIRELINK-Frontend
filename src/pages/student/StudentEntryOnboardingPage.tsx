import { useState } from 'react';

import googleIcon from '../../assets/images/student/entry/google.png';
import kakaoIcon from '../../assets/images/student/entry/kakao.png';
import socialLoginIllustration from '../../assets/images/student/entry/social-login-illustration.png';
import socialLoginSymbol from '../../assets/images/student/entry/social-login-symbol.png';
import socialLoginWordmark from '../../assets/images/student/entry/social-login-wordmark.png';
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
    <main className="relative mx-auto h-[844px] w-[390px] max-w-none overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <img
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full max-w-none object-bottom"
        src={socialLoginIllustration}
      />

      <img
        alt="HIRELINK"
        className="pointer-events-none absolute top-[165px] left-[92px] z-10 h-[42px] w-[42px]"
        src={socialLoginSymbol}
      />
      <img
        alt=""
        className="pointer-events-none absolute top-[159px] left-[134px] z-10 h-[55px] w-[163px]"
        src={socialLoginWordmark}
      />

      <section className="absolute top-[546px] left-0 z-10 h-[298px] w-[390px] rounded-t-[30px] bg-[#F5F5F5] shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">
        <button
          className="absolute top-6 left-1/2 -translate-x-1/2 border-0 bg-transparent p-0 text-[15px] leading-normal underline"
          type="button"
          onClick={handleEmployerNoticeOpen}
        >
          사장님이신가요?
        </button>

        <div className="absolute top-16 right-6 left-6 space-y-[14px]">
          <button
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
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
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
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
            className="relative h-[57px] w-full rounded-[15px] border-[0.7px] border-[#B3B8B9] bg-[#F5F5F5] text-[17px] leading-[1.5] font-medium text-black"
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
