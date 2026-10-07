export const imageTrailSourceCode = String.raw`'use client'

import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export type ImageTrailItem = {
  src: string
  alt: string
}

export type ImageTrailProps = {
  images: ImageTrailItem[]
  className?: string
  imageClassName?: string
  throttle?: number
  maxTrailItems?: number
}

type TrailImage = ImageTrailItem & {
  id: number
  x: number
  y: number
  rotate: number
  driftX: number
  driftY: number
}

export default function ImageTrail({
  images,
  className,
  imageClassName,
  throttle = 160,
  maxTrailItems = 5,
}: ImageTrailProps) {
  const [trail, setTrail] = useState<TrailImage[]>([])
  const lastSpawn = useRef(0)
  const nextId = useRef(0)
  const reduceMotion = useReducedMotion()

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || images.length === 0) return

    const now = performance.now()
    if (now - lastSpawn.current < Math.max(0, throttle)) return
    lastSpawn.current = now

    const bounds = event.currentTarget.getBoundingClientRect()
    const id = nextId.current++
    const image = images[id % images.length]
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top

    setTrail((current) => [
      ...current,
      {
        ...image,
        id,
        x,
        y,
        rotate: (id % 2 === 0 ? -1 : 1) * (4 + (id % 4) * 2),
        driftX: (id % 2 === 0 ? -1 : 1) * (12 + (id % 3) * 5),
        driftY: -18 - (id % 3) * 7,
      },
    ].slice(-Math.max(1, maxTrailItems)))
  }

  return (
    <div
      role="group"
      aria-label="Move or tap over the canvas to create an image trail"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerMove}
      className={cn(
        'border-border bg-surface relative isolate h-[24rem] w-full touch-pan-y overflow-hidden rounded-2xl border bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_srgb,var(--foreground)_9%,transparent),transparent_55%),linear-gradient(145deg,color-mix(in_srgb,var(--foreground)_3%,var(--background)),var(--background))] sm:h-[32rem]',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--foreground)_3%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--foreground)_3%,transparent)_1px,transparent_1px)] bg-size-[48px_48px] opacity-30"
      />
      <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-center px-4">
        <span className="border-border/70 bg-background/75 text-muted rounded-full border px-4 py-2 text-xs shadow-sm backdrop-blur-md">
          Move or tap to explore
        </span>
      </div>

      <AnimatePresence initial={false}>
        {trail.map((item) => (
          <motion.img
            key={item.id}
            src={item.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            initial={{ opacity: 0, scale: 0.72, rotate: item.rotate + 8 }}
            animate={{
              opacity: [0, 1, 0.88, 0],
              scale: [0.72, 1, 1, 0.86],
              rotate: item.rotate,
              x: item.driftX,
              y: item.driftY,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1.15, times: [0, 0.16, 0.58, 1], ease: 'easeOut' }}
            onAnimationComplete={() =>
              setTrail((current) => current.filter((image) => image.id !== item.id))
            }
            style={{ left: item.x, top: item.y }}
            className={cn(
              'pointer-events-none absolute -ml-[5.25rem] -mt-[7rem] h-56 w-40 rounded-xl border border-white/70 object-cover shadow-[0_18px_50px_-18px_rgba(0,0,0,0.65)] sm:-ml-[6rem] sm:-mt-[8rem] sm:h-64 sm:w-48',
              imageClassName,
            )}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
`
