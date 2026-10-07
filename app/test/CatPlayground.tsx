'use client'

import { useState } from 'react'
import {
  PixelCat,
  type PixelCatBreed,
  type PixelCatPose,
  type PixelCatPosition,
} from '@/components/ui/pixel-cat'
import { cn } from '@/lib/utils'

const BREEDS: { id: PixelCatBreed; name: string; desc: string; dot: string }[] =
  [
    {
      id: 'white',
      name: 'White / Cloud',
      desc: 'Classic studio companion',
      dot: 'bg-zinc-200 border-zinc-400',
    },
    {
      id: 'orange',
      name: 'Orange Tabby',
      desc: 'Energetic ginger companion',
      dot: 'bg-amber-500 border-amber-600',
    },
    {
      id: 'black',
      name: 'Midnight / Tuxedo',
      desc: 'Golden glowing eyes',
      dot: 'bg-zinc-900 border-yellow-400',
    },
    {
      id: 'calico',
      name: 'Calico',
      desc: 'Three-tone calico fur',
      dot: 'bg-amber-200 border-orange-500',
    },
    {
      id: 'gray',
      name: 'Silver / Gray',
      desc: 'Sleek British Shorthair',
      dot: 'bg-slate-400 border-slate-600',
    },
  ]

const SIZES = [28, 36, 48, 64]
const SPEEDS = [0.5, 1, 1.5, 2]
const POSES: (PixelCatPose | 'auto')[] = [
  'auto',
  'sit',
  'sleep',
  'groom',
  'stretch',
  'happy',
  'alert',
  'walk',
]
const POSITIONS: { id: PixelCatPosition; label: string }[] = [
  { id: 'random', label: 'Random' },
  { id: 'center', label: 'Center' },
  { id: 'bottom-left', label: 'Bottom Left' },
  { id: 'bottom-right', label: 'Bottom Right' },
  { id: 'top-left', label: 'Top Left' },
  { id: 'top-right', label: 'Top Right' },
]

