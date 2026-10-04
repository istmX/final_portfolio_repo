'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CatHomeEngine, type Hud } from '@/lib/cat/engine'
import { VH, VW } from '@/lib/cat/room'

const EMPTY_HUD: Hud = {
  hunger: 70,
  happiness: 75,
  energy: 80,
  food: 1,
  water: 2,
  timeOfDay: 'night',
  lampOn: true,
  laserOn: false,
  prompt: null,
  message: null,
  state: 'idle',
}

const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']

function Bar({ label, value }: { label: string; value: number }) {
  const filled = Math.max(0, Math.min(10, Math.round(value / 10)))
  return (
    <div className="flex items-center justify-between gap-1.5 text-[8px]">
      <span className="text-muted tracking-wider">{label}</span>
      <span
        className="flex gap-[2px]"
        role="meter"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`block h-1.5 w-1.5 ${
              i < filled ? 'bg-foreground' : 'bg-muted/30'
            }`}
          />
        ))}
      </span>
    </div>
  )
}

function Joystick({ onChange }: { onChange: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ x: 0, y: 0 })
  const active = useRef<number | null>(null)
  const R = 32

  function update(e: React.PointerEvent) {
    const rect = base.current!.getBoundingClientRect()
    let dx = e.clientX - (rect.left + rect.width / 2)
    let dy = e.clientY - (rect.top + rect.height / 2)
    const len = Math.hypot(dx, dy)
    if (len > R) {
      dx = (dx / len) * R
      dy = (dy / len) * R
    }
    setThumb({ x: dx, y: dy })
    onChange(dx / R, dy / R)
  }

  function end() {
    active.current = null
    setThumb({ x: 0, y: 0 })
    onChange(0, 0)
  }

  return (
    <div
      ref={base}
      className="relative h-20 w-20 touch-none select-none rounded-full border-2 border-border/80 bg-background/80 backdrop-blur-sm"
      onPointerDown={(e) => {
        e.preventDefault()
        active.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => {
        e.preventDefault()
        if (active.current === e.pointerId) update(e)
      }}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Directional joystick"
    >
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-muted text-[6px]">▲</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-muted text-[6px]">▼</span>
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-muted text-[6px]">◀</span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-muted text-[6px]">▶</span>
      <span
        className="absolute left-1/2 top-1/2 block h-8 w-8 rounded-full border border-border bg-surface shadow-md transition-transform"
        style={{
          transform: `translate(calc(-50% + ${thumb.x}px), calc(-50% + ${thumb.y}px))`,
        }}
      />
    </div>
  )
}

