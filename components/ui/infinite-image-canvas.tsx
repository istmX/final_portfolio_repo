'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'motion/react'
import { cn } from '@/lib/utils'

export type InfiniteImageCanvasItem = {
  src: string
  alt: string
  name: string
  color: string
}

export type InfiniteImageCanvasProps = {
  images: InfiniteImageCanvasItem[]
  heading?: string
  description?: string
  className?: string
  tileWidth?: number
  tileHeight?: number
}

type Camera = { x: number; y: number }
type CanvasSize = { width: number; height: number }

function CanvasTile({
  image,
  left,
  top,
  width,
  height,
  reduceMotion,
}: {
  image: InfiniteImageCanvasItem
  left: number
  top: number
  width: number
  height: number
  reduceMotion: boolean
}) {
  const tileRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(tileRef, { once: false, amount: 0.12 })

  return (
    <motion.div
      ref={tileRef}
      initial={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }
      }
      animate={{
        x: left,
        y: top,
        opacity: reduceMotion ? 1 : isInView ? 1 : 0,
        scale: reduceMotion || isInView ? 1 : 0.94,
        filter: reduceMotion || isInView ? 'blur(0px)' : 'blur(7px)',
      }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.94, filter: 'blur(7px)' }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              x: { type: 'spring', stiffness: 150, damping: 28, mass: 0.7 },
              y: { type: 'spring', stiffness: 150, damping: 28, mass: 0.7 },
              opacity: { duration: 0.35 },
              scale: { duration: 0.4, ease: 'easeOut' },
              filter: { duration: 0.4, ease: 'easeOut' },
            }
      }
      aria-hidden="true"
      className="absolute flex flex-col gap-2 rounded-lg"
      style={{ left: 0, top: 0, width, height }}
    >
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/15 bg-zinc-900 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.85)]">
        <img
          src={image.src}
          alt=""
          draggable={false}
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
      <div
        className="flex h-8 shrink-0 items-center rounded-md px-3 text-xs font-medium tracking-wide text-zinc-900"
        style={{ backgroundColor: image.color }}
      >
        <span className="truncate">{image.name}</span>
      </div>
    </motion.div>
  )
}

export default function InfiniteImageCanvas({
  images,
  heading = 'Somewhere, Everywhere',
  description = 'An endless field of images, waiting to be explored.',
  className,
  tileWidth = 210,
  tileHeight = 270,
}: InfiniteImageCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(
    null,
  )
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 })
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 })
  const reduceMotion = useReducedMotion() ?? false

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return

    function handleWheel(event: globalThis.WheelEvent) {
      event.preventDefault()
      const horizontalDelta = event.shiftKey && event.deltaX === 0
        ? event.deltaY
        : event.deltaX
      const verticalDelta = event.shiftKey && event.deltaX === 0 ? 0 : event.deltaY

      setCamera((current) => ({
        x: current.x + horizontalDelta * 0.72,
        y: current.y + verticalDelta * 0.72,
      }))
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    return () => element.removeEventListener('wheel', handleWheel)
  }, [])

  const columns = Math.max(8, Math.ceil(size.width / tileWidth) + 4)
  const rows = Math.max(8, Math.ceil(size.height / tileHeight) + 4)
  const firstColumn = Math.floor(camera.x / tileWidth) - 2
  const firstRow = Math.floor(camera.y / tileHeight) - 2
  const cells = []

  for (let rowOffset = 0; rowOffset < rows; rowOffset += 1) {
    for (let columnOffset = 0; columnOffset < columns; columnOffset += 1) {
      const row = firstRow + rowOffset
      const column = firstColumn + columnOffset
      const imageIndex = Math.abs(row * 11 + column * 7) % images.length
      const image = images[imageIndex]
      if (image) cells.push({ row, column, image })
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const deltaX = event.clientX - drag.x
    const deltaY = event.clientY - drag.y
    dragRef.current = { ...drag, x: event.clientX, y: event.clientY }
    setCamera((current) => ({
      x: current.x - deltaX,
      y: current.y - deltaY,
    }))
  }

  function stopDragging(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const directions: Record<string, Camera> = {
      ArrowLeft: { x: -tileWidth / 2, y: 0 },
      ArrowRight: { x: tileWidth / 2, y: 0 },
      ArrowUp: { x: 0, y: -tileHeight / 2 },
      ArrowDown: { x: 0, y: tileHeight / 2 },
    }
    const direction = directions[event.key]
    if (!direction) return
    event.preventDefault()
    setCamera((current) => ({
      x: current.x + direction.x,
      y: current.y + direction.y,
    }))
  }

  return (
    <section
      aria-label="Infinite image canvas"
      className={cn(
        'border-border relative isolate h-[34rem] w-full overflow-hidden rounded-2xl border bg-zinc-950 sm:h-[42rem]',
        className,
      )}
    >
      <div
        ref={canvasRef}
        role="region"
        aria-label="Image canvas. Use the scroll wheel, drag, or arrow keys to explore. Scroll outside the canvas to move the page."
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 cursor-grab touch-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
      >
        <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.42),transparent_62%),linear-gradient(90deg,rgba(0,0,0,0.45),transparent_75%),linear-gradient(0deg,rgba(0,0,0,0.16),transparent_55%)]" />

        <AnimatePresence initial={false}>
          {cells.map(({ row, column, image }) => (
            <CanvasTile
              key={row + ':' + column}
              image={image}
              left={column * tileWidth - camera.x}
              top={row * tileHeight - camera.y}
              width={tileWidth - 18}
              height={tileHeight - 18}
              reduceMotion={reduceMotion}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center text-white">
        <h2 className="font-display mt-3 max-w-xl text-5xl leading-[0.95] font-semibold tracking-[-0.045em] sm:text-7xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
          {description}
        </p>
      </div>
    </section>
  )
}
