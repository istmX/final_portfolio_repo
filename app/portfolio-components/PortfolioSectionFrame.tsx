import type { ElementType, ReactNode } from 'react'
import DoubleBorderCard from './DoubleBorderCard'

export type PortfolioSectionFrameProps = {
  children: ReactNode
  className?: string
  innerClassName?: string
  ariaLabelledby?: string
  as?: ElementType
}

export default function PortfolioSectionFrame({
  children,
  className,
  innerClassName,
  ariaLabelledby,
  as = 'section',
}: PortfolioSectionFrameProps) {
  return (
    <DoubleBorderCard
      as={as}
      aria-labelledby={ariaLabelledby}
      className={className}
      innerClassName={innerClassName ?? 'p-4 sm:p-5'}
    >
      {children}
    </DoubleBorderCard>
  )
}
