type OnboardingBottomSheetOption<T extends string> = {
  label: string;
  value: T;
};

type OnboardingBottomSheetProps<T extends string> = {
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (value: T) => void;
  options: OnboardingBottomSheetOption<T>[];
  selectedValue: T;
  title: string;
};

export function OnboardingBottomSheet<T extends string>({
  onClose,
  onConfirm,
  onSelect,
  options,
  selectedValue,
  title,
}: OnboardingBottomSheetProps<T>) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-black/50">
      <button
        aria-label={`${title} 닫기`}
        className="flex-1 cursor-default border-0 bg-transparent p-0"
        type="button"
        onClick={onClose}
      />
      <section
        aria-label={title}
        className="h-[407px] rounded-t-[20px] bg-[#F5F5F5] px-6 pt-[34px]"
      >
        <h2 className="m-0 text-[20px] leading-[1.5] font-semibold">{title}</h2>
        <div className="mt-[18px] max-h-[205px] space-y-0.5 overflow-y-auto px-0.5 py-1">
          {options.map((option) => {
            const isSelected = option.value === selectedValue;

            return (
              <button
                aria-pressed={isSelected}
                className={`flex h-[33px] w-full items-center justify-center rounded-[5px] text-[20px] leading-[1.5] ${
                  isSelected
                    ? 'bg-[#E5E8EB] font-medium text-[#191F28]'
                    : 'font-normal text-[#8B95A1]'
                }`}
                key={option.value}
                type="button"
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <button
          className="mt-[26px] h-[57px] w-full rounded-[15px] border-0 bg-[#00B894] text-[20px] leading-[1.5] font-medium text-[#F5F5F5] active:bg-[#009376]"
          type="button"
          onClick={onConfirm}
        >
          확인
        </button>
      </section>
    </div>
  );
}
