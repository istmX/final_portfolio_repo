'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import ChatCodeBlock from './chat-code-block'

function inlineContent(value: string): ReactNode[] {
  const parts: ReactNode[] = []
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/gu
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(value))) {
    if (match.index > cursor) parts.push(value.slice(cursor, match.index))
    const token = match[0]
    const key = `inline-${match.index}`

    if (token.startsWith('`')) {
      parts.push(
        <code
          key={key}
          className="border-border/70 bg-surface/70 rounded-md border px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--chat-accent,var(--foreground))]"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith('**')) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('*')) {
      parts.push(<em key={key}>{token.slice(1, -1)}</em>)
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/u)
      if (link) {
        const [, label, href] = link
        const safe = /^(https?:|mailto:|\/|#)/u.test(href)
        parts.push(
          safe ? (
            <a
              key={key}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              className="text-[var(--chat-accent,var(--foreground))] underline underline-offset-4"
            >
              {label}
            </a>
          ) : (
            label
          ),
        )
      }
    }
    cursor = pattern.lastIndex
  }

  if (cursor < value.length) parts.push(value.slice(cursor))
  return parts
}

type MessageBlock =
  | { kind: 'code'; language: string; value: string }
  | { kind: 'heading'; level: number; value: string }
  | { kind: 'list'; ordered: boolean; items: string[] }
  | { kind: 'paragraph'; value: string }

type LiveBlock = { kind: 'text'; value: string } | { kind: 'code'; language: string; value: string }

function parseLiveBlocks(value: string): LiveBlock[] {
  const lines = value.split('\n')
  const blocks: LiveBlock[] = []
  let text: string[] = []
  let code: string[] | null = null
  let language = 'code'

  const flushText = () => {
    if (text.length) blocks.push({ kind: 'text', value: text.join('\n') })
    text = []
  }

  for (const line of lines) {
    const opening = line.match(/^\s*```([\w+-]*)\s*$/u)
    if (code === null && opening) {
      flushText()
      code = []
      language = opening[1] || 'code'
      continue
    }
    if (code !== null && /^\s*```\s*$/u.test(line)) {
      blocks.push({ kind: 'code', language, value: code.join('\n') })
      code = null
      continue
    }
    if (code !== null) code.push(line)
    else text.push(line)
  }

  if (code !== null) blocks.push({ kind: 'code', language, value: code.join('\n') })
  flushText()
  return blocks
}

