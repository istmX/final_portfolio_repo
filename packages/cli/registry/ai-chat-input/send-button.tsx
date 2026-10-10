'use client'

import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useReducedMotion,
} from 'motion/react'
import { IconArrowUp, IconCheck, IconLoader, IconPlayerStop } from '@tabler/icons-react'

export type SendButtonProps = {
  state: 'idle' | 'ready' | 'sending' | 'sent'
  disabled?: boolean
  label?: string
  shakeControls?: ReturnType<typeof useAnimationControls>
  onClick: () => void
  onStop?: () => void
}

export default function SendButton({
  state,
  disabled = false,
  label = 'Send message',
  shakeControls,
  onClick,
  onStop,
}: SendButtonProps) {
  const reduceMotion = useReducedMotion()
  const active = state === 'ready' || state === 'sent'
  const canStop = state === 'sending' && Boolean(onStop)

  return (
    <motion.button
      type="button"
      onClick={canStop ? onStop : onClick}
      aria-label={canStop ? 'Stop generating response' : state === 'sending' ? 'Sending message' : label}
      title={canStop ? 'Stop generating' : label}
      aria-disabled={disabled || (!active && !canStop)}
      disabled={disabled || (!active && !canStop)}
      animate={shakeControls}
      whileTap={reduceMotion || (!active && !canStop) ? undefined : { scale: 0.9 }}
      whileHover={reduceMotion || state !== 'ready' ? undefined : { y: -1 }}
      className={`focus-visible:outline-foreground relative flex size-8 shrink-0 items-center justify-center rounded-xl border transition-[color,background-color,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:size-9 ${
        canStop
          ? 'border-[var(--chat-accent,var(--foreground))] bg-[var(--chat-accent,var(--foreground))] text-white hover:opacity-85'
          : active
          ? 'border-[var(--chat-accent,var(--foreground))] bg-[var(--chat-accent,var(--foreground))] text-white hover:shadow-[0_10px_26px_-12px_var(--chat-accent,var(--foreground))]'
          : 'border-border/70 bg-surface/40 text-muted/60'
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'sending' && canStop ? (
          <motion.span
            key="stop"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center justify-center"
          >
            <IconPlayerStop size={13} fill="currentColor" aria-hidden="true" />
          </motion.span>
        ) : state === 'sending' ? (
          <motion.span
            key="sending"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="flex items-center justify-center"
          >
            <IconLoader
              size={16}
              stroke={1.8}
              aria-hidden="true"
              className="motion-safe:animate-spin"
            />
          </motion.span>
        ) : state === 'sent' ? (
          <motion.span
            key="sent"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 24 }}
            className="flex items-center justify-center"
          >
            <IconCheck size={17} stroke={2} aria-hidden="true" />
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            className="flex items-center justify-center"
          >
            <IconArrowUp size={17} stroke={1.9} aria-hidden="true" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
