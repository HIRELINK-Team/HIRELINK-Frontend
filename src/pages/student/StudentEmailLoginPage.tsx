import { useState } from 'react';

import backIcon from '../../assets/icons/student/entry-email-back.svg';
import googleIcon from '../../assets/images/student/entry/google.png';
import hirelinkLogoIcon from '../../assets/images/student/entry/hirelink-logo-mint.svg';
import kakaoIcon from '../../assets/images/student/entry/kakao.png';

type SocialProvider = 'google' | 'kakao';

type StudentEmailLoginPageProps = {
  onBack: () => void;
  onLogin: () => void;
  onSignup: () => void;
  onSocialLogin: (provider: SocialProvider) => void;
};

/** Renders the student email-login view used from entry onboarding. */
export default function StudentEmailLoginPage({
  onBack,
  onLogin,
  onSignup,
  onSocialLogin,
}: StudentEmailLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin();
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
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

      <div className="absolute inset-0 translate-y-[min(0px,calc(100dvh-776px))]">
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
              autoComplete="current-password"
              className="h-full w-full rounded-[15px] border-0 bg-[#E5E8EB] px-[25px] text-[20px] leading-[1.5] outline-none placeholder:text-[#8B95A1]"
              placeholder="비밀번호 입력"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          <button
            className="absolute top-[457px] right-[25px] left-[25px] h-16 rounded-[35px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5]"
            type="submit"
          >
            로그인
          </button>
        </form>

        <div
          aria-hidden="true"
          className="absolute top-[559px] right-[25px] left-[25px] h-5"
        >
          <div className="absolute top-[9px] left-0 h-px w-[41.47%] bg-[#8B95A1]" />
          <span className="absolute left-1/2 -translate-x-1/2 text-[15px] leading-normal text-[#8B95A1]">
            또는
          </span>
          <div className="absolute top-[9px] right-0 h-px w-2/5 bg-[#8B95A1]" />
        </div>

        <button
          aria-label="Google로 계속하기"
          className="absolute top-[600px] left-[calc(50%-73px)] size-[43px] rounded-full border-0 bg-[#E5E8EB] p-0"
          type="button"
          onClick={() => onSocialLogin('google')}
        >
          <img
            alt=""
            className="absolute top-3 left-3 size-[19px]"
            src={googleIcon}
          />
        </button>
        <button
          aria-label="카카오로 계속하기"
          className="absolute top-[600px] left-[calc(50%+29px)] size-[43px] rounded-full border-0 bg-[#E5E8EB] p-0"
          type="button"
          onClick={() => onSocialLogin('kakao')}
        >
          <img
            alt=""
            className="absolute top-3 left-[11px] size-[21px]"
            src={kakaoIcon}
          />
        </button>

        <button
          className="absolute top-[675px] right-[25px] left-[25px] h-16 rounded-[15px] border border-[#191F28] bg-transparent text-[20px] leading-normal"
          type="button"
          onClick={onSignup}
        >
          회원가입
        </button>
      </div>
    </main>
  );
}
