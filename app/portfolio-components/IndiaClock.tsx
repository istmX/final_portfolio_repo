'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

type ClockParts = {
  hours: string
  minutes: string
  seconds: string
}

const EMPTY_CLOCK: ClockParts = { hours: '--', minutes: '--', seconds: '--' }

function getIndiaTime(): ClockParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  return {
    hours: parts.find((part) => part.type === 'hour')?.value ?? '--',
    minutes: parts.find((part) => part.type === 'minute')?.value ?? '--',
    seconds: parts.find((part) => part.type === 'second')?.value ?? '--',
  }
}

export default function IndiaClock() {
  const [time, setTime] = useState(EMPTY_CLOCK)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setTime(getIndiaTime())
    const interval = window.setInterval(() => setTime(getIndiaTime()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span
      aria-label={`India local time ${time.hours}:${time.minutes}:${time.seconds} IST`}
      className="text-muted inline-flex items-center gap-1 font-mono text-[11px] tabular-nums sm:text-xs"
    >
      <span>
        {time.hours}:{time.minutes}:
      </span>
      <span className="relative inline-block h-[1.2em] w-[1.35em] align-middle [perspective:100px]">
        <AnimatePresence initial={false} mode="sync">
          <motion.span
            key={time.seconds}
            initial={{
              rotateX: shouldReduceMotion ? 0 : -90,
              opacity: shouldReduceMotion ? 0 : 1,
            }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{
              rotateX: shouldReduceMotion ? 0 : 90,
              opacity: shouldReduceMotion ? 0 : 1,
            }}
            transition={{
              duration: shouldReduceMotion ? 0.12 : 0.45,
              ease: [0.22, 0.68, 0, 1],
            }}
            style={{ transformOrigin: '50% 50%', backfaceVisibility: 'hidden' }}
            className="absolute inset-0 inline-flex items-center justify-center leading-none"
          >
            {time.seconds}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="font-sans text-[10px] tracking-wide">IST</span>
    </span>
  )
}
