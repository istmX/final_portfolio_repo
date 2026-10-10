'use client'

import { useEffect, useRef, useState } from 'react'
import {
  IconCamera,
  IconFile,
  IconHeadphones,
  IconPhoto,
} from '@tabler/icons-react'
import AiChatInput, {
  type AiChatInputAction,
  type AiChatInputAttachment,
  type AiChatInputGlow,
} from '@/components/ui/ai-chat-input'
import { cn } from '@/lib/utils'

const ACTIONS: AiChatInputAction[] = [
  {
    id: 'photos',
    label: 'Upload photos',
    hint: 'JPG, PNG or WebP',
    icon: <IconPhoto size={16} stroke={1.7} aria-hidden="true" />,
    accept: 'image/*',
    multiple: true,
  },
  {
    id: 'file',
    label: 'Attach a file',
    hint: 'Any format',
    icon: <IconFile size={16} stroke={1.7} aria-hidden="true" />,
    accept: '*/*',
    multiple: true,
  },
  {
    id: 'camera',
    label: 'Take a photo',
    hint: 'Use the device camera',
    icon: <IconCamera size={16} stroke={1.7} aria-hidden="true" />,
    accept: 'image/*',
    capture: 'environment',
  },
  {
    id: 'audio',
    label: 'Add a voice note',
    hint: 'MP3, WAV or M4A',
    icon: <IconHeadphones size={16} stroke={1.7} aria-hidden="true" />,
    accept: 'audio/*',
    multiple: true,
  },
]

const GLOW_PRESETS: ReadonlyArray<{
  id: string
  label: string
  hint: string
  glow: AiChatInputGlow
}> = [
  {
    id: 'calm',
    label: 'Calm',
    hint: '8s · 40%',
    glow: { duration: 8, intensity: 0.4 },
  },
  {
    id: 'default',
    label: 'Default',
    hint: '5s · 100%',
    glow: { duration: 5, intensity: 1 },
  },
  {
    id: 'hot',
    label: 'Hot',
    hint: '2.5s · 100%',
    glow: { duration: 2.5, intensity: 1 },
  },
]

type Submission = {
  message: string
  attachments: AiChatInputAttachment[]
}

export default function AiChatInputDemo() {
  const [listening, setListening] = useState(false)
  const [busy, setBusy] = useState(false)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [glowPreset, setGlowPreset] = useState(GLOW_PRESETS[1])
  const busyTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (busyTimer.current) window.clearTimeout(busyTimer.current)
    }
  }, [])

  function handleSubmit(message: string, attachments: AiChatInputAttachment[]) {
    setSubmission({ message, attachments })
    setBusy(true)

    if (busyTimer.current) window.clearTimeout(busyTimer.current)
    busyTimer.current = window.setTimeout(() => setBusy(false), 1800)
  }

  const status = listening ? 'Listening' : busy ? 'Generating' : 'Ready'

  return (
    <div className="bg-surface/30 rounded-xl p-4 sm:p-6">
      <div className="w-full min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
            istmx / composer
          </p>
          <p className="text-muted flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase">
            <span
              className={cn(
                'size-1.5 rounded-full transition-colors duration-300',
                listening
                  ? 'bg-foreground motion-safe:animate-pulse'
                  : busy
                    ? 'bg-foreground/60'
                    : 'bg-muted/50',
              )}
              aria-hidden="true"
            />
            {status}
          </p>
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <span className="text-muted/70 mr-1 font-mono text-[9px] tracking-[0.18em] uppercase">
            Glow
          </span>
          {GLOW_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setGlowPreset(preset)}
              aria-pressed={glowPreset.id === preset.id}
              title={`${preset.label}: ${preset.hint}`}
              className={cn(
                'border-border/70 text-muted hover:border-foreground/40 hover:text-foreground focus-visible:outline-foreground inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                glowPreset.id === preset.id &&
                  'border-foreground/50 bg-surface/60 text-foreground',
              )}
            >
              {preset.label}
              <span className="text-muted/70 font-mono text-[9px] tracking-wide">
                {preset.hint}
              </span>
            </button>
          ))}
        </div>

        <AiChatInput
          actions={ACTIONS}
          label="Message istmX"
          placeholder="Ask istmX anything, or attach something…"
          busy={busy}
          glow={glowPreset.glow}
          onSubmit={handleSubmit}
          onListeningChange={setListening}
        />

        <div className="border-border/60 bg-background/60 mt-4 rounded-xl border p-3.5 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
              Last submit
            </p>
            <p className="text-muted/70 font-mono text-[10px] tracking-[0.14em] uppercase">
              {submission
                ? `${submission.attachments.length} attachment${
                    submission.attachments.length === 1 ? '' : 's'
                  }`
                : 'Awaiting input'}
            </p>
          </div>

          <div aria-live="polite" className="mt-2.5">
            {submission ? (
              <div className="space-y-2">
                <p className="font-display text-foreground text-sm leading-6">
                  {submission.message || (
                    <span className="text-muted italic">
                      Sent with attachments only.
                    </span>
                  )}
                </p>

                {submission.attachments.length ? (
                  <ul className="flex flex-wrap gap-1.5">
                    {submission.attachments.map((item) => (
                      <li
                        key={item.id}
                        className="border-border/70 bg-surface/40 text-muted max-w-full truncate rounded-md border px-2 py-1 font-mono text-[10px] tracking-wide"
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <p className="text-muted text-sm leading-6">
                Nothing sent yet. Type a message, hit{' '}
                <kbd className="border-border/70 bg-surface/40 text-foreground rounded-md border px-1.5 py-0.5 font-mono text-[10px]">
                  Enter
                </kbd>
                , or open the <span className="text-foreground">+</span> menu to
                attach a file.
              </p>
            )}
          </div>
        </div>

        <ul className="text-muted mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.12em] uppercase">
          <li>Empty enter → shake</li>
          <li>Mic → listening state</li>
          <li>Send → check flash</li>
        </ul>
      </div>
    </div>
  )
}
