'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react'

export type VoiceButtonProps = {
  listening: boolean
  disabled?: boolean
  onClick: () => void
  startLabel?: string
  stopLabel?: string
}

export default function VoiceButton({
  listening,
  disabled = false,
  onClick,
  startLabel = 'Start voice input',
  stopLabel = 'Stop voice input',
}: VoiceButtonProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={listening}
      aria-label={listening ? stopLabel : startLabel}
      title={listening ? stopLabel : startLabel}
      disabled={disabled}
      whileTap={reduceMotion ? undefined : { scale: 0.9 }}
      whileHover={reduceMotion ? undefined : { y: -1 }}
      className={`focus-visible:outline-foreground relative flex size-8 shrink-0 cursor-pointer items-center justify-center overflow-visible rounded-xl border transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:size-9 ${
        listening
          ? 'border-[var(--chat-accent,var(--foreground))] bg-[var(--chat-accent,var(--foreground))] text-white'
          : 'border-border/70 bg-surface/40 text-muted hover:border-foreground/40 hover:text-foreground'
      }`}
    >
      {listening && !reduceMotion ? (
        <motion.span
          aria-hidden="true"
          className="border-[var(--chat-accent,var(--foreground))] pointer-events-none absolute inset-0 rounded-[inherit] border"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.55 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
        />
      ) : null}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={listening ? 'on' : 'off'}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: -35 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.6, rotate: 35 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
          className="relative flex items-center justify-center"
        >
          {listening ? (
            <IconPlayerStop size={13} stroke={1.6} aria-hidden="true" />
          ) : (
            <IconMicrophone size={17} stroke={1.7} aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
