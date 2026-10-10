'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import ChatComposer from './chat-composer'
import ChatSidebar from './chat-sidebar'
import ChatUserAvatar from './chat-user-avatar'
import ChatLogo from './chat-logo'
import { DEFAULT_ATTACHMENT_OPTIONS } from './default-attachments'
import MessageList from './message-list'
import type {
  AttachmentOption,
  ChatAttachment,
  ChatRequest,
  ChatResponse,
  ChatSendError,
  ChatStreamChunk,
  ChatThread,
  ChatTurn,
} from './types'

export type AiChatBlockProps = {
  onSend: (request: ChatRequest) => Promise<ChatResponse>
  initialMessages?: readonly ChatTurn[]
  initialThreads?: readonly ChatThread[]
  title?: string
  description?: string
  assistantName?: string
  userName?: string
  assistantAvatar?: ReactNode
  userAvatar?: ReactNode
  attachmentOptions?: readonly AttachmentOption[]
  maxAttachments?: number
  maxFileSizeBytes?: number
  /** Maximum streamed response size in characters; defaults to 60,000. */
  maxResponseCharacters?: number
  accentColor?: string
  allowVoiceInput?: boolean
  placeholder?: string
  emptyMessage?: string
  className?: string
  fullScreen?: boolean
  onListeningChange?: (listening: boolean) => void
}

type RetryRequest = {
  message: string
  attachments: ChatAttachment[]
  userTurnId: string
  assistantTurnId: string
  threadId: string
}

type StreamParts = { text: string; thinking: string }
type ChatState = { threads: ChatThread[]; activeThreadId: string }
const STREAM_RENDER_INTERVAL_MS = 32

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function isAsyncIterable(value: unknown): value is AsyncIterable<ChatStreamChunk> {
  return Boolean(
    value && typeof value === 'object' && Symbol.asyncIterator in value &&
      typeof (value as AsyncIterable<ChatStreamChunk>)[Symbol.asyncIterator] === 'function',
  )
}

function readParts(chunk: unknown): StreamParts {
  if (typeof chunk === 'string') return { text: chunk, thinking: '' }
  if (Array.isArray(chunk)) {
    return chunk.reduce<StreamParts>((parts, item) => {
      const next = readParts(item)
      return { text: parts.text + next.text, thinking: parts.thinking + next.thinking }
    }, { text: '', thinking: '' })
  }
  if (!chunk || typeof chunk !== 'object') return { text: '', thinking: '' }
  const value = chunk as { content?: unknown; text?: unknown; delta?: unknown; type?: string }
  const part = value.delta ?? value.content ?? value.text
  const content = readParts(part)
  return value.type === 'thinking-delta' || value.type === 'reasoning-delta'
    ? { text: '', thinking: content.text + content.thinking }
    : content
}

