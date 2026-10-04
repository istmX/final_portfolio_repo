'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ShimmerText from './ShimmerText'

const ROLES = [
  'an AI Engineer',
  'a Full-Stack Developer',
  'a Student',
  'a Mobile Developer',
]

export default function AnimatedRole() {
  const [roleIndex, setRoleIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const interval = window.setInterval(() => {
      setRoleIndex((current) => (current + 1) % ROLES.length)
    }, 2600)

    return () => window.clearInterval(interval)
  }, [shouldReduceMotion])

  return (
    <span className="relative inline-flex min-h-5 items-center overflow-hidden align-top text-sm sm:text-base">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROLES[roleIndex]}
          initial={{ opacity: 0, y: 5, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -5, filter: 'blur(5px)' }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="whitespace-nowrap font-medium"
        >
          <ShimmerText>{ROLES[roleIndex]}</ShimmerText>
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
