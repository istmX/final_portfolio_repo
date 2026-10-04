/**
 * Cat Home room definition: world size, collision, points of interest,
 * time-of-day atmospheric states, and all pixel artwork.
 */

export const W = 416
export const H = 240
/** Camera viewport in world pixels. */
export const VW = 320
export const VH = 192

export const WALL_H = 104
export const BOUNDS = { minX: 14, maxX: 402, minY: 116, maxY: 234 }

export type Rect = { x: number; y: number; w: number; h: number }
export type TimeOfDay = 'day' | 'sunset' | 'night'

export function getLocalTimeOfDay(): TimeOfDay {
  const h = new Date().getHours()
  if (h >= 7 && h < 17) return 'day'
  if ((h >= 5 && h < 7) || (h >= 17 && h < 20)) return 'sunset'
  return 'night'
}

/** Solid footprints (feet-space) the player cannot walk through. */
export const COLLIDERS: Rect[] = [
  { x: 14, y: 114, w: 28, h: 14 }, // plant
  { x: 26, y: 158, w: 60, h: 22 }, // bed
  { x: 104, y: 212, w: 34, h: 14 }, // box
  { x: 248, y: 116, w: 26, h: 14 }, // food storage cabinet
  { x: 290, y: 142, w: 46, h: 26 }, // study desk / table
  { x: 338, y: 146, w: 18, h: 22 }, // chair
  { x: 356, y: 172, w: 32, h: 14 }, // scratching post
]

export const POI = {
  door: { x: 90, y: 116 },
  plant: { x: 28, y: 126 },
  bed: { x: 56, y: 174 },
  box: { x: 120, y: 220 },
  window: { x: 210, y: 118 },
  foodStorage: { x: 261, y: 128 },
  foodBowl: { x: 296, y: 126 },
  waterBowl: { x: 322, y: 126 },
  foodSpot: { x: 296, y: 136 },
  waterSpot: { x: 322, y: 136 },
  desk: { x: 312, y: 172 },
  chair: { x: 346, y: 160 },
  lamp: { x: 342, y: 118 },
  post: { x: 372, y: 182 },
}

/** Places the cat likes to wander and investigate autonomously. */
export const INVESTIGATE: { x: number; y: number; face: 1 | -1; label: string }[] = [
  { x: 120, y: 222, face: 1, label: 'box' },
  { x: 344, y: 184, face: 1, label: 'post' },
  { x: 54, y: 130, face: -1, label: 'plant' },
  { x: 210, y: 126, face: 1, label: 'window' },
  { x: 236, y: 188, face: -1, label: 'rug' },
  { x: 268, y: 134, face: -1, label: 'foodStorage' },
  { x: 304, y: 174, face: -1, label: 'desk' },
  { x: 90, y: 124, face: 1, label: 'door' },
]

export const TOY_START = {
  ball: { x: 186, y: 194 },
  yarn: { x: 230, y: 206 },
  mouse: { x: 154, y: 216 },
  fish: { x: 256, y: 184 },
  wand: { x: 202, y: 168 },
}

export function insideCollider(x: number, y: number, pad = 0) {
  return COLLIDERS.some(
    (c) => x > c.x - pad && x < c.x + c.w + pad && y > c.y - pad && y < c.y + c.h + pad,
  )
}

function R(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = color
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h))
}

function RR(ctx: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
  R(ctx, color, x + 1, y, w - 2, h)
  R(ctx, color, x, y + 1, w, h - 2)
}

// ---------------------------------------------------------------- Background