export default function AiChatBlock({
  onSend,
  initialMessages = [],
  initialThreads,
  title = 'AI chat',
  assistantName = 'Assistant',
  userName = 'You',
  assistantAvatar,
  userAvatar,
  attachmentOptions = DEFAULT_ATTACHMENT_OPTIONS,
  maxAttachments = 10,
  maxFileSizeBytes,
  maxResponseCharacters = 60_000,
  accentColor = '#0369a1',
  allowVoiceInput = true,
  placeholder = 'Message the assistant…',
  emptyMessage,
  className,
  fullScreen = false,
  onListeningChange,
}: AiChatBlockProps) {
  const generatedId = useId()
  const [chat, setChat] = useState<ChatState>(() => {
    const threads = initialThreads?.length
      ? initialThreads.map((thread) => ({ ...thread, messages: [...thread.messages] }))
      : [{ id: generatedId, title: 'New chat', messages: [...initialMessages] }]
    return { threads, activeThreadId: threads[0].id }
  })
  const [sending, setSending] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarHidden, setDesktopSidebarHidden] = useState(false)
  const [attachmentError, setAttachmentError] = useState('')
  const [retryAt, setRetryAt] = useState(0)
  const [clock, setClock] = useState(0)
  const activeController = useRef<AbortController | null>(null)
  const activeRequest = useRef<RetryRequest | null>(null)
  const streamedTextRef = useRef<string[]>([])
  const streamedThinkingRef = useRef<string[]>([])
  const retryRequests = useRef(new Map<string, RetryRequest>())
  const attachmentErrorTimer = useRef<number | null>(null)

  const activeThread = chat.threads.find((thread) => thread.id === chat.activeThreadId) ?? chat.threads[0]
  const messages = activeThread?.messages ?? []
  const profileAvatar = userAvatar ?? <ChatUserAvatar />

  function updateThread(threadId: string, update: (thread: ChatThread) => ChatThread) {
    setChat((current) => ({
      ...current,
      threads: current.threads.map((thread) => thread.id === threadId ? update(thread) : thread),
    }))
  }

  useEffect(() => {
    if (!retryAt) return
    const timer = window.setInterval(() => setClock(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [retryAt])

  useEffect(() => () => {
    activeController.current?.abort()
    if (attachmentErrorTimer.current) window.clearTimeout(attachmentErrorTimer.current)
  }, [])

  async function performRequest(request: RetryRequest) {
    const controller = new AbortController()
    activeController.current?.abort()
    activeController.current = controller
    activeRequest.current = request
    const textChunks: string[] = []
    const thinkingChunks: string[] = []
    streamedTextRef.current = textChunks
    streamedThinkingRef.current = thinkingChunks
    setSending(true)
    setRetryAt(0)
    setAttachmentError('')
    updateThread(request.threadId, (thread) => ({
      ...thread,
      messages: thread.messages.map((turn) => turn.id === request.assistantTurnId
        ? { ...turn, content: '', thinking: '', status: 'streaming', thinkingStatus: 'thinking', error: undefined }
        : turn),
    }))

    let textLength = 0
    let renderedTextLength = 0
    let streamTimer: number | null = null
    const flushStream = () => {
      streamTimer = null
      if (controller.signal.aborted) return
      const content = textChunks.join('')
      const thinking = thinkingChunks.join('')
      const streamingDelta = content.slice(renderedTextLength)
      renderedTextLength = content.length
      updateThread(request.threadId, (thread) => ({
        ...thread,
        messages: thread.messages.map((turn) => turn.id === request.assistantTurnId
          ? { ...turn, content, streamingDelta, thinking, status: 'streaming', thinkingStatus: 'thinking' }
          : turn),
      }))
    }

    try {
      const response = await onSend({ message: request.message, attachments: request.attachments, signal: controller.signal })
      if (controller.signal.aborted) return
      if (typeof response === 'string') {
        const limit = Number.isFinite(maxResponseCharacters) ? Math.max(1, Math.floor(maxResponseCharacters)) : 60_000
        const truncated = response.length > limit
        const content = truncated ? `${response.slice(0, limit)}\n\n[Response stopped at the configured length limit.]` : response
        updateThread(request.threadId, (thread) => ({
          ...thread,
          messages: thread.messages.map((turn) => turn.id === request.assistantTurnId
            ? { ...turn, content, status: 'complete', thinkingStatus: turn.thinking ? 'complete' : undefined }
            : turn),
        }))
      } else if (isAsyncIterable(response)) {
        let truncated = false
        let thinkingLength = 0
        let lastEventLoopYield = performance.now()
        const limit = Number.isFinite(maxResponseCharacters) ? Math.max(1, Math.floor(maxResponseCharacters)) : 60_000
        for await (const chunk of response) {
          if (controller.signal.aborted) break
          const parts = readParts(chunk)
          if (parts.text) {
            const remaining = limit - textLength
            const accepted = parts.text.slice(0, Math.max(0, remaining))
            textChunks.push(accepted)
            textLength += accepted.length
            if (accepted.length < parts.text.length) truncated = true
          }
          if (parts.thinking && thinkingLength < 8_000) {
            const thinking = parts.thinking.slice(0, 8_000 - thinkingLength)
            thinkingChunks.push(thinking)
            thinkingLength += thinking.length
          }
          if ((parts.text || parts.thinking) && streamTimer === null) {
            // Throttle markdown parsing and layout work while model tokens arrive.
            streamTimer = window.setTimeout(flushStream, textLength < 16_000 ? STREAM_RENDER_INTERVAL_MS : 80)
          }
          if (truncated) break
          // Some async iterators resolve chunks continuously in microtasks.
          // Yield to a browser task periodically so input, paint, and Stop remain responsive.
          if (performance.now() - lastEventLoopYield >= 16) {
            await new Promise<void>((resolve) => window.setTimeout(resolve, 0))
            lastEventLoopYield = performance.now()
          }
          if (controller.signal.aborted) break
        }
        if (controller.signal.aborted) return
        if (streamTimer !== null) window.clearTimeout(streamTimer)
        const text = textChunks.join('')
        const thinking = thinkingChunks.join('')
        const content = truncated ? `${text}\n\n[Response stopped at the configured length limit.]` : text
        updateThread(request.threadId, (thread) => ({
          ...thread,
          messages: thread.messages.map((turn) => turn.id === request.assistantTurnId
            ? { ...turn, content, thinking, status: 'complete', thinkingStatus: thinking ? 'complete' : undefined }
            : turn),
        }))
      } else {
        throw new Error('The chat handler must return text or an async stream.')
      }
    } catch (cause) {
      if (controller.signal.aborted) return
      if (streamTimer !== null) window.clearTimeout(streamTimer)
      const error = cause as Partial<ChatSendError>
      const message = typeof error.message === 'string' && error.message.trim()
        ? error.message : 'The message could not be sent. Please try again.'
      const waitMs = typeof error.retryAfterMs === 'number' && error.retryAfterMs > 0 ? error.retryAfterMs : undefined
      const nextRetryAt = waitMs ? Date.now() + waitMs : 0
      setRetryAt(nextRetryAt)
      updateThread(request.threadId, (thread) => ({
        ...thread,
        messages: thread.messages.map((turn) => turn.id === request.assistantTurnId
          ? { ...turn, content: textChunks.join(''), thinking: thinkingChunks.join(''), status: 'error', thinkingStatus: thinkingChunks.length ? 'complete' : undefined,
            error: { message, retryAfterMs: waitMs, retryAt: nextRetryAt || undefined } }
          : turn),
      }))
    } finally {
      if (streamTimer !== null) window.clearTimeout(streamTimer)
      if (activeController.current === controller) {
        activeController.current = null
        activeRequest.current = null
        streamedTextRef.current = []
        streamedThinkingRef.current = []
        setSending(false)
      }
    }
  }

  function handleSubmit(message: string, attachments: ChatAttachment[]) {
    const thread = activeThread
    if (!thread) return
    const userTurnId = createId()
    const assistantTurnId = createId()
    const storedAttachments = attachments.map((attachment) => ({ ...attachment }))
    const request = { message, attachments: storedAttachments, userTurnId, assistantTurnId, threadId: thread.id }
    retryRequests.current.set(assistantTurnId, request)
    const firstMessage = thread.messages.length === 0
    updateThread(thread.id, (current) => ({
      ...current,
      title: firstMessage ? (message.trim().slice(0, 36) || attachments[0]?.name || 'New chat') : current.title,
      messages: [...current.messages,
        { id: userTurnId, role: 'user', content: message, attachments: storedAttachments, status: 'complete' },
        { id: assistantTurnId, role: 'assistant', content: '', status: 'streaming', thinkingStatus: 'thinking' },
      ],
    }))
    void performRequest(request)
  }

  function retryMessage(assistantTurnId: string) {
    const request = retryRequests.current.get(assistantTurnId)
    if (request && !sending && clock >= retryAt) void performRequest(request)
  }

  function stopGeneration() {
    const controller = activeController.current
    const request = activeRequest.current
    if (!controller || !request) return
    const partialText = streamedTextRef.current.join('')
    const partialThinking = streamedThinkingRef.current.join('')
    controller.abort()
    activeController.current = null
    activeRequest.current = null
    streamedTextRef.current = []
    streamedThinkingRef.current = []
    setSending(false)
    updateThread(request.threadId, (thread) => ({
      ...thread,
      messages: thread.messages.map((turn) => turn.id === request.assistantTurnId && turn.status === 'streaming'
        ? { ...turn, content: turn.content || partialText || 'Generation stopped.', thinking: partialThinking, status: 'complete', thinkingStatus: partialThinking ? 'complete' : undefined }
        : turn),
    }))
  }

  function startNewChat() {
    stopGeneration()
    const id = createId()
    setChat((current) => ({ threads: [{ id, title: 'New chat', messages: [] }, ...current.threads], activeThreadId: id }))
    setMobileSidebarOpen(false)
  }

  function selectThread(id: string) {
    if (sending) stopGeneration()
    setChat((current) => ({ ...current, activeThreadId: id }))
  }

  function togglePinnedThread(id: string) {
    updateThread(id, (thread) => ({ ...thread, pinned: !thread.pinned }))
  }

  function toggleArchivedThread(id: string) {
    const thread = chat.threads.find((item) => item.id === id)
    if (!thread) return
    if (activeRequest.current?.threadId === id) stopGeneration()
    const replacement = { id: createId(), title: 'New chat', messages: [] as ChatTurn[] }
    setChat((current) => {
      const threads = current.threads.map((item) => item.id === id ? { ...item, archived: !item.archived, pinned: item.archived ? item.pinned : false } : item)
      if (current.activeThreadId !== id || thread.archived) return { ...current, threads }
      const next = threads.find((item) => item.id !== id && !item.archived)
      if (next) return { threads, activeThreadId: next.id }
      return { threads: [replacement, ...threads], activeThreadId: replacement.id }
    })
  }

  function deleteThread(id: string) {
    if (activeRequest.current?.threadId === id) stopGeneration()
    const replacement = { id: createId(), title: 'New chat', messages: [] as ChatTurn[] }
    setChat((current) => {
      const threads = current.threads.filter((thread) => thread.id !== id)
      retryRequests.current.forEach((request, key) => {
        if (request.threadId === id) retryRequests.current.delete(key)
      })
      if (current.activeThreadId !== id) return { ...current, threads }
      const next = threads.find((thread) => !thread.archived)
      if (next) return { threads, activeThreadId: next.id }
      return { threads: [replacement, ...threads], activeThreadId: replacement.id }
    })
  }

  function handleAttachmentError(message: string) {
    setAttachmentError(message)
    if (attachmentErrorTimer.current) window.clearTimeout(attachmentErrorTimer.current)
    attachmentErrorTimer.current = window.setTimeout(() => setAttachmentError(''), 4000)
  }

  function toggleSidebar() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      setDesktopSidebarHidden((hidden) => !hidden)
      return
    }
    setMobileSidebarOpen((open) => !open)
  }

  const style = { '--chat-accent': accentColor } as CSSProperties
  const retryDisabled = sending || (retryAt > 0 && clock < retryAt)

  return (
    <section
      aria-label={title}
      style={style}
      className={cn('border-border/70 bg-background relative flex h-[min(76vh,54rem)] min-h-[34rem] w-full overflow-hidden rounded-2xl border shadow-[0_24px_64px_-44px_rgba(0,0,0,0.8)] [&_*]:[scrollbar-width:none] [&_*::-webkit-scrollbar]:hidden', fullScreen && 'h-full min-h-0 rounded-none border-0 shadow-none', className)}
    >
      <ChatSidebar
        items={chat.threads.map(({ id, title: threadTitle, pinned, archived }) => ({ id, title: threadTitle, pinned, archived }))}
        activeId={chat.activeThreadId}
        userName={userName}
        userAvatar={profileAvatar}
        mobileOpen={mobileSidebarOpen}
        desktopHidden={desktopSidebarHidden}
        onToggleDesktop={() => setDesktopSidebarHidden((hidden) => !hidden)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onNewChat={() => {
          startNewChat()
          setMobileSidebarOpen(false)
        }}
        onSelect={selectThread}
        onPin={togglePinnedThread}
        onArchive={toggleArchivedThread}
        onDelete={deleteThread}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="pointer-events-none absolute left-3 top-3 z-10 flex">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={desktopSidebarHidden ? 'Show chat history' : 'Toggle chat history'}
            title="Toggle chat history"
            className={cn('border-border/70 bg-background/90 text-[var(--chat-accent)] pointer-events-auto flex size-10 cursor-pointer items-center justify-center rounded-xl border p-2 shadow-lg backdrop-blur-xl transition-transform duration-200 hover:scale-105 active:scale-95 motion-reduce:transition-none md:hidden', mobileSidebarOpen && 'rotate-[-8deg]')}
          >
            <ChatLogo className="size-full lg:hidden" />
            <span className="hidden lg:flex">
              {desktopSidebarHidden ? <IconLayoutSidebarLeftExpand size={20} stroke={1.7} /> : <IconLayoutSidebarLeftCollapse size={20} stroke={1.7} />}
            </span>
          </button>
        </header>

        <MessageList
          className="pt-16"
          messages={messages}
          userName={userName}
          assistantName={assistantName}
          userAvatar={profileAvatar}
          assistantAvatar={assistantAvatar}
          onRetry={retryMessage}
          retryDisabled={retryDisabled}
          emptyMessage={emptyMessage}
        />

        <div className="border-border/60 shrink-0 border-t p-3 sm:p-4">
          <div className="mx-auto w-full md:max-w-3xl">
            {attachmentError ? (
              <p className="mb-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-3 py-2 text-xs text-rose-200" role="alert">{attachmentError}</p>
            ) : null}
            <ChatComposer
              actions={attachmentOptions}
              disabled={false}
              busy={sending}
              maxAttachments={maxAttachments}
              maxFileSizeBytes={maxFileSizeBytes}
              showVoice={allowVoiceInput}
              placeholder={placeholder}
              accentColor={accentColor}
              onSubmit={handleSubmit}
              onStop={stopGeneration}
              onListeningChange={onListeningChange}
              onAttachmentError={handleAttachmentError}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
