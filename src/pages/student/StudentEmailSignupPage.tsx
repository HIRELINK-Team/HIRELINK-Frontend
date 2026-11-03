import { useState } from 'react';

import backIcon from '../../assets/icons/student/entry-email-back.svg';
import hirelinkLogoIcon from '../../assets/images/student/entry/hirelink-logo-mint.svg';

type StudentEmailSignupPageProps = {
  onBack: () => void;
  onSignup: () => void;
};

/** Renders the student email sign-up view used from entry onboarding. */
export default function StudentEmailSignupPage({
  onBack,
  onSignup,
}: StudentEmailSignupPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const isPasswordMatch =
    password.length > 0 && password === passwordConfirmation;
  const isSignupReady =
    email.length > 0 && password.length > 0 && isPasswordMatch;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isSignupReady) return;

    onSignup();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirmation(event.target.value);
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPhoneNumber(event.target.value);
  };

  return (
    <main className="relative mx-auto h-[min(844px,100dvh)] w-[390px] max-w-none overflow-hidden bg-[#F5F5F5] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]">
      <button
        aria-label="뒤로가기"
        className="absolute top-[61px] left-[18px] z-10 size-8 border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img
          alt=""
          className="absolute top-[6.667px] left-[6.667px] h-[18.667px] w-[10.667px]"
          src={backIcon}
        />
      </button>

      <div className="absolute inset-0 translate-y-[min(0px,calc(100dvh-844px))]">
        <div className="absolute top-[189px] left-[calc(50%-99px)] h-[31.137px] w-[32.688px]">
          <img
            alt=""
            className="h-[31.137px] w-[32.688px]"
            src={hirelinkLogoIcon}
          />
        </div>
        <span className="absolute top-[192.43px] left-[calc(50%-59px)] whitespace-nowrap text-[29.733px] leading-none font-black italic tracking-[-0.04em] text-[#00B894]">
          HIRELINK
        </span>

        <form onSubmit={handleSubmit}>
          <label className="absolute top-[299px] right-[25px] left-[25px] block h-16">
            <span className="sr-only">이메일 아이디</span>
            <input
              autoComplete="email"
              className="h-full w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[20px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              placeholder="이메일 아이디 입력"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </label>

          <label className="absolute top-[372px] right-[25px] left-[25px] block h-16">
            <span className="sr-only">비밀번호</span>
            <input
              autoComplete="new-password"
              className="h-full w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[20px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              placeholder="비밀번호 입력"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>

          <label className="absolute top-[445px] right-[25px] left-[25px] block h-16">
            <span className="sr-only">비밀번호 확인</span>
            <input
              autoComplete="new-password"
              className="h-full w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[20px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              placeholder="비밀번호 확인"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
            />
          </label>

          <p className="absolute top-[539px] left-[25px] text-[13px] leading-[1.5] text-[#8B95A1]">
            전화번호를 입력하면 문자로 채용알림이 가요!
          </p>

          <label className="absolute top-[566px] right-[25px] left-[25px] block h-16">
            <span className="sr-only">선택 전화번호</span>
            <input
              autoComplete="tel"
              className="h-full w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[20px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              placeholder="(선택) 전화번호 입력"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
            />
          </label>

          <button
            aria-disabled={!isSignupReady}
            className="absolute top-[718px] right-[25px] left-[25px] h-16 rounded-[35px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
            type="submit"
          >
            가입하기
          </button>
        </form>
      </div>
    </main>
  );
}
