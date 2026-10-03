'use client'

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'
import { useEffect, useMemo, useState, type FocusEvent, type MouseEvent, type ReactNode } from 'react'

/* eslint-disable @next/next/no-img-element -- Microlink returns the screenshot URL at runtime. */

type LinkPreviewProps = {
  children: ReactNode
  url: string
  label: string
  className?: string
  width?: number
  height?: number
  quality?: number
  isStatic?: boolean
  imageSrc?: string
}

type PreviewPosition = {
  left: number
  top: number
  width: number
}

export function LinkPreview({
  children,
  url,
  label,
  className = '',
  width = 320,
  height = 200,
  quality = 55,
  isStatic = false,
  imageSrc = '',
}: LinkPreviewProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<PreviewPosition>({ left: 12, top: 12, width })
  const shouldReduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const translateX = useSpring(x, { stiffness: 120, damping: 18 })

  const previewSrc = useMemo(() => {
    if (isStatic) return imageSrc

    const params = new URLSearchParams({
      url,
      screenshot: 'true',
      meta: 'false',
      embed: 'screenshot.url',
      colorScheme: 'dark',
      'viewport.isMobile': 'true',
      'viewport.deviceScaleFactor': '1',
      'viewport.width': String(width * 3),
      'viewport.height': String(height * 3),
      quality: String(quality),
    })

    return `https://api.microlink.io/?${params.toString()}`
  }, [height, imageSrc, isStatic, quality, url, width])

  useEffect(() => {
    const preload = new window.Image()
    preload.src = previewSrc
  }, [previewSrc])

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const offsetFromCenter = (event.clientX - rect.left - rect.width / 2) / 4
    x.set(offsetFromCenter)
  }

  function showPreview(element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    const previewWidth = Math.min(width, Math.max(1, window.innerWidth - 34))
    const cardWidth = previewWidth + 10
    const left = Math.max(
      12,
      Math.min(rect.left + rect.width / 2 - cardWidth / 2, window.innerWidth - cardWidth - 12),
    )
    const cardHeight = height + 10
    const above = rect.top - cardHeight - 12 >= 12

    setPosition({
      left,
      top: above ? rect.top - cardHeight - 12 : rect.bottom + 12,
      width: previewWidth,
    })
    x.set(0)
    setIsOpen(true)
  }

  function handleBlur(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={(event) => showPreview(event.currentTarget)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={(event) => showPreview(event.currentTarget)}
      onBlur={handleBlur}
    >
      <a
        href={url}
        aria-label={label}
        target="_blank"
        rel="noreferrer"
        onMouseMove={handleMouseMove}
        className={className}
      >
        {children}
      </a>

      <AnimatePresence>
        {isOpen && (
          <motion.a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${label}`}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed z-30 block rounded-xl border border-border bg-background p-1 shadow-xl shadow-neutral-950/20"
            style={{ left: position.left, top: position.top, width: position.width + 10, x: translateX, fontSize: 0 }}
          >
            <img
              src={previewSrc}
              width={position.width}
              height={height}
              alt={`${label} profile preview`}
              className="rounded-lg object-cover"
              style={{ width: position.width, height }}
            />
          </motion.a>
        )}
      </AnimatePresence>
    </span>
  )
}
