'use client'

import { motion, useReducedMotion, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

export type TextRevealProps = {
  text: string
  className?: string
  characterStagger?: number
  lineStagger?: number
  duration?: number
  waveDistance?: number
  waveOvershoot?: number
  sidewaysDistance?: number
  blurAmount?: number
  opacityFrom?: number
  opacityPeak?: number
  scaleFrom?: number
  scalePeak?: number
  scrollProgress?: MotionValue<number>
  once?: boolean
  viewportAmount?: number
}

function ScrollRevealCharacter({
  character,
  progress,
  start,
  end,
  waveDistance,
  waveOvershoot,
  sidewaysDistance,
  blurAmount,
  opacityFrom,
  opacityPeak,
  scaleFrom,
  scalePeak,
}: {
  character: string
  progress: MotionValue<number>
  start: number
  end: number
  waveDistance: number
  waveOvershoot: number
  sidewaysDistance: number
  blurAmount: number
  opacityFrom: number
  opacityPeak: number
  scaleFrom: number
  scalePeak: number
}) {
  const characterProgress = useTransform(progress, [start, end], [0, 1])
  const opacity = useTransform(
    characterProgress,
    [0, 0.55, 1],
    [opacityFrom, opacityPeak, 1],
  )
  const y = useTransform(
    characterProgress,
    [0, 0.55, 1],
    [waveDistance, -waveOvershoot, 0],
  )
  const x = useTransform(
    characterProgress,
    [0, 0.55, 1],
    [-sidewaysDistance, sidewaysDistance * 0.5, 0],
  )
  const scale = useTransform(
    characterProgress,
    [0, 0.55, 1],
    [scaleFrom, scalePeak, 1],
  )
  const filter = useTransform(
    characterProgress,
    [0, 0.55, 1],
    [`blur(${blurAmount}px)`, `blur(${blurAmount * 0.35}px)`, 'blur(0px)'],
  )

  return (
    <motion.span
      style={{ opacity, x, y, scale, filter }}
      className="inline-block whitespace-pre"
    >
      {character}
    </motion.span>
  )
}

export function TextReveal({
  text,
  className,
  characterStagger = 0.024,
  lineStagger = 0.24,
  duration = 0.7,
  waveDistance = 5,
  waveOvershoot = waveDistance * 0.75,
  sidewaysDistance = waveDistance * 0.12,
  blurAmount = 7,
  opacityFrom = 0.08,
  opacityPeak = 0.72,
  scaleFrom = 0.96,
  scalePeak = 1.025,
  scrollProgress,
  once = true,
  viewportAmount = 0.4,
}: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const lines = text.split('\n')
  const stagger = Math.max(0, characterStagger)
  const lineDelay = Math.max(0, lineStagger)
  const animationDuration = Math.max(0, duration)
  const wave = Math.max(0, waveDistance)
  const wavePeak = Math.max(0, waveOvershoot)
  const sideways = Math.max(0, sidewaysDistance)
  const blur = Math.max(0, blurAmount)
  const startOpacity = Math.min(1, Math.max(0, opacityFrom))
  const middleOpacity = Math.min(1, Math.max(startOpacity, opacityPeak))
  const startScale = Math.max(0.01, scaleFrom)
  const middleScale = Math.max(0.01, scalePeak)
  const lineStartDelays: number[] = []
  let nextLineDelay = 0

  for (const line of lines) {
    lineStartDelays.push(nextLineDelay)
    nextLineDelay +=
      Math.max(0, Array.from(line).length - 1) * stagger +
      animationDuration +
      lineDelay
  }

  const characterCount = lines.reduce(
    (total, line) => total + Array.from(line).length,
    0,
  )
  const scrollCharacterWeight = Math.max(stagger, 0.001)
  const scrollLineWeight = Math.max(0, lineDelay)
  const totalScrollWeight =
    characterCount * scrollCharacterWeight +
    Math.max(0, lines.length - 1) * scrollLineWeight
  let scrollWeight = 0

  if (scrollProgress && !shouldReduceMotion) {
    return (
      <p className={cn('text-foreground', className)}>
        <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
        {lines.map((line, lineIndex) => {
          const words = line.match(/\s+|\S+/gu) ?? []
          const content = words.map((word, wordIndex) => {
            if (/^\s+$/u.test(word)) {
              scrollWeight += Array.from(word).length * scrollCharacterWeight
              return (
                <span
                  key={`${wordIndex}-${word}`}
                  className="whitespace-pre-wrap"
                >
                  {word}
                </span>
              )
            }

            const characters = Array.from(word).map((character) => {
              const start = scrollWeight / totalScrollWeight
              scrollWeight += scrollCharacterWeight
              const end = scrollWeight / totalScrollWeight

              return (
                <ScrollRevealCharacter
                  key={`${start}-${character}`}
                  character={character}
                  progress={scrollProgress}
                  start={start}
                  end={end}
                  waveDistance={wave}
                  waveOvershoot={wavePeak}
                  sidewaysDistance={sideways}
                  blurAmount={blur}
                  opacityFrom={startOpacity}
                  opacityPeak={middleOpacity}
                  scaleFrom={startScale}
                  scalePeak={middleScale}
                />
              )
            })

            return (
              <span
                key={`${wordIndex}-${word}`}
                className="inline-block whitespace-nowrap"
              >
                {characters}
              </span>
            )
          })

          if (lineIndex < lines.length - 1) {
            scrollWeight += scrollLineWeight
          }

          return (
            <span
              key={`${lineIndex}-${line}`}
              aria-hidden="true"
              className="block"
            >
              {content}
            </span>
          )
        })}
      </p>
    )
  }

  return (
    <motion.p
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once, amount: Math.min(1, Math.max(0, viewportAmount)) }}
      className={cn('text-foreground', className)}
    >
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      {lines.map((line, lineIndex) => {
        let characterIndex = 0
        const words = line.match(/\s+|\S+/gu) ?? []

        return (
          <span
            key={`${lineIndex}-${line}`}
            aria-hidden="true"
            className="block"
          >
            {words.map((word, wordIndex) => {
              if (/^\s+$/u.test(word)) {
                characterIndex += Array.from(word).length
                return (
                  <span
                    key={`${wordIndex}-${word}`}
                    className="whitespace-pre-wrap"
                  >
                    {word}
                  </span>
                )
              }

              const characters = Array.from(word).map((character) => {
                const delay =
                  lineStartDelays[lineIndex] + characterIndex * stagger
                characterIndex += 1

                return (
                  <motion.span
                    key={`${characterIndex}-${character}`}
                    custom={delay}
                    variants={{
                      hidden: {
                        opacity: startOpacity,
                        y: wave,
                        x: -sideways,
                        scale: startScale,
                        filter: `blur(${blur}px)`,
                      },
                      visible: shouldReduceMotion
                        ? {
                            opacity: 1,
                            y: 0,
                            x: 0,
                            scale: 1,
                            filter: 'blur(0px)',
                            transition: { duration: 0 },
                          }
                        : (staggerDelay: number) => ({
                            opacity: 1,
                            y: [wave, -wavePeak, 0],
                            x: [-sideways, sideways * 0.5, 0],
                            scale: [startScale, middleScale, 1],
                            filter: ['blur(' + blur + 'px)', 'blur(0px)'],
                            transition: {
                              duration: animationDuration,
                              delay: staggerDelay,
                              ease: 'easeOut',
                            },
                          }),
                    }}
                    className="inline-block whitespace-pre"
                  >
                    {character}
                  </motion.span>
                )
              })

              return (
                <span
                  key={`${wordIndex}-${word}`}
                  className="inline-block whitespace-nowrap"
                >
                  {characters}
                </span>
              )
            })}
          </span>
        )
      })}
    </motion.p>
  )
}

export default TextReveal
