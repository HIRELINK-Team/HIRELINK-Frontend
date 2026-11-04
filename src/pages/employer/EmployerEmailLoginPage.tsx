import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EmployerAuthLayout from '../../components/employer/EmployerAuthLayout';
import { getApiErrorResponse, getApiErrorStatus } from '../../api/errors';
import { useAuth } from '../../hooks/useAuth';
import { useEmployerProfile } from '../../hooks/useEmployerProfile';

interface LoginLocationState {
  email?: string;
}

const INPUT_CLASS_NAME =
  'h-[58px] w-full rounded-[10px] border border-[rgba(112,115,124,0.22)] bg-white px-4 text-base text-[#171719] outline-none transition-colors placeholder:text-[#8b95a1] hover:border-[#aeb4bc] focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/10';

function EmployerEmailLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LoginLocationState | null;
  const { login, isAuthInitializing } = useAuth();
  const { loadProfile } = useEmployerProfile();
  const [email, setEmail] = useState(locationState?.email ?? '');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await login({ email: email.trim(), password });

      if (response.role === 'EMPLOYER') {
        try {
          await loadProfile();
          navigate('/employer/dashboard', { replace: true });
        } catch (profileError: unknown) {
          const status = getApiErrorStatus(profileError);
          const apiError = getApiErrorResponse(profileError);

          if (status === 404) {
            navigate('/employer/onboarding', { replace: true });
          } else if (status === 401) {
            setErrorMessage(
              '로그인 정보를 확인하지 못했습니다. 다시 로그인해주세요.',
            );
          } else if (status === 403) {
            setErrorMessage('사업주 계정으로 접근할 수 없습니다.');
          } else if (status && status >= 500) {
            setErrorMessage(
              '사업주 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
            );
          } else {
            setErrorMessage(
              apiError?.message ??
                '사업주 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
            );
          }
        }
        return;
      }

      navigate('/', { replace: true });
    } catch (error: unknown) {
      const status = getApiErrorStatus(error);
      const apiError = getApiErrorResponse(error);

      if (status === 400) {
        setErrorMessage('이메일과 비밀번호 입력 형식을 확인해주세요.');
      } else if (status === 401) {
        setErrorMessage('이메일 또는 비밀번호를 확인해주세요.');
      } else if (status === 403) {
        setErrorMessage('로그인이 제한된 계정입니다.');
      } else if (status && status >= 500) {
        setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setErrorMessage(
          apiError?.message ??
            '로그인 요청을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={!email || !password || isSubmitting || isAuthInitializing}
          className="h-[52px] w-full cursor-pointer rounded-xl bg-[#00b894] text-base font-semibold text-white transition-colors hover:bg-[#00a886] disabled:cursor-not-allowed disabled:bg-[#e1e2e4] disabled:text-[#8b95a1]"
        >
          {isSubmitting ? '로그인 중' : '로그인'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#70737c]">
        계정이 없으신가요?{' '}
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
