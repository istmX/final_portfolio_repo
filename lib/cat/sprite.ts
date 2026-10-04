/**
 * Pixel cat sprite system.
 *
 * Every frame of every animation is generated from the same parametric 32x32
 * description (body, head, legs, tail, face), so the character is guaranteed
 * to be the exact same cat in every pose. Sprites face RIGHT; mirror them at
 * draw time to face left.
 *
 * Grid values: 0 empty · 1 white · 2 off-white shade · 3 dark detail · 4 outline
 */

export const CAT_SIZE = 32
/** Row (exclusive) of the sprite where the paws touch the ground. */
export const CAT_FEET_Y = 27

export type CatAnim =
  | 'idle'
  | 'walk'
  | 'sit'
  | 'sleep'
  | 'eat'
  | 'pet'
  | 'play'
  | 'alert'
  | 'happy'
  | 'stretch'
  | 'groom'
  | 'scratch'

type Eyes = 'open' | 'blink' | 'happy' | 'closed' | 'wide'
type Mouth = 'smile' | 'open'
type TailKind = 'low' | 'mid' | 'up'
type Body = 'stand' | 'sit' | 'loaf' | 'stretch' | 'scratch'

export type CatFrame = {
  body?: Body
  /** Whole-body vertical offset (negative = up). */
  bob?: number
  headDX?: number
  headDY?: number
  eyes?: Eyes
  mouth?: Mouth
  tallEars?: boolean
  tail?: TailKind
  /** -1 | 0 | 1 horizontal tail sway. */
  sway?: number
  /** Walk cycle phase 0..3, or 'jump' for the airborne leg pose. */
  legs?: 0 | 1 | 2 | 3 | 'jump'
  /** Loaf breathing offset. */
  breath?: number
  pawLick?: boolean
}

export const PALETTE: Record<number, string> = {
  1: '#f4f4f4',
  2: '#bdbdbd',
  3: '#161616',
  4: '#2c2c2c',
}

class Grid {
  data = new Uint8Array(CAT_SIZE * CAT_SIZE)
  px(x: number, y: number, v: number) {
    if (x < 0 || y < 0 || x >= CAT_SIZE || y >= CAT_SIZE) return
    this.data[y * CAT_SIZE + x] = v
  }
  get(x: number, y: number) {
    if (x < 0 || y < 0 || x >= CAT_SIZE || y >= CAT_SIZE) return 0
    return this.data[y * CAT_SIZE + x]
  }
  rect(x: number, y: number, w: number, h: number, v: number) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, v)
  }
  /** Rectangle with rounded corners (r pixels cut) for retro pixel art look. */
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
  /** Adds a 1px outline around every filled pixel. */
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
  low: [[4, 15], [3, 16], [2, 17], [1, 18], [1, 20]],
  mid: [[4, 14], [3, 13], [2, 12], [1, 11], [1, 9]],
  up: [[4, 14], [3, 12], [3, 10], [2, 8], [3, 6]],
}

function drawTail(g: Grid, kind: TailKind, sway: number, dy: number) {
  TAILS[kind].forEach(([x, y], i) => {
    const dx = i >= 4 ? sway * 2 : i >= 2 ? sway : 0
    g.rect(x + dx, y + dy, 2, 2, 1)
  })
}

function drawHead(g: Grid, hx: number, hy: number, f: CatFrame) {
  // Ears (drawn first so head overlaps their base)
  const tall = f.tallEars ? 1 : 0
  for (let row = 0; row < 4 + tall; row++) {
    const y = hy - 4 - tall + row
    const w = row - tall + 1 > 0 ? row - tall + 1 : 1
    g.rect(hx + 1, y, w, 1, 1) // left ear widens toward head
    g.rect(hx + 12 - w, y, w, 1, 1) // right ear mirrors it
  }
  g.px(hx + 2, hy - 2, 2) // inner ear shading
  g.px(hx + 10, hy - 2, 2)

  // Chubby, slightly rounder head shape with cute chubby cheeks
  g.round(hx, hy, 13, 10, 1, 2)
  g.px(hx - 1, hy + 5, 1) // left chubby cheek
  g.px(hx + 13, hy + 5, 1) // right chubby cheek

  const eye = (cx: number, mirror: boolean) => {
    const e = f.eyes ?? 'open'
    if (e === 'open') g.rect(cx, hy + 3, 1, 2, 3)
    else if (e === 'blink' || e === 'closed') g.rect(mirror ? cx : cx - 1, hy + 4, 2, 1, 3)
    else if (e === 'wide') {
      g.rect(cx - (mirror ? 0 : 1), hy + 3, 2, 3, 3)
      g.px(cx - (mirror ? 0 : 1), hy + 3, 2) // catch-light
    } else if (e === 'happy') {
      g.px(cx - 1, hy + 4, 3)
      g.px(cx, hy + 3, 3)
      g.px(cx + 1, hy + 4, 3)
    }
  }
  eye(hx + 3, false)
  eye(hx + 9, true)

  g.rect(hx + 5, hy + 5, 2, 1, 3) // nose
  if (f.mouth === 'open') g.rect(hx + 5, hy + 6, 2, 2, 3)
  else {
    g.px(hx + 4, hy + 6, 3)
    g.px(hx + 7, hy + 6, 3)
  }
  // Cute whiskers
  g.px(hx - 2, hy + 5, 2)
  g.px(hx + 14, hy + 5, 2)
}