export function renderBackground(time: TimeOfDay, lampOn: boolean): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  const palette = {
    day: {
      wall: '#1c1c22',
      wallStripe: '#22222a',
      base: '#34343e',
      baseLine: '#444450',
      floor: '#26262e',
      plank: '#2e2e38',
      mullion: '#545464',
      sill: '#78788c',
      sky: '#4a6f8a',
      windowBorder: '#383844',
    },
    sunset: {
      wall: '#1a141a',
      wallStripe: '#201820',
      base: '#322430',
      baseLine: '#443240',
      floor: '#221a20',
      plank: '#2a2028',
      mullion: '#563e4e',
      sill: '#785a6a',
      sky: '#b85238',
      windowBorder: '#3a2834',
    },
    night: {
      wall: '#101014',
      wallStripe: '#14141a',
      base: '#22222a',
      baseLine: '#2e2e38',
      floor: '#16161c',
      plank: '#1c1c24',
      mullion: '#424250',
      sill: '#5c5c6e',
      sky: '#080812',
      windowBorder: '#282834',
    },
  }[time]

  // Wall
  R(ctx, palette.wall, 0, 0, W, WALL_H)
  for (let x = 0; x < W; x += 16) {
    R(ctx, palette.wallStripe, x, 0, 8, WALL_H)
  }
  R(ctx, palette.base, 0, WALL_H - 5, W, 5)
  R(ctx, palette.baseLine, 0, WALL_H - 5, W, 1)
  R(ctx, '#101014', 0, WALL_H, W, 1)

  // Floor planks
  R(ctx, palette.floor, 0, WALL_H + 1, W, H - WALL_H - 1)
  for (let y = WALL_H + 16, row = 0; y < H; y += 16, row++) {
    R(ctx, palette.plank, 0, y, W, 1)
    for (let x = (row % 2) * 40; x < W; x += 80) {
      R(ctx, palette.plank, x, y - 15, 1, 15)
    }
  }

  // ---------------- Door (Return to Portfolio)
  const dx = 74
  const dy = 44
  const dw = 32
  const dh = 60
  // Door frame
  R(ctx, '#3a3a46', dx - 2, dy - 2, dw + 4, dh + 2)
  R(ctx, '#181820', dx, dy, dw, dh)
  // Wooden door panels
  R(ctx, '#2a2220', dx + 2, dy + 2, dw - 4, dh - 2)
  R(ctx, '#382e2a', dx + 4, dy + 4, dw - 8, 22)
  R(ctx, '#382e2a', dx + 4, dy + 30, dw - 8, 24)
  R(ctx, '#221a18', dx + 5, dy + 5, dw - 10, 20)
  R(ctx, '#221a18', dx + 5, dy + 31, dw - 10, 22)
  // Brass doorknob
  R(ctx, '#d4a34b', dx + dw - 7, dy + 32, 3, 3)
  R(ctx, '#f0d078', dx + dw - 6, dy + 32, 1, 1)
  R(ctx, '#101010', dx + dw - 6, dy + 34, 1, 2)
  // Welcome mat in front of door
  RR(ctx, '#3c3228', dx - 4, WALL_H + 2, dw + 8, 12)
  R(ctx, '#544638', dx - 2, WALL_H + 4, dw + 4, 8)
  for (let mx = dx + 2; mx < dx + dw - 2; mx += 4) {
    R(ctx, '#3c3228', mx, WALL_H + 5, 2, 6)
  }

  // ---------------- Window
  const wx = 176
  const wy = 20
  const ww = 68
  const wh = 54
  R(ctx, palette.windowBorder, wx - 3, wy - 3, ww + 6, wh + 6)
  R(ctx, '#08080c', wx, wy, ww, wh)

  if (time === 'day') {
    R(ctx, '#5c86a6', wx, wy, ww, wh)
    R(ctx, '#7aa6c2', wx, wy + 26, ww, wh - 26)
    // Sun
    R(ctx, '#ffe57f', wx + ww - 18, wy + 8, 10, 10)
    R(ctx, '#fff9c4', wx + ww - 16, wy + 10, 6, 6)
    // Clouds
    const drawCloud = (cx: number, cy: number) => {
      RR(ctx, '#f0f4f8', cx, cy, 18, 6)
      RR(ctx, '#ffffff', cx + 4, cy - 3, 10, 5)
    }
    drawCloud(wx + 8, wy + 18)
    drawCloud(wx + 34, wy + 32)
  } else if (time === 'sunset') {
    R(ctx, '#3a1e3e', wx, wy, ww, 14)
    R(ctx, '#6b2e3e', wx, wy + 14, ww, 14)
    R(ctx, '#b84e36', wx, wy + 28, ww, 14)
    R(ctx, '#e48a3c', wx, wy + 42, ww, 12)
    // Low setting sun
    R(ctx, '#ffcc66', wx + 24, wy + 30, 12, 12)
    R(ctx, '#fff0aa', wx + 26, wy + 32, 8, 8)
    RR(ctx, '#482438', wx + 36, wy + 20, 22, 5)
    RR(ctx, '#361828', wx + 6, wy + 38, 18, 4)
  } else {
    // Night sky
    R(ctx, '#080812', wx, wy, ww, wh)
    const stars = [
      [6, 8], [16, 22], [32, 10], [48, 16], [58, 30],
      [12, 38], [28, 44], [44, 40], [54, 8], [22, 6],
    ]
    stars.forEach(([sx, sy], i) => {
      R(ctx, i % 2 === 0 ? '#ffffff' : '#b0b8d0', wx + sx, wy + sy, 1, 1)
    })
    // Moon
    R(ctx, '#f8f8fc', wx + 42, wy + 12, 10, 10)
    R(ctx, '#f8f8fc', wx + 41, wy + 13, 12, 8)
    R(ctx, '#080812', wx + 46, wy + 11, 7, 8)
  }

  // Mullions
  R(ctx, palette.mullion, wx + Math.floor(ww / 2) - 2, wy, 4, wh)
  R(ctx, palette.mullion, wx, wy + Math.floor(wh / 2) - 1, ww, 3)
  // Window sill
  R(ctx, palette.sill, wx - 5, wy + wh, ww + 10, 4)
  R(ctx, '#1a1a24', wx - 5, wy + wh + 4, ww + 10, 1)

  // Natural light beam on floor
  if (time === 'day') {
    for (let y = 112; y < 192; y += 2) {
      const x0 = 156 + Math.floor((y - 112) * 0.6)
      for (let x = x0; x < x0 + 78; x += 2) {
        if (((x >> 1) + (y >> 1)) % 2 === 0) {
          R(ctx, 'rgba(255, 240, 200, 0.08)', x, y, 2, 2)
        }
      }
    }
  } else if (time === 'sunset') {
    for (let y = 112; y < 192; y += 2) {
      const x0 = 152 + Math.floor((y - 112) * 0.7)
      for (let x = x0; x < x0 + 82; x += 2) {
        if (((x >> 1) + (y >> 1)) % 2 === 0) {
          R(ctx, 'rgba(235, 140, 60, 0.12)', x, y, 2, 2)
        }
      }
    }
  } else {
    for (let y = 112; y < 184; y += 2) {
      const x0 = 160 + Math.floor((y - 112) * 0.55)
      for (let x = x0; x < x0 + 74; x += 2) {
        if (((x >> 1) + (y >> 1)) % 2 === 0) {
          R(ctx, 'rgba(170, 195, 235, 0.07)', x, y, 2, 2)
        }
      }
    }
  }

  // ---------------- Wall Art / Picture Frame
  R(ctx, '#4a4238', 126, 26, 32, 26)
  R(ctx, '#141416', 128, 28, 28, 22)
  for (let i = 0; i < 9; i++) R(ctx, '#485648', 134 + i, 46 - i, 1, 1 + i)
  for (let i = 0; i < 6; i++) R(ctx, '#2e382e', 142 + i, 46 - i, 1, 1 + i)
  R(ctx, '#f0d078', 147, 33, 3, 3)

  // ---------------- Shelf with Books, Plant, and Lamp
  R(ctx, '#544638', 264, 62, 88, 4)
  R(ctx, '#3a2e22', 268, 66, 3, 6)
  R(ctx, '#3a2e22', 344, 66, 3, 6)
  // Books
  const books: [number, number, string][] = [
    [272, 14, '#e0e0e0'],
    [277, 11, '#5a6878'],
    [281, 13, '#a07850'],
    [286, 10, '#3e5242'],
    [290, 12, '#924a4a'],
  ]
  books.forEach(([bx, bh, bc]) => R(ctx, bc, bx, 62 - bh, 4, bh))
  // Succulent
  R(ctx, '#8a6242', 302, 55, 8, 7)
  R(ctx, '#588258', 304, 49, 4, 6)
  R(ctx, '#70a470', 303, 51, 6, 3)

  // Lamp on shelf
  R(ctx, '#383842', 336, 58, 10, 4)
  R(ctx, '#686878', 340, 48, 2, 10)
  R(ctx, '#b8904a', 333, 40, 16, 9)
  R(ctx, '#d8aa58', 335, 41, 12, 7)
  if (lampOn) {
    R(ctx, '#fff3a8', 338, 47, 6, 3)
    for (let ly = 32; ly < 140; ly += 2) {
      const radius = 28 + Math.floor((ly - 32) * 0.25)
      for (let lx = 341 - radius; lx <= 341 + radius; lx += 2) {
        const d = Math.hypot(lx - 341, ly - 50)
        if (d < radius && ((lx >> 1) + (ly >> 1)) % 2 === 0) {
          R(ctx, 'rgba(255, 230, 150, 0.08)', lx, ly, 2, 2)
        }
      }
    }
  }

  // ---------------- Central Cozy Rug
  RR(ctx, '#2c2830', 164, 158, 122, 60)
  RR(ctx, '#221e26', 168, 162, 114, 52)
  for (let x = 172; x < 280; x += 6) {
    R(ctx, '#363040', x, 166, 2, 2)
    R(ctx, '#363040', x, 210, 2, 2)
  }
  R(ctx, '#363040', 172, 176, 106, 1)
  R(ctx, '#363040', 172, 198, 106, 1)
  for (let fy = 162; fy < 214; fy += 3) {
    R(ctx, '#50485c', 162, fy, 2, 1)
    R(ctx, '#50485c', 286, fy, 2, 1)
  }

  // ---------------- Cat Bed (Padded, Plush)
  RR(ctx, '#483c48', 26, 158, 62, 24)
  RR(ctx, '#685668', 28, 159, 58, 20)
  RR(ctx, '#282028', 32, 162, 50, 14)
  for (let x = 36; x < 80; x += 6) R(ctx, '#382e38', x, 168, 2, 2)
  R(ctx, '#1e181e', 30, 179, 54, 2)

  // ---------------- Bowl Mat
  R(ctx, '#32323a', 286, 124, 54, 16)
  R(ctx, '#42424c', 286, 124, 54, 1)
  // Food bowl
  RR(ctx, '#8a8a96', 289, 120, 18, 10)
  RR(ctx, '#26262e', 291, 121, 14, 6)
  R(ctx, '#5a5a66', 292, 129, 12, 2)
  // Water bowl
  RR(ctx, '#8a8a96', 315, 120, 18, 10)
  RR(ctx, '#30485e', 317, 121, 14, 6)
  R(ctx, '#5a5a66', 318, 129, 12, 2)

  return canvas
}

