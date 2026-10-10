'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { cn } from './utils'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ChatTurn } from './types'
import ChatMessage from './chat-message'
import ChatLogo from './chat-logo'

export type MessageListProps = {
  messages: readonly ChatTurn[]
  userName: string
  assistantName: string
  userAvatar?: ReactNode
  assistantAvatar?: ReactNode
  onRetry?: (turnId: string) => void
  retryDisabled?: boolean
  emptyMessage?: string
  className?: string
}

export default function MessageList({
  messages,
  userName,
  assistantName,
  userAvatar,
  assistantAvatar,
  onRetry,
  retryDisabled,
  emptyMessage = 'Start a conversation. Your messages will appear here.',
  className,
}: MessageListProps) {
  const logRef = useRef<HTMLDivElement>(null)
  const wasAtBottom = useRef(true)
  const previousCount = useRef(messages.length)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const log = logRef.current
    if (!log) return
    const newMessageAdded = messages.length > previousCount.current
    previousCount.current = messages.length
    if (wasAtBottom.current || newMessageAdded) log.scrollTop = log.scrollHeight
  }, [messages])

  return (
    <div
      role="log"
      ref={logRef}
      onScroll={(event) => {
        const log = event.currentTarget
        wasAtBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 48
      }}
      aria-label="Chat conversation"
      aria-relevant="additions text"
      className={cn('[scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 sm:py-5', className)}
    >
      {messages.length ? (
        <div className="space-y-5 sm:space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((turn) => (
              <ChatMessage
                key={turn.id}
                turn={turn}
                userName={userName}
                assistantName={assistantName}
                userAvatar={userAvatar}
                assistantAvatar={assistantAvatar}
                onRetry={turn.status === 'error' && onRetry ? () => onRetry(turn.id) : undefined}
                retryDisabled={retryDisabled}
              />
            ))}
          </AnimatePresence>
          <div aria-hidden="true" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.3 }}
          className="flex min-h-48 flex-col items-center justify-center px-4 text-center sm:min-h-56"
        >
          <span className="bg-[var(--chat-accent,var(--foreground))]/10 text-[var(--chat-accent,var(--foreground))] mb-3 flex size-10 items-center justify-center rounded-2xl">
            <ChatLogo className="size-5" />
          </span>
          <p className="font-display text-sm font-medium">Start a conversation</p>
          <p className="text-muted mt-1 max-w-sm text-xs leading-5">{emptyMessage}</p>
        </motion.div>
      )}
    </div>
  )
}
