import type { ReactNode } from 'react'

export default function ShimmerText({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={`text-shimmer ${className}`}>{children}</span>
}
