'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CatHomeEngine, type Hud } from '@/lib/cat/engine'
import { H, W } from '@/lib/cat/room'

const EMPTY_HUD: Hud = { hunger: 70, happiness: 75, energy: 80, food: 1, water: 2, timeOfDay: 'night', lampOn: true, laserOn: false, prompt: null, message: null, state: 'idle', catName: '', carrying: false }
const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']

function shortPrompt(prompt: string) {
  if (prompt.startsWith('return to')) return 'leave for portfolio'
  if (prompt.startsWith('fill food')) return 'fill food bowl'
  if (prompt.startsWith('fill water')) return 'fill water bowl'
  if (prompt.startsWith('toss ') || prompt.startsWith('wave ')) return 'play with toy'
  if (prompt.startsWith('tuck cat')) return 'cat bed'
  if (prompt.startsWith('cardboard box')) return 'look inside the box'
  if (prompt === 'cat food cabinet') return 'restock food'
  return prompt
}

function DirectionPad({ onChange }: { onChange: (x: number, y: number) => void }) {
  const directions = [
    { key: 'up', x: 0, y: -1, icon: '↑', place: 'col-start-2 row-start-1' },
    { key: 'left', x: -1, y: 0, icon: '←', place: 'col-start-1 row-start-2' },
    { key: 'right', x: 1, y: 0, icon: '→', place: 'col-start-3 row-start-2' },
    { key: 'down', x: 0, y: 1, icon: '↓', place: 'col-start-2 row-start-3' },
  ]
  return <div role="group" aria-label="Move around the room" className="grid grid-cols-3 grid-rows-3 gap-1 touch-none">
    {directions.map((d) => <button key={d.key} type="button" aria-label={`Move ${d.key}`} className={`grid h-10 w-10 place-items-center rounded-xl bg-surface/70 font-mono text-sm text-foreground/80 shadow-sm backdrop-blur-md active:bg-foreground/20 ${d.place}`} onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onChange(d.x, d.y) }} onPointerUp={() => onChange(0, 0)} onPointerCancel={() => onChange(0, 0)} onLostPointerCapture={() => onChange(0, 0)} onClick={() => { onChange(d.x, d.y); window.setTimeout(() => onChange(0, 0), 140) }}>{d.icon}</button>)}
  </div>
}

