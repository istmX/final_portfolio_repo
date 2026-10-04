'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import CatSprite from './CatSprite'

const FULL_DURATION = 1850

function SittingCat({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className="relative z-10 -mb-2 size-16 sm:-mb-3 sm:size-[4.5rem]"
      initial={false}
      animate={reducedMotion ? undefined : { y: [0, -1, 0], rotate: [0, 0.35, 0] }}
      transition={reducedMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <CatSprite anim="sit" animated={!reducedMotion} />
    </motion.div>
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
          id="portfolio-preloader"
          className="fixed inset-0 z-[100] flex min-h-dvh items-center justify-center bg-background text-foreground"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -5 }}
          transition={{ duration: prefersReducedMotion ? 0.2 : 0.28, ease: 'easeOut' }}
        >
          <div className="flex flex-col items-center px-5">
            <SittingCat reducedMotion={Boolean(prefersReducedMotion)} />
            <motion.p
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 4 }}
              animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: [0, 1, 0.88, 1], y: [4, 0, -1, 0], scale: [0.97, 1, 1.012, 1] }}
              transition={{ duration: prefersReducedMotion ? 0.2 : 0.4, delay: prefersReducedMotion ? 0 : 0.16, ease: 'easeOut' }}
              className="font-display text-3xl font-semibold tracking-tight min-[400px]:text-4xl sm:text-5xl"
            >
              <span>wait a minute babe</span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
