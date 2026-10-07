'use client'

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Pixel Art Engine (Parametric 32x32 Cat Model)
// -----------------------------------------------------------------------------

export const CAT_SIZE = 32
export const CAT_FEET_Y = 27

export type PixelCatBreed =
  'white' | 'orange' | 'black' | 'calico' | 'gray' | 'theme'

export type PixelCatPose =
  'idle' | 'walk' | 'sit' | 'sleep' | 'alert' | 'happy' | 'stretch' | 'groom'

type Eyes = 'open' | 'blink' | 'happy' | 'closed' | 'wide'
type Mouth = 'smile' | 'open'
type TailKind = 'low' | 'mid' | 'up'
type Body = 'stand' | 'sit' | 'loaf' | 'stretch' | 'scratch'

interface CatFrame {
  body?: Body
  bob?: number
  headDX?: number
  headDY?: number
  eyes?: Eyes
  mouth?: Mouth
  tallEars?: boolean
  tail?: TailKind
  sway?: number
  legs?: 0 | 1 | 2 | 3 | 'jump'
  breath?: number
  pawLick?: boolean
}

export const CAT_PALETTES: Record<
  PixelCatBreed,
  Record<1 | 2 | 3 | 4, string>
> = {
  white: {
    1: '#f5f5f5',
    2: '#cccccc',
    3: '#18181b',
    4: '#27272a',
  },
  orange: {
    1: '#f59e0b',
    2: '#d97706',
    3: '#451a03',
    4: '#78350f',
  },
  black: {
    1: '#262626',
    2: '#3f3f46',
    3: '#facc15', // Golden glowing eyes
    4: '#09090b',
  },
  calico: {
    1: '#fef3c7',
    2: '#ea580c',
    3: '#18181b',
    4: '#27272a',
  },
  gray: {
    1: '#94a3b8',
    2: '#64748b',
    3: '#0f172a',
    4: '#1e293b',
  },
  theme: {
    1: '#e4e4e7',
    2: '#a1a1aa',
    3: '#18181b',
    4: '#27272a',
  },
}

class Grid {
  data = new Uint8Array(CAT_SIZE * CAT_SIZE)
  px(x: number, y: number, v: number) {
    if (x < 0 || y < 0 || x >= CAT_SIZE || y >= CAT_SIZE) return
    this.data[y * CAT_SIZE + x] = v
  }
  rect(x: number, y: number, w: number, h: number, v: number) {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) this.px(x + i, y + j, v)
    }
  }
  round(x: number, y: number, w: number, h: number, v: number, r = 1) {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        const cx = Math.min(i, w - 1 - i)
        const cy = Math.min(j, h - 1 - j)
        if (cx + cy < r) continue
        this.px(x + i, y + j, v)
      }
    }
  }
  outline() {
    const src = this.data.slice()
    for (let y = 0; y < CAT_SIZE; y++) {
      for (let x = 0; x < CAT_SIZE; x++) {
        if (src[y * CAT_SIZE + x]) continue
        const n =
          (x > 0 && src[y * CAT_SIZE + x - 1]) ||
          (x < CAT_SIZE - 1 && src[y * CAT_SIZE + x + 1]) ||
          (y > 0 && src[(y - 1) * CAT_SIZE + x]) ||
          (y < CAT_SIZE - 1 && src[(y + 1) * CAT_SIZE + x])
        if (n) this.data[y * CAT_SIZE + x] = 4
      }
    }
  }
}

const TAILS: Record<TailKind, [number, number][]> = {
  low: [
    [4, 15],
    [3, 16],
    [2, 17],
    [1, 18],
    [1, 20],
  ],
  mid: [
    [4, 14],
    [3, 13],
    [2, 12],
    [1, 11],
    [1, 9],
  ],
  up: [
    [4, 14],
    [3, 12],
    [3, 10],
    [2, 8],
    [3, 6],
  ],
}

function drawTail(g: Grid, kind: TailKind, sway: number, dy: number) {
  TAILS[kind].forEach(([x, y], i) => {
    const dx = i >= 4 ? sway * 2 : i >= 2 ? sway : 0
    g.rect(x + dx, y + dy, 2, 2, 1)
  })
}

