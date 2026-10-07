'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const DEFAULT_ITEMS = [
  'an AI Engineer',
  'a Full-Stack Developer',
  'a Student',
  'a Mobile Developer',
]

const DIRECTIONS = {
  up: { enter: 5, exit: -5 },
  down: { enter: -5, exit: 5 },
  left: { enter: 7, exit: -7 },
  right: { enter: -7, exit: 7 },
  none: { enter: 0, exit: 0 },
} as const

export type AnimatedTextEffect = 'blur' | 'shimmer' | 'fade' | 'slide' | 'wave'
export type AnimatedTextDirection = keyof typeof DIRECTIONS
export type AnimatedTextEffectOptions = {
  blur?: { amount?: number }
  fade?: { from?: number }
  slide?: { distance?: number }
  shimmer?: {
    duration?: number
    width?: number
    color?: string
    highlight?: string
  }
  wave?: { amplitude?: number; stagger?: number }
}

export type AnimatedTextProps = {
  items?: string[]
  prefix?: string
  effect?: AnimatedTextEffect
  effects?: AnimatedTextEffect[]
  effectOptions?: AnimatedTextEffectOptions
  scale?: number
  direction?: AnimatedTextDirection
  interval?: number
  speed?: number
  className?: string
  textClassName?: string
}

export function AnimatedText({
  items = DEFAULT_ITEMS,
  prefix,
  effect = 'blur',
  effects = [effect],
  effectOptions,
  scale,
  direction = 'up',
  interval = 2600,
  speed = 0.32,
  className,
  textClassName,
}: AnimatedTextProps) {
  const [itemIndex, setItemIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const values = items.length > 0 ? items : ['']
  const currentItem = values[itemIndex % values.length]
  const offset = DIRECTIONS[direction]
  const activeEffects = new Set(effects)
  const hasBlur = activeEffects.has('blur')
  const hasFade = activeEffects.has('fade') || hasBlur
  const hasSlide = activeEffects.has('slide') || hasBlur
  const blurAmount = Math.max(0, effectOptions?.blur?.amount ?? 5)
  const fadeFrom = Math.min(1, Math.max(0, effectOptions?.fade?.from ?? 0))
  const shimmerDuration = Math.max(0.1, effectOptions?.shimmer?.duration ?? 2.6)
  const shimmerWidth = Math.min(
    80,
    Math.max(5, effectOptions?.shimmer?.width ?? 30),
  )
  const shimmerColor = effectOptions?.shimmer?.color ?? 'var(--muted, #71717a)'
  const shimmerHighlight =
    effectOptions?.shimmer?.highlight ?? 'var(--foreground, #18181b)'
  const slideDistance = Math.max(
    0,
    effectOptions?.slide?.distance ?? Math.abs(offset.enter),
  )
  const waveAmplitude = Math.max(0, effectOptions?.wave?.amplitude ?? 4)
  const waveStagger = Math.max(0, effectOptions?.wave?.stagger ?? 0.025)
  const scaleFrom =
    typeof scale === 'number' &&
    Number.isFinite(scale) &&
    scale > 0 &&
    scale !== 1
      ? scale
      : undefined
  const shimmerEnabled = activeEffects.has('shimmer') && !shouldReduceMotion
  const waveEnabled = activeEffects.has('wave')
  const enterX =
    direction === 'left' || direction === 'right'
      ? Math.sign(offset.enter) * slideDistance
      : 0
  const enterY =
    direction === 'up' || direction === 'down'
      ? Math.sign(offset.enter) * slideDistance
      : 0
  const exitX =
    direction === 'left' || direction === 'right'
      ? Math.sign(offset.exit) * slideDistance
      : 0
  const exitY =
    direction === 'up' || direction === 'down'
      ? Math.sign(offset.exit) * slideDistance
      : 0
  const initialState = {
    ...(hasFade ? { opacity: fadeFrom } : {}),
    ...(hasSlide ? { x: enterX, y: enterY } : {}),
    ...(hasBlur ? { filter: 'blur(' + blurAmount + 'px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: scaleFrom } : {}),
  }
  const animateState = {
    ...(hasFade ? { opacity: 1 } : {}),
    ...(hasSlide ? { x: 0, y: 0 } : {}),
    ...(hasBlur ? { filter: 'blur(0px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: 1 } : {}),
    ...(shimmerEnabled ? { backgroundPosition: ['100% 0', '-120% 0'] } : {}),
  }
  const exitState = {
    ...(hasFade ? { opacity: fadeFrom } : {}),
    ...(hasSlide ? { x: exitX, y: exitY } : {}),
    ...(hasBlur ? { filter: 'blur(' + blurAmount + 'px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: scaleFrom } : {}),
  }

  useEffect(() => {
    if (shouldReduceMotion || values.length < 2 || interval <= 0) return

    const timer = window.setInterval(() => {
      setItemIndex((index) => (index + 1) % values.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, shouldReduceMotion, values.length])

  return (
    <span
      className={cn(
        'relative inline-flex min-h-5 items-center overflow-hidden align-top text-sm sm:text-base',
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix ? <span className="mr-1.5 shrink-0">{prefix}</span> : null}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={itemIndex + ':' + currentItem}
          initial={shouldReduceMotion ? false : initialState}
          animate={animateState}
          exit={shouldReduceMotion ? { opacity: 0 } : exitState}
          transition={{
            duration: shouldReduceMotion ? 0 : speed,
            ease: 'easeOut',
            ...(shimmerEnabled
              ? {
                  backgroundPosition: {
                    duration: shimmerDuration,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  },
                }
              : {}),
          }}
          className={cn(
            'font-medium whitespace-nowrap',
            activeEffects.has('shimmer') &&
              (shimmerEnabled
                ? 'bg-[linear-gradient(100deg,var(--shimmer-color)_var(--shimmer-start),var(--shimmer-highlight)_50%,var(--shimmer-color)_var(--shimmer-end))] bg-[length:220%_100%] bg-clip-text text-transparent'
                : 'text-foreground'),
            textClassName,
          )}
          style={
            {
              '--shimmer-start': 50 - shimmerWidth / 2 + '%',
              '--shimmer-end': 50 + shimmerWidth / 2 + '%',
              '--shimmer-color': shimmerColor,
              '--shimmer-highlight': shimmerHighlight,
            } as CSSProperties
          }
        >
          {waveEnabled ? (
            <>
              <span className="sr-only">{currentItem}</span>
              <span aria-hidden="true" className="inline-flex">
                {Array.from(currentItem).map((character, index) => (
                  <motion.span
                    key={index + '-' + character}
                    initial={shouldReduceMotion ? false : { y: waveAmplitude }}
                    animate={
                      shouldReduceMotion
                        ? { y: 0 }
                        : { y: [waveAmplitude, -waveAmplitude * 0.75, 0] }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : speed * 0.7,
                      delay: shouldReduceMotion ? 0 : index * waveStagger,
                      ease: 'easeOut',
                    }}
                    className="inline-block"
                  >
                    {character === ' ' ? '\u00a0' : character}
                  </motion.span>
                ))}
              </span>
            </>
          ) : (
            currentItem
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default AnimatedText
