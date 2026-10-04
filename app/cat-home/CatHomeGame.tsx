'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { CatHomeEngine, type Hud } from '@/lib/cat/engine'
import { H, W } from '@/lib/cat/room'

const EMPTY_HUD: Hud = { hunger: 70, happiness: 75, energy: 80, food: 1, water: 2, timeOfDay: 'night', lampOn: true, laserOn: false, prompt: null, message: null, state: 'idle', catName: '', carrying: false, actions: [], globalActions: [], affection: 0, tutorialHint: null, discoveryHint: null, interactionFeedback: null, hasSeenHelp: false }
const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyA', 'KeyS', 'KeyD']

function shortPrompt(prompt: string) {
  if (prompt.startsWith('return to')) return 'return to portfolio'
  if (prompt.startsWith('fill food')) return 'fill food bowl'
  if (prompt.startsWith('fill water')) return 'fill water bowl'
  if (prompt.startsWith('pick up & toss')) return 'pick up & toss toy'
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
    {directions.map((d) => <button key={d.key} type="button" aria-label={`Move ${d.key}`} className={`grid h-10 w-10 place-items-center border border-[#4a4545] bg-[#17171c] font-mono text-sm text-[#e4dfd4] active:bg-[#39323a] ${d.place}`} onPointerDown={(e) => { e.preventDefault(); e.currentTarget.setPointerCapture(e.pointerId); onChange(d.x, d.y) }} onPointerUp={() => onChange(0, 0)} onPointerCancel={() => onChange(0, 0)} onLostPointerCapture={() => onChange(0, 0)} onClick={(e) => { if (e.detail === 0) { onChange(d.x, d.y); window.setTimeout(() => onChange(0, 0), 140) } }}>{d.icon}</button>)}
  </div>
}

function FloatingAction({ shortcut, label, onClick, active = false }: { shortcut: string; label: string; onClick: () => void; active?: boolean }) {
  return <button type="button" onClick={onClick} className={`flex min-h-9 items-center justify-center gap-1.5 border px-2 font-mono text-[8px] transition-colors active:bg-[#39323a] motion-reduce:transition-none ${active ? 'border-[#d6b88d] bg-[#29232a] text-[#f2dfc4]' : 'border-[#4a4545] bg-[#17171c] text-[#e4dfd4]'}`}>
    <span className="border border-[#766650] px-1 py-0.5 text-[8px] leading-none text-[#e1c59b]">{shortcut}</span><span>{label}</span>
  </button>
}

function StatusMeter({ label, value }: { label: string; value: number }) {
  const [expanded, setExpanded] = useState(false)
  const explanations: Record<string, string> = {
    HUNGER: 'How recently your cat has eaten.',
    HAPPY: 'A little attention and play help this stay up.',
    ENERGY: 'Rest helps your cat recharge.',
  }
  return <button type="button" title={explanations[label]} aria-label={`${label}: ${value}. ${explanations[label]}`} aria-expanded={expanded} onClick={() => setExpanded((isExpanded) => !isExpanded)} className="grid min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2 text-left font-mono text-[7px] text-[#c5bfb4] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e1c59b] sm:gap-2.5 sm:text-[8px]">
    <span>{label}</span>
    <span className="h-1.5 w-12 overflow-hidden border border-[#514a42] bg-[#111116] sm:w-20"><span className="block h-full bg-[#c4a77d] transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></span>
    <span className="tabular-nums text-[#eee5d7]">{value}</span>
    {expanded && <span className="col-span-3 max-w-48 text-[7px] leading-relaxed text-[#aaa397]">{explanations[label]}</span>}
  </button>
}

const HELP_CONTROLS = [
  ['E', 'Interact with what is nearby'], ['C', 'Cuddle your cat'], ['Q', 'Call your cat'], ['H', 'Pick up / set down'],
  ['R', 'Invite your cat to play'], ['F', 'Offer food'], ['L', 'Use the laser pointer'], ['Z', 'Encourage a nap'],
] as const

