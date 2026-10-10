'use client'

import { memo, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IconUser, IconX } from '@tabler/icons-react'
import type { ChatAttachment, ChatTurn } from './types'
import MessageContent from './message-content'
import ChatLogo from './chat-logo'
import { AttachmentPreview } from './attachment'

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function MessageFiles({ files }: { files: readonly ChatAttachment[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="border-border/70 bg-background/70 flex max-w-[15rem] items-center gap-2 rounded-xl border p-1.5"
        >
          <AttachmentPreview file={file.file} name={file.name} kind={file.kind} thumbnailClassName="size-12 rounded-lg" />
          <span className="min-w-0 pr-2">
            <span className="block truncate text-xs font-medium">{file.name}</span>
            <span className="text-muted mt-0.5 block font-mono text-[9px] uppercase">
              {formatBytes(file.size)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}

export type ChatMessageProps = {
  turn: ChatTurn
  userName: string
  assistantName: string
  userAvatar?: ReactNode
  assistantAvatar?: ReactNode
  onRetry?: () => void
  retryDisabled?: boolean
}

function ChatMessage({
  turn,
  userName,
  assistantName,
  userAvatar,
  assistantAvatar,
  onRetry,
  retryDisabled,
}: ChatMessageProps) {
  const reduceMotion = useReducedMotion()
  const [manualThinkingOpen, setManualThinkingOpen] = useState<boolean | null>(null)
  const user = turn.role === 'user'
  const name = user ? userName : assistantName
  const avatar = user ? userAvatar : assistantAvatar

  const thinkingOpen = manualThinkingOpen ?? turn.status === 'streaming'

  return (
    <motion.article
      layout={!reduceMotion && turn.status !== 'streaming'}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduceMotion ? { duration: 0.1 } : { duration: 0.24, ease: 'easeOut' }}
      aria-label={`${name} message`}
      className={`flex items-start gap-2.5 sm:gap-3 ${user ? 'flex-row-reverse' : ''}`}
    >
      <span
        aria-hidden="true"
        className={`border-border/70 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border ${user ? 'bg-surface/70 text-muted' : 'bg-[var(--chat-accent,var(--foreground))] text-white'}`}
      >
        {avatar ??
          (user ? (
            <IconUser size={15} stroke={1.7} />
          ) : (
            <ChatLogo className="size-4" />
          ))}
      </span>

      <div className={`min-w-0 max-w-[min(88%,44rem)] ${user ? 'items-end' : 'items-start'} flex flex-col`}>
        <span className={`text-muted mb-1 px-1 text-[10px] ${user ? 'text-right' : ''}`}>
          {name}
        </span>
        {turn.content || !user ? (
        <div className={`min-w-0 ${user ? 'rounded-2xl rounded-tr-md border border-[var(--chat-accent)]/80 bg-[var(--chat-accent)] px-3.5 py-2.5 text-white shadow-sm sm:px-4 sm:py-3' : 'w-full px-0 py-0 text-foreground'}`}>
          {!user && (turn.thinking || turn.status === 'streaming') ? (
            <div className="mb-2 max-w-full">
              <button type="button" aria-expanded={thinkingOpen} onClick={() => setManualThinkingOpen(!thinkingOpen)} className="text-muted hover:text-foreground w-fit cursor-pointer text-left text-[11px] transition-colors">
                <span className="inline-flex items-center gap-1.5">
                  {turn.thinkingStatus === 'thinking' ? (
                    <span className="bg-[var(--chat-accent)] size-1.5 animate-pulse rounded-full" />
                  ) : null}
                  {turn.thinkingStatus === 'thinking' ? 'Thinking…' : 'Thought process'}
                </span>
              </button>
              {thinkingOpen && turn.thinking ? <p className="text-muted mt-2 whitespace-pre-wrap text-xs leading-5">{turn.thinking}</p> : null}
            </div>
          ) : null}
          {turn.content ? (
            <MessageContent
              content={turn.content}
              streaming={turn.status === 'streaming'}
              streamingDelta={turn.streamingDelta}
            />
          ) : turn.status === 'streaming' ? (
            <MessageContent content="" streaming />
          ) : null}
          {!user && turn.attachments?.length ? (
            <MessageFiles files={turn.attachments} />
          ) : null}
        </div>
        ) : null}
        {user && turn.attachments?.length ? (
          <div className="mt-2 flex w-full justify-end">
            <MessageFiles files={turn.attachments} />
          </div>
        ) : null}
        <AnimatePresence>
          {turn.status === 'error' && turn.error ? (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 5 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="border-rose-500/30 bg-rose-500/5 mt-2 flex max-w-full items-start gap-2 rounded-xl border px-3 py-2.5 text-xs text-rose-200"
              role="alert"
            >
              <IconX size={14} stroke={1.8} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 flex-1 leading-5">
                {turn.error.message}
                {turn.error.retryAfterMs ? (
                  <span className="text-rose-200/70 mt-0.5 block font-mono text-[10px]">
                    Retry after {Math.ceil(turn.error.retryAfterMs / 1000)}s
                  </span>
                ) : null}
              </span>
              {onRetry ? (
                <button
                  type="button"
                  onClick={onRetry}
                  disabled={retryDisabled}
                  className="shrink-0 cursor-pointer rounded-md px-2 py-1 font-medium text-rose-100 underline underline-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Retry
                </button>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export default memo(ChatMessage)