// ---------------------------------------------------------------- Props

export function drawBowlFood(ctx: CanvasRenderingContext2D, food: number) {
  const pts: [number, number][] = [
    [293, 123], [297, 122], [301, 123],
    [295, 124], [299, 124], [303, 124],
  ]
  const n = Math.min(pts.length, food * 2)
  for (let i = 0; i < n; i++) {
    R(ctx, '#d89b48', pts[i][0], pts[i][1], 2, 2)
  }
  if (food > 0) R(ctx, '#8e5e24', 293, 125, 10, 1)
}

export function drawBowlWater(ctx: CanvasRenderingContext2D, water: number) {
  if (water <= 0) return
  const wColor = water >= 2 ? '#5894c4' : '#3c6e94'
  R(ctx, wColor, 318, 122, 12, 4)
  R(ctx, '#e0f4ff', 320, 122, 3, 1)
  R(ctx, '#e0f4ff', 326, 123, 2, 1)
}

export function drawFoodStorage(ctx: CanvasRenderingContext2D) {
  const { x, y } = POI.foodStorage
  R(ctx, '#141416', x - 11, y - 2, 22, 4)
  R(ctx, '#4e3e32', x - 10, y - 18, 20, 18)
  R(ctx, '#685444', x - 10, y - 18, 20, 2)
  R(ctx, '#3a2e24', x - 9, y - 15, 18, 13)
  // Paw print
  R(ctx, '#f0d078', x - 2, y - 10, 4, 3)
  R(ctx, '#f0d078', x - 4, y - 12, 2, 2)
  R(ctx, '#f0d078', x - 1, y - 13, 2, 2)
  R(ctx, '#f0d078', x + 2, y - 12, 2, 2)
  R(ctx, '#d8aa58', x + 6, y - 9, 2, 2)
}

