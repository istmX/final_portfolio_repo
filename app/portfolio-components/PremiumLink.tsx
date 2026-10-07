import Link from 'next/link'
import type { ReactNode } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'

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
    <Link
      href={href}
      className={`group border-border/50 from-border/80 via-surface to-border/45 shadow-foreground/10 hover:border-border/90 hover:shadow-foreground/15 focus-visible:outline-foreground inline-flex rounded-[11px] border bg-gradient-to-br p-[2px] shadow-sm transition duration-200 hover:-translate-y-px hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-3 ${className}`}
    >
      <span className="border-border/70 from-surface/90 to-surface/60 text-muted group-hover:border-foreground/45 group-hover:from-surface group-hover:to-surface/75 group-hover:text-foreground inline-flex items-center gap-2 rounded-[8px] border bg-gradient-to-b px-2.5 py-1.5 text-[11px] leading-4 font-medium transition-colors">
        {children}
        <IconArrowUpRight
          size={14}
          stroke={1.7}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </span>
    </Link>
  )
}
