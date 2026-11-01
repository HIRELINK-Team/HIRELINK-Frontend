import { Link } from "react-router-dom";
import googleLoginIcon from "../../assets/employer/google-login.png";
import kakaoLoginIcon from "../../assets/employer/kakao-login.png";
import hirelinkBigLogo from "../../assets/hirelink-biglogo.svg";
import hirelinkTextLogo from "../../assets/hirelink-text.svg";

const LOGIN_OPTIONS = [
  {
    label: "카카오톡으로 계속하기",
    icon: kakaoLoginIcon,
    className: "border-black/8 bg-[#fee500]",
  },
  {
    label: "구글로 계속하기",
    icon: googleLoginIcon,
    className: "border-[#70737c38] bg-white",
  },
] as const;

function EmployerLoginPage() {
  return (
    <main className="relative flex min-h-screen min-w-0 flex-col items-center overflow-hidden bg-white px-6 pt-[clamp(7.5rem,25.5vh,13.25rem)] text-[#171719]">
      <img
        src={hirelinkBigLogo}
        alt=""
        className="h-[156px] w-[164px] shrink-0 object-contain"
      />
      <img
        src={hirelinkTextLogo}
        alt="HIRELINK"
        className="mt-[22px] h-[51px] w-[285px] shrink-0 object-contain"
      />

      <p className="mt-[7px] text-center text-base leading-6 text-[#6d7683]">
        사업주 계정으로 인재를 만나보세요
      </p>

      <div className="mt-8 flex w-full max-w-[480px] flex-col gap-3">
        {LOGIN_OPTIONS.map((option) => (
          <Link
            key={option.label}
            to="/employer/onboarding"
            className={`flex h-[52px] items-center justify-center gap-2 rounded-xl border text-base font-semibold shadow-[0_1px_1px_rgba(23,23,23,0.1)] transition-[filter] hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00b894] ${option.className}`}
          >
            <img
              src={option.icon}
              alt=""
              className="h-7 w-7 shrink-0 object-contain"
            />
            <span>{option.label}</span>
          </Link>
        ))}
      </div>

      <div className="absolute bottom-[68px] text-center text-sm font-medium leading-5 text-[#868686]">
        <p>외국인 구직자이신가요?</p>
        <p className="underline underline-offset-2">구직자페이지 바로가기</p>
      </div>
    </main>
  );
}

export default EmployerLoginPage;