export function drawDeskAndChair(ctx: CanvasRenderingContext2D) {
  const dx = 290
  const dy = 142
  R(ctx, 'rgba(0, 0, 0, 0.45)', dx - 2, dy + 22, 48, 6)
  R(ctx, '#362a22', dx + 2, dy + 6, 3, 18)
  R(ctx, '#362a22', dx + 39, dy + 6, 3, 18)
  R(ctx, '#281e18', dx + 6, dy + 4, 3, 16)
  R(ctx, '#281e18', dx + 35, dy + 4, 3, 16)
  RR(ctx, '#544234', dx, dy, 44, 8)
  R(ctx, '#6c5644', dx + 1, dy + 1, 42, 2)
  R(ctx, '#d8d8e0', dx + 6, dy - 5, 4, 5)
  R(ctx, '#2e485e', dx + 16, dy - 2, 10, 3)
  R(ctx, '#f0f0f4', dx + 18, dy - 2, 6, 2)

  const cx = 338
  const cy = 146
  R(ctx, 'rgba(0, 0, 0, 0.35)', cx - 1, cy + 18, 16, 4)
  R(ctx, '#32261e', cx + 1, cy + 8, 2, 12)
  R(ctx, '#32261e', cx + 11, cy + 8, 2, 12)
  RR(ctx, '#4e3c30', cx, cy + 4, 14, 5)
  R(ctx, '#4e3c30', cx + 2, cy - 8, 10, 12)
  R(ctx, '#624e3e', cx + 3, cy - 7, 8, 2)
}

export function drawPost(ctx: CanvasRenderingContext2D) {
  const { x, y } = POI.post
  R(ctx, '#141416', x - 11, y - 3, 22, 5)
  RR(ctx, '#504438', x - 10, y - 5, 20, 5)
  R(ctx, '#a89878', x - 3, y - 36, 7, 32)
  for (let j = y - 34; j < y - 6; j += 3) {
    R(ctx, '#7c6c54', x - 3, j, 7, 1)
  }
  RR(ctx, '#e0d8c8', x - 9, y - 40, 19, 5)
  R(ctx, '#9c8c78', x - 9, y - 36, 19, 1)
  R(ctx, '#706050', x + 6, y - 35, 1, 9)
  R(ctx, '#ff6b81', x + 5, y - 26, 3, 3)
}

