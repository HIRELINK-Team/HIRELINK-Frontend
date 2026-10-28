import type { CSSProperties, ReactNode } from 'react'

import backIcon from '../../../assets/icons/student/back.svg'

type OnboardingScaffoldProps = {
  activeSubStep: number
  children: ReactNode
  ctaLabel: string
  currentStage: number
  isCtaDisabled?: boolean
  onBack: () => void
  onCtaClick: () => void
  question: string
  stageLabel: string
  totalSubSteps: number
}

export function OnboardingScaffold({
  activeSubStep,
  children,
  ctaLabel,
  currentStage,
  isCtaDisabled = false,
  onBack,
  onCtaClick,
  question,
  stageLabel,
  totalSubSteps,
}: OnboardingScaffoldProps) {
  const progressStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${totalSubSteps}, minmax(0, 1fr))`,
  }

  return (
    <main
      aria-labelledby="onboarding-question"
      className="relative mx-auto flex min-h-[100svh] w-full max-w-[430px] flex-col bg-[#F5F5F5] px-6 pt-[65px] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
    >
      <button
        aria-label="이전 단계로 이동"
        className="absolute top-[65px] left-5 flex size-6 items-center justify-center border-0 bg-transparent p-0"
        type="button"
        onClick={onBack}
      >
        <img alt="" className="h-4 w-2" src={backIcon} />
      </button>

      <header className="mt-[37px]">
        <p className="flex items-baseline gap-1 text-[15px] leading-[1.5] text-[#8B95A1]">
          <strong className="text-[17px] leading-[1.5] font-bold text-[#00B894]">{currentStage}/5</strong>
          {stageLabel}
        </p>
        <div aria-hidden="true" className="mt-[35px] grid gap-[5px]" style={progressStyle}>
          {Array.from({ length: totalSubSteps }, (_, index) => (
            <span
              className={`h-0.5 ${index < activeSubStep ? 'bg-[#00B894]' : 'bg-[#B0B8C1]'}`}
              key={index}
            />
          ))}
        </div>
      </header>

      <section className="mt-10">
        <h1 className="m-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold" id="onboarding-question">
          {question}
        </h1>
        {children}
      </section>

      <div className="mt-auto pt-8">
        <button
          className="h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376] disabled:bg-[#B0B8C1] disabled:active:bg-[#B0B8C1]"
          disabled={isCtaDisabled}
          type="button"
          onClick={onCtaClick}
        >
          {ctaLabel}
        </button>
      </div>
    </main>
  )
}
