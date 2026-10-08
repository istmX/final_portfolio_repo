'use client'

import { useRef } from 'react'
import { useReducedMotion, useScroll, useSpring } from 'motion/react'
import { TextReveal } from '@/components/ui/text-reveal'
import { TEXT_REVEAL_QUOTE } from '@/app/portfolio-components/library/text-reveal-data'

export default function TextRevealDemo() {
  const trackRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    skipInitialAnimation: true,
  })

  return (
    <div
      ref={trackRef}
      className={shouldReduceMotion ? 'relative' : 'relative min-h-[260svh]'}
    >
      <div
        className={
          shouldReduceMotion
            ? 'flex min-h-64 items-center'
            : 'sticky top-20 flex min-h-[calc(100svh-5rem)] items-center'
        }
      >
        <div className="bg-surface/30 flex min-h-[min(32rem,75svh)] w-full items-center justify-center rounded-xl px-5 py-10 sm:px-10">
          <TextReveal
            text={TEXT_REVEAL_QUOTE}
            scrollProgress={smoothProgress}
            characterStagger={0.024}
            lineStagger={0.24}
            waveDistance={12}
            blurAmount={8}
            className="font-display max-w-3xl text-center text-2xl leading-relaxed font-medium tracking-tight sm:text-4xl sm:leading-relaxed"
          />
        </div>
      </div>
    </div>
  )
}
