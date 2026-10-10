'use client'

import AiChatInput from './ai-chat-input'
import type { AiChatInputAction, AiChatInputAttachment } from './ai-chat-input'

export type ChatComposerProps = {
  actions: readonly AiChatInputAction[]
  disabled?: boolean
  busy?: boolean
  maxAttachments?: number
  maxFileSizeBytes?: number
  showVoice?: boolean
  placeholder?: string
  accentColor?: string
  onSubmit: (message: string, attachments: AiChatInputAttachment[]) => void
  onStop?: () => void
  onListeningChange?: (listening: boolean) => void
  onAttachmentError?: (message: string) => void
}

export default function ChatComposer({
  actions,
  disabled,
  busy,
  maxAttachments,
  maxFileSizeBytes,
  showVoice,
  placeholder,
  accentColor,
  onSubmit,
  onStop,
  onListeningChange,
  onAttachmentError,
}: ChatComposerProps) {
  return (
    <AiChatInput
      actions={actions}
      disabled={disabled}
      busy={busy}
      maxAttachments={maxAttachments}
      maxFileSizeBytes={maxFileSizeBytes}
      showVoice={showVoice}
      placeholder={placeholder}
      glow={accentColor ? { color: accentColor } : {}}
      onSubmit={onSubmit}
      onStop={onStop}
      onListeningChange={onListeningChange}
      onAttachmentError={onAttachmentError}
    />
  )
}