function drawHead(g: Grid, hx: number, hy: number, f: CatFrame) {
  const tall = f.tallEars ? 1 : 0
  for (let row = 0; row < 4 + tall; row++) {
    const y = hy - 4 - tall + row
    const w = row - tall + 1 > 0 ? row - tall + 1 : 1
    g.rect(hx + 1, y, w, 1, 1)
    g.rect(hx + 12 - w, y, w, 1, 1)
  }
  g.px(hx + 2, hy - 2, 2)
  g.px(hx + 10, hy - 2, 2)

  g.round(hx, hy, 13, 10, 1, 2)
  g.px(hx - 1, hy + 5, 1)
  g.px(hx + 13, hy + 5, 1)

  const eye = (cx: number, mirror: boolean) => {
    const e = f.eyes ?? 'open'
    if (e === 'open') {
      const glintX = mirror ? cx : cx - 1
      g.rect(glintX, hy + 3, 2, 2, 3)
      g.px(glintX, hy + 3, 1)
    } else if (e === 'blink' || e === 'closed') {
      g.rect(mirror ? cx - 1 : cx - 1, hy + 4, 3, 1, 3)
    } else if (e === 'wide') {
      const glintX = mirror ? cx - 1 : cx - 1
      g.rect(glintX, hy + 2, 3, 3, 3)
      g.px(glintX, hy + 2, 1)
    } else if (e === 'happy') {
      g.px(cx - 1, hy + 4, 3)
      g.px(cx, hy + 3, 3)
      g.px(cx + 1, hy + 4, 3)
    }
  }
  eye(hx + 3, false)
  eye(hx + 9, true)

  g.rect(hx + 5, hy + 5, 2, 1, 3)

  if (f.mouth === 'open') {
    g.rect(hx + 5, hy + 6, 2, 2, 3)
    g.px(hx + 5, hy + 7, 2)
  } else {
    g.px(hx + 5, hy + 6, 3)
    g.px(hx + 6, hy + 6, 3)
    g.px(hx + 4, hy + 5, 3)
    g.px(hx + 7, hy + 5, 3)
  }

  g.px(hx - 2, hy + 5, 2)
  g.px(hx - 2, hy + 7, 2)
  g.px(hx + 14, hy + 5, 2)
  g.px(hx + 14, hy + 7, 2)
}

function drawLeg(g: Grid, x: number, y0: number, len: number, v: number) {
  g.rect(x, y0, 2, len, v)
}

