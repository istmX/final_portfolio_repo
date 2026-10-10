'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { ChangeEvent, CSSProperties, KeyboardEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'motion/react'
import { IconPlus, IconX } from '@tabler/icons-react'
import { cn } from './utils'
import AttachmentDialog, { AttachmentPreview } from './attachment'
import SendButton from './send-button'
import VoiceButton from './voice-button'
import type { AttachmentOption, ChatAttachment } from './types'

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

export type AiChatInputAction = AttachmentOption & {
  hint?: string
}
export type AiChatInputAttachment = ChatAttachment

export type AiChatInputProps = {
  actions?: readonly AiChatInputAction[]
  placeholder?: string

  label?: string
  menuLabel?: string
  submitLabel?: string
  startVoiceLabel?: string
  stopVoiceLabel?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onAttachmentsChange?: (attachments: AiChatInputAttachment[]) => void
  onSubmit?: (value: string, attachments: AiChatInputAttachment[]) => void
  onStop?: () => void
  onListeningChange?: (listening: boolean) => void
  maxLength?: number
  maxRows?: number
  maxAttachments?: number
  maxFileSizeBytes?: number
  showVoice?: boolean
  busy?: boolean
  disabled?: boolean
  className?: string
  textareaClassName?: string

  glow?: false | AiChatInputGlow
  onAttachmentError?: (message: string) => void
}

export type AiChatInputGlow = {
  color?: string

  duration?: number

  intensity?: number
}

const LINE_HEIGHT = 24
const PADDING_Y = 16

const MEDIA_EXTENSION: Record<string, AiChatInputAttachment['kind']> = {
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  avif: 'image',
  svg: 'image',
  bmp: 'image',
  mp4: 'video',
  webm: 'video',
  mov: 'video',
  mkv: 'video',
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  m4a: 'audio',
  flac: 'audio',
}

function attachmentKind(type: string, name: string) {
  if (type.startsWith('image/')) return 'image' as const
  if (type.startsWith('video/')) return 'video' as const
  if (type.startsWith('audio/')) return 'audio' as const

  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  return MEDIA_EXTENSION[extension] ?? ('file' as const)
}

function formatBytes(size?: number) {
  if (typeof size !== 'number' || Number.isNaN(size)) return ''
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function Equalizer({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-3 shrink-0 items-center gap-[2px]"
    >
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.span
          key={index}
          className="bg-foreground block h-3 w-[2px] rounded-full"
          style={{ transformOrigin: 'center' }}
          animate={
            reduceMotion
              ? { scaleY: 0.55 }
              : { scaleY: [0.22, 1, 0.4, 0.85, 0.22] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 1 + index * 0.14,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.07,
                }
          }
        />
      ))}
    </span>
  )
}

