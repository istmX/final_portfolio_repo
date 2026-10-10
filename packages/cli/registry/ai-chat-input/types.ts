import type { ReactNode } from 'react'

export type ChatAttachmentKind = 'image' | 'video' | 'audio' | 'file'

export type ChatAttachment = {
  id: string
  name: string
  kind: ChatAttachmentKind
  size: number
  file: File
  url?: string
}

export type AttachmentOption = {
  id: string
  label: string
  description?: string
  icon?: ReactNode
  accept: string
  multiple?: boolean
  capture?: 'user' | 'environment'
  disabled?: boolean
  onSelect?: () => void
}

export type ChatTurn = {
  id: string
  role: 'user' | 'assistant'
  content: string

  streamingDelta?: string
  attachments?: ChatAttachment[]
  status?: 'streaming' | 'complete' | 'error'
  error?: {
    message: string
    retryAfterMs?: number
    retryAt?: number
  }
  thinking?: string
  thinkingStatus?: 'thinking' | 'complete'
}

export type ChatThread = {
  id: string
  title: string
  messages: readonly ChatTurn[]
  pinned?: boolean
  archived?: boolean
}

export type ChatRequest = {
  message: string
  attachments: readonly ChatAttachment[]
  signal: AbortSignal
}

export type ChatStreamChunk =
  | string
  | {
      content?: unknown
      text?: unknown
      delta?: unknown
      type?: 'text-delta' | 'thinking-delta' | 'reasoning-delta'
    }
  | readonly unknown[]

export type ChatResponse = string | AsyncIterable<ChatStreamChunk>

export type ChatSendError = Error & {
  retryAfterMs?: number
}
