'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

export default function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={
        prefersReducedMotion
          ? false
          : { opacity: 0, y: 22, filter: 'blur(8px)' }
      }
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.65,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
