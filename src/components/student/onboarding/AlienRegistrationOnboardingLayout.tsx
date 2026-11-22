import type { ReactNode } from 'react';

type AlienRegistrationOnboardingLayoutProps = {
  children: ReactNode;
  variant?: 'light' | 'camera';
};

export function AlienRegistrationOnboardingLayout({
  children,
  variant = 'light',
}: AlienRegistrationOnboardingLayoutProps) {
  const isCamera = variant === 'camera';

  return (
    <main
      className={`h-dvh w-full overflow-hidden ${
        isCamera ? 'bg-[#3F3F3F]' : 'bg-[#F5F5F5]'
      }`}
    >
      <div
        className={`mx-auto flex h-full w-full max-w-[430px] flex-col px-5 pt-[7.2dvh] min-[375px]:px-6 min-[420px]:px-7 ${
          isCamera
            ? 'pb-[10.8dvh] [@media(max-height:700px)]:pb-[4dvh]'
            : 'pb-[4.4dvh]'
        } font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] ${
          isCamera ? '' : 'text-[#1D1F20]'
        }`}
      >
        {children}
      </div>
    </main>
  );
}
