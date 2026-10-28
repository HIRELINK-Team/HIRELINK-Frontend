import type { ReactNode } from 'react'

import './SelectionCard.css'

type SelectionCardProps = {
  children: ReactNode
  description: string
  isSelected: boolean
  onClick: () => void
}

export function SelectionCard({ children, description, isSelected, onClick }: SelectionCardProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={isSelected ? 'selection-card selection-card--selected' : 'selection-card'}
      type="button"
      onClick={onClick}
    >
      <strong>{children}</strong>
      <span>{description}</span>
    </button>
  )
}
