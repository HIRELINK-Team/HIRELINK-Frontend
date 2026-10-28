type IndustryChipProps = {
  isSelected: boolean;
  label: string;
  onClick: () => void;
};

export function IndustryChip({
  isSelected,
  label,
  onClick,
}: IndustryChipProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={`rounded-[50px] px-5 py-2.5 text-[15px] leading-[1.5] whitespace-nowrap ${
        isSelected
          ? 'bg-[#00B894] font-bold text-[#F5F5F5]'
          : 'bg-[#E5E8EB] font-normal text-[#191F28]'
      }`}
      type="button"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