export function drawBox(ctx: CanvasRenderingContext2D) {
  const { x, y } = POI.box
  R(ctx, '#141416', x - 17, y - 2, 34, 4)
  R(ctx, '#8c7054', x - 16, y - 26, 32, 8)
  R(ctx, '#1c1612', x - 14, y - 25, 28, 6)
  R(ctx, '#6e5640', x - 16, y - 18, 32, 18)
  R(ctx, '#8c7054', x - 16, y - 18, 32, 2)
  R(ctx, '#d4bc94', x - 2, y - 16, 4, 16)
  R(ctx, '#4e3c2c', x - 14, y - 6, 8, 1)
}

export function drawPlant(ctx: CanvasRenderingContext2D) {
  const { x, y } = POI.plant
  R(ctx, '#141416', x - 9, y - 2, 18, 4)
  RR(ctx, '#584a3c', x - 8, y - 12, 16, 12)
  R(ctx, '#7c6854', x - 8, y - 12, 16, 2)
  const leaves: [number, number, number][] = [
    [-5, 24, 1], [-2, 30, 1], [1, 34, 1], [4, 28, 1], [6, 20, 1], [-7, 17, 1],
  ]
  leaves.forEach(([lx, lh]) => R(ctx, '#3e6648', x + lx, y - 12 - lh, 2, lh))
  leaves.forEach(([lx, lh], i) => {
    R(ctx, '#5ea870', x + lx - 1, y - 12 - lh - 1, 4, 2 + (i % 2))
  })
}

// ---------------------------------------------------------------- Toys

export type ToyKind = 'ball' | 'yarn' | 'mouse' | 'fish' | 'wand'

export function drawToy(ctx: CanvasRenderingContext2D, kind: ToyKind, x: number, y: number, spin: number) {
  R(ctx, 'rgba(0,0,0,0.45)', x - 4, y - 1, 9, 2)
  if (kind === 'ball') {
    RR(ctx, '#f0f0f4', x - 3, y - 7, 7, 7)
    R(ctx, '#b0b0bc', x - 2, y - 3, 5, 1)
    R(ctx, '#ff4757', x + (spin % 2 ? -1 : 0), y - 6, 2, 6)
  } else if (kind === 'yarn') {
    RR(ctx, '#e28f3a', x - 3, y - 7, 7, 7)
    R(ctx, '#9e5a1e', x - 2, y - 5, 5, 1)
    R(ctx, '#9e5a1e', x - 1, y - 3, 4, 1)
    R(ctx, '#e28f3a', x + 4, y - 1, 5, 1)
    R(ctx, '#e28f3a', x + 8, y - 2, 1, 1)
  } else if (kind === 'mouse') {
    const mx = Math.round(x)
    const my = Math.round(y)
    RR(ctx, '#9aa0a6', mx - 4, my - 6, 8, 5)
    R(ctx, '#5f6368', mx - 2, my - 2, 5, 1)
    R(ctx, '#ff8fa3', mx - 1, my - 8, 2, 2)
    R(ctx, '#141416', mx + 3, my - 5, 1, 1)
    R(ctx, '#ff6b81', mx + 4, my - 4, 1, 1)
    R(ctx, '#ff8fa3', mx - 6, my - 5, 2, 1)
    R(ctx, '#ff8fa3', mx - 8, my - 6, 2, 1)
  } else if (kind === 'fish') {
    // Catnip fish plush
    const fx = Math.round(x)
    const fy = Math.round(y)
    RR(ctx, '#38a3a5', fx - 5, fy - 6, 9, 5) // fish body
    R(ctx, '#22577a', fx - 5, fy - 4, 9, 1) // fish belly line
    R(ctx, '#57cc99', fx + 4, fy - 7, 2, 7) // tail fin
    R(ctx, '#57cc99', fx - 2, fy - 8, 3, 2) // dorsal fin
    R(ctx, '#ffffff', fx - 3, myEye(spin), 2, 2) // eye
    R(ctx, '#141416', fx - 2, myEye(spin), 1, 1)
  } else if (kind === 'wand') {
    // Feather teaser wand lying on floor
    const wx = Math.round(x)
    const wy = Math.round(y)
    R(ctx, '#d4a373', wx - 8, wy - 5, 16, 2) // stick
    // Dangling colorful feathers
    R(ctx, '#ff4d6d', wx + 8, wy - 7, 4, 3)
    R(ctx, '#ffb703', wx + 10, wy - 5, 3, 3)
    R(ctx, '#80ed99', wx + 7, wy - 4, 4, 2)
  }
}

function myEye(spin: number) {
  return -5 + (spin % 2 === 1 ? 0 : 0)
}

