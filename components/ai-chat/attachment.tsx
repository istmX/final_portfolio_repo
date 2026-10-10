'use client'

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  IconArrowRight,
  IconFile,
  IconHeadphones,
  IconPaperclip,
  IconPhoto,
  IconVideo,
  IconX,
  IconZoomIn,
} from '@tabler/icons-react'
import { cn } from './utils'
import type { AttachmentOption, ChatAttachmentKind } from './types'

type AnimatedAccentBorderProps = {
  color: string
  duration?: number
  intensity?: number
}

function AnimatedAccentBorder({
  color,
  duration = 5,
  intensity = 1,
}: AnimatedAccentBorderProps) {
  const borderRef = useRef<SVGSVGElement>(null)
  const glowFilterId = `${useId().replace(/:/g, '')}-organic-glow`
  const [size, setSize] = useState({ width: 0, height: 0 })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const border = borderRef.current
    if (!border) return

    const observer = new ResizeObserver(() => {
      const { width, height } = border.getBoundingClientRect()
      setSize((current) =>
        Math.abs(current.width - width) < 0.5 &&
        Math.abs(current.height - height) < 0.5
          ? current
          : { width, height },
      )
    })

    observer.observe(border)
    return () => observer.disconnect()
  }, [])

  const measuredWidth = Math.max(1, size.width)
  const measuredHeight = Math.max(1, size.height)
  const width = Math.max(0, measuredWidth - 1)
  const height = Math.max(0, measuredHeight - 1)
  const radius = Math.min(15.5, width / 2, height / 2)
  const pathLength = Math.max(
    0,
    2 * (width + height - 4 * radius) + 2 * Math.PI * radius,
  )
  const dashLength = pathLength * 0.22
  const highlightColor = `color-mix(in srgb, ${color} 62%, white)`
  const animate = reduceMotion ? undefined : { strokeDashoffset: -pathLength }
  const transition = {
    duration: Math.max(1, duration),
    ease: 'linear' as const,
    repeat: Infinity,
  }
  const shape = {
    x: 0.5,
    y: 0.5,
    width,
    height,
    rx: radius,
    fill: 'none',
  }
  const animatedShape = {
    ...shape,
    strokeDasharray: `${dashLength} ${pathLength - dashLength}`,
    strokeLinecap: 'round' as const,
    initial: { strokeDashoffset: 0 },
    animate,
    transition,
  }

  return (
    <svg
      ref={borderRef}
      aria-hidden="true"
      viewBox={`0 0 ${measuredWidth} ${measuredHeight}`}
      className="pointer-events-none absolute -top-px -left-px z-20 overflow-visible"
      style={{
        width: 'calc(100% + 2px)',
        height: 'calc(100% + 2px)',
        opacity: Math.min(1, Math.max(0, intensity)),
      }}
    >
      <defs>
        <filter
          id={glowFilterId}
          x="-35%"
          y="-60%"
          width="170%"
          height="220%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.08"
            numOctaves="2"
            seed="7"
            result="edgeNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="edgeNoise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="unevenEdge"
          />
          <feGaussianBlur in="unevenEdge" stdDeviation="10" />
        </filter>
      </defs>
      <rect {...shape} stroke={color} strokeWidth="1.5" opacity="0.38" />
      <rect
        {...shape}
        stroke={color}
        strokeWidth="8"
        filter={`url(#${glowFilterId})`}
        opacity="0.55"
      />
      <motion.rect
        {...animatedShape}
        stroke={color}
        strokeWidth="14"
        filter={`url(#${glowFilterId})`}
        opacity="0.7"
      />
      <motion.rect
        {...animatedShape}
        stroke={color}
        strokeWidth="8"
        filter={`url(#${glowFilterId})`}
        opacity="0.9"
      />
      <motion.rect
        {...animatedShape}
        stroke={highlightColor}
        strokeWidth="3.5"
      />
    </svg>
  )
}

const subscribeToNothing = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export type AttachmentDialogProps = {
  id?: string
  anchorRef: RefObject<HTMLButtonElement | null>
  open: boolean
  title?: string
  description?: string
  options: readonly AttachmentOption[]
  onSelect: (option: AttachmentOption) => void
  onClose: () => void
  accentColor?: string
}

