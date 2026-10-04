'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react'
import { CAT_SIZE } from '@/lib/cat/sprite'
import CatSprite, { type CatSpritePose } from './CatSprite'

type Pose = CatSpritePose
type Controls = { stop: () => void; pause: () => void; play: () => void }

const MESSAGES = ['meow', 'meow!', 'purrr...', 'mrrp', ':3']

const rand = (min: number, max: number) => min + Math.random() * (max - min)

function PixelCat() {
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const [pose, setPose] = useState<Pose>('sit')
  const [facing, setFacing] = useState<1 | -1>(1)
  const [message, setMessage] = useState<string | null>(null)
  const [dialog, setDialog] = useState<'above' | 'below' | null>(null)

  const cursor = useRef<{ x: number; y: number } | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const controls = useRef(new Set<Controls>())
  const dialogOpen = useRef(false)
  const wantPose = useRef<Pose>('sit')

  /** Sets the pose the cat wants; shown immediately unless the dialogue is open. */
  function applyPose(p: Pose) {
    wantPose.current = p
    if (!dialogOpen.current) setPose(p)
  }

  function closeDialog() {
    dialogOpen.current = false
    setDialog(null)
    controls.current.forEach((c) => c.play())
    setPose(wantPose.current)
  }

  function openDialog() {
    dialogOpen.current = true
    setDialog(y.get() < 80 ? 'below' : 'above')
    setMessage(null)
    controls.current.forEach((c) => c.pause())
    setPose('alert')
  }

  // Track the cursor passively (never intercepts events).
  useEffect(() => {
    function onMove(event: PointerEvent) {
      if (event.pointerType === 'touch') return
      cursor.current = { x: event.clientX, y: event.clientY }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // Close the invitation on Escape, outside click or after a while.
  useEffect(() => {
    if (!dialog) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDialog()
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) closeDialog()
    }
    const timeout = window.setTimeout(closeDialog, 9000)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [dialog])

  useEffect(() => {
    let cancelled = false
    const timers = new Set<number>()
    const pending = new Set<() => void>()
    const active = controls.current

    const size = () => root.current?.offsetWidth ?? CAT_SIZE

    function wait(ms: number, wakeOnCursor = false) {
      return new Promise<void>((resolve) => {
        let poll = 0
        const finish = () => {
          window.clearTimeout(t)
          window.clearInterval(poll)
          timers.delete(t)
          pending.delete(finish)
          resolve()
        }
        const t = window.setTimeout(finish, ms)
        timers.add(t)
        pending.add(finish)
        if (wakeOnCursor) {
          poll = window.setInterval(() => {
            if (distanceToCursor() < 90) finish()
          }, 300)
        }
      })
    }

    function distanceToCursor() {
      const c = cursor.current
      if (!c) return Infinity
      return Math.hypot(c.x - (x.get() + size() / 2), c.y - (y.get() + size() / 2))
    }

    function bounds() {
      const s = size()
      const pad = 8
      const small = window.innerWidth < 640
      return {
        minX: pad,
        maxX: Math.max(pad, window.innerWidth - s - pad),
        // On small screens keep the cat to a lower strip of the viewport.
        minY: small ? Math.max(pad, window.innerHeight - s - 56) : pad,
        maxY: Math.max(pad, window.innerHeight - s - pad),
      }
    }

    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

    async function walkTo(tx: number, ty: number) {
      while (dialogOpen.current && !cancelled) await wait(300)
      if (cancelled) return
      const dx = tx - x.get()
      const dy = ty - y.get()
      const dist = Math.hypot(dx, dy)
      if (dist < 4) return
      setFacing(dx >= 0 ? 1 : -1)
      const duration = dist / rand(28, 44)
      applyPose('walk')
      const a = animate(x, tx, { duration, ease: 'linear' })
      const b = animate(y, ty, { duration, ease: 'linear' })
      active.add(a)
      active.add(b)
      await Promise.all([a, b]).catch(() => {})
      active.delete(a)
      active.delete(b)
    }

    async function maybeMeow() {
      if (dialogOpen.current || Math.random() > 0.14) return
      setMessage(MESSAGES[Math.floor(Math.random() * MESSAGES.length)])
      await wait(1600)
      setMessage(null)
    }

    async function run() {
      const b = bounds()
      x.set(rand(b.minX, b.maxX))
      y.set(rand(b.minY, b.maxY))

      while (!cancelled) {
        const { minX, maxX, minY, maxY } = bounds()
        const d = distanceToCursor()

        if (d < 48) {
          // Cursor too close: playfully hop away.
          const c = cursor.current!
          const cx = x.get() + size() / 2
          const cy = y.get() + size() / 2
          const ang = Math.atan2(cy - c.y, cx - c.x) + rand(-0.6, 0.6)
          const dist = rand(100, 180)
          await walkTo(
            clamp(x.get() + Math.cos(ang) * dist, minX, maxX),
            clamp(y.get() + Math.sin(ang) * dist, minY, maxY),
          )
        } else if (d < 220) {
          // Notice the cursor: look toward it, sometimes wander closer.
          const c = cursor.current!
          setFacing(c.x >= x.get() + size() / 2 ? 1 : -1)
          applyPose('alert')
          await wait(rand(900, 1800))
          if (cancelled) break
          if (Math.random() < 0.3 && cursor.current) {
            const t = cursor.current
            const ang = Math.atan2(t.y - y.get(), t.x - x.get())
            await walkTo(
              clamp(t.x - Math.cos(ang) * 70 - size() / 2, minX, maxX),
              clamp(t.y - Math.sin(ang) * 70 - size() / 2, minY, maxY),
            )
          }
        } else {
          const roll = Math.random()
          if (roll < 0.6) {
            await walkTo(rand(minX, maxX), rand(minY, maxY))
          } else if (roll < 0.8) {
            applyPose('sit')
            await maybeMeow()
            await wait(rand(3000, 7000), true)
          } else if (roll < 0.9) {
            applyPose('sleep')
            await wait(rand(7000, 14000), true)
          } else {
            applyPose('idle')
            if (Math.random() < 0.4) setFacing((f) => (f === 1 ? -1 : 1))
            await wait(rand(1200, 3000), true)
          }
        }
        if (cancelled) break
        applyPose('idle')
        await maybeMeow()
        await wait(rand(600, 2200), true)
      }
    }

    if (reduceMotion) {
      // Static, limited-motion version: sit in the bottom-left margin, rarely say meow.
      const s = size()
      x.set(12)
      y.set(window.innerHeight - s - 12)
      const onResize = () => y.set(window.innerHeight - size() - 12)
      window.addEventListener('resize', onResize)
      let alive = true
      const loop = async () => {
        while (alive) {
          await wait(rand(15000, 30000))
          if (!alive) break
          if (dialogOpen.current) continue
          setMessage('meow')
          await wait(1600)
          setMessage(null)
        }
      }
      loop()
      return () => {
        alive = false
        cancelled = true
        window.removeEventListener('resize', onResize)
        timers.forEach((t) => window.clearTimeout(t))
        pending.forEach((f) => f())
      }
    }

    run()

    return () => {
      cancelled = true
      active.forEach((c) => c.stop())
      active.clear()
      timers.forEach((t) => {
        window.clearTimeout(t)
        window.clearInterval(t)
      })
      pending.forEach((f) => f())
    }
  }, [reduceMotion, x, y])

  return (
    <motion.div
      ref={root}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-9 w-9 sm:h-10 sm:w-10 select-none"
      style={{ x, y }}
    >
      <div className="h-full w-full" style={{ transform: `scaleX(${facing})` }}>
        <CatSprite anim={pose} animated={!reduceMotion} />
      </div>

      {/* Small hit area so the cat can be clicked without making the whole page interactive. */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Say hi to the cat"
        className="pointer-events-auto absolute -inset-1 cursor-pointer"
        onClick={() => (dialogOpen.current ? closeDialog() : openDialog())}
      />

      <AnimatePresence>
        {message && !dialog && (
          <motion.span
            key={message}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-border bg-surface px-1.5 py-0.5 font-secondary text-[10px] leading-none text-foreground"
          >
            {message}
          </motion.span>
        )}
        {dialog && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, y: dialog === 'above' ? 3 : -3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-surface p-2 font-secondary text-foreground shadow-sm ${
              dialog === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <span className="text-[11px] leading-none">wanna play?</span>
            <Link
              href="/cat-home"
              className="rounded border border-border bg-background px-2 py-1 text-[10px] leading-none outline-none transition-colors hover:bg-foreground hover:text-background focus-visible:ring-1 focus-visible:ring-foreground"
            >
              Enter Cat Home
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default PixelCat
