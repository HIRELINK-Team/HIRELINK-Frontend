import type { ReactNode } from 'react'

type SelectionCardProps = {
  children: ReactNode
  description: string
  isSelected: boolean
  onClick: () => void
}

export function SelectionCard({ children, description, isSelected, onClick }: SelectionCardProps) {
  const selectionStyle = isSelected
    ? 'border-[1.5px] border-[#00B894] bg-[#E5F8F3] px-[22.5px] pt-[19.5px]'
    : 'border-[0.7px] border-[#B3B8B9] px-[23.3px] pt-[20.3px]'

  return (
    <button
      aria-pressed={isSelected}
      className={`flex h-[89px] w-[341px] flex-col gap-[1.5px] rounded-[20px] bg-transparent text-left text-[#1D1F20] ${selectionStyle}`}
      type="button"
      onClick={onClick}
    >
      <strong
        className={`text-[17px] leading-[1.5] font-semibold ${
          isSelected ? 'text-[#009376]' : ''
        }`}
      >
        {children}
      </strong>
      <span className="text-[13px] leading-[1.5] text-[#909597]">{description}</span>
    </button>
  )
}
