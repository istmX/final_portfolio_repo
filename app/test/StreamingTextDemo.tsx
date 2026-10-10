'use client'

import { useState } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import StreamingText, {
  type StreamingTextEffect,
} from '@/components/ui/streaming-text'
import { cn } from '@/lib/utils'

const RESPONSE =
  "Here's a first pass. I kept the layout calm, used a single accent color, and let the small details carry the rest. Want me to push the typography further?"

const EFFECTS: { id: StreamingTextEffect; label: string; note: string }[] = [
  { id: 'blur', label: 'blur', note: 'Softens then sharpens in place.' },
  { id: 'fade', label: 'fade', note: 'Pure opacity, nothing else.' },
  { id: 'slide', label: 'slide', note: 'Rises into the line.' },
  { id: 'wave', label: 'wave', note: 'Springs in with a light bounce.' },
]

export default function StreamingTextDemo() {
  const [run, setRun] = useState(0)
  const [effect, setEffect] = useState<StreamingTextEffect>('blur')

  return (
    <div className="grid gap-6">
      <div className="border-border/60 bg-surface/20 rounded-xl border p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted text-[10px] font-medium tracking-[0.16em] uppercase">
              AI response
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="border-border/60 flex items-center gap-1 rounded-lg border p-0.5">
              {EFFECTS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setEffect(option.id)}
                  className={cn(
                    'focus-visible:outline-foreground cursor-pointer rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                    effect === option.id
                      ? 'bg-foreground text-background'
                      : 'text-muted hover:text-foreground',
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRun((value) => value + 1)}
              className="border-border/60 text-muted hover:border-foreground/40 hover:text-foreground focus-visible:outline-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <IconRefresh size={14} stroke={1.8} aria-hidden="true" />
              Replay
            </button>
          </div>
        </div>

        <p className="border-border/40 mt-4 border-t pt-4">
          <StreamingText
            key={`main-${effect}-${run}`}
            text={RESPONSE}
            effect={effect}
            speed={34}
            cursorAfterComplete
            textClassName="text-sm leading-7 text-foreground sm:text-[15px] sm:leading-7"
          />
        </p>
      </div>

      <ul className="border-border/50 divide-border/50 divide-y rounded-xl border">
        {EFFECTS.map((option) => (
          <li
            key={option.id}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-4 sm:px-5 sm:py-4"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] tracking-tight">
                {option.label}
              </span>
              <span className="text-muted hidden text-[10px] sm:inline">/</span>
              <span className="text-muted hidden text-[10px] sm:inline">
                {option.note}
              </span>
            </div>
            <StreamingText
              key={`${option.id}-${run}`}
              text="The response writes itself, one character at a time."
              effect={option.id}
              speed={38}
              cursor={false}
              textClassName="text-sm leading-6 text-foreground"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
