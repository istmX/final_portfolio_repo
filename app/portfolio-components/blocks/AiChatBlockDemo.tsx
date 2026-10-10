'use client'

import { IconMessageCircle } from '@tabler/icons-react'
import Image from 'next/image'
import { AiChatBlock } from '@/components/ai-chat'
import type { ChatRequest, ChatResponse, ChatStreamChunk, ChatThread } from '@/components/ai-chat'

const SAMPLE_ANSWER = [
  'Here’s a simple way to think about it:',
  '',
  '1. Keep the chat interface separate from the model provider.',
  '2. Pass the user message and attachments to your own handler.',
  '3. Return either a string or an async stream of text chunks.',
  '',
  '```ts',
  'const answer = await sendToYourModel(request.message)',
  'return answer',
  '```',
  '',
  'This preview streams a sample answer. Connect your own model in the onSend handler when you use the component.',
].join('\n')

async function* streamSample(signal: AbortSignal): AsyncGenerator<ChatStreamChunk> {
  yield { type: 'thinking-delta', delta: 'Reviewing the question and organizing a concise answer.' }
  await new Promise((resolve) => window.setTimeout(resolve, 450))
  const chunks = SAMPLE_ANSWER.match(/\S+\s*/gu) ?? [SAMPLE_ANSWER]
  for (const chunk of chunks) {
    if (signal.aborted) return
    await new Promise((resolve) => window.setTimeout(resolve, 34))
    yield chunk
  }
}

const PREVIEW_THREADS: ChatThread[] = [
  {
    id: 'preview-prd',
    title: 'Explain PRD understanding',
    messages: [
      { id: 'preview-prd-user', role: 'user', content: 'Summarize the main product goals.' },
      { id: 'preview-prd-assistant', role: 'assistant', content: 'The product focuses on clear community, messaging, creation, and discovery flows.', status: 'complete' },
    ],
  },
  {
    id: 'preview-budget',
    title: 'Plan a token budget',
    messages: [
      { id: 'preview-budget-user', role: 'user', content: 'How should I cap model usage?' },
      { id: 'preview-budget-assistant', role: 'assistant', content: 'Set a per-plan output cap, then track requests and token use over a defined window.', status: 'complete' },
    ],
  },
]

export default function AiChatBlockDemo({ fullBleed = false }: { fullBleed?: boolean }) {
  async function onSend(_request: ChatRequest): Promise<ChatResponse> {
    return streamSample(_request.signal)
  }

  const chat = (
    <AiChatBlock
      title="AI Chat"
      description="This is a local interaction preview. No message leaves this page."
      assistantName="ISTMX AI"
      userName="Aryan"
      userAvatar={(
        <span className="relative size-full overflow-hidden rounded-full">
          <Image src="/hero.png" alt="" fill sizes="32px" className="object-cover" />
        </span>
      )}
      accentColor="#0369a1"
      initialThreads={PREVIEW_THREADS}
      onSend={onSend}
      emptyMessage="Try asking about a topic. The preview will stream a sample response."
      fullScreen={fullBleed}
    />
  )

  if (fullBleed) return <div className="flex h-dvh min-h-0 w-full flex-col pt-14">{chat}</div>

  return (
    <section className="border-border/70 bg-surface/20 overflow-hidden rounded-2xl border">
      <div className="border-border/60 flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="bg-sky-500/10 text-sky-400 flex size-8 shrink-0 items-center justify-center rounded-lg">
            <IconMessageCircle size={17} stroke={1.7} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-medium">AI Chat</h2>
            <p className="text-muted text-[11px]">A responsive assistant chat with streaming and file attachments.</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-5">
        {chat}
      </div>
    </section>
  )
}
