'use client'

import { useRef } from 'react'
import type { RefObject } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { cn } from '@/lib/utils'

export type ScrollParallaxHeroProps = {
  image: string
  imageAlt?: string
  heroHeading?: string
  sectionHeading?: string
  className?: string
  scrollContainerRef?: RefObject<HTMLElement | null>
  fullBleed?: boolean
}

export default function ScrollParallaxHero({
  image,
  imageAlt = '',
  heroHeading = 'Make room for\na different perspective.',
  sectionHeading = 'Look closer.',
  className,
  scrollContainerRef,
  fullBleed = true,
}: ScrollParallaxHeroProps) {
  const sceneRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sceneRef,
    offset: ['start start', 'end end'],
  })

  const sceneTransitionOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.34],
    [0, 1],
  )
  const heroOpacity = useTransform(scrollYProgress, [0.12, 0.27], [1, 0])
  const heroY = useTransform(
    scrollYProgress,
    [0.12, 0.27],
    shouldReduceMotion ? ['0svh', '0svh'] : ['0svh', '-7svh'],
  )
  const frameProgress = useTransform(scrollYProgress, [0.2, 0.96], [0, 1])
  const frameWidth = useTransform(
    frameProgress,
    [0, 1],
    fullBleed ? ['60vw', '100vw'] : ['60%', '100%'],
  )
  const frameHeight = useTransform(
    frameProgress,
    [0, 1],
    fullBleed ? ['58svh', '100svh'] : ['52svh', '72svh'],
  )
  const frameRadius = useTransform(frameProgress, [0, 0.84, 1], [22, 5, 0])
  const frameRotation = useTransform(
    frameProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [5, 0],
  )
  const imageY = useTransform(
    frameProgress,
    [0, 1],
    shouldReduceMotion ? ['0%', '0%'] : ['9%', '-9%'],
  )
  const imageScale = useTransform(
    frameProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [1.2, 1.08],
  )
  const frameOpacity = useTransform(scrollYProgress, [0.16, 0.24], [0, 1])
  const framingOpacity = useTransform(scrollYProgress, [0.32, 0.62], [1, 0])
  const trailingFrameProgress = useTransform(
    scrollYProgress,
    [0.27, 1],
    [0, 0.94],
  )
  const trailingFrameWidth = useTransform(
    trailingFrameProgress,
    [0, 1],
    fullBleed ? ['60vw', '100vw'] : ['60%', '100%'],
  )
  const trailingFrameHeight = useTransform(
    trailingFrameProgress,
    [0, 1],
    fullBleed ? ['58svh', '100svh'] : ['52svh', '72svh'],
  )
  const trailingFrameRadius = useTransform(
    trailingFrameProgress,
    [0, 0.84, 1],
    [22, 5, 0],
  )
  const trailingFrameOpacity = useTransform(
    scrollYProgress,
    [0.21, 0.32, 0.94, 1],
    [0, 1, 1, 0],
  )
  const captionOpacity = useTransform(scrollYProgress, [0.7, 0.86], [0, 1])
  const captionY = useTransform(
    scrollYProgress,
    [0.7, 0.86],
    shouldReduceMotion ? [0, 0] : [18, 0],
  )
  const progress = useTransform(scrollYProgress, [0.12, 0.96], [0, 1])
  const headingLines = heroHeading.split('\n')

  return (
    <section
      ref={sceneRef}
      aria-label="Scroll parallax image reveal"
      className={cn(
        fullBleed
          ? 'relative left-1/2 h-[300svh] w-screen -translate-x-1/2'
          : 'border-border relative mx-auto h-[300svh] w-full max-w-5xl overflow-clip rounded-xl border',
        className,
      )}
    >
      <motion.div className="bg-background text-foreground sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <motion.div
          aria-hidden="true"
          style={{ opacity: sceneTransitionOpacity }}
          className="bg-foreground pointer-events-none absolute inset-0 z-0"
        />
        <motion.h1
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute z-10 max-w-5xl px-6 text-center font-serif text-[clamp(3.25rem,10vw,9rem)] leading-[0.88] tracking-[-0.065em] whitespace-pre-line"
        >
          {headingLines.map((line, index) => (
            <motion.span
              key={`${line}-${index}`}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 26,
                filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)',
              }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.85,
                delay: shouldReduceMotion ? 0 : index * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,color-mix(in_srgb,var(--background)_10%,transparent),transparent_52%)]"
        />

        <motion.div
          style={{ opacity: framingOpacity }}
          className="text-background/60 absolute inset-x-5 top-[5svh] z-10 flex items-start justify-between text-[9px] font-medium tracking-[0.2em] uppercase sm:inset-x-8"
        >
          <span>Visual study&nbsp; / &nbsp;05</span>
          <span>Image in motion</span>
        </motion.div>

        <motion.div
          style={{ opacity: framingOpacity }}
          className="text-background absolute top-[12svh] z-10 text-center"
        >
          <p className="font-serif text-4xl tracking-[-0.04em] sm:text-6xl">
            {sectionHeading}
          </p>
          <p className="text-background/55 mt-2 text-[9px] font-medium tracking-[0.2em] uppercase">
            A study in scale and perspective
          </p>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{
            width: trailingFrameWidth,
            height: trailingFrameHeight,
            borderRadius: trailingFrameRadius,
            opacity: trailingFrameOpacity,
            y: shouldReduceMotion ? 0 : 14,
          }}
          className="bg-surface absolute z-[1] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.22)]"
        />

        <motion.figure
          style={{
            width: frameWidth,
            height: frameHeight,
            borderRadius: frameRadius,
            rotateX: frameRotation,
            transformPerspective: 1200,
            opacity: frameOpacity,
          }}
          className="border-background/20 bg-surface relative isolate z-[2] overflow-hidden border shadow-[0_42px_120px_rgba(0,0,0,0.48)]"
        >
          <motion.img
            src={image}
            alt={imageAlt}
            style={{ y: imageY, scale: imageScale }}
            className="absolute inset-0 size-full object-cover"
            draggable={false}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20"
          />
        </motion.figure>

        <motion.p
          style={{ opacity: captionOpacity, y: captionY }}
          className="text-background pointer-events-none absolute bottom-[13svh] left-6 z-10 max-w-[75vw] font-serif text-3xl tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:left-10 sm:text-5xl"
        >
          {sectionHeading}
        </motion.p>

        <motion.div
          style={{ opacity: framingOpacity }}
          className="text-background/70 absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-5 pb-[5svh] text-[9px] font-medium tracking-[0.2em] uppercase sm:px-8"
        >
          <span>Scale / 60—100</span>
          <span>Scroll to expand</span>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="bg-background/80 absolute inset-x-0 bottom-0 z-20 h-px origin-left"
        />
      </motion.div>
    </section>
  )
}
