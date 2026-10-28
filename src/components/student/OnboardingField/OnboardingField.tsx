import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'

import './OnboardingField.css'

type OnboardingFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'onChange'> & {
  errorMessage?: string
  label: string
  onChange: ChangeEventHandler<HTMLInputElement>
  trailing?: ReactNode
}

export function OnboardingField({
  errorMessage,
  label,
  onChange,
  trailing,
  ...inputProps
}: OnboardingFieldProps) {
  const hasError = Boolean(errorMessage)

  return (
    <label className={hasError ? 'onboarding-field onboarding-field--error' : 'onboarding-field'}>
      <span className="onboarding-field__label">{label}</span>
      <span className="onboarding-field__control">
        <input {...inputProps} aria-invalid={hasError} onChange={onChange} />
        {trailing}
      </span>
      {errorMessage ? <span className="onboarding-field__error">{errorMessage}</span> : null}
    </label>
  )
}
