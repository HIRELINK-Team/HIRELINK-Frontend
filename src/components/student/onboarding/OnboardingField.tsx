import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';

import errorIcon from '../../../assets/icons/student/documents/alien-registration/review-error.svg';

type OnboardingFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'onChange'
> & {
  errorMessage?: string;
  label: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  status?: 'success';
  spacing?: 'first' | 'next';
  trailing?: ReactNode;
};

export function OnboardingField({
  errorMessage,
  label,
  onChange,
  status,
  spacing,
  trailing,
  ...inputProps
}: OnboardingFieldProps) {
  const hasError = Boolean(errorMessage);
  const borderColor = hasError
    ? 'border-[#E05260]'
    : status === 'success'
      ? 'border-[#00B894]'
      : 'border-[#B0B8C1] focus-within:border-[#00B894]';

  return (
    <label
      className={`block ${spacing === 'first' ? 'mt-[35px]' : spacing === 'next' ? 'mt-[19px]' : 'mt-[27px]'}`}
    >
      <span className="block text-[17px] leading-[1.5] text-[#191F28]">
        {label}
      </span>
      <span
        className={`flex min-h-[57px] items-center gap-3 border-b ${borderColor}`}
      >
        <input
          {...inputProps}
          aria-invalid={hasError}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[26px] leading-[1.5] font-semibold text-[#191F28] outline-none placeholder:text-[#B0B8C1]"
          onChange={onChange}
        />
        {trailing}
      </span>
      {errorMessage ? (
        <span className="mt-[10px] flex items-center gap-[7px] text-[15px] leading-[1.5] text-[#E05260]">
          <img alt="" className="size-[11px] shrink-0" src={errorIcon} />
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}
