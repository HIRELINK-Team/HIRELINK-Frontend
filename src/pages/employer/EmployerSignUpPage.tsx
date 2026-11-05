import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployerAuthLayout from '../../components/employer/EmployerAuthLayout';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useAuth } from '../../hooks/useAuth';

const INPUT_CLASS_NAME =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10';

function EmployerSignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signup({
        email: email.trim(),
        password,
        role: 'EMPLOYER',
      });
      navigate('/employer/onboarding', { replace: true });
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const apiError = getApiErrorResponse(error);

      if (status === 400) {
        setErrorMessage(
          apiError?.message ?? '이메일과 비밀번호 입력 형식을 확인해주세요.',
        );
      } else if (status === 409) {
        setErrorMessage(apiError?.message ?? '이미 가입된 이메일입니다.');
      } else if (status && status >= 500) {
        setErrorMessage(
          apiError?.message ??
            '회원가입 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        );
      } else {
        setErrorMessage(
          apiError?.message ??
            '회원가입 요청을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EmployerAuthLayout
      title="회원가입"
      description="HIRELINK 사업주 계정을 만들어보세요"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="block">
          <span className="mb-1.5 block text-base leading-6 font-semibold text-[#171719]">
            이메일
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
            autoComplete="new-password"
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
          disabled={!email.trim() || !password || isSubmitting}
          className="h-[52px] w-full cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
        >
          {isSubmitting ? '회원가입 중' : '회원가입하기'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#70737c]">
        이미 계정이 있으신가요?{' '}
        <Link
          to="/employer/login"
          className="font-semibold text-[#007a63] underline underline-offset-2"
        >
          로그인하기
        </Link>
      </p>
    </EmployerAuthLayout>
  );
}

export default EmployerSignUpPage;
