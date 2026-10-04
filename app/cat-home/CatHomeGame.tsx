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
  prompt: null,
  message: null,
  state: 'idle',
}

const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']

function Bar({ label, value }: { label: string; value: number }) {
  const filled = Math.max(0, Math.min(10, Math.round(value / 10)))
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[#a0a0a8] text-[8px] tracking-wider">{label}</span>
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
            className={`block h-2 w-2 ${
              i < filled ? 'bg-[#f4f4f8]' : 'bg-[#22222a]'
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
  const R = 34

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
      className="relative h-24 w-24 touch-none select-none rounded-full border-2 border-[#383844] bg-black/55 backdrop-blur-sm"
      onPointerDown={(e) => {
        active.current = e.pointerId
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => active.current === e.pointerId && update(e)}
      onPointerUp={end}
      onPointerCancel={end}
      aria-label="Directional move control"
    >
      {/* Directional marks */}
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[#444455] text-[7px]">▲</span>
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[#444455] text-[7px]">▼</span>
      <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[#444455] text-[7px]">◀</span>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[#444455] text-[7px]">▶</span>

      {/* Thumb handle */}
      <span
        className="absolute left-1/2 top-1/2 block h-9 w-9 rounded-full border-2 border-[#bdbdbd] bg-[#2a2a34] shadow-md transition-transform"
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
      el.style.width = `${VW * scale}px`
      el.style.height = `${VH * scale}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(wrap.current!)

    const down = (e: KeyboardEvent) => {
      if (MOVE_KEYS.includes(e.code) || e.code === 'Space') e.preventDefault()
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
    <div
      className="relative h-full w-full overflow-hidden text-[8px] leading-none text-[#f4f4f8]"
      style={{ fontFamily: 'var(--font-pixel), monospace' }}
    >
      {/* Game Canvas Container */}
      <div ref={wrap} className="absolute inset-0 flex items-center justify-center p-2">
        <canvas
          ref={canvas}
          className="block border-2 border-[#24242c] shadow-2xl"
          style={{ imageRendering: 'pixelated' }}
          aria-label="Cat Home: an interactive pixel art room. Move with WASD or arrows, interact with E or Enter."
        />
      </div>

      {/* Top Left: Compact Cat Status HUD */}
      <div className="pointer-events-none absolute left-3 top-3 flex w-44 flex-col gap-2 rounded-sm border-2 border-[#24242c] bg-black/75 p-2.5 uppercase backdrop-blur-sm">
        <div className="flex items-center justify-between pb-1 border-b border-[#24242c] text-[#d4d4dc] font-bold">
          <span>CAT STATUS</span>
          <span className="text-[7px] text-[#8e8e9c]">({hud.state})</span>
        </div>
        <Bar label="HUNGER" value={hud.hunger} />
        <Bar label="HAPPY" value={hud.happiness} />
        <Bar label="ENERGY" value={hud.energy} />

        {/* Resources: Kibble & Fresh Water */}
        <div className="flex items-center justify-between pt-1 border-t border-[#24242c] text-[#8e8e9c]">
          <span>KIBBLE</span>
          <span className="text-[#e28f3a]">
            {'●'.repeat(hud.food) + '○'.repeat(3 - hud.food)}
          </span>
        </div>
        <div className="flex items-center justify-between text-[#8e8e9c]">
          <span>WATER</span>
          <span className="text-[#64b5f6]">
            {'●'.repeat(hud.water) + '○'.repeat(3 - hud.water)}
          </span>
        </div>
      </div>

      {/* Top Right: Time, Lamp, and Exit Controls */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {/* Toggleable Time of Day Button */}
        <button
          type="button"
          onClick={() => engine.current?.toggleTimeOfDay()}
          className="rounded-sm border-2 border-[#24242c] bg-black/75 px-2.5 py-2 text-[#d4d4dc] outline-none backdrop-blur-sm hover:border-[#bdbdbd] hover:text-[#ffffff] focus-visible:ring-1 focus-visible:ring-white active:bg-[#24242c]"
          title="Click to toggle Day / Sunset / Night atmosphere"
        >
          {timeLabel}
        </button>

        {/* Toggleable Lamp Button */}
        <button
          type="button"
          onClick={() => engine.current?.toggleLamp()}
          className="rounded-sm border-2 border-[#24242c] bg-black/75 px-2.5 py-2 text-[#d4d4dc] outline-none backdrop-blur-sm hover:border-[#bdbdbd] hover:text-[#ffffff] focus-visible:ring-1 focus-visible:ring-white active:bg-[#24242c]"
          title="Toggle Room Lamp"
        >
          {hud.lampOn ? '💡 LAMP ON' : '🌑 LAMP OFF'}
        </button>

        {/* Exit Button */}
        <Link
          href="/home"
          className="rounded-sm border-2 border-[#24242c] bg-black/75 px-2.5 py-2 text-[#bdbdbd] outline-none backdrop-blur-sm hover:border-[#bdbdbd] hover:text-[#ffffff] focus-visible:ring-1 focus-visible:ring-white"
        >
          ← PORTFOLIO
        </Link>
      </div>

      {/* Bottom Center: Interaction Prompts and Messages */}
      <div className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center gap-2 [@media(pointer:fine)]:bottom-6">
        {hud.message && (
          <div className="rounded-sm border border-[#24242c] bg-[#f4f4f8] px-3 py-2 text-[8px] text-[#141416] shadow-lg">
            {hud.message}
          </div>
        )}
        {hud.prompt && (
          <div className="rounded-sm border-2 border-[#e0e0e8] bg-black/85 px-3 py-2 text-[9px] text-[#f4f4f8] shadow-lg">
            <span className="text-[#f0b040] font-bold">E / ENTER</span> · {hud.prompt}
          </div>
        )}
        <div className="hidden text-[7px] text-[#747484] [@media(pointer:fine)]:block tracking-wider">
          WASD / ARROWS TO MOVE · E TO INTERACT · WALK TO DOOR TO LEAVE
        </div>
      </div>

      {/* Mobile Touch Controls */}
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between pointer-events-none [@media(pointer:fine)]:hidden">
        {/* Virtual Joystick */}
        <div className="pointer-events-auto">
          <Joystick onChange={(x, y) => engine.current?.setJoystick(x, y)} />
        </div>

        {/* Large Action Interact Button */}
        <div className="pointer-events-auto">
          <button
            type="button"
            className="flex h-20 w-20 touch-none select-none items-center justify-center rounded-full border-2 border-[#d4d4dc] bg-black/60 text-base font-bold text-[#f4f4f8] shadow-lg backdrop-blur-sm active:bg-[#282834] active:scale-95"
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
  )
}