export default function CatPlayground() {
  const [breed, setBreed] = useState<PixelCatBreed>('orange')
  const [size, setSize] = useState<number>(40)
  const [speed, setSpeed] = useState<number>(1)
  const [wandering, setWandering] = useState<boolean>(true)
  const [selectedPose, setSelectedPose] = useState<PixelCatPose | 'auto'>(
    'auto',
  )
  const [position, setPosition] = useState<PixelCatPosition>('random')
  const [cursorInteraction, setCursorInteraction] = useState<boolean>(true)
  const [petStats, setPetStats] = useState({ count: 0, lastPose: 'sit' })
  const [refreshKey, setRefreshKey] = useState(0)

  const resetPlayground = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <div className="mt-8 space-y-10">
      {/* Interactive Movement World */}
      <div className="space-y-3">
        <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-3 text-xs">
          <span>
            Parent Movement World (moves strictly inside this container)
          </span>
          <div className="flex items-center gap-3">
            <span>
              Petted:{' '}
              <strong className="text-foreground">{petStats.count}</strong>{' '}
              times
            </span>
            <span>•</span>
            <span>
              Active state:{' '}
              <strong className="text-foreground font-mono">
                {petStats.lastPose}
              </strong>
            </span>
            <button
              onClick={resetPlayground}
              className="border-border bg-muted/40 text-foreground hover:bg-muted cursor-pointer rounded border px-2 py-0.5 text-xs transition-colors"
            >
              Respawn
            </button>
          </div>
        </div>

        <div className="border-border/80 relative h-[420px] w-full overflow-hidden rounded-2xl border bg-zinc-950/40 p-4 shadow-inner backdrop-blur-sm">
          {/* Subtle grid pattern representing the world */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Interactive World Instructions Overlay */}
          <div className="pointer-events-none absolute top-4 left-4 z-0 max-w-xs space-y-1">
            <p className="text-foreground/80 text-xs font-medium">
              Container Playground
            </p>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              Move your mouse near the cat to observe curiosity, or click to pet
              with hearts and purrs.
            </p>
          </div>

          <div className="pointer-events-none absolute right-4 bottom-4 z-0 text-right">
            <span className="text-muted-foreground/60 font-mono text-[10px]">
              boundary: &apos;parent&apos; • size: {size}px • breed: {breed}
            </span>
          </div>

          {/* The Cat Component Living in this Container */}
          <PixelCat
            key={`${refreshKey}-${breed}-${size}-${position}`}
            breed={breed}
            size={size}
            speed={speed}
            wandering={wandering}
            cursorInteraction={cursorInteraction}
            position={position}
            pose={selectedPose === 'auto' ? undefined : selectedPose}
            onPet={(state) =>
              setPetStats({ count: state.count, lastPose: state.pose })
            }
            onPoseChange={(p) =>
              setPetStats((prev) => ({ ...prev, lastPose: p }))
            }
          />
        </div>
      </div>

      {/* Control Panel */}
      <div className="border-border bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="text-muted-foreground mb-5 font-mono text-xs font-semibold tracking-wider uppercase">
          Component Controls
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Breed Selection */}
          <div className="space-y-2">
            <label className="text-foreground text-xs font-medium">
              Breed / Coat Pattern
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {BREEDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBreed(b.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all',
                    breed === b.id
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground',
                  )}
                >
                  <span
                    className={cn('h-2.5 w-2.5 rounded-full border', b.dot)}
                  />
                  <span className="truncate">{b.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size & Speed */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-medium">Size</span>
                <span className="text-muted-foreground font-mono">
                  {size}px
                </span>
              </div>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md border py-1 font-mono text-xs transition-colors',
                      size === s
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                  >
                    {s}px
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground font-medium">Speed</span>
                <span className="text-muted-foreground font-mono">
                  {speed}x
                </span>
              </div>
              <div className="flex gap-2">
                {SPEEDS.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => setSpeed(sp)}
                    className={cn(
                      'flex-1 cursor-pointer rounded-md border py-1 font-mono text-xs transition-colors',
                      speed === sp
                        ? 'border-primary bg-primary/10 text-primary font-semibold'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                  >
                    {sp}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Behavior & Poses */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-medium">
                Lock Pose (or Auto)
              </label>
              <select
                value={selectedPose}
                onChange={(e) =>
                  setSelectedPose(e.target.value as PixelCatPose | 'auto')
                }
                className="border-border bg-background text-foreground focus:ring-primary w-full rounded-md border px-2.5 py-1.5 text-xs focus:ring-1 focus:outline-none"
              >
                {POSES.map((p) => (
                  <option key={p} value={p}>
                    {p === 'auto' ? 'Auto Behavior Cycle' : `Locked: ${p}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-medium">
                Initial Position
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {POSITIONS.map((pos) => (
                  <button
                    key={typeof pos.id === 'string' ? pos.id : 'custom'}
                    onClick={() => setPosition(pos.id)}
                    className={cn(
                      'cursor-pointer truncate rounded border px-1 py-1 text-[11px] transition-colors',
                      position === pos.id
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border bg-background hover:bg-muted text-muted-foreground',
                    )}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="border-border/60 mt-6 flex flex-wrap items-center gap-6 border-t pt-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={wandering}
              onChange={(e) => setWandering(e.target.checked)}
              className="border-border accent-primary cursor-pointer rounded"
            />
            <span className="text-foreground font-medium">
              Autonomous Wandering
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={cursorInteraction}
              onChange={(e) => setCursorInteraction(e.target.checked)}
              className="border-border accent-primary cursor-pointer rounded"
            />
            <span className="text-foreground font-medium">
              Cursor Interaction / Curiosity
            </span>
          </label>
        </div>
      </div>

      {/* Multiple Container Examples: Showing how it adapts to ANY parent container */}
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-lg tracking-tight sm:text-xl">
            Parent Container Worlds in Action
          </h3>
          <p className="text-muted-foreground mt-1 text-xs">
            Placing Pixel Cat in cards, headers, or widgets. The cat never
            escapes its parent element.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Sleeping Loaf on Header */}
          <div className="border-border bg-card relative flex h-56 flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-sm">
            <div className="space-y-1">
              <span className="text-primary font-mono text-[10px] font-semibold tracking-widest uppercase">
                Stationary Loaf
              </span>
              <h4 className="text-foreground text-sm font-medium">
                Sleeping on a Card
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Set{' '}
                <code className="text-foreground bg-muted rounded px-1 py-0.5 text-[11px]">
                  wandering=&#123;false&#125;
                </code>{' '}
                and{' '}
                <code className="text-foreground bg-muted rounded px-1 py-0.5 text-[11px]">
                  pose=&quot;sleep&quot;
                </code>{' '}
                to make a cozy mascot.
              </p>
            </div>
            {/* The cat sitting inside this card */}
            <PixelCat
              breed="orange"
              size={36}
              wandering={false}
              pose="sleep"
              position="bottom-right"
              padding={12}
            />
          </div>

          {/* Card 2: Interactive Black Cat in Small Card */}
          <div className="border-border bg-card relative flex h-56 flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-sm">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-amber-500 uppercase">
                Tuxedo Companion
              </span>
              <h4 className="text-foreground text-sm font-medium">
                Confined to Card Boundaries
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Cat wanders only within this card. Hover or poke to see it react
                within the frame.
              </p>
            </div>
            <PixelCat
              breed="black"
              size={32}
              speed={1.2}
              wandering={true}
              position="center"
              padding={8}
            />
          </div>

          {/* Card 3: Calico Cat Grooming */}
          <div className="border-border bg-card relative flex h-56 flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-sm">
            <div className="space-y-1">
              <span className="font-mono text-[10px] font-semibold tracking-widest text-rose-500 uppercase">
                Calico Mascot
              </span>
              <h4 className="text-foreground text-sm font-medium">
                Interactive Grooming
              </h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Click this calico cat to pet it and trigger floating hearts and
                cheerful meows.
              </p>
            </div>
            <PixelCat
              breed="calico"
              size={36}
              wandering={false}
              pose="groom"
              position="bottom-right"
              padding={12}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
