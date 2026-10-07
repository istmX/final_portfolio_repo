'use client'

import { useId } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export type PillTabOption<T extends string = string> =
  | T
  | {
      value: T
      label?: ReactNode
      ariaLabel?: string
    }

export interface PillTabsProps<T extends string = string> {
  options: readonly (T | { value: T; label?: ReactNode; ariaLabel?: string })[]
  value: T
  onChange: (value: T) => void
  layoutId?: string
  ariaLabel?: string
  className?: string
  buttonClassName?: string
  pillClassName?: string
}

export function PillTabs<T extends string>({
  options,
  value,
  onChange,
  layoutId,
  ariaLabel,
  className,
  buttonClassName,
  pillClassName,
}: PillTabsProps<T>) {
  const generatedId = useId()
  const reduceMotion = useReducedMotion()
  const activeLayoutId = layoutId ?? `pill-tab-${generatedId}`

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'border-border/70 bg-surface/20 relative inline-flex rounded-lg border p-1',
        className,
      )}
    >
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value
        const optionLabel =
          typeof option === 'string' ? option : (option.label ?? option.value)
        const optionAriaLabel =
          typeof option === 'object' ? option.ariaLabel : undefined
        const isSelected = value === optionValue

        return (
          <button
            key={optionValue}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={optionAriaLabel}
            onClick={() => onChange(optionValue)}
            className={cn(
              'focus-visible:outline-foreground relative z-10 min-w-20 cursor-pointer rounded-md px-3 py-1.5 text-xs capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
              isSelected
                ? 'text-foreground'
                : 'text-muted hover:text-foreground',
              buttonClassName,
            )}
          >
            {isSelected ? (
              <motion.span
                layoutId={activeLayoutId}
                className={cn(
                  'bg-surface border-border/60 absolute inset-0 -z-10 rounded-md border',
                  pillClassName,
                )}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 440, damping: 34 }
                }
              />
            ) : null}
            {optionLabel}
          </button>
        )
      })}
    </div>
  )
}

export default PillTabs
