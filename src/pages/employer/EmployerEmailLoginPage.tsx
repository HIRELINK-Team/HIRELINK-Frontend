import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmployerAuthLayout from "../../components/employer/EmployerAuthLayout";
import { isMockEmployerAccountValid } from "../../data/employerAuthMock";

interface LoginLocationState {
  email?: string;
}

const INPUT_CLASS_NAME =
  "h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10";

function EmployerEmailLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const [email, setEmail] = useState(locationState?.email ?? "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isMockEmployerAccountValid({ email, password })) {
      setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
      return;
    }

    navigate("/employer/onboarding");
  };

  return (
    <EmployerAuthLayout
      title="이메일 로그인"
      description="사업주 계정으로 인재를 만나보세요"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="mb-1.5 block text-base leading-6 font-semibold text-[#171719]">
            이메일 아이디
          </span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage(null);
            }}
            placeholder="이메일을 입력해주세요"
            className={INPUT_CLASS_NAME}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-base leading-6 font-semibold text-[#171719]">
            비밀번호
          </span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setErrorMessage(null);
            }}
            placeholder="비밀번호를 입력해주세요"
            className={INPUT_CLASS_NAME}
          />
        </label>

        {errorMessage && (
          <p role="alert" className="text-sm font-medium text-[#e11e1e]">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={!email || !password}
          className="h-[52px] w-full cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
        >
          로그인
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#70737c]">
        계정이 없으신가요?{" "}
        <Link
          to="/employer/signup"
          className="font-semibold text-[#007a63] underline underline-offset-2"
        >
          회원가입하기
        </Link>
      </p>
    </EmployerAuthLayout>
  );
}

export default EmployerEmailLoginPage;