function parseBlocks(value: string): MessageBlock[] {
  const lines = value.split('\n')
  const blocks: MessageBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const fence = line.match(/^\s*```([\w+-]*)\s*$/u)
    if (fence) {
      const code: string[] = []
      index += 1
      while (index < lines.length && !/^\s*```\s*$/u.test(lines[index])) {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push({ kind: 'code', language: fence[1] || 'code', value: code.join('\n') })
      continue
    }

    const heading = line.match(/^\s*(#{1,3})\s+(.+)$/u)
    if (heading) {
      blocks.push({ kind: 'heading', level: heading[1].length, value: heading[2] })
      index += 1
      continue
    }

    const listItem = line.match(/^\s*(?:[-*+]\s+|\d+[.)]\s+)/u)
    if (listItem) {
      const ordered = /^\s*\d+[.)]/u.test(line)
      const items: string[] = []
      while (index < lines.length) {
        const current = lines[index].match(/^\s*(?:[-*+]\s+|\d+[.)]\s+)(.+)$/u)
        if (!current) break
        items.push(current[1])
        index += 1
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }

    const paragraph = [line]
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^\s*```/u.test(lines[index]) &&
      !/^\s*#{1,3}\s/u.test(lines[index]) &&
      !/^\s*(?:[-*+]\s+|\d+[.)]\s+)/u.test(lines[index])
    ) {
      paragraph.push(lines[index])
      index += 1
    }
    blocks.push({ kind: 'paragraph', value: paragraph.join('\n') })
  }

  return blocks
}

export default function MessageContent({
  content,
  streaming = false,
  streamingDelta = '',
}: {
  content: string
  streaming?: boolean
  streamingDelta?: string
}) {
  const reduceMotion = useReducedMotion()
  const blocks = useMemo(() => streaming ? [] : parseBlocks(content), [content, streaming])
  const liveBlocks = useMemo(() => streaming ? parseLiveBlocks(content) : [], [content, streaming])

  if (!content && streaming) {
    return (
      <span className="inline-flex items-center gap-1.5" aria-label="Writing response">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            aria-hidden="true"
            className="bg-[var(--chat-accent,var(--foreground))]/70 size-1.5 animate-pulse rounded-full"
            style={{ animationDelay: `${dot * 130}ms` }}
          />
        ))}
      </span>
    )
  }

  if (streaming) {
    return (
      <div className="space-y-3 break-words text-sm leading-6">
        {liveBlocks.map((block, index) => {
          const isLast = index === liveBlocks.length - 1
          if (block.kind === 'code') {
            return (
              <div key={`live-code-${index}`} className="border-border/70 bg-[#09090b] my-2 overflow-hidden rounded-xl border text-left">
                <div className="border-neutral-800/80 bg-[#0d0d10]/95 flex items-center gap-2 border-b px-3.5 py-2">
                  <span className="text-neutral-500 font-mono text-[11px]">{block.language}</span>
                  {isLast ? <span className="bg-[var(--chat-accent)] ml-auto size-1.5 animate-pulse rounded-full" aria-label="Code is streaming" /> : null}
                </div>
                <pre className="max-w-full overflow-x-auto p-4 font-mono text-[13px] leading-6 text-neutral-100"><code>{block.value}</code></pre>
              </div>
            )
          }
          const animateDelta = isLast && !reduceMotion && streamingDelta.length > 0 && streamingDelta.length <= 240 && block.value.endsWith(streamingDelta)
          const stableText = animateDelta ? block.value.slice(0, -streamingDelta.length) : block.value
          return (
            <p key={`live-text-${index}`} className="whitespace-pre-wrap">
              {animateDelta ? stableText : null}
              {animateDelta ? (
                <motion.span
                  key={`${block.value.length}-${streamingDelta.length}`}
                  initial={{ opacity: 0.35, y: 1.5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.11, ease: 'easeOut' }}
                >
                  {streamingDelta}
                </motion.span>
              ) : block.value}
              {isLast ? <span aria-hidden="true" className="bg-[var(--chat-accent,var(--foreground))] ml-1 inline-block h-4 w-[2px] animate-pulse rounded-full align-middle" /> : null}
            </p>
          )
        })}
        {liveBlocks.length > 0 && liveBlocks[liveBlocks.length - 1].kind === 'code' ? (
          <span aria-hidden="true" className="bg-[var(--chat-accent,var(--foreground))] inline-block h-4 w-[2px] animate-pulse rounded-full align-middle" />
        ) : null}
      </div>
    )
  }

  return (
    <div className="space-y-3 text-sm leading-6">
      {blocks.map((block, index) => {
        if (block.kind === 'code') {
          return <ChatCodeBlock key={`code-${index}`} label={block.language} className="my-0">{block.value}</ChatCodeBlock>
        }

        if (block.kind === 'heading') {
          const Heading = `h${block.level}` as 'h1' | 'h2' | 'h3'
          return (
            <Heading key={`heading-${index}`} className="font-display font-semibold tracking-tight">
              {inlineContent(block.value)}
            </Heading>
          )
        }

        if (block.kind === 'list') {
          const List = block.ordered ? 'ol' : 'ul'
          return (
            <List
              key={`list-${index}`}
              className={block.ordered ? 'list-decimal space-y-1 pl-5' : 'list-disc space-y-1 pl-5'}
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{inlineContent(item)}</li>
              ))}
            </List>
          )
        }

        return (
          <p key={`paragraph-${index}`} className="whitespace-pre-wrap">
            {inlineContent(block.value)}
            {streaming && index === blocks.length - 1 ? (
              <span
                aria-hidden="true"
                className="bg-[var(--chat-accent,var(--foreground))] ml-1 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse rounded-full"
              />
            ) : null}
          </p>
        )
      })}
      {streaming && blocks.length > 0 && blocks[blocks.length - 1].kind !== 'paragraph' ? (
        <span
          aria-hidden="true"
          className="bg-[var(--chat-accent,var(--foreground))] inline-block h-4 w-[2px] animate-pulse rounded-full"
        />
      ) : null}
    </div>
  )
}