export function AiChatInput({
  actions,
  placeholder = 'Ask anything…',
  label = 'Message',
  menuLabel = 'Add to message',
  submitLabel = 'Send message',
  startVoiceLabel = 'Start voice input',
  stopVoiceLabel = 'Stop voice input',
  defaultValue = '',
  onValueChange,
  onAttachmentsChange,
  onSubmit,
  onStop,
  onListeningChange,
  maxLength = 4000,
  maxRows = 8,
  maxAttachments = 10,
  maxFileSizeBytes,
  showVoice = true,
  busy = false,
  disabled = false,
  className,
  textareaClassName,
  glow = {},
  onAttachmentError,
}: AiChatInputProps) {
  const rootId = useId().replace(/:/g, '')
  const attachmentCounter = useRef(0)
  const attachmentsRef = useRef<AiChatInputAttachment[]>([])

  const [value, setValue] = useState(defaultValue)
  const [attachments, setAttachments] = useState<AiChatInputAttachment[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [listening, setListening] = useState(false)
  const [sent, setSent] = useState(false)

  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sentTimer = useRef<number | null>(null)
  const shakeControls = useAnimationControls()
  const reduceMotion = useReducedMotion()

  const hasActions = Boolean(actions && actions.length > 0)
  const canSend =
    !disabled && !busy && (value.trim().length > 0 || attachments.length > 0)
  const sendState = busy ? 'busy' : canSend ? 'ready' : sent ? 'sent' : 'idle'
  const glowOptions = typeof glow === 'object' ? glow : {}
  const glowColor = glowOptions.color ?? '#0369a1'
  function updateValue(next: string) {
    const bounded = next.slice(0, maxLength)
    setValue(bounded)
    onValueChange?.(bounded)
  }

  function commitAttachments(next: AiChatInputAttachment[]) {
    setAttachments(next)
    onAttachmentsChange?.(next)
  }
  useEffect(() => {
    const field = fieldRef.current
    if (!field) return

    field.style.height = 'auto'
    const ceiling = maxRows * LINE_HEIGHT + PADDING_Y
    const next = Math.min(field.scrollHeight, ceiling)
    field.style.height = `${next}px`
    field.style.overflowY = field.scrollHeight > ceiling ? 'auto' : 'hidden'
  }, [value, maxRows])
  useEffect(() => {
    attachmentsRef.current = attachments
  }, [attachments])
  useEffect(() => {
    return () => {
      if (sentTimer.current) window.clearTimeout(sentTimer.current)
      attachmentsRef.current.forEach((item) => {
        if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url)
      })
    }
  }, [])

  function closeMenu(refocusTrigger = false) {
    setMenuOpen(false)
    if (refocusTrigger)
      requestAnimationFrame(() => menuTriggerRef.current?.focus())
  }

  function runAction(action: AiChatInputAction) {
    if (action.disabled || disabled) return

    setMenuOpen(false)

    if (action.accept) {
      const input = fileInputRef.current
      if (input) {
        input.accept = action.accept
        input.multiple = Boolean(action.multiple)
        if (action.capture) input.setAttribute('capture', action.capture)
        else input.removeAttribute('capture')
        input.value = ''
        input.click()
      }
    } else {
      requestAnimationFrame(() => menuTriggerRef.current?.focus())
    }

    action.onSelect?.()
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return

    const capacity = Math.max(0, maxAttachments - attachments.length)
    const accepted = files.filter((file) => {
      if (maxFileSizeBytes && file.size > maxFileSizeBytes) {
        onAttachmentError?.(
          `${file.name} is larger than the allowed file size.`,
        )
        return false
      }
      return true
    })
    if (accepted.length > capacity) {
      onAttachmentError?.(`You can attach up to ${maxAttachments} files.`)
    }

    const next: AiChatInputAttachment[] = accepted
      .slice(0, capacity)
      .map((file) => ({
        id: `${rootId}-attachment-${attachmentCounter.current++}`,
        name: file.name,
        kind: attachmentKind(file.type, file.name),
        size: file.size,
        file,
        url:
          file.type.startsWith('image/') || file.type.startsWith('video/')
            ? URL.createObjectURL(file)
            : undefined,
      }))

    commitAttachments([...attachments, ...next])
  }

  function removeAttachment(id: string) {
    const target = attachments.find((item) => item.id === id)
    if (target?.url?.startsWith('blob:')) URL.revokeObjectURL(target.url)
    commitAttachments(attachments.filter((item) => item.id !== id))
  }

  function toggleListening() {
    if (disabled) return
    const next = !listening
    setListening(next)
    onListeningChange?.(next)
  }

  function submit() {
    if (disabled || busy) return

    if (!canSend) {
      if (!reduceMotion) {
        void shakeControls.start({
          x: [0, -5, 5, -4, 4, -2, 0],
          transition: { duration: 0.36, ease: 'easeOut' },
        })
      }
      fieldRef.current?.focus()
      return
    }

    onSubmit?.(value.trim(), attachments)
    attachments.forEach((item) => {
      if (item.url?.startsWith('blob:')) URL.revokeObjectURL(item.url)
    })
    updateValue('')
    commitAttachments([])
    setSent(true)
    fieldRef.current?.focus()

    if (sentTimer.current) window.clearTimeout(sentTimer.current)
    sentTimer.current = window.setTimeout(() => setSent(false), 1200)
  }

  function handleFieldKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Escape' && busy) {
      event.preventDefault()
      onStop?.()
      return
    }
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <div
      style={{ '--chat-accent': glowColor } as CSSProperties}
      className={cn(
        'bg-background/85 relative rounded-2xl border border-transparent shadow-[0_20px_54px_-36px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-[border-color] duration-300 focus-within:border-transparent',
        disabled && 'opacity-60',
        className,
      )}
    >
      {glow !== false ? (
        <AnimatedAccentBorder
          color={glowColor}
          duration={glowOptions.duration}
          intensity={glowOptions.intensity}
        />
      ) : null}

      <AnimatePresence initial={false}>
        {attachments.length > 0 ? (
          <motion.div
            key="attachments"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={
              reduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto' }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.1 }
                : { type: 'spring', stiffness: 340, damping: 34, mass: 0.7 }
            }
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 px-2.5 pt-2.5 sm:px-3 sm:pt-3">
              <AnimatePresence initial={false}>
                {attachments.map((item) => {
                  return (
                    <motion.div
                      key={item.id}
                      layout={!reduceMotion}
                      initial={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.9, y: 8 }
                      }
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={
                        reduceMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.9, y: -6 }
                      }
                      transition={
                        reduceMotion
                          ? { duration: 0.1 }
                          : {
                              type: 'spring',
                              stiffness: 440,
                              damping: 30,
                              mass: 0.6,
                            }
                      }
                      className="border-border/70 bg-surface/40 group/chip flex max-w-full min-w-0 items-center gap-2 rounded-lg border p-1 pr-1.5"
                    >
                      <AttachmentPreview
                        file={item.file}
                        src={item.url}
                        name={item.name}
                        kind={item.kind}
                        thumbnailClassName="size-7 rounded-md"
                      />

                      <span className="text-foreground max-w-[9rem] truncate text-xs font-medium sm:max-w-[12rem]">
                        {item.name}
                      </span>
                      {item.size !== undefined ? (
                        <span className="text-muted/70 hidden font-mono text-[9px] tracking-wide uppercase sm:block">
                          {formatBytes(item.size)}
                        </span>
                      ) : null}

                      <button
                        type="button"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeAttachment(item.id)}
                        className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <IconX
                          size={13}
                          stroke={1.8}
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover/chip:rotate-90"
                        />
                      </button>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex items-end gap-2 p-2.5 sm:gap-3 sm:p-3">
        {hasActions ? (
          <motion.button
            type="button"
            ref={menuTriggerRef}
            data-chat-input-trigger=""
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close attachment options' : menuLabel}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls={`${rootId}-attachment-dialog`}
            disabled={disabled}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            className="border-border/70 bg-surface/40 text-muted hover:border-foreground/40 hover:text-foreground focus-visible:outline-foreground group/plus relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:size-9"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(255,255,255,0.14)_0%,transparent_48%,rgba(0,0,0,0.06)_100%)] opacity-0 transition-opacity duration-200 group-hover/plus:opacity-100"
            />
            <motion.span
              aria-hidden="true"
              animate={{ rotate: menuOpen ? 45 : 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 480, damping: 22 }
              }
              className="relative flex items-center justify-center"
            >
              <IconPlus size={17} stroke={1.8} />
            </motion.span>
          </motion.button>
        ) : null}

        <div className="relative min-w-0 flex-1">
          <textarea
            ref={fieldRef}
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            onKeyDown={handleFieldKeyDown}
            placeholder={listening ? '' : placeholder}
            aria-label={label}
            rows={1}
            maxLength={maxLength}
            enterKeyHint="send"
            spellCheck={false}
            disabled={disabled}
            className={cn(
              'placeholder:text-muted/70 text-foreground block w-full resize-none bg-transparent px-1 py-2 text-sm leading-6 outline-none disabled:cursor-not-allowed motion-safe:transition-[height] motion-safe:duration-200',
              textareaClassName,
            )}
          />

          <AnimatePresence>
            {listening && value.length === 0 ? (
              <motion.div
                aria-hidden="true"
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
                transition={{ duration: reduceMotion ? 0 : 0.18 }}
                className="pointer-events-none absolute inset-0 flex items-center gap-2.5 px-1 py-2"
              >
                <Equalizer reduceMotion={reduceMotion} />
                <span className="text-muted text-sm">Listening…</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
          {showVoice ? (
            <VoiceButton
              listening={listening}
              disabled={disabled}
              onClick={toggleListening}
              startLabel={startVoiceLabel}
              stopLabel={stopVoiceLabel}
            />
          ) : null}
          <SendButton
            state={sendState === 'busy' ? 'sending' : sendState}
            disabled={disabled}
            label={submitLabel}
            shakeControls={shakeControls}
            onClick={submit}
            onStop={onStop}
          />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFiles}
        className="sr-only"
      />
      <AttachmentDialog
        id={`${rootId}-attachment-dialog`}
        anchorRef={menuTriggerRef}
        open={menuOpen}
        title={menuLabel}
        options={
          actions?.map((action) => ({
            ...action,
            description: action.description ?? action.hint,
          })) ?? []
        }
        onSelect={runAction}
        onClose={() => closeMenu(true)}
        accentColor={typeof glow === 'object' ? glow.color : undefined}
      />
    </div>
  )
}

export default AiChatInput
