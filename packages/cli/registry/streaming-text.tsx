'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export type StreamingTextEffect = 'fade' | 'blur' | 'slide' | 'wave'

export type StreamingTextProps = {
  /** The string to stream, as if the model is still writing it. */
  text: string
  /** Characters revealed per second. Defaults to 34. */
  speed?: number
  /** Delay in milliseconds before streaming starts. Defaults to 0. */
  startDelay?: number
  /** How each new character enters. Defaults to blur. */
  effect?: StreamingTextEffect
  /** Time in seconds for a single character to settle. Defaults to 0.34. */
  glyphDuration?: number
  /** Blur radius used by the blur effect. Defaults to 6. */
  blurAmount?: number
  /** Rise distance used by the slide, blur, and wave effects. Defaults to 6. */
  slideDistance?: number
  /** Show the blinking caret while streaming. Defaults to true. */
  cursor?: boolean
  /** Keep the caret blinking after the string finishes. Defaults to false. */
  cursorAfterComplete?: boolean
  /** Restart the stream after the string finishes. Defaults to false. */
  loop?: boolean
  /** Pause in milliseconds between loop cycles. Defaults to 1200. */
  loopDelay?: number
  /** Called once the full string has been revealed. */
  onComplete?: () => void
  className?: string
  textClassName?: string
  cursorClassName?: string
}

const WHITESPACE = /^\s$/u

function splitGlyphs(value: string): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    return Array.from(segmenter.segment(value), (part) => part.segment)
  }

  return Array.from(value)
}

type GlyphGroup = {
  start: number
  space: boolean
  glyphs: string[]
}

function groupGlyphs(glyphs: string[]): GlyphGroup[] {
  const groups: GlyphGroup[] = []

  glyphs.forEach((glyph, index) => {
    const space = WHITESPACE.test(glyph)
    const last = groups[groups.length - 1]

    if (last && last.space === space) {
      last.glyphs.push(glyph)
      return
    }

    groups.push({ start: index, space, glyphs: [glyph] })
  })

  return groups
}

function glyphStates(
  effect: StreamingTextEffect,
  blurAmount: number,
  slideDistance: number,
) {
  switch (effect) {
    case 'fade':
      return { initial: { opacity: 0 }, animate: { opacity: 1 } }
    case 'slide':
      return {
        initial: { opacity: 0, y: slideDistance },
        animate: { opacity: 1, y: 0 },
      }
    case 'wave':
      return {
        initial: { opacity: 0, y: slideDistance, scale: 0.94 },
        animate: { opacity: 1, y: 0, scale: 1 },
      }
    case 'blur':
    default:
      return {
        initial: {
          opacity: 0,
          y: slideDistance * 0.5,
          filter: `blur(${blurAmount}px)`,
        },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      }
  }
}

export function StreamingText({
  text,
  speed = 34,
  startDelay = 0,
  effect = 'blur',
  glyphDuration = 0.34,
  blurAmount = 6,
  slideDistance = 6,
  cursor = true,
  cursorAfterComplete = false,
  loop = false,
  loopDelay = 1200,
  onComplete,
  className,
  textClassName,
  cursorClassName,
}: StreamingTextProps) {
  const shouldReduceMotion = useReducedMotion()
  const glyphs = useMemo(() => splitGlyphs(text), [text])
  const [revealed, setRevealed] = useState(0)
  const [cycle, setCycle] = useState(0)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    let frame = 0
    let timeout = 0

    const cancel = () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }

    if (shouldReduceMotion) {
      queueMicrotask(() => {
        setRevealed(glyphs.length)
      })
      return cancel
    }

    queueMicrotask(() => {
      setRevealed(0)
    })

    let startedAt: number | null = null
    const perGlyph = 1000 / Math.max(1, speed)
    const delay = Math.max(0, startDelay)
    const pause = Math.max(0, loopDelay)

    const step = (now: number) => {
      if (startedAt === null) startedAt = now

      const elapsed = now - startedAt - delay

      if (elapsed < 0) {
        frame = window.requestAnimationFrame(step)
        return
      }

      const count = Math.min(glyphs.length, Math.floor(elapsed / perGlyph) + 1)
      setRevealed(count)

      if (count < glyphs.length) {
        frame = window.requestAnimationFrame(step)
        return
      }

      onCompleteRef.current?.()

      if (loop) {
        timeout = window.setTimeout(() => {
          setCycle((value) => value + 1)
        }, pause)
      }
    }

    frame = window.requestAnimationFrame(step)

    return cancel
  }, [cycle, glyphs, loop, loopDelay, shouldReduceMotion, speed, startDelay])

  const visibleGlyphs = useMemo(
    () => glyphs.slice(0, Math.max(0, revealed)),
    [glyphs, revealed],
  )
  const groups = useMemo(() => groupGlyphs(visibleGlyphs), [visibleGlyphs])
  const streaming = revealed < glyphs.length
  const showCursor = cursor && (streaming || cursorAfterComplete)
  const states = glyphStates(effect, blurAmount, slideDistance)

  const content: ReactNode[] = groups.map((group) => {
    if (group.space) {
      return (
        <span key={`space-${group.start}`} className="whitespace-pre">
          {group.glyphs.join('')}
        </span>
      )
    }

    return (
      <span
        key={`word-${group.start}`}
        className="inline-block whitespace-nowrap"
      >
        {group.glyphs.map((glyph, offset) => {
          const index = group.start + offset

          return (
            <motion.span
              key={index}
              initial={shouldReduceMotion ? false : states.initial}
              animate={states.animate}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : effect === 'wave'
                    ? { type: 'spring', stiffness: 360, damping: 24, mass: 0.6 }
                    : {
                        duration: Math.max(0.05, glyphDuration),
                        ease: 'easeOut',
                      }
              }
              className="inline-block"
            >
              {glyph}
            </motion.span>
          )
        })}
      </span>
    )
  })

  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-state={streaming ? 'streaming' : 'complete'}
      className={cn('relative inline', className)}
    >
      <span
        aria-hidden="true"
        className={cn('whitespace-pre-wrap', textClassName)}
      >
        {content}
        {showCursor ? (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 1 }}
            animate={
              shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 0.15, 1] }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 1, ease: 'easeInOut', repeat: Infinity }
            }
            className={cn(
              'bg-foreground ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.1em] rounded-full align-middle',
              cursorClassName,
            )}
          />
        ) : null}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  )
}

export default StreamingText