function buildCatGrid(f: CatFrame): Uint8Array {
  const g = new Grid()
  const body = f.body ?? 'stand'
  const bob = f.bob ?? 0

  if (body === 'stand') {
    const legs = f.legs
    const spec: [number, number, 'A' | 'B'][] = [
      [5, 1, 'A'],
      [8, 2, 'B'],
      [14, 2, 'A'],
      [17, 1, 'B'],
    ]
    drawTail(g, f.tail ?? 'low', f.sway ?? 0, bob)
    spec.forEach(([x, v, pair]) => {
      let dx = 0
      let lift = 0
      if (legs === 'jump') {
        dx = x < 12 ? -2 : 2
        lift = 0
      } else if (legs !== undefined) {
        const A = pair === 'A'
        if (legs === 0) dx = A ? 1 : -1
        if (legs === 1) lift = A ? 1 : 0
        if (legs === 2) dx = A ? -1 : 1
        if (legs === 3) lift = A ? 0 : 1
      }
      const top = 22 + bob
      const len = 5 - lift - (legs === 'jump' ? 1 : 0)
      drawLeg(g, x + dx, top, Math.max(1, len), v)
    })

    g.round(4, 12 + bob, 17, 10, 1, 2)
    g.rect(6, 22 + bob, 13, 1, 1)
    g.rect(8, 23 + bob, 9, 1, 2)
    g.rect(7, 14 + bob, 3, 1, 2)
    g.rect(11, 14 + bob, 2, 1, 2)

    drawHead(g, 17 + (f.headDX ?? 0), 8 + (f.headDY ?? 0) + bob, f)
  } else if (body === 'sit') {
    for (let x = 2; x <= 22; x++) g.rect(x, 26, 1, 2, 1)
    g.rect(1, 24, 2, 3, 1)
    g.rect(23, 25, 2, 2, 1)
    g.rect(24, 23, 2, 3, 1)
    const sway = f.sway ?? 0
    if (sway) g.px(25, 22, 1)

    g.round(4, 14, 13, 12, 1, 3)
    g.round(13, 10, 10, 16, 1, 2)
    g.rect(18, 22, 3, 4, 2)
    g.rect(13, 24, 3, 2, 2)

    if (f.pawLick) {
      g.rect(18, 15, 3, 3, 1)
      g.px(19, 14, 3)
    }

    drawHead(g, 15 + (f.headDX ?? 0), 4 + (f.headDY ?? 0), f)
  } else if (body === 'loaf') {
    const b = f.breath ?? 0
    g.rect(2, 22, 2, 4, 1)
    g.round(3, 15 - b, 24, 12 + b, 1, 4)
    g.rect(5, 25, 18, 1, 2)
    g.rect(24, 23, 2, 3, 1)
    drawHead(g, 17, 14 - b, { ...f, eyes: 'closed' })
  } else if (body === 'stretch') {
    drawTail(g, 'up', 1, -2)
    drawLeg(g, 5, 18, 9, 1)
    drawLeg(g, 8, 18, 9, 2)
    g.round(5, 10, 15, 8, 1, 2)
    g.round(13, 15, 10, 8, 1, 2)
    g.rect(18, 24, 8, 2, 1)
    g.rect(20, 25, 6, 2, 2)
    drawHead(g, 19, 13, { ...f, eyes: 'closed' })
  }

  g.outline()
  return g.data
}

const IDLE_TAIL = [0, 1, 0, -1]
const idleFrames: CatFrame[] = Array.from({ length: 12 }, (_, i) => ({
  tail: 'up',
  sway: IDLE_TAIL[i % 4],
  eyes: i === 9 ? 'blink' : 'open',
}))

const ANIMATIONS: Record<PixelCatPose, { fps: number; frames: CatFrame[] }> = {
  idle: { fps: 4, frames: idleFrames },
  walk: {
    fps: 8,
    frames: [0, 1, 2, 3].map((p) => ({
      legs: p as 0 | 1 | 2 | 3,
      tail: 'up',
      sway: p % 2 === 0 ? 1 : -1,
      bob: p % 2 === 1 ? -1 : 0,
    })),
  },
  sit: {
    fps: 2,
    frames: [
      { body: 'sit' },
      { body: 'sit', sway: 1 },
      { body: 'sit' },
      { body: 'sit', eyes: 'blink' },
    ],
  },
  sleep: {
    fps: 1,
    frames: [
      { body: 'loaf', breath: 0 },
      { body: 'loaf', breath: 1 },
    ],
  },
  alert: {
    fps: 3,
    frames: [
      { eyes: 'wide', tallEars: true, tail: 'up', sway: 0 },
      { eyes: 'wide', tallEars: true, tail: 'up', sway: 1 },
    ],
  },
  happy: {
    fps: 8,
    frames: [0, -3, 0, -3].map((b, i) => ({
      bob: b,
      eyes: 'happy' as const,
      tail: 'up' as const,
      sway: i % 2 ? 1 : -1,
      legs: b < 0 ? ('jump' as const) : undefined,
    })),
  },
  stretch: {
    fps: 2,
    frames: [{ body: 'stretch' }, { body: 'stretch' }],
  },
  groom: {
    fps: 3,
    frames: [
      { body: 'sit', pawLick: true, headDX: 1, headDY: 2, eyes: 'closed' },
      { body: 'sit', pawLick: true, headDX: 1, headDY: 3, eyes: 'closed' },
      { body: 'sit', pawLick: false, headDX: 0, headDY: 1, eyes: 'happy' },
    ],
  },
}

const canvasCache = new Map<string, HTMLCanvasElement>()

