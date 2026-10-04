'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import ShimmerText from './ShimmerText'

const FULL_DURATION = 1850

function Eyes({ reducedMotion }: { reducedMotion: boolean }) {
  const glance = reducedMotion
    ? { x: 0, y: 0 }
    : {
        x: [0, -3, -3, 3, 3, 0, 0, 0],
        y: [0, 0, 0, 0, 0, -2, 0, 0],
      }

  return (
    <svg aria-hidden="true" viewBox="0 0 72 28" className="h-7 w-[72px] overflow-visible">
      <motion.g
        animate={glance}
        transition={reducedMotion ? { duration: 0 } : { duration: 1.5, times: [0, 0.14, 0.3, 0.48, 0.64, 0.76, 0.87, 1], ease: 'easeInOut' }}
      >
        <motion.g
          style={{ originY: '50%' }}
          animate={reducedMotion ? { scaleY: 1 } : { scaleY: [1, 1, 1, 1, 0.08, 1, 1] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 1.5, times: [0, 0.7, 0.76, 0.81, 0.84, 0.88, 1], ease: 'easeInOut' }}
        >
          <ellipse cx="22" cy="14" rx="7" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="22" cy="14" r="2.2" fill="currentColor" />
        </motion.g>
        <motion.g
          style={{ originY: '50%' }}
          animate={reducedMotion ? { scaleY: 1 } : { scaleY: [1, 1, 1, 1, 0.08, 1, 1] }}
          transition={reducedMotion ? { duration: 0 } : { duration: 1.5, times: [0, 0.7, 0.76, 0.81, 0.84, 0.88, 1], ease: 'easeInOut' }}
        >
          <ellipse cx="50" cy="14" rx="7" ry="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="50" cy="14" r="2.2" fill="currentColor" />
        </motion.g>
      </motion.g>
    </svg>
  )
}

export default function PortfolioPreloader() {
  const prefersReducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setVisible(false),
      prefersReducedMotion ? 350 : FULL_DURATION,
    )
    return () => window.clearTimeout(timeout)
  }, [prefersReducedMotion])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label="wait a minute babe"
          className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-background text-foreground"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.28, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center gap-4 px-5">
            <motion.div
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 3 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.32, ease: 'easeOut' }}
            >
              <Eyes reducedMotion={Boolean(prefersReducedMotion)} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : 0.16, ease: 'easeOut' }}
              className="font-display text-sm tracking-wide sm:text-base"
            >
              <ShimmerText>wait a minute babe</ShimmerText>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
