'use client'

import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconFileCode,
} from '@tabler/icons-react'
import DoubleBorderCard from './DoubleBorderCard'
import PortfolioButton from './PortfolioButton'
import { cn } from '@/lib/utils'
import { TokenSpan, tokenizeCode } from '@/components/ui/code-highlighter'

export type CodeBlockProps = {
  children: string
  label?: string
  diff?: boolean
  expandable?: boolean
  className?: string
}

export function CodeBlock({
  children,
  label,
  diff,
  expandable = false,
  className,
}: CodeBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const codeViewportRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const id = useId()

  const rawLines = children.replace(/\r\n/g, '\n').split('\n')
  const isDiff = diff ?? rawLines.some((line) => /^[+-](\s|$)/.test(line))

  // Clean lines for tokenization (strip diff marker so code parses with syntax highlighting)
  const cleanCode = rawLines
    .map((line) => {
      if (isDiff && (line.startsWith('+') || line.startsWith('-'))) {
        return line.slice(1).replace(/^[ ]/, '')
      }
      return line
    })
    .join('\n')

  const tokenizedLines = tokenizeCode(cleanCode)

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
    <DoubleBorderCard
      className={cn('my-3 text-left', className)}
      innerClassName="border-neutral-800/80 bg-[#09090b] text-[#f5f5f5]"
    >
      {/* Header bar or top-right copy icon */}
      {label ? (
        <div className="flex items-center justify-between border-b border-neutral-800/80 bg-[#0d0d10]/95 px-3.5 py-2 sm:px-4">
          <div className="flex items-center gap-2 select-none">
            <IconFileCode
              size={14}
              className="text-neutral-500"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] text-neutral-400">
              {label}
            </span>
          </div>
          <button
            type="button"
            onClick={copyCode}
            aria-label={copied ? 'Code copied' : 'Copy code'}
            title={copied ? 'Copied' : 'Copy code'}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-neutral-500 transition-colors hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-400"
          >
            {copied ? (
              <IconCheck
                size={13}
                stroke={2}
                className="text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <IconCopy size={13} stroke={1.7} aria-hidden="true" />
            )}
          </button>
        </div>
      ) : (
        <div className="absolute top-2.5 right-2.5 z-10">
          <button
            type="button"
            onClick={copyCode}
            aria-label={copied ? 'Code copied' : 'Copy code'}
            title={copied ? 'Copied' : 'Copy code'}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-neutral-500 transition-colors hover:text-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-neutral-400"
          >
            {copied ? (
              <IconCheck
                size={13}
                stroke={2}
                className="text-emerald-400"
                aria-hidden="true"
              />
            ) : (
              <IconCopy size={13} stroke={1.7} aria-hidden="true" />
            )}
          </button>
        </div>
      )}

      {/* Code viewport with smooth expand/collapse transition */}
      <motion.div
        ref={codeViewportRef}
        initial={false}
        className="relative overflow-hidden"
        animate={{ height: expandable && !expanded ? 288 : 'auto' }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }
        }
      >
        <pre
          className="w-full max-w-full overflow-x-hidden p-4 font-mono text-[13.5px] leading-[1.7] antialiased select-text sm:p-5 sm:text-[14.5px] sm:leading-[1.72]"
          style={{
            fontFamily:
              'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          <code>
            {rawLines.map((line, index) => {
              let lineType: 'add' | 'remove' | 'normal' = 'normal'
              let marker: string | null = null

              if (isDiff) {
                if (line.startsWith('+')) {
                  lineType = 'add'
                  marker = '+'
                } else if (line.startsWith('-')) {
                  lineType = 'remove'
                  marker = '-'
                } else {
                  lineType = 'normal'
                  marker = ' '
                }
              }

              const lineTokens = tokenizedLines[index] ?? []

              return (
                <div
                  key={`${id}-line-${index}`}
                  className={cn(
                    'flex min-w-full rounded-xs',
                    lineType === 'add' && 'bg-[#2dd4bf]/[0.05]',
                    lineType === 'remove' && 'bg-[#fb7185]/[0.05]',
                  )}
                >
                  {isDiff && (
                    <span
                      aria-hidden="true"
                      style={{
                        color:
                          lineType === 'add'
                            ? '#2dd4bf'
                            : lineType === 'remove'
                              ? '#fb7185'
                              : 'transparent',
                      }}
                      className="w-5 shrink-0 text-center font-mono font-medium select-none"
                    >
                      {marker}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 [overflow-wrap:anywhere] whitespace-pre-wrap">
                    {lineTokens.length > 0 ? (
                      lineTokens.map((token, tIdx) => (
                        <TokenSpan
                          key={`${id}-line-${index}-t-${tIdx}`}
                          token={token}
                        />
                      ))
                    ) : (
                      <>&nbsp;</>
                    )}
                  </span>
                </div>
              )
            })}
          </code>
        </pre>

        {/* Expand / Collapse gradient overlay */}
        {expandable && !expanded && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#09090b] via-[#09090b]/85 to-transparent"
          />
        )}

        {expandable && (
          <motion.div
            layout
            className={cn(
              'z-10 flex justify-center',
              expanded
                ? 'sticky bottom-3 mt-3 pb-3'
                : 'absolute inset-x-0 bottom-3',
            )}
          >
            <PortfolioButton
              variant="editorial"
              ariaExpanded={expanded}
              onClick={() => {
                if (expanded) {
                  window.requestAnimationFrame(() => {
                    codeViewportRef.current?.scrollIntoView({
                      behavior: reduceMotion ? 'auto' : 'smooth',
                      block: 'start',
                    })
                  })
                }
                setExpanded((prev) => !prev)
              }}
              icon={
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={expanded ? 'collapse' : 'expand'}
                    initial={
                      reduceMotion ? { opacity: 0 } : { opacity: 0, y: 2 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -2 }}
                    transition={{ duration: reduceMotion ? 0 : 0.14 }}
                    className="inline-flex"
                  >
                    {expanded ? (
                      <IconChevronUp size={13} stroke={1.8} />
                    ) : (
                      <IconChevronDown size={13} stroke={1.8} />
                    )}
                  </motion.span>
                </AnimatePresence>
              }
            >
              {expanded ? 'Collapse code' : 'Expand code'}
            </PortfolioButton>
          </motion.div>
        )}
      </motion.div>
    </DoubleBorderCard>
  )
}

export default CodeBlock
