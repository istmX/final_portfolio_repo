'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import Image from 'next/image'

export type ImageEffect = 'pixelate' | 'rgb-split' | 'glitch' | 'ascii'

export type ImageEffectsCardProps = {
  src: string
  alt: string
  effect: ImageEffect
  title: string
  detail?: string
  className?: string
}

const LENS_MASK =
  'radial-gradient(circle var(--lens-radius, 94px) at var(--pointer-x, 50%) var(--pointer-y, 50%), #000 0 52%, rgba(0,0,0,.92) 62%, rgba(0,0,0,.48) 78%, transparent 100%)'
const ASCII = ' .,:;irsXA253hMHGS#9B&@'

function drawEffectCanvas(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  effect: 'pixelate' | 'ascii',
) {
  const bounds = canvas.getBoundingClientRect()
  const width = Math.max(1, Math.round(bounds.width))
  const height = Math.max(1, Math.round(bounds.height))
  const context = canvas.getContext('2d')
  if (!context || !image.naturalWidth || !image.naturalHeight) return
  canvas.width = width
  canvas.height = height

  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
  const cropWidth = width / scale
  const cropHeight = height / scale
  const sx = (image.naturalWidth - cropWidth) / 2
  const sy = (image.naturalHeight - cropHeight) / 2

  if (effect === 'pixelate') {
    const sample = document.createElement('canvas')
    sample.width = Math.max(1, Math.ceil(width / 10))
    sample.height = Math.max(1, Math.ceil(height / 10))
    const small = sample.getContext('2d')
    if (!small) return
    small.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, sample.width, sample.height)
    context.imageSmoothingEnabled = false
    context.drawImage(sample, 0, 0, width, height)
    context.imageSmoothingEnabled = true
    return
  }

  const columns = Math.max(18, Math.round(width / 8))
  const rows = Math.max(24, Math.round(height / 8))
  const sample = document.createElement('canvas')
  sample.width = columns
  sample.height = rows
  const small = sample.getContext('2d', { willReadFrequently: true })
  if (!small) return
  try {
    small.drawImage(image, sx, sy, cropWidth, cropHeight, 0, 0, columns, rows)
    const pixels = small.getImageData(0, 0, columns, rows).data
    context.clearRect(0, 0, width, height)
    context.font = `bold ${Math.max(6, width / columns)}px ui-monospace, monospace`
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    for (let y = 0; y < rows; y += 1) {
      for (let x = 0; x < columns; x += 1) {
        const offset = (y * columns + x) * 4
        const red = pixels[offset]
        const green = pixels[offset + 1]
        const blue = pixels[offset + 2]
        const lightness = (red * 0.3 + green * 0.59 + blue * 0.11) / 255
        const character = ASCII[Math.min(ASCII.length - 1, Math.floor((1 - lightness) * (ASCII.length - 1)))]
        context.fillStyle = `rgba(${Math.min(255, red + 48)}, ${Math.min(255, green + 48)}, ${Math.min(255, blue + 48)}, .98)`
        context.fillText(character, (x + 0.5) * (width / columns), (y + 0.5) * (height / rows))
      }
    }
  } catch {
    // Canvas text remains hidden if the remote image host blocks pixel access.
  }
}

export default function ImageEffectsCard({
  src,
  alt,
  effect,
  title,
  detail,
  className = '',
}: ImageEffectsCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [active, setActive] = useState(false)
  const filterId = `glitch-${useId().replace(/:/g, '')}`
  const localMaskStyle: CSSProperties = {
    maskImage: LENS_MASK,
    WebkitMaskImage: LENS_MASK,
  }

  useEffect(() => {
    if ((effect !== 'pixelate' && effect !== 'ascii') || !active) return
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    const image = new window.Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    const draw = () => {
      if (!cancelled) drawEffectCanvas(canvas, image, effect)
    }
    image.decode().then(draw).catch(() => {})
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [active, effect, src])

  function handlePointerEnter(event: PointerEvent<HTMLElement>) {
    const radius = Math.round(76 + Math.random() * 52)
    event.currentTarget.style.setProperty('--lens-radius', `${radius}px`)
    setActive(true)
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  const layerTransition = `pointer-events-none absolute inset-0 transition-opacity duration-200 ease-out motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`

  return (
    <figure
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setActive(false)}
      className={`group relative isolate aspect-[4/5] overflow-hidden rounded-xl bg-neutral-950 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 260px"
        className="object-cover"
      />

      {(effect === 'pixelate' || effect === 'ascii') && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`${layerTransition} h-full w-full object-cover blur-[0.4px]`}
          style={localMaskStyle}
        />
      )}

      {effect === 'rgb-split' && (
        <div className={layerTransition} style={localMaskStyle} aria-hidden="true">
          <div className="absolute inset-0 -translate-x-[3px] scale-[1.015] bg-cover bg-center mix-blend-screen blur-[0.6px]" style={{ backgroundImage: `url("${src}")`, filter: 'sepia(1) saturate(5) hue-rotate(292deg)' }} />
          <div className="absolute inset-0 translate-x-[3px] scale-[1.015] bg-cover bg-center mix-blend-screen blur-[0.6px]" style={{ backgroundImage: `url("${src}")`, filter: 'sepia(1) saturate(5) hue-rotate(150deg)' }} />
        </div>
      )}

      {effect === 'glitch' && (
        <>
          <svg className="absolute size-0" aria-hidden="true">
            <filter id={filterId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.12" numOctaves="1" seed="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="24" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <div className={layerTransition} style={localMaskStyle} aria-hidden="true">
            <div className="absolute inset-0 scale-[1.025] bg-cover bg-center blur-[0.55px]" style={{ backgroundImage: `url("${src}")`, filter: `url(#${filterId}) saturate(1.45) hue-rotate(8deg)` }} />
          </div>
        </>
      )}

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 transition-opacity duration-200 motion-reduce:transition-none ${active ? 'opacity-100' : 'opacity-0'}`}
        style={{
          ...localMaskStyle,
          background: 'radial-gradient(circle var(--lens-radius, 94px) at var(--pointer-x, 50%) var(--pointer-y, 50%), transparent 62%, rgba(255,255,255,.22) 76%, rgba(255,255,255,.05) 88%, transparent 100%)',
          filter: 'blur(5px)',
        }}
      />

      <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-3 pt-12 pb-3 text-white">
        <p className="text-[10px] font-semibold tracking-[0.14em] uppercase">{title}</p>
        {detail ? <p className="mt-1 text-[10px] text-white/70">{detail}</p> : null}
      </figcaption>
    </figure>
  )
}
