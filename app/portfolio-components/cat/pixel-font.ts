/**
 * Crisp 5x7 retro pixel font and speech bubble system.
 * Highly legible, classic retro aesthetic with 1px border and drop shadow.
 */

// 5 wide x 7 high binary string (35 chars per glyph)
const GLYPHS: Record<string, string> = {
  a: '01110100011000111111100011000110001',
  b: '11110100011111010001100011000111110',
  c: '01110100011000010000100001000101110',
  d: '11110100011000110001100011000111110',
  e: '11111100001111010000100001000011111',
  f: '11111100001111010000100001000010000',
  g: '01110100011000010111100011000101110',
  h: '10001100011000111111100011000110001',
  i: '11111001000010000100001000010011111',
  j: '00111000100001000010100101001001100',
  k: '10001100101010011000101001001010001',
  l: '10000100001000010000100001000011111',
  m: '10001110111010110101100011000110001',
  n: '10001110011010110011100011000110001',
  o: '01110100011000110001100011000101110',
  p: '11110100011000111110100001000010000',
  q: '01110100011000110001101011001001101',
  r: '11110100011000111110101001001010001',
  s: '01111100001000001110000010000111110',
  t: '11111001000010000100001000010000100',
  u: '10001100011000110001100011000101110',
  v: '10001100011000110001100010101000100',
  w: '10001100011000110101101011101110001',
  x: '10001100010101000100010101000110001',
  y: '10001100010101000100001000010000100',
  z: '11111000010001000100010001000011111',
  '0': '01110100111010110101101011100101110',
  '1': '00100011000010000100001000010001110',
  '2': '01110100010000100010001000100011111',
  '3': '11110000010001001100000011000101110',
  '4': '00010001100101010010111110001000010',
  '5': '11111100001111000001000011000101110',
  '6': '00110010001000011110100011000101110',
  '7': '11111000010001000100001000010000100',
  '8': '01110100011000101110100011000101110',
  '9': '01110100011000101111000010001001100',
  ':': '00000001000000000000001000000000000',
  '.': '00000000000000000000000000011000110',
  ',': '00000000000000000000001100001000100',
  '?': '01110100010000100010001000000000100',
  '!': '00100001000010000100001000000000100',
  '-': '00000000000000001111000000000000000',
  "'": '00100001000000000000000000000000000',
  '/': '00001000100010000100000100000100000',
  '(': '00010001000100001000010000010000010',
  ')': '01000001000001000010000010000100100',
  ' ': '00000000000000000000000000000000000',
}

export const FONT_W = 5
export const FONT_H = 7
export const FONT_SPACING = 1

export function textWidth(text: string): number {
  if (!text) return 0
  return text.length * (FONT_W + FONT_SPACING) - FONT_SPACING
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
) {
  ctx.fillStyle = color
  let cx = Math.round(x)
  const cy = Math.round(y)
  const len = text.length
  for (let idx = 0; idx < len; idx++) {
    const ch = text[idx].toLowerCase()
    const g = GLYPHS[ch] ?? GLYPHS[' ']
    for (let p = 0; p < 35; p++) {
      if (g[p] === '1') {
        ctx.fillRect(cx + (p % 5), cy + Math.floor(p / 5), 1, 1)
      }
    }
    cx += FONT_W + FONT_SPACING
  }
}

/**
 * Pixel speech bubble with crisp 1px border, drop-shadow, and pointer tail.
 * Tail points down at (x, y).
 */
export function drawBubble(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  alpha = 1,
) {
  if (!text) return
  const tw = textWidth(text)
  const padX = 5
  const padY = 4
  const w = tw + padX * 2
  const h = FONT_H + padY * 2
  const bx = Math.round(x - w / 2)
  const by = Math.round(y - h - 4)

  ctx.save()
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha))

  // Drop shadow (bottom-right 1px)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)'
  ctx.fillRect(bx + 1, by + h, w, 1)
  ctx.fillRect(bx + w, by + 1, 1, h)

  // Outer dark border (1px)
  ctx.fillStyle = '#141416'
  ctx.fillRect(bx + 1, by, w - 2, h)
  ctx.fillRect(bx, by + 1, w, h - 2)

  // Tail border
  ctx.fillRect(Math.round(x) - 2, by + h, 5, 1)
  ctx.fillRect(Math.round(x) - 1, by + h + 1, 3, 1)
  ctx.fillRect(Math.round(x), by + h + 2, 1, 1)

  // Inner light fill
  ctx.fillStyle = '#f8f8f8'
  ctx.fillRect(bx + 1, by + 1, w - 2, h - 2)

  // Tail fill
  ctx.fillRect(Math.round(x) - 1, by + h, 3, 1)
  ctx.fillRect(Math.round(x), by + h + 1, 1, 1)

  // Text
  drawText(ctx, text, bx + padX, by + padY, '#141416')
  ctx.restore()
}

const HEART_SHAPE = [
  '01100110',
  '11111111',
  '11111111',
  '01111110',
  '00111100',
  '00011000',
]

export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color = '#ff6b81',
) {
  ctx.fillStyle = color
  const rx = Math.round(x)
  const ry = Math.round(y)
  for (let j = 0; j < HEART_SHAPE.length; j++) {
    const row = HEART_SHAPE[j]
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '1') ctx.fillRect(rx + i, ry + j, 1, 1)
    }
  }
}