function hexToRgb(hex: string): [number, number, number] {
  if (hex.startsWith('#')) {
    const raw = hex.slice(1)
    const n = parseInt(
      raw.length === 3
        ? raw
            .split('')
            .map((c) => c + c)
            .join('')
        : raw,
      16,
    )
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  return [240, 240, 240]
}

function getCatFrameCanvas(
  pose: PixelCatPose,
  index: number,
  palette: Record<1 | 2 | 3 | 4, string>,
): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null
  const frames = ANIMATIONS[pose].frames
  const i = ((index % frames.length) + frames.length) % frames.length
  const palKey = `${palette[1]}_${palette[2]}_${palette[3]}_${palette[4]}`
  const key = `${pose}:${i}:${palKey}`
  const hit = canvasCache.get(key)
  if (hit) return hit

  const canvas = document.createElement('canvas')
  canvas.width = CAT_SIZE
  canvas.height = CAT_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const img = ctx.createImageData(CAT_SIZE, CAT_SIZE)
  const data = buildCatGrid(frames[i])
  for (let p = 0; p < data.length; p++) {
    const v = data[p]
    if (!v) continue
    const hex = palette[v as 1 | 2 | 3 | 4] || '#ffffff'
    const [r, g, b] = hexToRgb(hex)
    img.data[p * 4] = r
    img.data[p * 4 + 1] = g
    img.data[p * 4 + 2] = b
    img.data[p * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  canvasCache.set(key, canvas)
  return canvas
}

function CatSpriteCanvas({
  pose,
  palette,
  animated,
}: {
  pose: PixelCatPose
  palette: Record<1 | 2 | 3 | 4, string>
  animated: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false
    const animDef = ANIMATIONS[pose]
    const { fps, frames } = animDef
    let index = 0

    const draw = () => {
      ctx.clearRect(0, 0, CAT_SIZE, CAT_SIZE)
      const frameCanvas = getCatFrameCanvas(pose, index, palette)
      if (frameCanvas) {
        ctx.drawImage(frameCanvas, 0, 0)
      }
    }

    draw()
    if (!animated) return

    const interval = window.setInterval(() => {
      index = (index + 1) % frames.length
      draw()
    }, 1000 / fps)

    return () => window.clearInterval(interval)
  }, [pose, palette, animated])

  return (
    <canvas
      ref={canvasRef}
      width={CAT_SIZE}
      height={CAT_SIZE}
      aria-hidden="true"
      className="block h-full w-full select-none"
      style={{
        imageRendering: 'pixelated',
      }}
    />
  )
}

// -----------------------------------------------------------------------------
// Component Props and Configuration
// -----------------------------------------------------------------------------

export type PixelCatPosition =
  | 'random'
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | { x: number; y: number }

export type PixelCatProps = {
  /** Size in pixels (width and height). Default: 36 */
  size?: number
  /** Cat fur color pattern / breed. Default: 'white' */
  breed?: PixelCatBreed
  /** Custom 4-color palette overriding the breed colors. */
  palette?: Record<1 | 2 | 3 | 4, string>
  /** Whether the cat wanders within its parent container. Default: true */
  wandering?: boolean
  /** Movement speed multiplier. Default: 1 */
  speed?: number
  /** Movement boundary: 'parent' container (default) or full 'viewport' */
  boundary?: 'parent' | 'viewport'
  /** Initial placement inside the container. Default: 'random' */
  position?: PixelCatPosition
  /** Initial pose when rendered. Default: 'sit' */
  initialPose?: PixelCatPose
  /** Fixed pose to lock the cat into (disables pose cycling). */
  pose?: PixelCatPose
  /** Whether clicking / hovering pets the cat. Default: true */
  interactive?: boolean
  /** Whether the cat observes and responds to cursor proximity. Default: true */
  cursorInteraction?: boolean
  /** List of speech messages. */
  messages?: string[]
  /** Whether speech bubbles are shown. Default: true */
  showBubble?: boolean
  /** Callback fired when user pets (clicks) the cat. */
  onPet?: (state: { count: number; pose: PixelCatPose }) => void
  /** Callback fired when pose changes. */
  onPoseChange?: (pose: PixelCatPose) => void
  /** Inner padding in pixels from container edges. Default: 8 */
  padding?: number
  /** Optional class name for the wrapper. */
  className?: string
  /** Optional inline styles for the wrapper. */
  style?: CSSProperties
}

const DEFAULT_MESSAGES = ['meow', 'meow!', 'purrr...', 'mrrp', ':3', 'nya~']

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function PixelCat({
  size = 36,
  breed = 'white',
  palette,
  wandering = true,
  speed = 1,
  boundary = 'parent',
  position = 'random',
  initialPose = 'sit',
  pose: fixedPose,
  interactive = true,
  cursorInteraction = true,
  messages = DEFAULT_MESSAGES,
  showBubble = true,
  onPet,
  onPoseChange,
  padding = 8,
  className,
  style,
}: PixelCatProps) {
  const reduceMotion = useReducedMotion()
  const instanceId = useId()

  const x = useMotionValue(-999)
  const y = useMotionValue(-999)
  const [currentPose, setCurrentPose] = useState<PixelCatPose>(
    fixedPose ?? initialPose,
  )
  const [facing, setFacing] = useState<1 | -1>(1)
  const [bubbleText, setBubbleText] = useState<string | null>(null)
  const [petCount, setPetCount] = useState(0)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  )

  const rootRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<{ x: number; y: number } | null>(null)
  const activeAnimations = useRef<Set<{ stop: () => void }>>(new Set())
  const isInteracting = useRef(false)
  const containerDimensions = useRef({ width: 0, height: 0 })

  const activePalette = palette ?? CAT_PALETTES[breed] ?? CAT_PALETTES.white

  // Update pose helper
  const setCatPose = useCallback(
    (p: PixelCatPose) => {
      if (fixedPose) return
      setCurrentPose(p)
      onPoseChange?.(p)
    },
    [fixedPose, onPoseChange],
  )

  // Calculate container boundaries
  const getBounds = useCallback(() => {
    let w = containerDimensions.current.width
    let h = containerDimensions.current.height

    if (
      boundary === 'viewport' ||
      (typeof window !== 'undefined' && (!w || !h))
    ) {
      if (boundary === 'viewport') {
        w = window.innerWidth
        h = window.innerHeight
      } else {
        const parent = rootRef.current?.parentElement
        if (parent) {
          w = parent.clientWidth
          h = parent.clientHeight
        }
      }
    }

    const minX = padding
    const maxX = Math.max(padding, (w || 300) - size - padding)
    const minY = padding
    const maxY = Math.max(padding, (h || 200) - size - padding)

    return { minX, maxX, minY, maxY, width: w, height: h }
  }, [boundary, padding, size])

  // Resolve initial coordinates based on position prop
  const resolveInitialPos = useCallback(() => {
    const { minX, maxX, minY, maxY, width, height } = getBounds()

    if (typeof position === 'object') {
      const px = (position.x / 100) * (width - size)
      const py = (position.y / 100) * (height - size)
      return {
        x: clamp(px, minX, maxX),
        y: clamp(py, minY, maxY),
      }
    }

    switch (position) {
      case 'center':
        return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 }
      case 'top-left':
        return { x: minX, y: minY }
      case 'top-right':
        return { x: maxX, y: minY }
      case 'bottom-left':
        return { x: minX, y: maxY }
      case 'bottom-right':
        return { x: maxX, y: maxY }
      case 'random':
      default:
        return { x: rand(minX, maxX), y: rand(minY, maxY) }
    }
  }, [getBounds, position, size])

  // ResizeObserver for parent container bounds
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateDimensions = () => {
      if (boundary === 'viewport') {
        containerDimensions.current = {
          width: window.innerWidth,
          height: window.innerHeight,
        }
      } else {
        const parent = rootRef.current?.parentElement
        if (parent) {
          containerDimensions.current = {
            width: parent.clientWidth,
            height: parent.clientHeight,
          }
        }
      }
    }

    updateDimensions()

    // Place cat initially
    const initial = resolveInitialPos()
    x.set(initial.x)
    y.set(initial.y)

    if (boundary === 'viewport') {
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }

    const parent = rootRef.current?.parentElement
    if (!parent) return

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerDimensions.current = {
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        }
        // Clamp current position if parent shrunk
        const b = getBounds()
        if (x.get() > b.maxX) x.set(b.maxX)
        if (y.get() > b.maxY) y.set(b.maxY)
      }
    })
    ro.observe(parent)

    return () => ro.disconnect()
  }, [boundary, getBounds, resolveInitialPos, x, y])

  // Track cursor within parent container or window
  useEffect(() => {
    if (!cursorInteraction || typeof window === 'undefined') return

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (boundary === 'viewport') {
        cursorRef.current = { x: e.clientX, y: e.clientY }
      } else {
        const parent = rootRef.current?.parentElement
        if (!parent) return
        const rect = parent.getBoundingClientRect()
        // Relative to parent container
        cursorRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        }
      }
    }

    const handlePointerLeave = () => {
      cursorRef.current = null
    }

    const target =
      boundary === 'viewport'
        ? window
        : (rootRef.current?.parentElement ?? window)

    target.addEventListener('pointermove', handlePointerMove as EventListener, {
      passive: true,
    })
    target.addEventListener('pointerleave', handlePointerLeave as EventListener)

    return () => {
      target.removeEventListener(
        'pointermove',
        handlePointerMove as EventListener,
      )
      target.removeEventListener(
        'pointerleave',
        handlePointerLeave as EventListener,
      )
    }
  }, [boundary, cursorInteraction])

  // Handle petting / interaction
  const handlePet = useCallback(() => {
    if (!interactive) return
    isInteracting.current = true
    const nextCount = petCount + 1
    setPetCount(nextCount)

    // Pose reaction
    setCatPose('happy')
    onPet?.({ count: nextCount, pose: 'happy' })

    // Speech bubble
    if (showBubble && messages.length > 0) {
      const msg = messages[Math.floor(Math.random() * messages.length)]
      setBubbleText(msg)
    }

    // Floating heart effect
    const heartId = Date.now() + Math.random()
    setHearts((prev) => [
      ...prev.slice(-3),
      { id: heartId, x: rand(-8, 8), y: rand(-4, 4) },
    ])

    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== heartId))
    }, 1200)

    window.setTimeout(() => {
      setBubbleText(null)
      isInteracting.current = false
      if (!fixedPose) setCatPose('sit')
    }, 2000)
  }, [
    fixedPose,
    interactive,
    messages,
    onPet,
    petCount,
    setCatPose,
    showBubble,
  ])

  // Wandering & Behavior Loop
  useEffect(() => {
    if (!wandering || reduceMotion || fixedPose) return

    let cancelled = false
    const timers = new Set<number>()

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(() => {
          timers.delete(t)
          resolve()
        }, ms)
        timers.add(t)
      })

    const walkTo = async (tx: number, ty: number) => {
      if (cancelled) return
      const dx = tx - x.get()
      const dy = ty - y.get()
      const dist = Math.hypot(dx, dy)
      if (dist < 4) return

      setFacing(dx >= 0 ? 1 : -1)
      setCatPose('walk')

      const travelSpeed = Math.max(16, rand(28, 44) * speed)
      const duration = dist / travelSpeed

      const ax = animate(x, tx, { duration, ease: 'linear' })
      const ay = animate(y, ty, { duration, ease: 'linear' })

      activeAnimations.current.add(ax)
      activeAnimations.current.add(ay)

      await Promise.all([ax, ay]).catch(() => {})
      activeAnimations.current.delete(ax)
      activeAnimations.current.delete(ay)
    }

    const runLoop = async () => {
      // Small initial delay before wandering begins
      await wait(rand(1000, 2500))

      while (!cancelled) {
        if (isInteracting.current) {
          await wait(500)
          continue
        }

        const b = getBounds()
        const c = cursorRef.current

        // Cursor awareness
        if (cursorInteraction && c) {
          const cx = x.get() + size / 2
          const cy = y.get() + size / 2
          const distToCursor = Math.hypot(c.x - cx, c.y - cy)

          if (distToCursor < 36) {
            // Playfully scamper away
            const ang = Math.atan2(cy - c.y, cx - c.x) + rand(-0.4, 0.4)
            const escapeDist = rand(60, 110)
            await walkTo(
              clamp(x.get() + Math.cos(ang) * escapeDist, b.minX, b.maxX),
              clamp(y.get() + Math.sin(ang) * escapeDist, b.minY, b.maxY),
            )
            continue
          } else if (distToCursor < 120) {
            // Face cursor alertly
            setFacing(c.x >= cx ? 1 : -1)
            setCatPose('alert')
            await wait(rand(800, 1600))
            if (Math.random() < 0.35 && cursorRef.current) {
              // Curious step closer
              const target = cursorRef.current
              const ang = Math.atan2(target.y - cy, target.x - cx)
              await walkTo(
                clamp(target.x - Math.cos(ang) * 44 - size / 2, b.minX, b.maxX),
                clamp(target.y - Math.sin(ang) * 44 - size / 2, b.minY, b.maxY),
              )
            }
            continue
          }
        }

        // Autonomous wandering behaviors
        const roll = Math.random()

        if (roll < 0.45) {
          // Walk to a new position
          const targetX = rand(b.minX, b.maxX)
          const targetY = rand(b.minY, b.maxY)
          await walkTo(targetX, targetY)
        } else if (roll < 0.65) {
          // Sit and observe
          setCatPose('sit')
          if (showBubble && Math.random() < 0.15 && messages.length > 0) {
            setBubbleText(messages[Math.floor(Math.random() * messages.length)])
            await wait(1800)
            setBubbleText(null)
          } else {
            await wait(rand(2500, 5000))
          }
        } else if (roll < 0.78) {
          // Take a nap / loaf
          setCatPose('sleep')
          await wait(rand(4000, 8000))
        } else if (roll < 0.88) {
          // Groom paw
          setCatPose('groom')
          await wait(rand(2000, 4000))
        } else if (roll < 0.94) {
          // Morning stretch
          setCatPose('stretch')
          await wait(rand(1800, 3200))
        } else {
          // Idle sway
          setCatPose('idle')
          if (Math.random() < 0.4) setFacing((f) => (f === 1 ? -1 : 1))
          await wait(rand(1500, 3000))
        }

        if (cancelled) break
        setCatPose('idle')
        await wait(rand(600, 1800))
      }
    }

    runLoop()

    const anims = activeAnimations.current
    return () => {
      cancelled = true
      anims.forEach((a) => a.stop())
      anims.clear()
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [
    cursorInteraction,
    fixedPose,
    getBounds,
    messages,
    reduceMotion,
    setCatPose,
    showBubble,
    size,
    speed,
    wandering,
    x,
    y,
  ])

  const activePose = fixedPose ?? currentPose

  return (
    <motion.div
      ref={rootRef}
      id={`pixel-cat-${instanceId}`}
      className={cn(
        boundary === 'viewport' ? 'fixed' : 'absolute',
        'pointer-events-none top-0 left-0 z-20 select-none',
        className,
      )}
      style={{
        width: size,
        height: size,
        x,
        y,
        ...style,
      }}
    >
      {/* Facing transform container */}
      <div
        className="pointer-events-none h-full w-full transition-transform duration-100"
        style={{ transform: `scaleX(${facing})` }}
      >
        <CatSpriteCanvas
          pose={activePose}
          palette={activePalette}
          animated={!reduceMotion}
        />
      </div>

      {/* Hitbox for petting */}
      {interactive && (
        <button
          type="button"
          tabIndex={0}
          aria-label={`Pet the ${breed} cat`}
          onClick={handlePet}
          className="focus-visible:ring-ring pointer-events-auto absolute -inset-2 cursor-pointer rounded-full outline-none focus-visible:ring-1"
        />
      )}

      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleText && (
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -2, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            className="border-border bg-popover text-popover-foreground pointer-events-none absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium whitespace-nowrap shadow-sm"
          >
            {bubbleText}
            {/* Tiny speech pointer notch */}
            <div className="border-border bg-popover absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-r border-b" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Hearts Reaction */}
      <AnimatePresence>
        {hearts.map((h) => (
          <motion.span
            key={h.id}
            initial={{ opacity: 1, y: 0, x: h.x, scale: 0.8 }}
            animate={{ opacity: 0, y: -24, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 text-xs leading-none select-none"
          >
            ❤️
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

export default PixelCat
