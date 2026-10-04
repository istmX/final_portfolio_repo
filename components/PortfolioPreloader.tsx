'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import CatSprite from './CatSprite'

const FULL_DURATION = 1850
const START_KEY = 'istmx-preloader-started-at'
const FINISHED_KEY = 'istmx-preloader-finished'
const listeners = new Set<() => void>()
let fallbackVisible = true
let checkedReload = false

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

function getVisibilitySnapshot() {
  if (typeof window === 'undefined') return true

  try {
    if (!checkedReload) {
      checkedReload = true
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
      if (navigation?.type === 'reload') {
        sessionStorage.removeItem(START_KEY)
        sessionStorage.removeItem(FINISHED_KEY)
      }
    }

    if (sessionStorage.getItem(FINISHED_KEY) === '1') return false
    const startedAt = Number(sessionStorage.getItem(START_KEY))
    return !startedAt || Date.now() - startedAt < FULL_DURATION
  } catch {
    return fallbackVisible
  }
}

function getServerVisibilitySnapshot() {
  return true
}

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
  const visible = useSyncExternalStore(subscribe, getVisibilitySnapshot, getServerVisibilitySnapshot)

  useEffect(() => {
    if (!visible) return

    let startedAt = Date.now()
    try {
      const savedStart = Number(sessionStorage.getItem(START_KEY))
      if (savedStart) startedAt = savedStart
      else sessionStorage.setItem(START_KEY, String(startedAt))

      if (sessionStorage.getItem(FINISHED_KEY) === '1') return
    } catch {
      // The in-memory fallback still handles environments that block storage.
    }

    const duration = prefersReducedMotion ? 350 : FULL_DURATION
    const remaining = Math.max(0, duration - (Date.now() - startedAt))
    const finish = () => {
      fallbackVisible = false
      try {
        sessionStorage.setItem(FINISHED_KEY, '1')
      } catch {
        // The in-memory fallback is enough until the page is unloaded.
      }
      notifyListeners()
    }

    if (remaining === 0) {
      finish()
      return
    }

    const timeout = window.setTimeout(finish, remaining)
    return () => window.clearTimeout(timeout)
  }, [visible, prefersReducedMotion])

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
