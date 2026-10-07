'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export default function ShimmerText({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.span
      animate={
        reduceMotion
          ? { backgroundPosition: '100% 0' }
          : { backgroundPosition: ['100% 0', '-120% 0'] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              backgroundPosition: {
                duration: isHovered ? 0.7 : 2.6,
                ease: 'easeInOut',
                repeat: Infinity,
              },
            }
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'bg-[linear-gradient(100deg,var(--muted)_35%,var(--foreground)_50%,var(--muted)_65%)] bg-[length:220%_100%] bg-clip-text text-transparent',
        reduceMotion && 'text-foreground bg-none',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
