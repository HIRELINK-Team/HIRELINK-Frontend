import type { CSSProperties, KeyboardEvent, ReactNode } from 'react';

import backIcon from '../../../assets/icons/student/back.svg';

type OnboardingScaffoldProps = {
  activeSubStep: number;
  children: ReactNode;
  ctaLabel: string;
  contentClassName?: string;
  currentStage: number;
  footer?: ReactNode;
  isCtaDisabled?: boolean;
  onBack: () => void;
  onCtaClick: () => void;
  onEnter?: () => void;
  question: string;
  questionClassName?: string;
  showProgress?: boolean;
  stageLabelLayout?: 'inline' | 'stacked';
  stageLabel: string;
  totalSubSteps: number;
};

export function OnboardingScaffold({
  activeSubStep,
  children,
  ctaLabel,
  contentClassName = 'mt-10',
  currentStage,
  footer,
  isCtaDisabled = false,
  onBack,
  onCtaClick,
  onEnter,
  question,
  questionClassName,
  showProgress = true,
  stageLabelLayout = 'stacked',
  stageLabel,
  totalSubSteps,
}: OnboardingScaffoldProps) {
  const progressStyle: CSSProperties = {
    gridTemplateColumns: `repeat(${totalSubSteps}, minmax(0, 1fr))`,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      !onEnter ||
      event.key !== 'Enter' ||
      isCtaDisabled ||
      !(
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLSelectElement
      )
    ) {
      return;
    }

    event.preventDefault();
    onEnter();
  };

  return (
    <main
      aria-labelledby="onboarding-question"
      className="relative mx-auto flex h-[min(844px,100dvh)] w-[390px] max-w-none flex-col overflow-hidden bg-[#F5F5F5] px-6 pt-[65px] pb-[calc(37px+env(safe-area-inset-bottom))] font-['Pretendard','Apple_SD_Gothic_Neo','Noto_Sans_KR',sans-serif] tracking-[-0.02em] text-[#191F28]"
      onKeyDown={handleKeyDown}
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
        <p
          className={`${
            stageLabelLayout === 'stacked'
              ? 'block text-[15px] leading-[1.5] text-[#8B95A1]'
              : 'flex items-baseline gap-1 text-[15px] leading-[1.5] text-[#8B95A1]'
          }`}
        >
          <strong className="text-[17px] leading-[1.5] font-bold text-[#00B894]">
            {currentStage}/5
          </strong>
          {stageLabelLayout === 'stacked' ? (
            <span className="block">{stageLabel}</span>
          ) : (
            stageLabel
          )}
        </p>
        {showProgress ? (
          <div
            aria-hidden="true"
            className={`${stageLabelLayout === 'stacked' ? 'mt-[11px]' : 'mt-[35px]'} grid gap-[5px]`}
            style={progressStyle}
          >
            {Array.from({ length: totalSubSteps }, (_, index) => (
              <span
                className={`h-0.5 ${index < activeSubStep ? 'bg-[#00B894]' : 'bg-[#B0B8C1]'}`}
                key={index}
              />
            ))}
          </div>
        ) : null}
      </header>

      <section className={contentClassName}>
        <h1
          className={`m-0 whitespace-pre-line text-[26px] leading-[1.5] font-semibold ${questionClassName ?? ''}`}
          id="onboarding-question"
        >
          {question}
        </h1>
        {children}
      </section>

      <div className="mt-auto shrink-0 pt-8">
        {footer ?? (
          <button
            className="h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376] disabled:bg-[#B0B8C1] disabled:active:bg-[#B0B8C1]"
            disabled={isCtaDisabled}
            type="button"
            onClick={onCtaClick}
          >
            {ctaLabel}
          </button>
        )}
      </div>
    </main>
  );
}
