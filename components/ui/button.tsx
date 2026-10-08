'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps } from 'motion/react'
import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'soft'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'
export type ButtonIntent = 'save' | 'share' | 'delete'

type SharedButtonProps = {
  children?: ReactNode
  className?: string
  icon?: ReactNode
  feedback?: {
    label: string
    icon?: ReactNode
    duration?: number
  }
  intent?: ButtonIntent
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
}

type NativeButtonProps = SharedButtonProps &
  Omit<HTMLMotionProps<'button'>, keyof SharedButtonProps> & {
    href?: never
  }

type ButtonAnchorProps = SharedButtonProps &
  Omit<HTMLMotionProps<'a'>, keyof SharedButtonProps | 'href'> & {
    href: string
  }

export type ButtonProps = NativeButtonProps | ButtonAnchorProps

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    '',
  secondary:
    'border border-border bg-surface text-foreground hover:border-foreground/25 hover:bg-surface/75',
  outline:
    'border border-border bg-transparent text-foreground hover:border-foreground/45 hover:bg-surface/70',
  ghost:
    'border border-transparent bg-transparent text-foreground hover:bg-surface/75',
  soft:
    'border border-transparent bg-surface text-foreground hover:border-border hover:bg-surface/80',
}

const INTENT_CLASSES: Record<ButtonIntent, string> = {
  save: 'border-emerald-400 bg-emerald-400 text-emerald-950 hover:border-emerald-300 hover:bg-emerald-300 hover:drop-shadow-[0_7px_12px_rgba(16,185,129,0.2)] active:drop-shadow-[0_2px_5px_rgba(16,185,129,0.2)] focus-visible:ring-emerald-300/60',
  share: 'border-sky-400 bg-sky-400 text-sky-950 hover:border-sky-300 hover:bg-sky-300 hover:drop-shadow-[0_7px_12px_rgba(14,165,233,0.2)] active:drop-shadow-[0_2px_5px_rgba(14,165,233,0.2)] focus-visible:ring-sky-300/60',
  delete: 'border-rose-400 bg-rose-400 text-rose-950 hover:border-rose-300 hover:bg-rose-300 hover:drop-shadow-[0_7px_12px_rgba(244,63,94,0.2)] active:drop-shadow-[0_2px_5px_rgba(244,63,94,0.2)] focus-visible:ring-rose-300/60',
}

const INTENT_FEEDBACK_CLASSES: Record<ButtonIntent, string> = {
  save: 'border-emerald-100 ring-2 ring-emerald-200/70 drop-shadow-[0_0_10px_rgba(16,185,129,0.28)]',
  share: 'border-sky-100 ring-2 ring-sky-200/70 drop-shadow-[0_0_10px_rgba(56,189,248,0.28)]',
  delete: 'border-rose-100 ring-2 ring-rose-200/70 drop-shadow-[0_0_10px_rgba(244,63,94,0.28)]',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-8 gap-1.5 rounded-md px-3 text-xs',
  md: 'min-h-10 gap-2 rounded-lg px-4 text-sm',
  lg: 'min-h-12 gap-2.5 rounded-xl px-5 text-sm',
  icon: 'size-10 rounded-lg p-0',
}

const MOTION_TRANSITION = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 26,
  mass: 0.55,
}

function buttonClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string,
  intent: ButtonIntent = 'save',
  feedbackActive = false,
) {
  return cn(
    'group relative inline-flex shrink-0 cursor-pointer items-center justify-center overflow-hidden font-medium whitespace-nowrap transition-[color,background-color,border-color,filter] duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-foreground/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    variant === 'primary' ? INTENT_CLASSES[intent] : VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    feedbackActive && INTENT_FEEDBACK_CLASSES[intent],
    className,
  )
}

export function Button(props: NativeButtonProps): ReactNode
export function Button(props: ButtonAnchorProps): ReactNode
export function Button(props: ButtonProps) {
  const reduceMotion = useReducedMotion()
  const [feedbackActive, setFeedbackActive] = useState(false)
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    },
    [],
  )

  function showFeedback(duration = 1800) {
    setFeedbackActive(true)
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current)
    feedbackTimeout.current = setTimeout(() => setFeedbackActive(false), duration)
  }

  function completeAction(result: unknown, duration?: number) {
    if (result && typeof (result as PromiseLike<unknown>).then === 'function') {
      void Promise.resolve(result).then(
        () => showFeedback(duration),
        () => undefined,
      )
      return
    }
    showFeedback(duration)
  }

  const motionProps = {
    whileHover: reduceMotion ? undefined : { y: -2, scale: 1.025 },
    whileTap: reduceMotion ? undefined : { y: 0, scale: 0.955, filter: 'brightness(0.9)' },
    transition: MOTION_TRANSITION,
  }

  if ('href' in props && typeof props.href === 'string') {
    const {
      href,
      variant = 'primary',
      size = 'md',
      className,
      children,
      icon,
      feedback,
      intent = 'save',
      disabled,
      onClick,
      ...anchorProps
    } = props

    return (
      <motion.a
        {...anchorProps}
        href={href}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
        onClick={(event) => {
          if (disabled) {
            event.preventDefault()
            return
          }
          const result = onClick?.(event)
          if (feedback) completeAction(result, feedback.duration)
        }}
        data-state={feedbackActive ? 'success' : 'idle'}
        className={buttonClassName(variant, size, className, intent, feedbackActive && !!feedback)}
        {...motionProps}
      >
        <span
          aria-live={feedback ? 'polite' : undefined}
          className="relative inline-flex items-center justify-center gap-2"
        >
          {icon || feedback ? (
            <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={feedbackActive ? 'feedback-icon' : 'idle-icon'}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65, rotate: 12 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="inline-flex"
              aria-hidden="true"
            >
              {feedbackActive ? feedback?.icon ?? '✓' : icon}
            </motion.span>
            </AnimatePresence>
          ) : null}
          <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={feedbackActive ? 'feedback-label' : 'idle-label'}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            {feedbackActive && feedback ? feedback.label : children}
          </motion.span>
          </AnimatePresence>
        </span>
      </motion.a>
    )
  }

  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    icon,
    feedback,
    intent = 'save',
    disabled,
    type = 'button',
    ...buttonProps
  } = props

  return (
    <motion.button
      {...buttonProps}
      type={type}
      disabled={disabled}
      aria-live={feedback ? 'polite' : undefined}
      data-state={feedbackActive ? 'success' : 'idle'}
      onClick={(event) => {
        const result = buttonProps.onClick?.(event)
        if (!disabled && feedback) completeAction(result, feedback.duration)
      }}
      className={buttonClassName(variant, size, className, intent, feedbackActive && !!feedback)}
      {...motionProps}
    >
      <span className="relative inline-flex items-center justify-center gap-2">
        {icon || feedback ? (
          <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={feedbackActive ? 'feedback-icon' : 'idle-icon'}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.65, rotate: 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            className="inline-flex"
            aria-hidden="true"
          >
            {feedbackActive ? feedback?.icon ?? '✓' : icon}
          </motion.span>
          </AnimatePresence>
        ) : null}
        <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={feedbackActive ? 'feedback-label' : 'idle-label'}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
        >
          {feedbackActive && feedback ? feedback.label : children}
        </motion.span>
        </AnimatePresence>
      </span>
    </motion.button>
  )
}

export default Button
