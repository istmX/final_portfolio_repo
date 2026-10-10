export type BlockProp = {
  name: string
  type: string
  description: string
}

export type BlockItem = {
  slug: string
  commandName: string
  name: string
  category: string
  description: string
  overview: string
  features: string[]
  dependencies: string[]
  files: { path: string; purpose: string }[]
  interaction: string
  accessibility: string
  limitations: string
  usage: string
  streamingUsage: string
  attachmentUsage: string
  props: BlockProp[]
}

export const BLOCK_ITEMS: BlockItem[] = [
  {
    slug: 'ai-chat',
    commandName: 'ai-chat-block',
    name: 'AI Chat',
    category: 'AI interfaces',
    description: 'A responsive assistant chat with streaming replies, file attachments, and conversation controls.',
    overview: 'Bring your own model handler and connect it to a ready-made chat workspace. The block handles the responsive conversation UI, streamed text, attachment previews, cancellation, and local chat history.',
    features: [
      'Provider-agnostic onSend handler accepts a string or an async stream.',
      'Streams plain text and code without rendering unfinished Markdown fences as raw text.',
      'Lets users stop generation, retry errors, and continue typing while a response streams.',
      'Supports image, document, audio, video, and custom attachment options.',
      'Includes local chat history with pin, archive, restore, and delete actions.',
      'Provides a collapsible desktop sidebar and a closed-by-default mobile drawer.',
      'Includes optional voice input and configurable accent color, attachment count, and response size.',
    ],
    dependencies: ['motion', '@tabler/icons-react', 'clsx', 'tailwind-merge'],
    files: [
      { path: 'index.ts', purpose: 'Public component and type exports.' },
      { path: 'ai-chat-block.tsx', purpose: 'Main block, local conversation state, model request lifecycle, streaming, retry, and stop behavior.' },
      { path: 'ai-chat-input.tsx', purpose: 'Message field, attachment selection and previews, voice input, and send controls.' },
      { path: 'chat-composer.tsx', purpose: 'Connects the main block to the message input and forwards composer events.' },
      { path: 'chat-sidebar.tsx', purpose: 'Conversation list, new chat, pin, archive, restore, delete, and account area.' },
      { path: 'message-list.tsx', purpose: 'Scrollable conversation log and empty state.' },
      { path: 'chat-message.tsx', purpose: 'User and assistant message layout, thinking disclosure, files, and errors.' },
      { path: 'message-content.tsx', purpose: 'Renders paragraphs, headings, lists, inline formatting, and live code fences.' },
      { path: 'chat-code-block.tsx', purpose: 'Finished code presentation and copy action.' },
      { path: 'code-highlighter.tsx', purpose: 'Small dependency-free tokenizer used by the code block.' },
      { path: 'attachment.tsx', purpose: 'Attachment picker dialog, file preview tiles, and enlarged previews.' },
      { path: 'default-attachments.tsx', purpose: 'Default image, document, audio, and video options.' },
      { path: 'send-button.tsx', purpose: 'Animated send, sending, stop, and sent states.' },
      { path: 'voice-button.tsx', purpose: 'Optional browser voice-input control.' },
      { path: 'chat-logo.tsx', purpose: 'Inline SVG mark used by the assistant and sidebar.' },
      { path: 'chat-user-avatar.tsx', purpose: 'Fallback user avatar; pass userAvatar to show your own profile image.' },
      { path: 'types.ts', purpose: 'Public request, response, thread, message, and attachment types.' },
      { path: 'utils.ts', purpose: 'Local Tailwind class merging helper; no shared lib/utils file is required.' },
    ],
    interaction: 'The onSend callback receives the message, selected attachments, and an AbortSignal. It can return a complete string or an async iterable of text chunks. Yield thinking-delta or reasoning-delta chunks only when you have a short, user-facing activity update to show.',
    accessibility: 'Uses native controls and labels, supports keyboard operation, exposes streaming status, respects reduced motion, and keeps attachment and chat-history actions available without hover on touch screens.',
    limitations: 'Conversation history is held in component state and is cleared when the page reloads. Connect a server-side store to persist conversations. Model credentials and provider calls belong in your application handler, not in the browser-facing component.',
    usage: `import { AiChatBlock } from '@/components/ai-chat-block'
import type { AiChatBlockProps } from '@/components/ai-chat-block'

const onSend: AiChatBlockProps['onSend'] = async ({
  message,
  attachments,
  signal,
}) => {
  const body = new FormData()
  body.set('message', message)
  attachments.forEach(({ file }) => body.append('files', file))

  const response = await fetch('/api/chat', {
    method: 'POST',
    body,
    signal,
  })

  if (!response.ok) throw new Error('The chat request failed.')
  const result = (await response.json()) as { answer: string }
  return result.answer
}

export function SupportChat() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <AiChatBlock
        title="Support assistant"
        assistantName="ISTMX AI"
        userName="You"
        accentColor="#0369a1"
        maxResponseCharacters={40_000}
        onSend={onSend}
      />
    </div>
  )
}`,
    streamingUsage: `import type { AiChatBlockProps } from '@/components/ai-chat-block'

async function* decodeTextStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      if (text) yield text
    }
    const remaining = decoder.decode()
    if (remaining) yield remaining
  } finally {
    reader.releaseLock()
  }
}

const onSend: AiChatBlockProps['onSend'] = async ({ message, attachments, signal }) => {
  const body = new FormData()
  body.set('message', message)
  attachments.forEach(({ file }) => body.append('files', file))
  const response = await fetch('/api/chat/stream', { method: 'POST', body, signal })
  if (!response.ok) throw new Error('The chat request failed.')
  return response.body ? decodeTextStream(response.body) : response.text()
}`,
    attachmentUsage: `import {
  AiChatBlock,
  DEFAULT_ATTACHMENT_OPTIONS,
} from '@/components/ai-chat-block'
import type { AiChatBlockProps, AttachmentOption } from '@/components/ai-chat-block'

const attachmentOptions: AttachmentOption[] =
  DEFAULT_ATTACHMENT_OPTIONS.filter((option) => option.id !== 'video')

export function SupportChat({ onSend }: { onSend: AiChatBlockProps['onSend'] }) {
  return (
    <AiChatBlock
      attachmentOptions={attachmentOptions}
      maxAttachments={5}
      maxFileSizeBytes={10 * 1024 * 1024}
      onSend={onSend}
    />
  )
}`,
    props: [
      { name: 'onSend', type: '(request: ChatRequest) => Promise<ChatResponse>', description: 'Required. Connect your model or API and return a string or async text stream.' },
      { name: 'initialMessages?', type: 'readonly ChatTurn[]', description: 'Messages for the first local conversation.' },
      { name: 'initialThreads?', type: 'readonly ChatThread[]', description: 'Optional local chat history to show in the sidebar.' },
      { name: 'title?', type: 'string', description: 'Heading displayed in the chat header.' },
      { name: 'description?', type: 'string', description: 'Short context shown beneath the chat heading.' },
      { name: 'assistantName? / userName?', type: 'string', description: 'Names displayed alongside each message and in the account area.' },
      { name: 'assistantAvatar? / userAvatar?', type: 'ReactNode', description: 'Optional custom avatar content for assistant and user messages.' },
      { name: 'attachmentOptions?', type: 'readonly AttachmentOption[]', description: 'File types and selection behavior offered by the plus menu.' },
      { name: 'maxAttachments?', type: 'number', description: 'Maximum files per message. Defaults to 10.' },
      { name: 'maxFileSizeBytes?', type: 'number', description: 'Optional per-file size limit.' },
      { name: 'maxResponseCharacters?', type: 'number', description: 'Maximum streamed response characters. Defaults to 60,000.' },
      { name: 'accentColor?', type: 'string', description: 'CSS color used for focus and active accents.' },
      { name: 'allowVoiceInput?', type: 'boolean', description: 'Shows the optional voice input control.' },
      { name: 'placeholder? / emptyMessage?', type: 'string', description: 'Composer placeholder and empty conversation guidance.' },
      { name: 'onListeningChange?', type: '(listening: boolean) => void', description: 'Notifies the host when voice input starts or stops.' },
      { name: 'className?', type: 'string', description: 'Additional classes for sizing and layout.' },
    ],
  },
]

export function getBlockItem(slug: string) {
  return BLOCK_ITEMS.find((item) => item.slug === slug)
}
