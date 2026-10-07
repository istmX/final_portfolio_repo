import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type DoubleBorderCardProps<T extends ElementType = 'div'> = {
  children: ReactNode
  className?: string
  innerClassName?: string
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

export function DoubleBorderCard<T extends ElementType = 'div'>({
  children,
  className,
  innerClassName,
  as,
  ...props
}: DoubleBorderCardProps<T>) {
  const Component = as ?? 'div'

  return (
    <Component
      className={cn(
        'border-border/50 bg-surface/15 relative rounded-2xl border p-1 transition-colors sm:p-1.5',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'border-border/40 bg-background/70 relative overflow-hidden rounded-xl border',
          innerClassName,
        )}
      >
        {children}
      </div>
    </Component>
  )
}

export default DoubleBorderCard
