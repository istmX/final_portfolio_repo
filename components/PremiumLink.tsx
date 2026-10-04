import Link from 'next/link'
import type { ReactNode } from 'react'

export default function PremiumLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex rounded-[11px] border border-border/50 bg-gradient-to-br from-border/80 via-surface to-border/45 p-[2px] shadow-sm shadow-foreground/10 transition duration-200 hover:-translate-y-px hover:border-border/90 hover:shadow-md hover:shadow-foreground/15 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground ${className}`}
    >
      <span className="inline-flex items-center gap-2 rounded-[8px] border border-border/70 bg-gradient-to-b from-surface/90 to-surface/60 px-2.5 py-1.5 text-[11px] font-medium leading-4 text-muted transition-colors group-hover:border-foreground/45 group-hover:from-surface group-hover:to-surface/75 group-hover:text-foreground">
        {children}<span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </span>
    </Link>
  )
}
