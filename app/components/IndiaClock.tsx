'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import ShimmerText from './ShimmerText'

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

  useEffect(() => {
    setTime(getIndiaTime())
    const interval = window.setInterval(() => setTime(getIndiaTime()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <span
      aria-label={`India local time ${time.hours}:${time.minutes}:${time.seconds} IST`}
      className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-muted sm:text-xs"
    >
      <span>{time.hours}:{time.minutes}:</span>
      <motion.span
        key={time.seconds}
        initial={{ opacity: 0.72, y: 0.5 }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.14, ease: 'easeOut' }}
        className="inline-block min-w-[1.25em]"
      >
        <ShimmerText>{time.seconds}</ShimmerText>
      </motion.span>
      <span className="font-sans text-[10px] tracking-wide">IST</span>
    </span>
  )
}
