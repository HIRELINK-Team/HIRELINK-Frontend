import type { ReactNode } from 'react'

import backIcon from '../../../assets/icons/student/back.svg'

import './OnboardingScaffold.css'

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
  return (
    <main className="student-onboarding" aria-labelledby="onboarding-question">
      <button
        aria-label="이전 단계로 이동"
        className="student-onboarding__back-button"
        type="button"
        onClick={onBack}
      >
        <img alt="" src={backIcon} />
      </button>

      <header className="student-onboarding__header">
        <p className="student-onboarding__step">
          <strong>{currentStage}/5</strong>
          {stageLabel}
        </p>
        <div aria-hidden="true" className="student-onboarding__progress">
          {Array.from({ length: totalSubSteps }, (_, index) => (
            <span
              className={
                index < activeSubStep
                  ? 'student-onboarding__progress-bar student-onboarding__progress-bar--active'
                  : 'student-onboarding__progress-bar'
              }
              key={index}
            />
          ))}
        </div>
      </header>

      <section className="student-onboarding__content">
        <h1 id="onboarding-question">{question}</h1>
        {children}
      </section>

      <div className="student-onboarding__cta-wrap">
        <button
          className="student-onboarding__cta"
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
