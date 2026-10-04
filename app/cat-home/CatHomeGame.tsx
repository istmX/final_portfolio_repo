'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CatHomeEngine, type Hud } from '@/lib/cat/engine'
import { VH, VW } from '@/lib/cat/room'

const EMPTY_HUD: Hud = { hunger: 70, happiness: 75, energy: 80, food: 1, water: 2, timeOfDay: 'night', lampOn: true, laserOn: false, prompt: null, message: null, state: 'idle', catName: '' }
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
  return <div role="group" aria-label="Move around the room" className="grid grid-cols-3 grid-rows-3 gap-1 touch-none sm:hidden">
    {directions.map((d) => <button key={d.key} type="button" aria-label={`Move ${d.key}`} className={`grid h-8 w-8 place-items-center rounded border border-dotted border-border/70 bg-background/70 font-mono text-sm text-muted active:text-foreground ${d.place}`} onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onChange(d.x, d.y) }} onPointerUp={() => onChange(0, 0)} onPointerCancel={() => onChange(0, 0)} onLostPointerCapture={() => onChange(0, 0)} onClick={() => { onChange(d.x, d.y); window.setTimeout(() => onChange(0, 0), 140) }}>{d.icon}</button>)}
  </div>
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
      const scale = Math.min(width / VW, height / VH)
      el.style.width = `${Math.floor(VW * scale)}px`
      el.style.height = `${Math.floor(VH * scale)}px`
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

    <div className="mb-3 grid shrink-0 grid-cols-3 gap-2 border-y border-border/30 py-2 sm:mb-4 sm:flex sm:items-center sm:gap-6">
      <StatusMeter label="HUNGER" value={hud.hunger} />
      <StatusMeter label="HAPPY" value={hud.happiness} />
      <StatusMeter label="ENERGY" value={hud.energy} />
      <span className="col-span-3 font-mono text-[7px] text-muted/60 sm:ml-auto sm:text-[8px]">food {hud.food}/3 <span className="mx-1 text-border">·</span> water {hud.water}/3</span>
    </div>

    <div ref={frame} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#0a0a0e]" style={{ touchAction: 'none' }}>
      <canvas ref={canvas} className="block max-h-full max-w-full" style={{ imageRendering: 'pixelated' }} aria-label="Walk around and explore the Cat Home room" role="img" />
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center gap-1 sm:bottom-4">
        {hud.message && <div className="border border-white/10 bg-black/75 px-2 py-1 font-mono text-[8px] text-white/85 shadow-lg sm:text-[9px]">{hud.message}</div>}
        {hud.prompt && <div className="border border-white/15 bg-black/80 px-2.5 py-1.5 font-mono text-[8px] text-white/90 shadow-lg sm:text-[9px]"><span className="font-[var(--font-pixel)] text-[6px] font-bold text-[#e6c99d]">E</span><span className="text-white/45"> · </span>{shortPrompt(hud.prompt)}</div>}
      </div>
    </div>
    <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border/30 px-1 pt-2.5 sm:pt-3">
      <div className="sm:hidden"><DirectionPad onChange={(x, y) => engine.current?.setJoystick(x, y)} /></div>
      <p className="hidden font-mono text-[8px] tracking-wide text-muted/65 sm:block">WASD / arrows move <span className="mx-1 text-border">·</span> E / Enter interact <span className="mx-1 text-border">·</span> C cuddle <span className="mx-1 text-border">·</span> Q call <span className="mx-1 text-border">·</span> F feed</p>
      <span className="ml-auto font-mono text-[7px] text-muted/50 sm:hidden">move · explore</span>
      {hud.prompt && <button type="button" onClick={() => engine.current?.interact()} className="rounded border border-foreground/30 px-2.5 py-1.5 font-mono text-[8px] text-foreground sm:hidden"><span className="font-[var(--font-pixel)] text-[6px]">E</span> · {shortPrompt(hud.prompt)}</button>}
      <span className="hidden font-mono text-[8px] text-muted/55 sm:inline">{hud.timeOfDay}</span>
    </div>
  </section>
}