function drawLeg(g: Grid, x: number, y0: number, len: number, v: number) {
  g.rect(x, y0, 2, len, v)
}

export function buildCatGrid(f: CatFrame): Uint8Array {
  const g = new Grid()
  const body = f.body ?? 'stand'
  const bob = f.bob ?? 0

  if (body === 'stand') {
    const legs = f.legs
    // Spec: [x, shade?, pair] — near legs white, far legs shaded
    const spec: [number, number, 'A' | 'B'][] = [
      [5, 1, 'A'], // hind near
      [8, 2, 'B'], // hind far
      [14, 2, 'A'], // front far
      [17, 1, 'B'], // front near
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

    // Chubby, rounder body silhouette with a soft cat belly
    g.round(4, 12 + bob, 17, 10, 1, 2)
    // Round belly pouch
    g.rect(6, 22 + bob, 13, 1, 1)
    g.rect(8, 23 + bob, 9, 1, 2)
    // Subtle back markings
    g.rect(7, 14 + bob, 3, 1, 2)
    g.rect(11, 14 + bob, 2, 1, 2)

    drawHead(g, 17 + (f.headDX ?? 0), 8 + (f.headDY ?? 0) + bob, f)
  } else if (body === 'sit') {
    // Curled tail first so paws sit atop it
    for (let x = 2; x <= 22; x++) g.rect(x, 26, 1, 2, 1)
    g.rect(1, 24, 2, 3, 1)
    g.rect(23, 25, 2, 2, 1)
    g.rect(24, 23, 2, 3, 1)
    const sway = f.sway ?? 0
    if (sway) g.px(25, 22, 1)

    // Plumper, rounder sitting haunch and chest
    g.round(4, 14, 13, 12, 1, 3) // plump round haunch
    g.round(13, 10, 10, 16, 1, 2) // round chest
    g.rect(18, 22, 3, 4, 2) // front leg
    g.rect(13, 24, 3, 2, 2) // hind paw

    if (f.pawLick) {
      // Raised front paw licking animation
      g.rect(18, 15, 3, 3, 1)
      g.px(19, 14, 3) // tongue licking paw
    }

    drawHead(g, 15 + (f.headDX ?? 0), 4 + (f.headDY ?? 0), f)
  } else if (body === 'loaf') {
    const b = f.breath ?? 0
    // Tail wraps around the front, drawn behind the loaf
    g.rect(2, 22, 2, 4, 1)
    // Wider, plumper loaf shape
    g.round(3, 15 - b, 24, 12 + b, 1, 4)
    g.rect(5, 25, 18, 1, 2) // wrapped tail stripe
    g.rect(24, 23, 2, 3, 1)
    drawHead(g, 17, 14 - b, { ...f, eyes: 'closed' })
  } else if (body === 'stretch') {
    // Morning cat stretch (front low, rear high, tail up)
    drawTail(g, 'up', 1, -2)
    // Hind legs standing tall
    drawLeg(g, 5, 18, 9, 1)
    drawLeg(g, 8, 18, 9, 2)
    // Arched slanting body
    g.round(5, 10, 15, 8, 1, 2)
    // Front chest dropped low to ground
    g.round(13, 15, 10, 8, 1, 2)
    // Stretched front paws reaching forward
    g.rect(18, 24, 8, 2, 1)
    g.rect(20, 25, 6, 2, 2)
    drawHead(g, 19, 13, { ...f, eyes: 'closed' })
  } else if (body === 'scratch') {
    // Standing tall on hind legs against post
    drawTail(g, 'low', 0, 0)
    drawLeg(g, 7, 21, 6, 1)
    drawLeg(g, 11, 21, 6, 2)
    // Body upright
    g.round(6, 11, 10, 13, 1, 2)
    // Front paws reaching high up
    g.rect(14, 8, 8, 2, 1)
    g.rect(14, 11, 8, 2, 1)
    drawHead(g, 11, 4, { ...f, eyes: 'wide' })
  }

  g.outline()
  return g.data
}

const IDLE_TAIL: number[] = [0, 1, 0, -1]
const idle: CatFrame[] = Array.from({ length: 12 }, (_, i) => ({
  tail: 'low',
  sway: IDLE_TAIL[i % 4],
  eyes: i === 9 ? 'blink' : 'open',
}))

export const ANIMATIONS: Record<CatAnim, { fps: number; frames: CatFrame[] }> = {
  idle: { fps: 4, frames: idle },
  walk: {
    fps: 8,
    frames: [0, 1, 2, 3].map((p) => ({
      legs: p as 0 | 1 | 2 | 3,
      tail: 'mid',
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
  eat: {
    fps: 4,
    frames: [
      { headDX: 2, headDY: 6, mouth: 'open', tail: 'low', sway: 0 },
      { headDX: 2, headDY: 5, tail: 'low', sway: 1 },
      { headDX: 2, headDY: 6, mouth: 'open', tail: 'low', sway: 0 },
      { headDX: 2, headDY: 5, tail: 'low', sway: -1 },
    ],
  },
  pet: {
    fps: 6,
    frames: [
      { eyes: 'happy', headDY: 1, tail: 'up', sway: 0 },
      { eyes: 'happy', headDY: 2, tail: 'up', sway: 1, bob: 0 },
      { eyes: 'happy', headDY: 1, tail: 'up', sway: 0, bob: -1 },
      { eyes: 'happy', headDY: 2, tail: 'up', sway: -1 },
    ],
  },
  play: {
    fps: 10,
    frames: [0, -2, -3, -3, -2, 0].map((b) => ({
      bob: b,
      legs: b < 0 ? ('jump' as const) : 0,
      eyes: 'wide' as const,
      tail: 'up' as const,
      sway: b < -2 ? 1 : -1,
      mouth: 'open' as const,
    })),
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
    frames: [
      { body: 'stretch' },
      { body: 'stretch' },
    ],
  },
  groom: {
    fps: 3,
    frames: [
      { body: 'sit', pawLick: true, headDX: 1, headDY: 2, eyes: 'closed' },
      { body: 'sit', pawLick: true, headDX: 1, headDY: 3, eyes: 'closed' },
      { body: 'sit', pawLick: false, headDX: 0, headDY: 1, eyes: 'happy' },
    ],
  },
  scratch: {
    fps: 4,
    frames: [
      { body: 'scratch', headDX: 1, headDY: -1 },
      { body: 'scratch', headDX: 0, headDY: 0 },
    ],
  },
}

export function frameCount(anim: CatAnim) {
  return ANIMATIONS[anim].frames.length
}

/** ASCII dump of a frame, used for debugging sprite art. */
export function catAscii(frame: CatFrame): string {
  const chars = ['.', '#', 'o', '@', '+']
  const data = buildCatGrid(frame)
  const rows: string[] = []
  for (let y = 0; y < CAT_SIZE; y++) {
    let row = ''
    for (let x = 0; x < CAT_SIZE; x++) row += chars[data[y * CAT_SIZE + x]]
    rows.push(row)
  }
  return rows.join('\n')
}

// ---------------------------------------------------------------- Canvas Cache

const cache = new Map<string, HTMLCanvasElement>()

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Returns a cached 32x32 canvas for one animation frame. Browser only. */
export function getCatFrameCanvas(anim: CatAnim, index: number): HTMLCanvasElement {
  const frames = ANIMATIONS[anim].frames
  const i = ((index % frames.length) + frames.length) % frames.length
  const key = `${anim}:${i}`
  const hit = cache.get(key)
  if (hit) return hit
  const canvas = document.createElement('canvas')
  canvas.width = CAT_SIZE
  canvas.height = CAT_SIZE
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(CAT_SIZE, CAT_SIZE)
  const data = buildCatGrid(frames[i])
  for (let p = 0; p < data.length; p++) {
    const v = data[p]
    if (!v) continue
    const [r, g, b] = hexToRgb(PALETTE[v])
    img.data[p * 4] = r
    img.data[p * 4 + 1] = g
    img.data[p * 4 + 2] = b
    img.data[p * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  cache.set(key, canvas)
  return canvas
}

/**
 * Draws the cat so its paws touch (x, feetY). `facing` 1 = right, -1 = left.
 * Coordinates are rounded so the sprite stays on the pixel grid.
 */
export function drawCat(
  ctx: CanvasRenderingContext2D,
  anim: CatAnim,
  frameIndex: number,
  x: number,
  feetY: number,
  facing: 1 | -1,
) {
  const sprite = getCatFrameCanvas(anim, frameIndex)
  const dx = Math.round(x)
  const dy = Math.round(feetY) - CAT_FEET_Y
  ctx.save()
  ctx.imageSmoothingEnabled = false
  if (facing === -1) {
    ctx.translate(dx + CAT_SIZE / 2, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(sprite, -CAT_SIZE / 2, dy)
  } else {
    ctx.drawImage(sprite, dx - CAT_SIZE / 2, dy)
  }
  ctx.restore()
}
