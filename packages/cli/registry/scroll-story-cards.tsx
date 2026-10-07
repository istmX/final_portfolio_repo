'use client'

import { useRef, useState } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import type { MotionValue } from 'motion/react'
import { cn } from '@/lib/utils'

export type ScrollStoryCard = {
  id: string
  eyebrow?: string
  title: string
  description: string
  image: string
  imageAlt: string
  color: string
  overlayColor?: string
  overlayOpacity?: number
  buttonLabel?: string
  buttonHref?: string
  buttonColor?: string
}

export type ScrollStoryCardsProps = {
  cards: ScrollStoryCard[]
  eyebrow?: string
  heading?: string
  description?: string
  className?: string
  curveAmount?: number
  cardWidth?: number
  cardHeight?: number
  overlayOpacity?: number
  scrollDistance?: number
  showCardLabels?: boolean
  onActiveChange?: (card: ScrollStoryCard) => void
  scrollContainerRef?: RefObject<HTMLElement | null>
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function smoothstep(value: number) {
  const t = clamp(value, 0, 1)
  return t * t * (3 - 2 * t)
}

function hexToRgb(color: string) {
  const value = color.trim().replace('#', '')
  const normalized =
    value.length === 3
      ? value
          .split('')
          .map((part) => part + part)
          .join('')
      : value

  if (!/^[\da-f]{6}$/i.test(normalized)) return { r: 24, g: 24, b: 27 }

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

function mixColor(from: string, to: string, amount: number) {
  const start = hexToRgb(from)
  const end = hexToRgb(to)
  const mix = (a: number, b: number) => Math.round(a + (b - a) * amount)

  return `rgb(${mix(start.r, end.r)}, ${mix(start.g, end.g)}, ${mix(start.b, end.b)})`
}

function storyPosition(progress: number, count: number) {
  return progress * count
}

function cardRelativePosition(progress: number, index: number, count: number) {
  return index - (storyPosition(progress, count) - 1)
}

function cardWeight(progress: number, index: number, count: number) {
  const distance = Math.abs(cardRelativePosition(progress, index, count))
  return smoothstep(1 - distance)
}

function colorAtProgress(cards: ScrollStoryCard[], progress: number) {
  if (cards.length === 1) return cards[0].color

  const position = clamp(
    storyPosition(progress, cards.length) - 1,
    0,
    cards.length - 1,
  )
  const index = Math.min(Math.floor(position), cards.length - 2)

  return mixColor(
    cards[index].color,
    cards[index + 1].color,
    smoothstep(position - index),
  )
}

function FeaturedCard({
  card,
  index,
  count,
  progress,
  reduceMotion,
  curveAmount,
  overlayOpacity,
  active,
}: {
  card: ScrollStoryCard
  index: number
  count: number
  progress: MotionValue<number>
  reduceMotion: boolean
  curveAmount: number
  overlayOpacity: number
  active: boolean
}) {
  const x = useTransform(progress, (value) => {
    if (reduceMotion) return 0
    const relative = cardRelativePosition(value, index, count)
    return smoothstep(clamp(relative, 0, 1)) * curveAmount
  })
  const y = useTransform(progress, (value) => {
    const relative = cardRelativePosition(value, index, count)
    return `${relative * 56}vh`
  })
  const scale = useTransform(progress, (value) =>
    reduceMotion ? 1 : 0.94 + cardWeight(value, index, count) * 0.06,
  )
  const rotate = useTransform(progress, (value) => {
    if (reduceMotion) return 0
    return clamp(cardRelativePosition(value, index, count) * 4, -7, 7)
  })
  const zIndex = useTransform(
    progress,
    (value) => Math.round(cardWeight(value, index, count) * 100) + index,
  )
  const imageY = useTransform(progress, (value) =>
    reduceMotion ? 0 : (1 - cardWeight(value, index, count)) * -5,
  )
  const detailsY = useTransform(progress, (value) =>
    reduceMotion ? 0 : (1 - cardWeight(value, index, count)) * 6,
  )
  const tint = hexToRgb(card.overlayColor ?? card.color)
  const tintOpacity = clamp(card.overlayOpacity ?? overlayOpacity, 0, 1)

  return (
    <motion.article
      aria-hidden={!active}
      inert={!active}
      className="group/image absolute top-[61%] left-1/2 grid h-[clamp(15rem,52svh,21rem)] min-h-0 w-[min(88vw,560px)] -translate-x-1/2 -translate-y-1/2 grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] overflow-hidden rounded-xl border border-zinc-950/[0.08] bg-[#fffef9] text-zinc-950 shadow-[0_28px_80px_-48px_rgba(48,38,28,0.32),0_2px_5px_rgba(48,38,28,0.08)] ring-1 ring-white/65 sm:top-[63%] sm:h-[17rem] sm:w-[min(80vw,620px)] sm:grid-cols-[0.9fr_1.1fr]"
      style={{
        x,
        y,
        scale,
        rotate,
        zIndex,
      }}
    >
      <div className="relative m-1.5 min-h-0 overflow-hidden rounded-sm sm:m-3">
        <motion.img
          src={card.image}
          alt={card.imageAlt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-[1.035] motion-reduce:transition-none"
          style={{ y: imageY }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${tintOpacity})`,
          }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10"
        />
      </div>
      <motion.div
        className="flex min-h-0 flex-col items-start p-2.5 sm:p-4 md:p-5"
        style={{ y: detailsY }}
      >
        <div className="w-full">
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[9px] tracking-[0.14em] text-zinc-500 uppercase sm:text-[10px]">
              {card.eyebrow ?? 'Selected story'}
            </p>
            <span className="font-mono text-[9px] tracking-[0.12em] text-zinc-400 tabular-nums sm:text-[10px]">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(count).padStart(2, '0')}
            </span>
          </div>
          <p className="font-display mt-1.5 text-sm leading-tight font-semibold tracking-tight sm:mt-2 sm:text-xl">
            {card.title}
          </p>
          <p className="mt-1.5 max-w-lg text-[11px] leading-[1.4] text-zinc-600 sm:mt-3 sm:text-[13px] sm:leading-5">
            {card.description}
          </p>
        </div>
        {card.buttonLabel && card.buttonHref ? (
          <a
            href={card.buttonHref}
            style={{
              backgroundColor:
                card.buttonColor ?? card.overlayColor ?? card.color,
            }}
            className="group/link mt-2 ml-auto inline-flex min-h-8 max-w-full shrink-0 items-center gap-2 rounded-sm border border-black/10 px-2.5 text-[9px] font-medium whitespace-nowrap text-zinc-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_2px_8px_rgba(0,0,0,0.08)] transition-[transform,filter,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_5px_12px_rgba(0,0,0,0.1)] hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 active:translate-y-0 motion-reduce:transition-none sm:mt-auto sm:min-h-9 sm:gap-2.5 sm:px-3 sm:text-[11px]"
          >
            {card.buttonLabel}
            <IconArrowUpRight
              aria-hidden="true"
              size={14}
              stroke={1.8}
              className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:transition-none"
            />
          </a>
        ) : null}
      </motion.div>
    </motion.article>
  )
}

function WaitingCard({
  card,
  index,
  count,
  cardWidth,
  cardHeight,
  overlayOpacity,
  showCardLabels,
}: {
  card: ScrollStoryCard
  index: number
  count: number
  cardWidth: number
  cardHeight: number
  overlayOpacity: number
  showCardLabels: boolean
}) {
  const tint = hexToRgb(card.overlayColor ?? card.color)
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square shrink-0 overflow-hidden rounded-sm border border-white/65 bg-black/30 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.6)]"
      style={{
        width: `clamp(58px, 14vw, ${Math.min(cardWidth, cardHeight)}px)`,
        transform: `translateY(${68 - index * 2.5}%) rotate(${(index - (count - 1) / 2) * 1.2}deg)`,
        zIndex: index + 1,
      }}
    >
      <img
        src={card.image}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className="size-full object-cover"
      />
      <span
        className="absolute inset-0"
        style={{
          backgroundColor: `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${clamp(card.overlayOpacity ?? overlayOpacity, 0, 1)})`,
        }}
      />
      {showCardLabels ? (
        <span className="absolute inset-x-0 top-0 truncate bg-black/25 px-2 py-1 text-left text-[9px] font-medium text-white">
          {card.title}
        </span>
      ) : null}
    </div>
  )
}

export default function ScrollStoryCards({
  cards,
  eyebrow = 'Selected work',
  heading = 'A collection worth exploring.',
  description,
  className,
  curveAmount = 64,
  cardWidth = 250,
  cardHeight = 156,
  overlayOpacity = 0.38,
  scrollDistance = 400,
  showCardLabels = true,
  onActiveChange,
  scrollContainerRef,
}: ScrollStoryCardsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const activeIndexRef = useRef(-1)
  const [activeIndex, setActiveIndex] = useState(-1)
  const reduceMotion = useReducedMotion()
  const storyCards = cards.filter((card) => card.image && card.color)
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    if (storyCards.length === 0) return
    const sequence = storyPosition(progress, storyCards.length) - 1
    const nextIndex =
      sequence < -0.5
        ? -1
        : clamp(Math.round(sequence), 0, storyCards.length - 1)

    if (activeIndexRef.current !== nextIndex) {
      activeIndexRef.current = nextIndex
      setActiveIndex(nextIndex)
      if (nextIndex >= 0) onActiveChange?.(storyCards[nextIndex])
    }
  })

  const backgroundColor = useTransform(scrollYProgress, (progress) =>
    storyCards.length ? colorAtProgress(storyCards, progress) : '#18181b',
  )
  const dockOpacity = useTransform(scrollYProgress, [0, 0.012], [1, 0])
  const safeDistance = clamp(scrollDistance, 240, 1200)
  const safeCardWidth = clamp(cardWidth, 140, 420)
  const safeCardHeight = clamp(cardHeight, 96, 280)
  const deckStyle = {
    '--story-deck-height': `${safeCardHeight}px`,
  } as CSSProperties

  if (storyCards.length === 0) return null

  return (
    <section
      ref={sectionRef}
      aria-label="Scroll story cards"
      className={cn('relative', className)}
      style={{ minHeight: `${safeDistance}vh` }}
    >
      <div className="sticky top-0 h-svh min-h-0 overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 z-0"
          style={{ backgroundColor }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_58%,rgba(255,255,255,0.56),transparent_65%)]"
        />
        <div className="relative z-20 mx-auto h-full w-full max-w-7xl px-4 pt-[clamp(4.5rem,8svh,7.5rem)] pb-20 text-zinc-950 sm:px-10 sm:pt-[clamp(5.5rem,10svh,7.5rem)] lg:px-16">
          <div className="flex items-center justify-between gap-4 border-b border-zinc-950/10 pb-3">
            <p className="font-mono text-[9px] tracking-[0.16em] text-zinc-600 uppercase sm:text-[10px]">
              {eyebrow}
            </p>
            <p className="font-mono text-[9px] tracking-[0.12em] text-zinc-500 uppercase sm:text-[10px]">
              Scroll to explore
            </p>
          </div>
          <div className="mt-[clamp(2.5rem,7svh,5.5rem)] text-center">
            <h2 className="font-display mx-auto max-w-5xl text-[clamp(2rem,8vw,3.5rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-[#a95f49] sm:text-[clamp(3rem,6vw,4.5rem)] lg:text-[clamp(3.25rem,4.2vw,4.5rem)]">
              {heading}
            </h2>
            {description ? (
              <p className="mx-auto mt-4 max-w-2xl text-[clamp(0.8rem,2.5vw,1rem)] leading-[1.5] text-zinc-600 sm:mt-5 sm:text-base sm:leading-7 lg:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        </div>

        <div
          role="group"
          aria-label="Featured story cards"
          className="absolute inset-0 z-40 overflow-hidden"
        >
          {storyCards.map((card, index) => (
            <FeaturedCard
              key={card.id}
              card={card}
              index={index}
              count={storyCards.length}
              progress={scrollYProgress}
              reduceMotion={Boolean(reduceMotion)}
              curveAmount={curveAmount}
              overlayOpacity={overlayOpacity}
              active={activeIndex === index}
            />
          ))}
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-50 flex h-[var(--story-deck-height)] items-start justify-center gap-2 overflow-hidden px-2 sm:gap-3 sm:px-6"
          style={{ ...deckStyle, opacity: dockOpacity }}
        >
          {storyCards.map((card, index) => (
            <WaitingCard
              key={`${card.id}-stack`}
              card={card}
              index={index}
              count={storyCards.length}
              cardWidth={safeCardWidth}
              cardHeight={safeCardHeight}
              overlayOpacity={overlayOpacity}
              showCardLabels={showCardLabels}
            />
          ))}
        </motion.div>
      </div>
      <ul className="sr-only" aria-label="Story card details">
        {storyCards.map((card, index) =>
          index === activeIndex ? null : (
            <li key={`${card.id}-accessible`}>
              <span>{card.imageAlt}</span>
              <span>{card.title}</span>
              <span>{card.description}</span>
              {card.buttonLabel && card.buttonHref ? (
                <a href={card.buttonHref}>{card.buttonLabel}</a>
              ) : null}
            </li>
          ),
        )}
      </ul>
    </section>
  )
}