export default function CatHomeGame() {
  const router = useRouter()
  const frame = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const engine = useRef<CatHomeEngine | null>(null)
  const [hud, setHud] = useState<Hud>(EMPTY_HUD)
  const [draftName, setDraftName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpOpenRef = useRef(false)

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
      if (event.code === 'Escape') {
        helpOpenRef.current = false
        setHelpOpen(false)
        game.clearKeys()
        return
      }
      if (helpOpenRef.current) return
      if (event.target instanceof HTMLElement && event.target.closest('button, a')) return
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

    <div ref={frame} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#0a0a0e]" style={{ touchAction: 'none' }} onPointerDown={(event) => {
      const target = event.target
      if (helpOpenRef.current && target instanceof Element && !target.closest('#cat-home-help, [aria-controls="cat-home-help"]')) {
        helpOpenRef.current = false
        setHelpOpen(false)
      }
    }} onPointerMove={(event) => {
      if (!hud.laserOn || !frame.current) return
      const rect = frame.current.getBoundingClientRect()
      engine.current?.setLaserViewportPosition((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
    }}>
      <canvas ref={canvas} className="block max-h-full max-w-full" style={{ imageRendering: 'pixelated' }} aria-label="Walk around and explore the Cat Home room" role="img" />
      <div className="absolute right-2 top-2 z-10 grid gap-1.5 border border-[#4a4545] bg-[#17171c]/95 p-2 sm:right-4 sm:top-4 sm:gap-2 sm:p-3">
        <div className="flex items-center justify-between gap-3 font-mono text-[7px] tracking-[0.12em] text-[#e1c59b]"><span>YOUR CAT</span><span className="tracking-normal text-[#f2d7da]">♥ {hud.affection}</span></div>
        <StatusMeter label="HUNGER" value={hud.hunger} />
        <StatusMeter label="HAPPY" value={hud.happiness} />
        <StatusMeter label="ENERGY" value={hud.energy} />
        <span className="font-mono text-[7px] text-[#aaa397] sm:text-[8px]">food {hud.food}/3 <span className="mx-1 text-[#5d574d]">·</span> water {hud.water}/3</span>
      </div>
      <button type="button" aria-expanded={helpOpen} aria-controls="cat-home-help" onClick={() => {
        const next = !helpOpen
        helpOpenRef.current = next
        setHelpOpen(next)
        if (next) engine.current?.markHelpSeen()
      }} className="absolute left-2 top-2 z-20 grid h-7 w-7 place-items-center border border-[#625744] bg-[#17171c] font-mono text-[10px] text-[#e1c59b] hover:bg-[#29232a] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#e1c59b] sm:left-4 sm:top-4" title="How to play">?</button>
      {helpOpen && <aside id="cat-home-help" aria-label="How to play" className="absolute left-2 top-11 z-30 w-[min(15rem,calc(100%-1rem))] border-2 border-[#6b5c47] bg-[#17171c] p-3 font-mono text-[#e9e1d5] shadow-[2px_2px_0_#09090b] sm:left-4 sm:top-12">
        <div className="mb-2 flex items-center justify-between border-b border-[#4a4545] pb-2"><h2 className="text-[9px] tracking-[0.14em] text-[#e1c59b]">HOW TO PLAY</h2><button type="button" aria-label="Close help" onClick={() => { helpOpenRef.current = false; setHelpOpen(false) }} className="px-2 py-1 text-xs text-[#c5bfb4] hover:text-white focus-visible:outline focus-visible:outline-1">×</button></div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[8px] leading-relaxed sm:text-[9px]">
          <dt className="text-[#e1c59b]"><span className="sm:hidden">Touch pad</span><span className="hidden sm:inline">WASD / arrows</span></dt><dd className="text-[#c5bfb4]"><span className="sm:hidden">Move around</span><span className="hidden sm:inline">Move around</span></dd>
          {HELP_CONTROLS.map(([key, label]) => <div key={key} className="contents"><dt className="text-[#e1c59b]">{key}</dt><dd className="text-[#c5bfb4]">{label}</dd></div>)}
        </dl>
        <p className="mt-2 border-t border-[#4a4545] pt-2 text-[7px] text-[#aaa397]">Move close to things to discover what they do.</p>
      </aside>}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-1 sm:bottom-4">
        {hud.message && <div aria-live="polite" className="border border-[#4c4540] bg-[#121217]/95 px-2 py-1 font-mono text-[8px] text-[#eee5d7] sm:text-[9px]">{hud.message}</div>}
        {hud.tutorialHint && <div className="border border-[#4c4540] bg-[#121217]/90 px-2 py-1 font-mono text-[7px] text-[#c5bfb4] sm:text-[8px]"><span className="sm:hidden">Touch the arrows to explore.</span><span className="hidden sm:inline">{hud.tutorialHint}</span></div>}
        {hud.discoveryHint && <div className="border border-[#514a42] bg-[#17171c]/90 px-2 py-1 font-mono text-[7px] text-[#cdb995]">{hud.discoveryHint}</div>}
        {!hud.message && !hud.discoveryHint && hud.interactionFeedback && <div className="border border-[#514a42] bg-[#17171c]/90 px-2 py-1 font-mono text-[7px] text-[#cdb995]">{hud.interactionFeedback}</div>}
        {hud.prompt && <div className="border border-[#625744] bg-[#17171c]/95 px-2.5 py-1.5 font-mono text-[8px] text-[#eee5d7] sm:text-[9px]"><span className="font-semibold text-[#e6c99d]">{shortPrompt(hud.prompt)}</span></div>}
      </div>
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-20 sm:hidden">
        <DirectionPad onChange={(x, y) => engine.current?.setJoystick(x, y)} />
      </div>
      <div className="absolute bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-2 z-20 flex max-w-[58%] flex-wrap justify-end gap-1 sm:hidden">
        {hud.actions.map((choice) => <FloatingAction key={choice.key} shortcut={choice.key} label={choice.label} active={choice.action === 'interact'} onClick={() => engine.current?.performAction(choice.action)} />)}
        {hud.globalActions.map((choice) => <FloatingAction key={choice.key} shortcut={choice.key} label={choice.action === 'laser' ? hud.laserOn ? 'Laser off' : 'Laser' : choice.label} active={choice.action === 'laser' && hud.laserOn} onClick={() => engine.current?.performAction(choice.action)} />)}
      </div>
      {hud.prompt && <div className="absolute bottom-3 left-1/2 z-20 hidden -translate-x-1/2 gap-1 border border-[#514a42] bg-[#17171c]/95 p-1 sm:flex">
        {hud.actions.map((choice) => <FloatingAction key={choice.key} shortcut={choice.key} label={choice.label} active={choice.action === 'interact'} onClick={() => engine.current?.performAction(choice.action)} />)}
      </div>}
    </div>
  </section>
}
