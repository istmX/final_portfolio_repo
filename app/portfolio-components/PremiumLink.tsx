import type { ReactNode } from 'react'
import PortfolioButton from './PortfolioButton'

export default function PremiumLink({
  href,
  children,
  className = '',
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return (
    <PortfolioButton href={href} className={className}>
      {children}
    </PortfolioButton>
  )
}
