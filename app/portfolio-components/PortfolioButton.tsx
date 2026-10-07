'use client'

import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { IconArrowUpRight } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

type PortfolioButtonProps = {
  children: ReactNode
  className?: string
  icon?: ReactNode
  variant?: 'editorial' | 'code'
  href?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
  ariaExpanded?: boolean
  ariaLabel?: string
}

export default function PortfolioButton({
  children,
  className,
  icon,
  variant = 'editorial',
  href,
  onClick,
  type = 'button',
  ariaExpanded,
  ariaLabel,
}: PortfolioButtonProps) {
  const reduceMotion = useReducedMotion()
  const content = (
    <>
      <span>{children}</span>
      {icon ??
        (variant === 'editorial' ? (
          <IconArrowUpRight size={14} stroke={1.7} aria-hidden="true" />
        ) : null)}
    </>
  )

  if (href) {
    return (
      <motion.div
        initial="rest"
        whileHover="active"
        whileFocus="active"
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn('group relative isolate inline-flex', className)}
      >
        <motion.span
          aria-hidden="true"
          variants={{
            rest: { opacity: 0, scale: 0.96 },
            active: { opacity: 1, scale: reduceMotion ? 1 : 1.02 },
          }}
          className="pointer-events-none absolute -inset-1 z-0 rounded-[14px] bg-[var(--button-glow)] blur-md"
        />
        <Link
          href={href}
          className="group/link border-border/55 from-border/80 via-surface to-border/45 shadow-foreground/10 focus-visible:ring-offset-background hover:border-border/90 focus-visible:ring-foreground/40 relative z-10 inline-flex rounded-[11px] border bg-gradient-to-br p-[2px] shadow-sm transition-[border-color,box-shadow] duration-200 hover:shadow-[0_5px_16px_rgb(0_0_0_/_0.18)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <span className="border-border/70 from-surface/90 to-surface/60 text-muted group-hover/link:from-surface group-hover/link:to-surface/75 group-hover/link:text-foreground group-hover/link:border-border inline-flex items-center gap-2 rounded-[8px] border bg-gradient-to-b px-2.5 py-1.5 text-[11px] leading-4 font-medium transition-[border-color,color] duration-200">
            {content}
          </span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-label={ariaLabel}
      initial="rest"
      whileHover="active"
      whileFocus="active"
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: reduceMotion ? 0 : 0.16 }}
      className={cn(
        'group focus-visible:ring-foreground/45 relative isolate inline-flex cursor-pointer items-center justify-center transition-[border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] focus-visible:outline-none',
        variant === 'code'
          ? 'border-border bg-surface/60 text-foreground hover:border-foreground/45 hover:bg-surface rounded-sm border px-3 py-1.5 font-mono text-[11px] shadow-[0_0_0_1px_rgb(163_163_163_/_0.12),0_4px_14px_rgb(0_0_0_/_0.3)] hover:shadow-[0_0_0_1px_rgb(163_163_163_/_0.2),0_5px_18px_rgb(0_0_0_/_0.36)]'
          : 'border-border/55 from-border/80 via-surface to-border/45 text-foreground hover:border-border/90 rounded-[11px] border bg-gradient-to-br p-[2px] shadow-sm hover:shadow-[0_5px_16px_rgb(0_0_0_/_0.18)]',
        className,
      )}
    >
      {variant === 'editorial' ? (
        <>
          <motion.span
            aria-hidden="true"
            variants={{
              rest: { opacity: 0, scale: 0.96 },
              active: { opacity: 1, scale: reduceMotion ? 1 : 1.01 },
            }}
            className="pointer-events-none absolute -inset-1 z-0 rounded-[14px] bg-[var(--button-glow)] blur-md"
          />
          <span className="border-border/70 from-surface/90 to-surface/60 text-muted group-hover:from-surface group-hover:to-surface/75 group-hover:text-foreground group-hover:border-border relative z-10 inline-flex items-center gap-2 rounded-[8px] border bg-gradient-to-b px-2.5 py-1.5 text-[11px] leading-4 font-medium transition-[border-color,color] duration-200">
            {content}
          </span>
        </>
      ) : (
        content
      )}
    </motion.button>
  )
}
