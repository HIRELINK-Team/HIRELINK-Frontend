import type { ReactNode } from 'react'

type SelectionCardProps = {
  children: ReactNode
  description: string
  isSelected: boolean
  onClick: () => void
}

export function SelectionCard({ children, description, isSelected, onClick }: SelectionCardProps) {
  const selectionStyle = isSelected
    ? 'border-[1.5px] border-[#00B894] px-[28.5px] py-[17.5px]'
    : 'border-[0.7px] border-[#B0B8C1] px-[29px] py-[18px]'

  return (
    <button
      aria-pressed={isSelected}
      className={`flex min-h-[89px] w-full flex-col rounded-[20px] bg-transparent text-left text-[#191F28] ${selectionStyle}`}
      type="button"
      onClick={onClick}
    >
      <strong className="text-[17px] leading-[1.5] font-bold">{children}</strong>
      <span className="text-[15px] leading-[1.5] text-[#8B95A1]">{description}</span>
    </button>
  )
}
