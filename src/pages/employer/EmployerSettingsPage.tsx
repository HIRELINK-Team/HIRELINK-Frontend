import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import ToggleSwitch from "../../components/common/ToggleSwitch";
import { useAuth } from "../../hooks/useAuth";

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-5 text-[#70737c]"
      fill="none"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-[#70737c]">{title}</h2>
      <div className="overflow-hidden rounded-xl border border-[#e1e2e4] bg-white">
        {children}
      </div>
    </section>
  );
}

function StaticRow({
  label,
  value,
  muted = false,
}: {
  label: string;
  value?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-[#f2f3f5] px-6 last:border-b-0">
      <span
        className={`text-[15px] font-medium ${muted ? "text-[#8b95a1]" : "text-[#171719]"}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-[#70737c]">{value}</span>}
        <ChevronIcon />
      </div>
    </div>
  );
}

function EmployerSettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState({
    newApplicants: true,
    offerAccepted: false,
    visaExpiry: false,
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
      navigate("/employer/login", { replace: true });
    } catch {
      return;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px] pt-[45px] pb-16">
      <h1 className="text-4xl leading-[43px] font-semibold tracking-[-0.8px] text-black">
        설정
      </h1>

      <div className="mt-8 space-y-8">
        <SettingsSection title="계정">
          <Link
            to="/employer/settings/account"
            className="flex h-14 items-center justify-between border-b border-[#f2f3f5] px-6 text-[15px] font-medium text-[#171719] transition-colors hover:bg-[#fafafa]"
          >
            <span>계정 정보 관리</span>
            <ChevronIcon />
          </Link>
          <StaticRow label="비밀번호 변경" />
        </SettingsSection>

        <SettingsSection title="알림">
          {[
            ["newApplicants", "신규 지원자 알림"],
            ["offerAccepted", "채용 제안 수락 관련 알림"],
            ["visaExpiry", "비자 자격 만료 알림"],
          ].map(([key, label]) => (
            <div
              key={key}
              className="flex h-14 items-center justify-between border-b border-[#f2f3f5] px-6 last:border-b-0"
            >
              <span className="text-[15px] font-medium text-[#171719]">
                {label}
              </span>
              <ToggleSwitch
                checked={
                  notificationSettings[key as keyof typeof notificationSettings]
                }
                onChange={(checked) =>
                  setNotificationSettings((current) => ({
                    ...current,
                    [key]: checked,
                  }))
                }
                ariaLabel={`${label} ${
                  notificationSettings[key as keyof typeof notificationSettings]
                    ? "끄기"
                    : "켜기"
                }`}
              />
            </div>
          ))}
        </SettingsSection>

        <SettingsSection title="서비스">
          <StaticRow label="언어" value="한국어" />
        </SettingsSection>

        <SettingsSection title="고객지원">
          <StaticRow label="자주 묻는 질문" />
          <StaticRow label="개발자에게 문의하기" />
          <StaticRow label="오류 신고" />
        </SettingsSection>

        <SettingsSection title="계정 관리">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => void handleLogout()}
            className="flex h-14 w-full cursor-pointer items-center justify-between border-b border-[#f2f3f5] px-6 text-left transition-colors hover:bg-[#fafafa] disabled:cursor-wait"
          >
            <span className="text-[15px] font-medium text-[#171719]">
              {isLoggingOut ? "로그아웃 중" : "로그아웃"}
            </span>
            <ChevronIcon />
          </button>
          <StaticRow label="회원 탈퇴" muted />
        </SettingsSection>
      </div>
    </div>
  );
}

export default EmployerSettingsPage;