export default function AttachmentDialog({
  id,
  anchorRef,
  open,
  title = 'Add to message',
  description = 'Choose a file type to attach.',
  options,
  onSelect,
  onClose,
  accentColor,
}: AttachmentDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  const generatedId = useId().replace(/:/g, '')
  const titleId = `${id ?? generatedId}-title`
  const descriptionId = `${id ?? generatedId}-description`
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  )
  const [position, setPosition] = useState<{
    left: number
    top?: number
    bottom?: number
  } | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return

    returnFocusRef.current = document.activeElement as HTMLElement | null
    const updatePosition = () => {
      const anchor = anchorRef.current
      if (!anchor) return
      const rect = anchor.getBoundingClientRect()
      const width = Math.min(304, window.innerWidth - 24)
      const panelHeight = Math.min(
        panelRef.current?.offsetHeight ?? 288,
        window.innerHeight * 0.5,
      )
      const left = Math.max(
        12,
        Math.min(rect.left, window.innerWidth - width - 12),
      )
      if (rect.top >= panelHeight + 20) {
        setPosition({ left, bottom: window.innerHeight - rect.top + 8 })
      } else {
        setPosition({
          left,
          top: Math.min(rect.bottom + 8, window.innerHeight - panelHeight - 12),
        })
      }
    }

    const frame = window.requestAnimationFrame(() => {
      updatePosition()
      panelRef.current
        ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
        ?.focus()
    })

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (
        target instanceof Node &&
        !panelRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onCloseRef.current()
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), [href], input:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      returnFocusRef.current?.focus()
    }
  }, [open, anchorRef])

  const dialog = (
    <AnimatePresence>
      {open && position ? (
        <motion.div
          key="attachment-dialog-popover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.2 }}
          style={{
            left: position.left,
            top: position.top,
            bottom: position.bottom,
          }}
          className="fixed z-[100]"
        >
          <motion.div
            ref={panelRef}
            id={id ?? `${generatedId}-attachment-dialog`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28, y: 8 }
            }
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
            transition={
              reduceMotion
                ? { duration: 0.08 }
                : { type: 'spring', stiffness: 390, damping: 34, mass: 0.75 }
            }
            style={
              { '--chat-accent': accentColor ?? '#0369a1' } as CSSProperties
            }
            className="text-foreground relative flex max-h-[min(50vh,18rem)] w-[min(19rem,calc(100vw-1.5rem))] flex-col rounded-2xl border border-transparent shadow-[0_18px_54px_-16px_rgba(0,0,0,0.65)]"
          >
            <div className="bg-background text-foreground relative z-10 flex max-h-[min(50vh,18rem)] w-full flex-col overflow-hidden rounded-2xl">
              <div className="border-border/60 flex items-start gap-2.5 border-b px-3 py-3 sm:px-4">
                <span className="border-border/70 bg-surface/60 text-muted flex size-8 shrink-0 items-center justify-center rounded-lg border">
                  <IconPaperclip size={17} stroke={1.7} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2
                    id={titleId}
                    className="font-display text-[13px] font-semibold tracking-tight"
                  >
                    {title}
                  </h2>
                  <p
                    id={descriptionId}
                    className="text-muted mt-0.5 text-[11px] leading-4"
                  >
                    {description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close attachment options"
                  className="text-muted hover:text-foreground focus-visible:outline-foreground flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <IconX size={16} stroke={1.7} aria-hidden="true" />
                </button>
              </div>

              <div className="min-h-0 [scrollbar-width:none] overflow-y-auto overscroll-contain p-2 [&::-webkit-scrollbar]:hidden">
                {options.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => onSelect(option)}
                    className="group focus-visible:outline-foreground hover:bg-surface/70 focus-visible:bg-surface/70 flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] disabled:cursor-not-allowed disabled:opacity-45 sm:px-2.5"
                  >
                    <span className="border-border/70 bg-surface/45 text-muted flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors group-hover:border-[var(--chat-accent,var(--foreground))]/40 group-hover:text-[var(--chat-accent,var(--foreground))]">
                      {option.icon ?? (
                        <IconPaperclip
                          size={17}
                          stroke={1.7}
                          aria-hidden="true"
                        />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="font-display block text-xs font-medium">
                        {option.label}
                      </span>
                      <span className="text-muted mt-0.5 block text-[10px] leading-3.5">
                        {option.description ?? option.accept}
                      </span>
                    </span>
                    <IconArrowRight
                      size={15}
                      stroke={1.6}
                      aria-hidden="true"
                      className="text-muted/45 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--chat-accent,var(--foreground))]"
                    />
                  </button>
                ))}
              </div>
              <div className="border-border/50 text-muted border-t px-3 py-2 font-mono text-[9px] tracking-[0.12em] uppercase sm:px-4">
                {options.length} attachment{' '}
                {options.length === 1 ? 'option' : 'options'}
              </div>
            </div>
            <AnimatedAccentBorder color={accentColor ?? '#0369a1'} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return mounted ? createPortal(dialog, document.body) : null
}

type AttachmentPreviewProps = {
  file: File
  name: string
  kind: ChatAttachmentKind
  src?: string
  thumbnailClassName?: string
}

function PreviewIcon({ kind }: { kind: ChatAttachmentKind }) {
  const Icon =
    kind === 'image'
      ? IconPhoto
      : kind === 'video'
        ? IconVideo
        : kind === 'audio'
          ? IconHeadphones
          : IconFile
  return <Icon size={18} stroke={1.7} aria-hidden="true" />
}

export function AttachmentPreview({
  file,
  name,
  kind,
  src,
  thumbnailClassName,
}: AttachmentPreviewProps) {
  const [open, setOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(src ?? '')
  const fileUrlRef = useRef('')
  const thumbnailRef = useRef<HTMLImageElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (src) return
    const url = URL.createObjectURL(file)
    fileUrlRef.current = url
    if (thumbnailRef.current) thumbnailRef.current.src = url
    return () => {
      fileUrlRef.current = ''
      URL.revokeObjectURL(url)
    }
  }, [file, src])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const trigger = triggerRef.current
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      trigger?.focus()
    }
  }, [open])

  const dialog = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.08 : 0.18 }}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={`Preview: ${name}`}
            className="border-border/70 bg-background relative z-10 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
            initial={reduceMotion ? { scale: 1 } : { scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduceMotion ? { scale: 1 } : { scale: 0.98, y: 8 }}
            transition={
              reduceMotion
                ? { duration: 0.08 }
                : { type: 'spring', stiffness: 360, damping: 30 }
            }
          >
            <div className="border-border/60 flex min-h-12 items-center gap-3 border-b px-3 py-2.5 sm:px-4">
              <span className="text-muted bg-surface/70 flex size-8 shrink-0 items-center justify-center rounded-lg">
                <PreviewIcon kind={kind} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {name}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close file preview"
                className="text-muted hover:bg-surface hover:text-foreground flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors"
              >
                <IconX size={17} stroke={1.7} aria-hidden="true" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-black/20 p-3 sm:p-6">
              {kind === 'image' && previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={name}
                  className="max-h-[calc(92dvh-8rem)] max-w-full rounded-lg object-contain"
                />
              ) : kind === 'video' && previewUrl ? (
                <video
                  src={previewUrl}
                  controls
                  playsInline
                  className="max-h-[calc(92dvh-8rem)] max-w-full rounded-lg"
                />
              ) : kind === 'audio' && previewUrl ? (
                <audio src={previewUrl} controls className="w-full max-w-xl" />
              ) : file.type === 'application/pdf' && previewUrl ? (
                <iframe
                  title={`Preview: ${name}`}
                  src={previewUrl}
                  className="h-[min(72vh,48rem)] w-full rounded-lg border-0"
                />
              ) : (
                <div className="text-muted flex flex-col items-center gap-3 py-12 text-center">
                  <span className="bg-surface/70 flex size-14 items-center justify-center rounded-2xl">
                    <PreviewIcon kind={kind} />
                  </span>
                  <p className="max-w-sm text-sm">
                    A preview isn’t available for this file type.
                  </p>
                  <a
                    href={previewUrl}
                    download={name}
                    className="text-foreground bg-surface hover:bg-surface/80 rounded-lg px-3 py-2 text-xs font-medium"
                  >
                    Download file
                  </a>
                </div>
              )}
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setPreviewUrl(src ?? fileUrlRef.current)
          setOpen(true)
        }}
        aria-label={`Preview ${name}`}
        title={`Preview ${name}`}
        className={cn(
          'group/preview border-border/60 bg-background/70 text-muted relative flex shrink-0 cursor-zoom-in items-center justify-center overflow-hidden rounded-lg border',
          thumbnailClassName,
        )}
      >
        {kind === 'image' && previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={thumbnailRef}
            src={previewUrl}
            alt=""
            aria-hidden="true"
            className="size-full object-cover"
          />
        ) : (
          <PreviewIcon kind={kind} />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-black/45 text-white opacity-0 transition-opacity duration-150 group-hover/preview:opacity-100 group-focus-visible/preview:opacity-100"
        >
          <IconZoomIn size={16} stroke={1.8} />
        </span>
      </button>
      {typeof document !== 'undefined'
        ? createPortal(dialog, document.body)
        : null}
    </>
  )
}
