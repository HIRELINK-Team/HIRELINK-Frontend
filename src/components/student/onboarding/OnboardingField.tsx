import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react'

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
  const borderColor = hasError
    ? 'border-[#E05260]'
    : 'border-[#B0B8C1] focus-within:border-[#00B894]'

  return (
    <label className="mt-[27px] block">
      <span className="block text-[17px] leading-[1.5] text-[#191F28]">{label}</span>
      <span className={`flex min-h-[57px] items-center gap-3 border-b ${borderColor}`}>
        <input
          {...inputProps}
          aria-invalid={hasError}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[26px] leading-[1.5] font-semibold text-[#191F28] outline-none placeholder:text-[#B0B8C1]"
          onChange={onChange}
        />
        {trailing}
      </span>
      {errorMessage ? (
        <span className="relative mt-2 block pl-5 text-[15px] leading-[1.5] text-[#E05260] before:absolute before:top-px before:left-0 before:text-[14px] before:font-bold before:content-['×']">
          {errorMessage}
        </span>
      ) : null}
    </label>
  )
}