function FloatingAction({ icon, label, onClick, active = false }: { icon: string; label: string; onClick: () => void; active?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex min-h-9 min-w-16 items-center justify-center gap-1.5 rounded-xl px-2 font-mono text-[8px] shadow-sm backdrop-blur-md transition-colors active:scale-[0.97] ${active ? 'bg-foreground/20 text-foreground' : 'bg-surface/70 text-foreground/85'}`}>
    <span className="text-[11px] leading-none">{icon}</span><span>{label}</span>
  </button>
}

function StatusMeter({ label, value }: { label: string; value: number }) {
  return <div className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2 font-mono text-[7px] text-muted sm:gap-2.5 sm:text-[8px]">
    <span>{label}</span>
    <span className="h-1.5 w-12 overflow-hidden bg-white/10 sm:w-20"><span className="block h-full bg-[#c4a77d] transition-[width] duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></span>
    <span className="tabular-nums text-foreground/75">{value}</span>
  </div>
}

export default function CatHomeGame() {
  const router = useRouter()
  const frame = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<CatHomeEngine | null>(null)
  const [hud, setHud] = useState<Hud>(EMPTY_HUD)
  const [draftName, setDraftName] = useState('')
  const [editingName, setEditingName] = useState(false)

  useEffect(() => {
    const el = canvas.current!
    const game = new CatHomeEngine(el, setHud, () => router.push('/home'))
    engine.current = game
    game.start()
    const fit = () => {
      if (!frame.current) return
      const { width, height } = frame.current.getBoundingClientRect()
      if (width <= 0 || height <= 0) return
      const pixelScale = Math.max(width / W, height / H)
      game.resizeViewport(width / pixelScale, height / pixelScale)
      el.style.width = `${Math.floor(width)}px`
      el.style.height = `${Math.floor(height)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(frame.current!)
    const down = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      if (MOVE_KEYS.includes(event.code) || ['Space'].includes(event.code)) event.preventDefault()
      game.keyDown(event.code, event.repeat)
    }
    const up = (event: KeyboardEvent) => game.keyUp(event.code)
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

  const showNameEditor = !hud.catName || editingName
  return <section aria-label="Cat Home pixel-art game" className="flex h-dvh w-full flex-col overflow-hidden px-3 py-3 sm:px-6 sm:py-4">
    <header className="mb-3 flex shrink-0 items-center justify-between gap-3 sm:mb-4">
      <div className="flex min-w-0 items-center gap-3">
        <h1 className="shrink-0 font-display text-[10px] font-semibold tracking-[0.17em] text-foreground sm:text-xs">CAT HOME</h1>
        <span aria-hidden="true" className="text-border">·</span>
        {showNameEditor ? <form className="flex min-w-0 items-center gap-1 font-mono text-[8px] sm:text-[9px]" onSubmit={(event) => { event.preventDefault(); const name = draftName.trim(); if (name) { engine.current?.setCatName(name); setEditingName(false) } }}>
          <label htmlFor="cat-name" className="whitespace-nowrap text-muted">{editingName ? 'rename:' : <><span className="sm:hidden">name:</span><span className="hidden sm:inline">What should I call you?</span></>}</label>
          <input id="cat-name" aria-label="Cat nickname" autoFocus={!hud.catName} value={draftName} onChange={(event) => setDraftName(event.target.value)} maxLength={14} className="w-[76px] border-b border-border/70 bg-transparent px-1 py-1 text-foreground outline-none placeholder:text-muted/50 focus:border-foreground sm:w-24" placeholder="nickname" />
          <button type="submit" className="px-1 text-muted hover:text-foreground" aria-label="Save cat nickname">↵</button>
        </form> : <button type="button" onClick={() => { setDraftName(hud.catName); setEditingName(true) }} className="truncate font-mono text-[8px] text-muted hover:text-foreground sm:text-[9px]">{hud.catName}<span className="ml-1 text-muted/50">✎</span></button>}
      </div>
      <Link href="/home" className="shrink-0 font-mono text-[8px] tracking-[0.08em] text-muted transition-colors hover:text-foreground sm:text-[9px]">← PORTFOLIO</Link>
    </header>

    <div ref={frame} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#0a0a0e]" style={{ touchAction: 'none' }} onPointerMove={(event) => {
      if (!hud.laserOn || !frame.current) return
      const rect = frame.current.getBoundingClientRect()
      engine.current?.setLaserViewportPosition((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
    }}>
      <canvas ref={canvas} className="block max-h-full max-w-full" style={{ imageRendering: 'pixelated' }} aria-label="Walk around and explore the Cat Home room" role="img" />
      <div className="pointer-events-none absolute right-3 top-3 z-10 grid gap-2 rounded-2xl bg-surface/70 p-3 shadow-sm backdrop-blur-md sm:right-5 sm:top-5 sm:gap-2.5 sm:p-3.5">
        <StatusMeter label="HUNGER" value={hud.hunger} />
        <StatusMeter label="HAPPY" value={hud.happiness} />
        <StatusMeter label="ENERGY" value={hud.energy} />
        <span className="font-mono text-[7px] text-muted/75 sm:text-[8px]">food {hud.food}/3 <span className="mx-1 text-border">·</span> water {hud.water}/3</span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-1 sm:bottom-4">
        {hud.message && <div className="border border-white/10 bg-black/75 px-2 py-1 font-mono text-[8px] text-white/85 shadow-lg sm:text-[9px]">{hud.message}</div>}
        {hud.prompt && <div className="border border-white/15 bg-black/80 px-2.5 py-1.5 font-mono text-[8px] text-white/90 shadow-lg sm:text-[9px]"><span className="font-semibold text-[#e6c99d]">E</span><span className="text-white/45"> · </span>{shortPrompt(hud.prompt)}</div>}
      </div>
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-20 sm:hidden">
        <DirectionPad onChange={(x, y) => engine.current?.setJoystick(x, y)} />
      </div>
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-3 z-20 grid grid-cols-2 gap-1.5 sm:hidden">
        {hud.prompt && <div className="col-span-2"><FloatingAction icon="E" label={shortPrompt(hud.prompt)} active onClick={() => engine.current?.interact()} /></div>}
        <FloatingAction icon="♡" label="Cuddle" onClick={() => engine.current?.cuddle()} />
        <FloatingAction icon={hud.carrying ? '↓' : '↟'} label={hud.carrying ? 'Set down' : 'Carry'} onClick={() => engine.current?.toggleCarryCat()} />
        <FloatingAction icon="✦" label="Play" onClick={() => engine.current?.playWithCat()} />
        <FloatingAction icon="Z" label="Nap" onClick={() => engine.current?.sleepCat()} />
        <FloatingAction icon="⌕" label="Call" onClick={() => engine.current?.callCat()} />
        <FloatingAction icon="＋" label="Feed" onClick={() => engine.current?.feedCat()} />
        <FloatingAction icon="◉" label={hud.laserOn ? 'Laser on' : 'Laser'} active={hud.laserOn} onClick={() => engine.current?.toggleLaser()} />
      </div>
      <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[8px] tracking-wide text-white/60 sm:block">
        WASD / arrows · E interact · C cuddle · H carry · R play · Z nap · Q call · F feed · L laser
      </div>
    </div>
  </section>
}