// ---------------------------------------------------------------- Player

export type PlayerAction = 'idle' | 'walk' | 'pet' | 'pour' | 'wave' | 'sit' | 'throw' | 'interact'

/**
 * Polished, high-detail retro human player character with expressive animations:
 * walking, idling with eye blinks, kneeling & petting cat, waving feather wand,
 * pouring food/water, throwing toys, interacting, and sitting.
 *
 * 40px tall (clearly larger than ~20px cat, 2:1 proportion), sharing the exact
 * same pixel-art grid and palette.
 */
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 1 | -1,
  direction: 'up' | 'down' | 'side',
  step: number,
  action: PlayerAction,
) {
  const px = Math.round(x)
  const py = Math.round(y)

  // Ground drop shadow
  R(ctx, 'rgba(0, 0, 0, 0.45)', px - 8, py - 1, 16, 3)

  // 1. PETTING ANIMATION (Human kneels down on one knee and strokes cat)
  if (action === 'pet') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    // Kneeling legs
    R(ctx, '#141418', -6, -6, 6, 5) // rear folded leg
    R(ctx, '#1a1a20', -2, -10, 4, 9) // forward bent leg
    R(ctx, '#f0f0f4', -6, -2, 5, 2) // sneakers
    R(ctx, '#f0f0f4', 0, -2, 4, 2)

    // Lowered torso / hoodie
    const ty = -18
    RR(ctx, '#282832', -6, ty, 12, 13)
    R(ctx, '#3a3a46', -5, ty + 1, 10, 2)
    R(ctx, '#d0d0d8', 2, ty + 4, 1, 7) // zipper

    // Stretched out arm petting cat
    const petReach = (step % 4 < 2) ? 1 : 0
    R(ctx, '#202028', 4, ty + 4, 8 + petReach, 3) // outstretched arm
    R(ctx, '#f4ece2', 12 + petReach, ty + 4, 3, 3) // hand stroking

    // Lowered tilted head
    const hy = ty - 10
    RR(ctx, '#18181c', -5, hy, 11, 6) // hair top
    RR(ctx, '#f4ece2', -3, hy + 3, 9, 8) // face
    R(ctx, '#18181c', 2, hy + 5, 2, 2) // gentle happy eye looking down at cat
    R(ctx, '#ffffff', 2, hy + 5, 1, 1)

    ctx.restore()
    return
  }

  // 2. POURING ANIMATION (Human bends down pouring kibble/water)
  if (action === 'pour') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    // Slightly bent legs
    R(ctx, '#141418', -4, -10, 4, 8)
    R(ctx, '#1a1a20', 0, -10, 4, 8)
    R(ctx, '#f0f0f4', -4, -2, 4, 2)
    R(ctx, '#f0f0f4', 0, -2, 4, 2)

    // Tilted torso
    const ty = -22
    RR(ctx, '#282832', -4, ty, 12, 13)
    // Both arms holding bowl/canister
    R(ctx, '#202028', 4, ty + 4, 6, 4)
    R(ctx, '#d4a373', 8, ty + 5, 5, 4) // canister/pitcher

    // Head tilted down
    const hy = ty - 10
    RR(ctx, '#18181c', -4, hy, 11, 6)
    RR(ctx, '#f4ece2', -2, hy + 3, 9, 8)
    R(ctx, '#18181c', 3, hy + 5, 2, 2)

    ctx.restore()
    return
  }

  // 3. WAVING FEATHER WAND ANIMATION
  if (action === 'wave') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    // Standing legs
    R(ctx, '#141418', -4, -10, 4, 8)
    R(ctx, '#1a1a20', 1, -10, 4, 8)
    R(ctx, '#f0f0f4', -4, -2, 4, 2)
    R(ctx, '#f0f0f4', 1, -2, 4, 2)

    // Torso
    const ty = -26
    RR(ctx, '#282832', -6, ty, 12, 16)

    // Raised arm holding stick
    const waveUp = (step % 4 < 2) ? -2 : 1
    R(ctx, '#202028', 2, ty + 2 + waveUp, 3, 7) // raised arm
    R(ctx, '#f4ece2', 3, ty + waveUp, 2, 3) // hand
    // Feather wand held high
    R(ctx, '#d4a373', 4, ty - 8 + waveUp, 2, 10) // stick
    R(ctx, '#ff4d6d', 4, ty - 12 + waveUp, 4, 4) // feathers fluttering!
    R(ctx, '#ffb703', 7, ty - 10 + waveUp, 3, 3)

    // Head looking happy
    const hy = ty - 12
    RR(ctx, '#18181c', -6, hy, 11, 6)
    RR(ctx, '#f4ece2', -4, hy + 3, 9, 9)
    R(ctx, '#18181c', 2, hy + 6, 2, 2)
    R(ctx, '#ffffff', 2, hy + 6, 1, 1)

    ctx.restore()
    return
  }

  // 4. SITTING IN CHAIR ANIMATION
  if (action === 'sit') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    // Sitting thighs & legs forward
    R(ctx, '#141418', -4, -10, 9, 4) // lap
    R(ctx, '#1a1a20', 4, -8, 4, 7) // lower leg
    R(ctx, '#f0f0f4', 4, -2, 4, 2) // sneakers

    // Torso sitting upright
    const ty = -24
    RR(ctx, '#282832', -6, ty, 12, 15)
    // Relaxed arms
    R(ctx, '#202028', 1, ty + 6, 5, 3)
    R(ctx, '#f4ece2', 6, ty + 6, 2, 2)

    // Head
    const hy = ty - 12
    RR(ctx, '#18181c', -6, hy, 11, 6)
    RR(ctx, '#f4ece2', -4, hy + 3, 9, 9)
    R(ctx, '#18181c', 2, hy + 6, 2, 2)
    R(ctx, '#ffffff', 2, hy + 6, 1, 1)

    ctx.restore()
    return
  }

  // 5. THROWING TOY ANIMATION
  if (action === 'throw') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    // Wide stable stance
    R(ctx, '#141418', -6, -10, 4, 8)
    R(ctx, '#1a1a20', 2, -10, 4, 8)
    R(ctx, '#f0f0f4', -6, -2, 4, 2)
    R(ctx, '#f0f0f4', 2, -2, 4, 2)

    // Leaning forward torso
    const ty = -25
    RR(ctx, '#282832', -4, ty, 13, 15)
    // Forward extended throw arm
    R(ctx, '#202028', 5, ty + 2, 8, 4)
    R(ctx, '#f4ece2', 13, ty + 2, 3, 3) // hand opening releasing toy

    // Head looking ahead
    const hy = ty - 12
    RR(ctx, '#18181c', -4, hy, 11, 6)
    RR(ctx, '#f4ece2', -2, hy + 3, 9, 9)
    R(ctx, '#18181c', 3, hy + 6, 2, 2)
    R(ctx, '#ffffff', 3, hy + 6, 1, 1)

    ctx.restore()
    return
  }

  // 6. FRIENDLY INTERACTION GESTURE ANIMATION
  if (action === 'interact') {
    ctx.save()
    ctx.translate(px, py)
    if (facing === -1) ctx.scale(-1, 1)

    R(ctx, '#141418', -4, -10, 4, 8)
    R(ctx, '#1a1a20', 1, -10, 4, 8)
    R(ctx, '#f0f0f4', -4, -2, 4, 2)
    R(ctx, '#f0f0f4', 1, -2, 4, 2)

    const ty = -25
    RR(ctx, '#282832', -5, ty, 12, 15)
    R(ctx, '#202028', 3, ty + 4, 5, 4)
    R(ctx, '#f4ece2', 7, ty + 5, 3, 3)

    const hy = ty - 12
    RR(ctx, '#18181c', -5, hy, 11, 6)
    RR(ctx, '#f4ece2', -3, hy + 3, 9, 9)
    R(ctx, '#18181c', 2, hy + 6, 2, 2)
    R(ctx, '#ffffff', 2, hy + 6, 1, 1)

    ctx.restore()
    return
  }

  // 7. STANDARD WALK & IDLE ANIMATION
  const isMoving = action === 'walk'
  const bob = isMoving && (step % 2 === 1) ? 1 : (!isMoving && (step % 16 < 8) ? 1 : 0) // breathing bob
  const isBlink = !isMoving && (step % 32 >= 30) // blink every few seconds
  const stride = isMoving ? (step % 4 === 1 ? 1 : step % 4 === 3 ? -1 : 0) : 0

  if (direction === 'up') {
    // Back view
    const l1 = stride === 1 ? -2 : 0
    const l2 = stride === -1 ? -2 : 0
    R(ctx, '#1a1a20', px - 5, py - 10 + l1, 4, 8)
    R(ctx, '#1a1a20', px + 1, py - 10 + l2, 4, 8)
    R(ctx, '#f0f0f4', px - 5, py - 2 + l1, 4, 2)
    R(ctx, '#f0f0f4', px + 1, py - 2 + l2, 4, 2)

    const ty = py - 26 + bob
    RR(ctx, '#26262e', px - 7, ty, 14, 16)
    R(ctx, '#181820', px - 6, ty + 15, 12, 1)
    RR(ctx, '#363642', px - 4, ty + 2, 8, 7)
    R(ctx, '#26262e', px - 3, ty + 3, 6, 5)

    const hy = ty - 12
    RR(ctx, '#18181c', px - 6, hy, 12, 11)
    R(ctx, '#282830', px - 4, hy + 2, 8, 4)
  } else if (direction === 'down') {
    // Front view
    const l1 = stride === 1 ? -1 : 0
    const l2 = stride === -1 ? -1 : 0
    R(ctx, '#1a1a20', px - 5, py - 10 + l1, 4, 8)
    R(ctx, '#1a1a20', px + 1, py - 10 + l2, 4, 8)
    R(ctx, '#f0f0f4', px - 5, py - 2 + l1, 4, 2)
    R(ctx, '#f0f0f4', px + 1, py - 2 + l2, 4, 2)
    R(ctx, '#202028', px - 5, py, 4, 1)
    R(ctx, '#202028', px + 1, py, 4, 1)

    const ty = py - 26 + bob
    RR(ctx, '#282832', px - 7, ty, 14, 16)
    R(ctx, '#3a3a46', px - 6, ty + 1, 12, 2)
    R(ctx, '#d0d0d8', px, ty + 3, 1, 11)
    R(ctx, '#d0d0d8', px - 2, ty + 5, 1, 4)
    R(ctx, '#d0d0d8', px + 2, ty + 5, 1, 4)
    R(ctx, '#f2ece4', px - 8, ty + 10, 2, 3)
    R(ctx, '#f2ece4', px + 6, ty + 10, 2, 3)

    const hy = ty - 12
    RR(ctx, '#18181c', px - 6, hy, 12, 6)
    RR(ctx, '#f4ece2', px - 5, hy + 3, 10, 9)
    R(ctx, '#18181c', px - 6, hy + 2, 2, 4)
    R(ctx, '#18181c', px + 4, hy + 2, 2, 4)

    if (isBlink) {
      // Closed/blinking eye slit
      R(ctx, '#18181c', px - 3, hy + 7, 2, 1)
      R(ctx, '#18181c', px + 1, hy + 7, 2, 1)
    } else {
      R(ctx, '#18181c', px - 3, hy + 6, 2, 2)
      R(ctx, '#18181c', px + 1, hy + 6, 2, 2)
      R(ctx, '#ffffff', px - 3, hy + 6, 1, 1)
      R(ctx, '#ffffff', px + 1, hy + 6, 1, 1)
    }
  } else {
    // Side view
    const flip = facing === -1
    ctx.save()
    ctx.translate(px, py)
    if (flip) ctx.scale(-1, 1)

    const stepFwd = stride * 3
    R(ctx, '#141418', -2 - stepFwd, -10, 4, 8)
    R(ctx, '#e4e4ec', -2 - stepFwd, -2, 5, 2)
    R(ctx, '#181820', -2 - stepFwd, 0, 5, 1)
    R(ctx, '#22222a', -2 + stepFwd, -10, 4, 8)
    R(ctx, '#f4f4f8', -2 + stepFwd, -2, 5, 2)
    R(ctx, '#181820', -2 + stepFwd, 0, 5, 1)

    const ty = -26 + bob
    RR(ctx, '#282832', -6, ty, 11, 16)
    R(ctx, '#3a3a46', -5, ty + 1, 9, 2)
    R(ctx, '#d0d0d8', 3, ty + 4, 1, 9)

    const armSwing = -stride * 3
    R(ctx, '#202028', -4 + armSwing, ty + 4, 3, 8)
    R(ctx, '#f4ece2', -3 + armSwing, ty + 11, 2, 3)

    const hy = ty - 12
    RR(ctx, '#18181c', -6, hy, 11, 6)
    RR(ctx, '#f4ece2', -4, hy + 3, 9, 9)
    R(ctx, '#18181c', -6, hy + 2, 3, 6)

    if (isBlink) {
      R(ctx, '#18181c', 2, hy + 7, 2, 1)
    } else {
      R(ctx, '#18181c', 2, hy + 6, 2, 2)
      R(ctx, '#ffffff', 2, hy + 6, 1, 1)
    }
    R(ctx, '#f4ece2', 4, hy + 7, 2, 2)

    ctx.restore()
  }
}

/**
 * Draws an interactive glowing red laser dot on the floor that the cat enthusiastically chases!
 */
export function drawLaserDot(ctx: CanvasRenderingContext2D, x: number, y: number, alpha = 1) {
  const lx = Math.round(x)
  const ly = Math.round(y)
  // Outer soft red bloom
  R(ctx, `rgba(255, 40, 60, ${0.35 * alpha})`, lx - 4, ly - 4, 9, 9)
  R(ctx, `rgba(255, 60, 80, ${0.65 * alpha})`, lx - 2, ly - 2, 5, 5)
  // Bright red core
  R(ctx, `rgba(255, 20, 40, ${alpha})`, lx - 1, ly - 1, 3, 3)
  // White hot center
  R(ctx, `rgba(255, 240, 240, ${alpha})`, lx, ly, 1, 1)
}