export default function CatHomeGame() {
  const router = useRouter()
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<CatHomeEngine | null>(null)
  const [hud, setHud] = useState<Hud>(EMPTY_HUD)

  useEffect(() => {
    const el = canvas.current!
    const game = new CatHomeEngine(el, setHud, () => {
      router.push('/home')
    })
    engine.current = game
    game.start()

    const fit = () => {
      if (!wrap.current) return
      const box = wrap.current.getBoundingClientRect()
      const raw = Math.min(box.width / VW, box.height / VH)
      const scale = raw >= 2 ? Math.floor(raw) : raw
      el.style.width = `${Math.floor(VW * scale)}px`
      el.style.height = `${Math.floor(VH * scale)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap.current!)

    const down = (e: KeyboardEvent) => {
      if (MOVE_KEYS.includes(e.code) || e.code === 'Space' || e.code === 'KeyL') {
        e.preventDefault()
      }
      game.keyDown(e.code, e.repeat)
    }
    const up = (e: KeyboardEvent) => game.keyUp(e.code)
    const blur = () => game.clearKeys()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)

    return () => {
      game.stop()
      ro.disconnect()
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      engine.current = null
    }
  }, [router])

  const timeLabel = {
    day: '☀️ DAY',
    sunset: '🌅 SUNSET',
    night: '🌙 NIGHT',
  }[hud.timeOfDay]

  return (
    <section
      aria-label="Cat Home: Interactive Pixel Pet Experience"
      className="px-4 pb-14 pt-4 sm:px-8 sm:pb-16 flex flex-col items-center"
      style={{ fontFamily: 'var(--font-pixel), monospace' }}
    >
      {/* Top Header & Status Strip */}
      <div className="w-full max-w-[640px] mb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[9px] text-muted tracking-wider">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground uppercase">CAT HOME</span>
            <span className="text-[7px] text-muted">· {hud.state}</span>
          </div>
          <Link
            href="/home"
            className="text-[8px] text-muted hover:text-foreground transition-colors"
          >
            ← PORTFOLIO
          </Link>
        </div>

        {/* HUD Controls & Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded border border-dashed border-border bg-surface/30 p-2.5 backdrop-blur-sm text-[8px]">
          {/* Vitals */}
          <div className="flex items-center gap-4">
            <Bar label="HUNGER" value={hud.hunger} />
            <Bar label="HAPPY" value={hud.happiness} />
            <Bar label="ENERGY" value={hud.energy} />
          </div>

          {/* Resources */}
          <div className="flex items-center gap-3 text-muted">
            <span title="Kibble available in bowl">
              KIBBLE <span className="text-[#e28f3a]">{'●'.repeat(hud.food) + '○'.repeat(3 - hud.food)}</span>
            </span>
            <span title="Fresh water in bowl">
              WATER <span className="text-[#64b5f6]">{'●'.repeat(hud.water) + '○'.repeat(3 - hud.water)}</span>
            </span>
          </div>

          {/* Interactive Mode Toggles */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Time toggle */}
            <button
              type="button"
              onClick={() => engine.current?.toggleTimeOfDay()}
              className="rounded border border-border/80 bg-background/80 px-2 py-1 text-muted hover:border-foreground hover:text-foreground transition-colors"
              title="Toggle Day / Sunset / Night"
            >
              {timeLabel}
            </button>

            {/* Lamp toggle */}
            <button
              type="button"
              onClick={() => engine.current?.toggleLamp()}
              className="rounded border border-border/80 bg-background/80 px-2 py-1 text-muted hover:border-foreground hover:text-foreground transition-colors"
              title="Toggle desk lamp on/off"
            >
              {hud.lampOn ? '💡 LAMP' : '🌑 OFF'}
            </button>

            {/* Laser pointer toggle */}
            <button
              type="button"
              onClick={() => engine.current?.toggleLaser()}
              className={`rounded border px-2 py-1 transition-colors ${
                hud.laserOn
                  ? 'border-red-500 bg-red-950/60 text-red-300 font-bold'
                  : 'border-border/80 bg-background/80 text-muted hover:border-foreground hover:text-foreground'
              }`}
              title="Toggle Red Laser Pointer (L key)"
            >
              {hud.laserOn ? '🔴 LASER ON' : '🔴 LASER'}
            </button>
          </div>
        </div>
      </div>

      {/* Contained Game World Boundary (Inside Portfolio Container) */}
      <div
        ref={wrap}
        className="relative w-full max-w-[640px] aspect-[5/3] overflow-hidden rounded-lg border-2 border-dashed border-border bg-[#0a0a0e] shadow-2xl flex items-center justify-center select-none"
      >
        <canvas
          ref={canvas}
          className="block max-w-full max-h-full"
          style={{ imageRendering: 'pixelated' }}
          aria-label="Cat Home room canvas"
        />

        {/* Floating Contextual Prompts Inside the Room Frame */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center gap-1.5">
          {hud.message && (
            <div className="rounded border border-border bg-[#f4f4f8] px-2.5 py-1.5 text-[8px] text-[#141416] shadow-lg animate-fade-in">
              {hud.message}
            </div>
          )}
          {hud.prompt && (
            <div className="rounded border border-[#e0e0e8] bg-black/85 px-2.5 py-1.5 text-[8px] text-[#f4f4f8] shadow-lg">
              <span className="text-[#f0b040] font-bold">E / ENTER</span> · {hud.prompt}
            </div>
          )}
        </div>
      </div>

      {/* Controls Guide & Mobile Controls Bar */}
      <div className="w-full max-w-[640px] mt-3 flex items-center justify-between text-[7px] text-muted tracking-wider">
        <div className="hidden sm:block">
          WASD / ARROWS TO MOVE · E TO INTERACT · L FOR LASER · WALK TO DOOR TO EXIT
        </div>

        {/* Mobile Touch Controls Container */}
        <div className="flex sm:hidden items-center justify-between w-full pt-1">
          {/* Virtual Joystick */}
          <Joystick onChange={(x, y) => engine.current?.setJoystick(x, y)} />

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`flex h-14 w-14 touch-none select-none items-center justify-center rounded-full border text-[9px] font-bold shadow-md active:scale-95 ${
                hud.laserOn
                  ? 'border-red-500 bg-red-950/80 text-red-300'
                  : 'border-border bg-surface text-muted'
              }`}
              onPointerDown={(e) => {
                e.preventDefault()
                engine.current?.toggleLaser()
              }}
              aria-label="Toggle Laser Pointer"
            >
              🔴
            </button>

            <button
              type="button"
              className="flex h-16 w-16 touch-none select-none items-center justify-center rounded-full border-2 border-foreground bg-surface text-sm font-bold text-foreground shadow-lg active:scale-95 active:bg-foreground active:text-background"
              onPointerDown={(e) => {
                e.preventDefault()
                engine.current?.interact()
              }}
              aria-label="Interact Button"
            >
              E
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
