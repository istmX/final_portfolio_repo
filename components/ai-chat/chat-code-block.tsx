'use client'

import { useMemo, useState } from 'react'
import { IconCheck, IconCopy, IconFileCode } from '@tabler/icons-react'
import { tokenizeCode, TokenSpan } from '@/components/ui/code-highlighter'
import { cn } from '@/lib/utils'

export default function ChatCodeBlock({
  children,
  label = 'code',
  className,
}: {
  children: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const lines = useMemo(() => tokenizeCode(children), [children])

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(children)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={cn('border-border/70 my-3 overflow-hidden rounded-xl border bg-[#09090b] text-left', className)}>
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#0d0d10]/95 px-3.5 py-2">
        <span className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
          <IconFileCode size={14} className="text-neutral-500" aria-hidden="true" />
          {label}
        </span>
        <button type="button" onClick={copyCode} aria-label={copied ? 'Code copied' : 'Copy code'} className="flex size-7 cursor-pointer items-center justify-center rounded text-neutral-500 transition-colors hover:text-neutral-200">
          {copied ? <IconCheck size={14} className="text-emerald-400" aria-hidden="true" /> : <IconCopy size={14} aria-hidden="true" />}
        </button>
      </div>
      <pre className="max-w-full overflow-x-auto p-4 font-mono text-[13px] leading-[1.7] antialiased select-text">
        <code>{lines.map((line, lineIndex) => (
          <span key={`line-${lineIndex}`} className="block min-h-[1.7em] whitespace-pre">
            {line.length ? line.map((token, tokenIndex) => <TokenSpan key={`${lineIndex}-${tokenIndex}`} token={token} />) : <>&nbsp;</>}
          </span>
        ))}</code>
      </pre>
    </div>
  )
}
