import { ANIMATIONS, CatAnim, drawCat } from './sprite'
import { drawBubble, drawHeart, drawText } from './pixel-font'
import {
  GLOBAL_ACTIONS,
  INTERACTION_REGISTRY,
  TARGET_ACTIONS,
  type InteractionAction,
  type InteractionChoice,
} from './interactions'
import {
  BOUNDS,
  H,
  INVESTIGATE,
  POI,
  PlayerAction,
  TOY_START,
  TimeOfDay,
  ToyKind,
  VH,
  VW,
  W,
  drawBowlFood,
  drawBowlWater,
  drawBox,
  drawDeskAndChair,
  drawFoodStorage,
  drawLaserDot,
  drawPlant,
  drawPlayer,
  drawPost,
  drawToy,
  getLocalTimeOfDay,
  insideCollider,
  renderBackground,
} from './room'

export type Hud = {
  hunger: number // 0-100 (Fullness / Satiety)
  happiness: number // 0-100
  energy: number // 0-100
  food: number // 0-3
  water: number // 0-3
  timeOfDay: TimeOfDay
  lampOn: boolean
  laserOn: boolean
  prompt: string | null
  message: string | null
  state: string
  catName: string
  carrying: boolean
  actions: InteractionChoice[]
  globalActions: InteractionChoice[]
  affection: number
  tutorialHint: string | null
  discoveryHint: string | null
  interactionFeedback: string | null
  hasSeenHelp: boolean
}

type Mode =
  | 'idle'
  | 'walk'
  | 'run'
  | 'jump'
  | 'sit'
  | 'sleep'
  | 'eat'
  | 'drink'
  | 'scratch'
  | 'stretch'
  | 'groom'
  | 'bat'
  | 'notice'
  | 'follow'
  | 'pet'
  | 'happy'
  | 'alert'

type Pt = { x: number; y: number }
type Toy = {
  kind: ToyKind
  x: number
  y: number
  vx: number
  vy: number
  spin: number
}
type Particle = {
  kind: 'z' | 'heart' | 'water' | 'sparkle'
  x: number
  y: number
  vx: number
  vy: number
  t: number
  ttl: number
}

type Target =
  | { kind: 'cat'; label: string; dist: number }
  | { kind: 'food'; label: string; dist: number }
  | { kind: 'water'; label: string; dist: number }
  | { kind: 'foodStorage'; label: string; dist: number }
  | { kind: 'bed'; label: string; dist: number }
  | { kind: 'post'; label: string; dist: number }
  | { kind: 'box'; label: string; dist: number }
  | { kind: 'plant'; label: string; dist: number }
  | { kind: 'lamp'; label: string; dist: number }
  | { kind: 'window'; label: string; dist: number }
  | { kind: 'desk'; label: string; dist: number }
  | { kind: 'tank'; label: string; dist: number }
  | { kind: 'bookshelf'; label: string; dist: number }
  | { kind: 'door'; label: string; dist: number }
  | { kind: 'toy'; label: string; dist: number; toy: Toy }

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const clamp100 = (v: number) => clamp(v, 0, 100)
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

export const CAT_SPEED_STROLL = 24
export const CAT_SPEED_WALK = 38
export const CAT_SPEED_TROT = 54
export const CAT_SPEED_RUN = 88
export const CAT_SPEED_SPRINT = 112
export const PLAYER_SPEED = 68
export const MAX_FOOD = 3
export const MAX_WATER = 3
const STORAGE_KEY = 'cathome_v2_state'
const TUTORIAL_HINTS: Record<string, string> = {
  'walk-around': 'WASD / arrows · take a little look around',
  'first-interaction': 'Nice. Your cat remembers the little things.',
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export class CatHomeEngine {
  private ctx: CanvasRenderingContext2D
  private viewW = VW
  private viewH = VH
  private bg!: HTMLCanvasElement
  private raf = 0
  private last = 0
  private running = false
  private reducedMotion = false

  private keys = new Set<string>()
  private joy = { x: 0, y: 0 }

  private player = {
    x: 160,
    y: 180,
    facing: 1 as 1 | -1,
    direction: 'down' as 'up' | 'down' | 'side',
    dir: { x: 0, y: 1 },
    step: 0,
    stepT: 0,
    moving: false,
    action: 'idle' as PlayerAction,
    actionTimer: 0,
  }

  private cam = { x: 0, y: 0 }
  private interactCd = 0

  // Game state & stats
  private stats = { hunger: 70, happiness: 75, energy: 80 }
  private catName = ''
  private carryingCat = false
  private carriedCatWasSleeping = false
  private personality:
    'playful' | 'lazy' | 'curious' | 'affectionate' | 'independent' = (
    ['playful', 'lazy', 'curious', 'affectionate', 'independent'] as const
  )[Math.floor(Math.random() * 5)]
  private affection = 0
  private trust = 0
  private discovered: string[] = []
  private discoveryHint: string | null = null
  private discoveryTimer = 0
  private interactionFeedback: string | null = null
  private interactionFeedbackTimer = 0
  private tutorialSeen: string[] = []
  private hasSeenHelp = false
  private food = 1
  private water = 2
  private lampOn = true
  private laserOn = false
  private laserTimer: number | null = null
  private laserPos: Pt = { x: 220, y: 180 }
  private timeOfDay: TimeOfDay = 'night'
  private autoTime = true

  private toys: Toy[] = [
    { kind: 'ball', ...TOY_START.ball, vx: 0, vy: 0, spin: 0 },
    { kind: 'yarn', ...TOY_START.yarn, vx: 0, vy: 0, spin: 0 },
    { kind: 'mouse', ...TOY_START.mouse, vx: 0, vy: 0, spin: 0 },
    { kind: 'wand', ...TOY_START.wand, vx: 0, vy: 0, spin: 0 },
    { kind: 'fish', ...TOY_START.fish, vx: 0, vy: 0, spin: 0 },
  ]

  private particles: Particle[] = []
  private bubble: { text: string; t: number; ttl: number } | null = null
  private message: { text: string; t: number } | null = null
  private zTimer = 0
  private heartTimer = 0
  private saveTimer = 0

  // Cat autonomous state & physics
  private cat = {
    x: 230,
    y: 180,
    facing: -1 as 1 | -1,
    mode: 'idle' as Mode,
    anim: 'idle' as CatAnim,
    animT: 0,
    timer: 2.0,
    speed: CAT_SPEED_WALK,
    jumpY: 0,
    jumping: null as {
      startX: number
      startY: number
      targetX: number
      targetY: number
      progress: number
      onEnd: () => void
    } | null,
    onEnd: null as (() => void) | null,
    target: null as Pt | null,
    then: null as (() => void) | null,
    chasing: null as Toy | null,
    walkT: 0,
    stuckTimer: 0,
    lastX: 230,
    lastY: 180,
    followingPlayer: false,
    followTimer: 0,
    noticeCd: 3,
    playLeft: 0,
    impulsed: false,
    pending: null as { t: number; fn: () => void } | null,
  }

  private hudAcc = 0
  private lastHud = ''

  constructor(
    private canvas: HTMLCanvasElement,
    private onHud: (hud: Hud) => void,
    private onExit?: () => void,
  ) {
    canvas.width = VW
    canvas.height = VH
    this.ctx = canvas.getContext('2d')!
    this.ctx.imageSmoothingEnabled = false

    this.timeOfDay = getLocalTimeOfDay()
    this.lampOn = this.timeOfDay === 'night'
    this.reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    this.loadFromStorage()
    this.rebuildBg()

    this.cam.x = clamp(
      this.player.x - this.viewW / 2,
      0,
      Math.max(0, W - this.viewW),
    )
    this.cam.y = clamp(
      this.player.y - this.viewH / 2,
      0,
      Math.max(0, H - this.viewH),
    )
  }

  private rebuildBg() {
    this.bg = renderBackground(this.timeOfDay, this.lampOn)
  }

  // -------------------------------------------------------- Storage Persistence

  private loadFromStorage() {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed: unknown = JSON.parse(raw)
      if (!isRecord(parsed)) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }
      const data = parsed
      if (typeof data.hunger === 'number' && Number.isFinite(data.hunger))
        this.stats.hunger = clamp100(data.hunger)
      if (typeof data.happiness === 'number' && Number.isFinite(data.happiness))
        this.stats.happiness = clamp100(data.happiness)
      if (typeof data.energy === 'number' && Number.isFinite(data.energy))
        this.stats.energy = clamp100(data.energy)
      if (typeof data.catName === 'string')
        this.catName = data.catName.trim().replace(/\s+/g, ' ').slice(0, 14)
      if (
        typeof data.personality === 'string' &&
        ['playful', 'lazy', 'curious', 'affectionate', 'independent'].includes(
          data.personality,
        )
      )
        this.personality = data.personality as typeof this.personality
      if (typeof data.affection === 'number' && Number.isFinite(data.affection))
        this.affection = clamp100(data.affection)
      if (typeof data.trust === 'number' && Number.isFinite(data.trust))
        this.trust = clamp100(data.trust)
      if (Array.isArray(data.discovered))
        this.discovered = data.discovered
          .filter((item: unknown): item is string => typeof item === 'string')
          .slice(0, 30)
      if (Array.isArray(data.tutorialSeen))
        this.tutorialSeen = data.tutorialSeen
          .filter((item: unknown): item is string => typeof item === 'string')
          .slice(0, 10)
      if (typeof data.hasSeenHelp === 'boolean')
        this.hasSeenHelp = data.hasSeenHelp
      if (typeof data.food === 'number' && Number.isFinite(data.food))
        this.food = clamp(Math.floor(data.food), 0, MAX_FOOD)
      if (typeof data.water === 'number' && Number.isFinite(data.water))
        this.water = clamp(Math.floor(data.water), 0, MAX_WATER)
      if (typeof data.lampOn === 'boolean') this.lampOn = data.lampOn

      if (
        typeof data.lastSaved === 'number' &&
        Number.isFinite(data.lastSaved)
      ) {
        const elapsedMins = (Date.now() - data.lastSaved) / 60000
        if (elapsedMins > 1) {
          const hungerDrop = Math.min(30, elapsedMins * 0.05)
          this.stats.hunger = clamp100(this.stats.hunger - hungerDrop)
          this.stats.energy = clamp100(
            this.stats.energy + Math.min(50, elapsedMins * 0.12),
          )
        }
      }
    } catch (error) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // Storage may be disabled; the in-memory defaults remain usable.
      }
      if (process.env.NODE_ENV !== 'production')
        console.warn(
          'Cat Home save was unreadable; using a fresh room state.',
          error,
        )
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return
    try {
      const payload = {
        hunger: Math.round(this.stats.hunger),
        happiness: Math.round(this.stats.happiness),
        energy: Math.round(this.stats.energy),
        catName: this.catName,
        personality: this.personality,
        affection: Math.round(this.affection),
        trust: Math.round(this.trust),
        discovered: this.discovered,
        tutorialSeen: this.tutorialSeen,
        hasSeenHelp: this.hasSeenHelp,
        food: this.food,
        water: this.water,
        lampOn: this.lampOn,
        lastSaved: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch (error) {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Cat Home could not save this session.', error)
    }
  }

  // ------------------------------------------------------------------ Control

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    const loop = (now: number) => {
      if (!this.running) return
      const dt = Math.min(0.05, (now - this.last) / 1000)
      this.last = now
      this.update(dt)
      this.render()
      this.raf = requestAnimationFrame(loop)
    }
    this.raf = requestAnimationFrame(loop)
  }

  resizeViewport(width: number, height: number) {
    this.viewW = Number.isFinite(width) ? Math.max(1, Math.floor(width)) : VW
    this.viewH = Number.isFinite(height) ? Math.max(1, Math.floor(height)) : VH
    this.canvas.width = this.viewW
    this.canvas.height = this.viewH
    this.ctx.imageSmoothingEnabled = false
    this.cam.x = clamp(
      this.player.x - this.viewW / 2,
      0,
      Math.max(0, W - this.viewW),
    )
    this.cam.y = clamp(
      this.player.y - this.viewH / 2,
      0,
      Math.max(0, H - this.viewH),
    )
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
    if (this.laserTimer !== null) {
      window.clearTimeout(this.laserTimer)
      this.laserTimer = null
    }
    this.saveToStorage()
  }

  keyDown(code: string, repeat = false) {
    this.keys.add(code)
    if (repeat) return
    const actions: Record<string, InteractionAction> = {
      KeyE: 'interact',
      Enter: 'interact',
      KeyL: 'laser',
      KeyC: 'cuddle',
      KeyQ: 'call',
      KeyF: 'feed',
      KeyH: 'carry',
      KeyR: 'play',
      KeyZ: 'nap',
    }
    const action = actions[code]
    if (action) this.performAction(action)
  }

  performAction(action: InteractionAction) {
    switch (action) {
      case 'interact':
        this.interact()
        break
      case 'cuddle':
        this.cuddle()
        break
      case 'call':
        this.callCat()
        break
      case 'carry':
        this.toggleCarryCat()
        break
      case 'play':
        this.playWithCat()
        break
      case 'feed':
        this.feedCat()
        break
      case 'laser':
        this.toggleLaser()
        break
      case 'nap':
        this.sleepCat()
        break
    }
  }

  markHelpSeen() {
    this.hasSeenHelp = true
    this.saveToStorage()
    this.emitHud()
  }

  setCatName(name: string) {
    this.catName = name.trim().replace(/\s+/g, ' ').slice(0, 14)
    this.saveToStorage()
    this.emitHud()
  }

  cuddle() {
    if (this.carryingCat) {
      this.flash('you are already cuddling the cat')
      return
    }
    if (dist(this.player, this.cat) > 48) {
      this.flash('come closer to cuddle the cat')
      return
    }
    if (['sleep', 'eat'].includes(this.cat.mode)) {
      this.flash(
        this.cat.mode === 'sleep'
          ? 'the cat is fast asleep'
          : 'the cat is busy eating',
      )
      return
    }
    const c = this.cat
    this.player.facing = c.x >= this.player.x ? 1 : -1
    this.player.action = 'pet'
    this.player.actionTimer = 2.8
    c.facing = this.player.x >= c.x ? 1 : -1
    this.setMode('pet', 'pet', 2.8, () => this.think())
    this.say(Math.random() < 0.5 ? 'purrr...' : 'mrrp', 2.5)
    this.stats.happiness = clamp100(this.stats.happiness + 12)
    this.affection = clamp100(this.affection + 3)
    this.trust = clamp100(this.trust + 2)
    this.spawnHearts(3)
    this.saveToStorage()
  }

  callCat() {
    const c = this.cat
    if (this.carryingCat) {
      this.flash('the cat is already right here')
      return
    }
    if (c.mode === 'sleep') {
      this.flash('a sleepy ear twitches')
      return
    }
    if (c.mode === 'eat') {
      this.flash(`${this.catName || 'the cat'} is busy with lunch`)
      return
    }
    if (dist(this.player, c) < 48) {
      if (Math.random() < 0.62) {
        c.facing = this.player.x >= c.x ? 1 : -1
        this.setMode('notice', 'alert', 0.5, () =>
          this.setMode('sit', 'sit', 1.8),
        )
        this.say('mrrp')
      } else {
        this.flash(`${this.catName || 'the cat'} gives you a look`)
      }
      return
    }
    c.facing = this.player.x >= c.x ? 1 : -1
    if (Math.random() < (this.personality === 'affectionate' ? 0.52 : 0.34)) {
      this.setMode('notice', 'alert', 0.65, () => {
        const side = c.x <= this.player.x ? -1 : 1
        this.goTo(
          this.player.x + side * 18,
          this.player.y + 2,
          () => {
            this.say('purrr...')
            this.setMode('sit', 'sit', 2.5)
          },
          CAT_SPEED_RUN,
        )
      })
    } else if (Math.random() < 0.5) {
      this.setMode('notice', 'alert', 1.2)
      this.say('?', 1.4)
    } else {
      this.flash(`${this.catName || 'the cat'} pretends not to hear`)
    }
  }

  feedCat() {
    if (this.carryingCat) {
      this.flash('set the cat down before offering food')
      return
    }
    if (dist(this.player, this.cat) > 52) {
      this.flash('come closer to offer food')
      return
    }
    if (this.food > 0) this.goEat()
    else this.say('feed me', 1.8)
  }

  toggleCarryCat() {
    const c = this.cat
    if (this.carryingCat) {
      this.carryingCat = false
      c.x = clamp(
        this.player.x + this.player.facing * 17,
        BOUNDS.minX + 10,
        BOUNDS.maxX - 10,
      )
      c.y = this.player.y + 1
      this.player.action = 'place'
      this.player.actionTimer = 0.65
      if (this.carriedCatWasSleeping)
        this.setMode('sleep', 'sleep', rand(8, 16))
      else this.setMode('sit', 'sit', rand(1.5, 3))
      this.flash(`${this.catName || 'the cat'} settles down softly`)
      this.saveToStorage()
      return
    }
    if (
      dist(this.player, c) > 44 ||
      c.jumping ||
      ['eat', 'drink'].includes(c.mode)
    ) {
      this.flash('come a little closer to pick the cat up')
      return
    }
    this.carriedCatWasSleeping = c.mode === 'sleep'
    this.carryingCat = true
    c.mode = 'sit'
    c.anim = 'sit'
    c.animT = 0
    c.jumping = null
    c.target = null
    c.then = null
    this.player.action = 'pickup'
    this.player.actionTimer = 0.7
    this.flash(`${this.catName || 'the cat'} lets you carry them`)
    this.affection = clamp100(this.affection + 1)
    this.trust = clamp100(this.trust + 2)
    this.saveToStorage()
  }

  sleepCat() {
    if (this.carryingCat) {
      this.flash('the cat is warm and sleepy in your arms')
      return
    }
    if (this.cat.mode === 'sleep') {
      this.flash('the cat is already having a nap')
      return
    }
    this.flash(`${this.catName || 'your cat'} finds a soft spot in bed`)
    this.goSleep(true)
  }

  playWithCat() {
    if (this.carryingCat) {
      this.flash('the cat would rather be set down first')
      return
    }
    if (dist(this.player, this.cat) > 100) {
      this.flash('get a little closer to invite the cat to play')
      return
    }
    const toy = this.toys[Math.floor(Math.random() * this.toys.length)]
    if (toy.kind === 'wand') {
      this.player.action = 'wave'
      this.player.actionTimer = 2.4
      this.flash('a little feather dance begins')
      this.react(0.2, () => this.startPlay(toy))
    } else {
      this.flash(`you toss the ${toy.kind} for ${this.catName || 'the cat'}`)
      this.throwToy(toy)
    }
  }

  keyUp(code: string) {
    this.keys.delete(code)
  }

  clearKeys() {
    this.keys.clear()
    this.joy = { x: 0, y: 0 }
  }

  setJoystick(x: number, y: number) {
    this.joy = { x, y }
  }

  toggleTimeOfDay() {
    this.autoTime = false
    const order: TimeOfDay[] = ['day', 'sunset', 'night']
    const next = order[(order.indexOf(this.timeOfDay) + 1) % order.length]
    this.timeOfDay = next
    if (next === 'night') this.lampOn = true
    this.rebuildBg()
    this.flash(`time: ${next.toUpperCase()}`)
  }

  toggleLamp() {
    this.lampOn = !this.lampOn
    this.rebuildBg()
    this.flash(this.lampOn ? 'lamp on' : 'lamp off')
    this.saveToStorage()
  }

  toggleLaser() {
    this.laserOn = !this.laserOn
    if (!this.laserOn && this.laserTimer !== null) {
      window.clearTimeout(this.laserTimer)
      this.laserTimer = null
    }
    if (this.laserOn) {
      this.laserPos = {
        x: clamp(
          this.player.x + this.player.facing * 38,
          BOUNDS.minX + 16,
          BOUNDS.maxX - 16,
        ),
        y: clamp(this.player.y + 8, BOUNDS.minY + 12, BOUNDS.maxY - 12),
      }
      this.flash('laser pointer on! (cat is locked in)')
      this.react(0.1, () => {
        this.cat.facing = this.laserPos.x >= this.cat.x ? 1 : -1
        this.say('!')
        this.chaseLaser()
      })
    } else {
      this.flash('laser pointer off')
    }
    this.emitHud()
  }

  setLaserPos(x: number, y: number) {
    if (!this.laserOn) return
    this.laserPos.x = clamp(x, BOUNDS.minX + 12, BOUNDS.maxX - 12)
    this.laserPos.y = clamp(y, BOUNDS.minY + 10, BOUNDS.maxY - 8)
    if (
      ['idle', 'walk', 'sit', 'notice'].includes(this.cat.mode) &&
      !this.cat.jumping
    ) {
      this.chaseLaser()
    }
  }

  setLaserViewportPosition(xRatio: number, yRatio: number) {
    if (!this.laserOn) return
    this.setLaserPos(
      this.cam.x + clamp(xRatio, 0, 1) * this.viewW,
      this.cam.y + clamp(yRatio, 0, 1) * this.viewH,
    )
  }

  // -------------------------------------------------------------- Interaction

  private target(): Target | null {
    const p = this.player
    const c = this.cat
    const options: { target: Target; score: number }[] = []
    const facing = p.dir
    for (const definition of INTERACTION_REGISTRY) {
      const point = POI[definition.point]
      const d = dist(p, point)
      if (d >= definition.radius) continue
      const facingDot =
        ((point.x - p.x) * facing.x + (point.y - p.y) * facing.y) /
        Math.max(d, 1)
      const label =
        definition.kind === 'food'
          ? this.food >= MAX_FOOD
            ? 'food bowl is full'
            : 'fill food bowl (kibble)'
          : definition.kind === 'water'
            ? this.water >= MAX_WATER
              ? 'water bowl is full'
              : 'fill water bowl (fresh water)'
            : definition.kind === 'foodStorage'
              ? 'cat food cabinet'
              : definition.kind === 'bed'
                ? 'tuck cat into bed'
                : definition.kind === 'post'
                  ? 'scratching post'
                  : definition.kind === 'box'
                    ? 'cardboard box (if it fits, I sits)'
                    : definition.kind === 'plant'
                      ? 'water houseplant'
                      : definition.kind === 'lamp'
                        ? this.lampOn
                          ? 'turn lamp off'
                          : 'turn lamp on'
                        : definition.kind === 'window'
                          ? 'look out window'
                          : definition.kind === 'desk'
                            ? 'sit at study desk'
                            : definition.kind === 'tank'
                              ? 'look at the fish'
                              : definition.kind === 'bookshelf'
                                ? 'browse bookshelf'
                                : 'return to portfolio'
      options.push({
        target: {
          kind: definition.kind,
          label:
            definition.kind === 'bed' && this.carryingCat
              ? 'place your cat in bed'
              : label,
          dist: d,
        },
        score: d + (facingDot > 0.25 ? -5 : 10),
      })
    }
    const dc = dist(p, c)
    if (dc < 36 && !this.carryingCat) {
      options.push({
        target: {
          kind: 'cat',
          label: this.carryingCat
            ? 'put the cat down'
            : `pet ${this.catName || 'the cat'}`,
          dist: dc,
        },
        score: dc - 20,
      })
    }

    for (const toy of this.toys) {
      const d = dist(p, toy)
      if (d < 24) {
        const actionVerb =
          toy.kind === 'wand'
            ? 'wave feather wand'
            : toy.kind === 'fish'
              ? 'pick up & toss catnip fish'
              : `pick up & toss ${toy.kind}`
        const facingDot =
          ((toy.x - p.x) * facing.x + (toy.y - p.y) * facing.y) / Math.max(d, 1)
        options.push({
          target: { kind: 'toy', label: actionVerb, dist: d, toy },
          score: d - 4 + (facingDot > 0.25 ? -5 : 10),
        })
      }
    }

    options.sort((a, b) => a.score - b.score)
    return options[0]?.target ?? null
  }

  private markInteractionUsed() {
    if (this.tutorialSeen.includes('first-interaction')) return
    this.tutorialSeen.push('first-interaction')
    this.interactionFeedback = TUTORIAL_HINTS['first-interaction']
    this.interactionFeedbackTimer = 3.6
    this.saveToStorage()
  }

  interact() {
    if (this.interactCd > 0) return
    const t = this.target()
    if (!t) return
    this.interactCd = 0.3
    if (t.kind !== 'cat' && t.kind !== 'toy') {
      const discovery = INTERACTION_REGISTRY.find(
        (target) => target.kind === t.kind,
      )?.discovery
      if (discovery && !this.discovered.includes(discovery)) {
        this.discovered.push(discovery)
        this.saveToStorage()
      }
    }

    switch (t.kind) {
      case 'door':
        this.flash('returning to portfolio...')
        if (this.onExit) this.onExit()
        break

      case 'cat':
        if (this.carryingCat) this.toggleCarryCat()
        else this.pet()
        break

      case 'food':
        this.player.action = 'pour'
        this.player.actionTimer = 1.4
        if (this.food >= MAX_FOOD) {
          this.flash('food bowl is already full!')
        } else {
          this.food = MAX_FOOD
          this.flash('kibble bowl filled!')
          this.react(0.3, () => {
            if (this.stats.hunger < 70) {
              this.say('nom nom', 2.0)
              this.goEat()
            } else {
              this.say('mrrp')
            }
          })
          this.saveToStorage()
        }
        break

      case 'water':
        this.player.action = 'pour'
        this.player.actionTimer = 1.4
        if (this.water >= MAX_WATER) {
          this.flash('water bowl is clean & fresh!')
        } else {
          this.water = MAX_WATER
          this.flash('fresh water poured!')
          this.spawnWaterSplashes(POI.waterSpot.x, POI.waterSpot.y)
          this.react(0.4, () => {
            if (Math.random() < 0.6) this.goDrink()
            else this.say('mrrp')
          })
          this.saveToStorage()
        }
        break

      case 'foodStorage':
        this.player.action = 'pour'
        this.player.actionTimer = 1.2
        this.food = MAX_FOOD
        this.flash('restocked delicious cat food!')
        this.react(0.4, () => this.say('meow!'))
        this.saveToStorage()
        break

      case 'toy':
        if (t.toy.kind === 'wand') {
          // Player waves feather wand high!
          this.player.action = 'wave'
          this.player.actionTimer = 3.0
          this.flash('waving feather teaser wand!')
          this.react(0.2, () => {
            const side = this.player.facing === 1 ? 18 : -18
            this.goTo(
              this.player.x + side,
              this.player.y + 2,
              () => {
                this.jump(this.cat.x + side * 0.4, this.cat.y - 2, () => {
                  this.setMode('happy', 'play', 2.0)
                  this.say('play!', 1.6)
                  this.stats.happiness = clamp100(this.stats.happiness + 10)
                })
              },
              CAT_SPEED_RUN,
            )
          })
        } else {
          this.throwToy(t.toy)
        }
        break

      case 'bed':
        if (this.carryingCat) {
          this.carryingCat = false
          this.carriedCatWasSleeping = false
          this.cat.x = POI.bed.x + 4
          this.cat.y = POI.bed.y + 10
          this.player.action = 'place'
          this.player.actionTimer = 0.75
          this.setMode('sleep', 'sleep', rand(18, 28), () => {
            this.setMode('stretch', 'stretch', 2.5, () => this.think())
          })
          this.say('zzz...', 2.4)
          this.flash(`${this.catName || 'your cat'} settles into the soft bed`)
          this.saveToStorage()
        } else if (this.cat.mode === 'sleep') {
          this.flash('shh... the cat is sleeping peacefully')
        } else if (this.stats.energy > 85) {
          this.flash('cat is wide awake and ready to play!')
          this.say('mrrp')
        } else {
          this.flash('time for a cozy nap')
          this.goSleep(true)
        }
        break

      case 'post':
        this.flash('the cat tower wobbles a little.')
        this.react(0.3, () =>
          Math.random() < 0.42 ? this.goTower() : this.goScratch(),
        )
        break

      case 'box':
        this.flash(
          Math.random() < 0.45
            ? dist(this.cat, POI.box) < 30
              ? 'there is definitely a cat in there.'
              : 'nothing here. suspicious.'
            : 'cardboard: a cat’s greatest treasure.',
        )
        if (!this.discovered.includes('box')) this.discovered.push('box')
        this.react(0.3, () => this.goBox())
        this.saveToStorage()
        break

      case 'plant':
        this.player.action = 'pour'
        this.player.actionTimer = 1.2
        this.flash(
          Math.random() < 0.5
            ? 'the plant looks healthy.'
            : 'a tiny new leaf. nice.',
        )
        break

      case 'lamp':
        this.toggleLamp()
        break

      case 'window':
        if (this.timeOfDay === 'day') {
          this.flash('warm daylight streaming in, birds fluttering outside')
        } else if (this.timeOfDay === 'sunset') {
          this.flash('gorgeous golden sunset painting the horizon')
        } else {
          this.flash('quiet starry night, soft moonlight outside')
        }
        this.react(0.4, () => this.goWindow())
        break

      case 'desk':
        this.player.action = 'sit'
        this.player.actionTimer = 3.5
        this.flash('sitting at desk: coding & sipping tea')
        break

      case 'tank': {
        const first = !this.discovered.includes('fish-tank')
        if (first) this.discovered.push('fish-tank')
        this.player.action = 'interact'
        this.player.actionTimer = 0.8
        this.flash(
          first
            ? 'the fish are having a better day than you.'
            : 'one tiny fish follows your finger.',
        )
        if (Math.random() < (this.personality === 'curious' ? 0.7 : 0.35))
          this.react(0.35, () => this.goTank())
        this.saveToStorage()
        break
      }

      case 'bookshelf': {
        const first = !this.discovered.includes('bookshelf')
        if (first) this.discovered.push('bookshelf')
        this.player.action = 'interact'
        this.player.actionTimer = 0.8
        this.flash(
          first
            ? 'mostly technical books... and “How to Ignore Humans”.'
            : 'the cat rearranged the bookmarks again.',
        )
        this.saveToStorage()
        break
      }
    }
    this.markInteractionUsed()
  }

  private pet() {
    const c = this.cat
    const wasSleeping = c.mode === 'sleep'
    this.player.facing = c.x >= this.player.x ? 1 : -1
    this.player.action = 'pet'
    this.player.actionTimer = 2.6

    // Cat turns and steps slightly toward player
    c.facing = this.player.x >= c.x ? 1 : -1
    const stepDx = this.player.facing === 1 ? -4 : 4
    c.x = clamp(c.x + stepDx, BOUNDS.minX + 12, BOUNDS.maxX - 12)

    this.setMode('pet', 'pet', 2.6, () => this.think())
    const phrases = wasSleeping
      ? ['purrr...', 'mrrp']
      : ['purrr...', 'meow!', ':3']
    this.say(phrases[Math.floor(Math.random() * phrases.length)], 2.4)

    this.stats.happiness = clamp100(this.stats.happiness + 9)
    this.affection = clamp100(this.affection + 2)
    this.trust = clamp100(this.trust + 1)
    this.spawnHearts(3)
    this.saveToStorage()
  }

  private throwToy(toy: Toy) {
    this.player.action = 'throw'
    this.player.actionTimer = 0.8
    const facing = this.player.facing

    toy.vx = facing * rand(130, 190)
    toy.vy = (Math.random() - 0.5) * 80
    toy.spin = 1
    this.flash(`tossed the ${toy.kind}!`)

    // Cat notices and races after the toy!
    this.react(0.2, () => {
      this.cat.facing = toy.x >= this.cat.x ? 1 : -1
      this.say('!')
      this.setMode('notice', 'alert', 0.4, () => {
        this.runToToy(toy)
      })
    })
  }

  private runToToy(toy: Toy) {
    const c = this.cat
    this.goTo(
      toy.x,
      toy.y,
      () => {
        this.pounceOnToy(toy)
      },
      CAT_SPEED_RUN,
    )
    c.chasing = toy
  }

  private pounceOnToy(toy: Toy) {
    const c = this.cat
    c.facing = toy.x >= c.x ? 1 : -1
    // Jump pounce onto toy
    this.jump(toy.x + (c.facing === 1 ? -6 : 6), toy.y, () => {
      this.setMode('bat', 'play', 1.2, () => {
        const ang = (c.facing === 1 ? 0 : Math.PI) + rand(-0.7, 0.7)
        toy.vx = Math.cos(ang) * rand(80, 130)
        toy.vy = Math.sin(ang) * rand(40, 80)
        this.stats.happiness = clamp100(this.stats.happiness + 8)
        this.stats.energy = clamp100(this.stats.energy - 3)
        this.say('meow!')
        this.saveToStorage()
        this.think()
      })
    })
  }

  private chaseLaser() {
    if (!this.laserOn) return
    this.goTo(
      this.laserPos.x,
      this.laserPos.y,
      () => {
        if (!this.laserOn) return this.think()
        // Playful pounce on laser dot!
        this.jump(
          this.laserPos.x + rand(-4, 4),
          this.laserPos.y + rand(-3, 3),
          () => {
            this.say(':3', 1.2)
            this.stats.happiness = clamp100(this.stats.happiness + 4)
            this.stats.energy = clamp100(this.stats.energy - 2)
            if (this.laserOn) {
              // Dart laser to a fresh nearby floor position
              this.laserPos.x = clamp(
                this.laserPos.x + rand(-45, 45),
                BOUNDS.minX + 16,
                BOUNDS.maxX - 16,
              )
              this.laserPos.y = clamp(
                this.laserPos.y + rand(-35, 35),
                BOUNDS.minY + 12,
                BOUNDS.maxY - 8,
              )
              this.laserTimer = window.setTimeout(() => {
                this.laserTimer = null
                if (this.running && this.laserOn) this.chaseLaser()
              }, 300)
            } else {
              this.think()
            }
          },
        )
      },
      CAT_SPEED_SPRINT,
    )
  }

  private react(delay: number, fn: () => void) {
    if (['sleep', 'eat', 'pet'].includes(this.cat.mode)) return
    this.cat.pending = { t: delay, fn }
  }

  private flash(text: string) {
    this.message = { text, t: 2.4 }
  }

  // -------------------------------------------------------------------- Cat AI

  private setMode(mode: Mode, anim: CatAnim, dur: number, onEnd?: () => void) {
    const c = this.cat
    if (c.anim !== anim) c.animT = 0
    c.mode = mode
    c.anim = anim
    c.timer = dur
    c.onEnd = onEnd ?? (() => this.think())
    c.chasing = null
    c.target = null
    c.then = null
    c.impulsed = false
  }

  private say(text: string, ttl = 2.0) {
    this.bubble = { text, t: 0, ttl }
  }

  private goTo(x: number, y: number, then: () => void, speed = CAT_SPEED_WALK) {
    const c = this.cat
    c.speed = speed
    const anim: CatAnim = speed >= CAT_SPEED_RUN ? 'run' : 'walk'
    this.setMode('walk', anim, 0)
    c.target = { x, y }
    c.then = then
    c.walkT = 0
    c.stuckTimer = 0
  }

  private jump(tx: number, ty: number, onEnd: () => void) {
    const c = this.cat
    c.facing = tx >= c.x ? 1 : -1
    c.jumping = {
      startX: c.x,
      startY: c.y,
      targetX: clamp(tx, BOUNDS.minX + 10, BOUNDS.maxX - 10),
      targetY: clamp(ty, BOUNDS.minY + 8, BOUNDS.maxY - 4),
      progress: 0,
      onEnd,
    }
    c.mode = 'jump'
    c.anim = 'jump'
    c.animT = 0
  }

  private think = () => {
    const c = this.cat
    const { hunger, energy } = this.stats
    const choices: [number, () => void][] = []

    const sleepWeight =
      (this.timeOfDay === 'night' ? 3.5 : 1.2) *
      (this.personality === 'lazy' ? 1.65 : 1)

    // 1. Critical Needs: Hunger
    if (hunger < 40 && this.food > 0) {
      choices.push([7, () => this.goEat()])
    } else if (hunger < 40 && this.food === 0) {
      choices.push([4, () => this.goBeg()])
    }

    // 2. High Energy: Spontaneous Zoomies!
    if (energy > 70 && Math.random() < 0.2) {
      choices.push([5, () => this.zoomies()])
    }

    // 3. Low Energy: Cozy Sleep & Lounging (Not sad, cozy and sleepy!)
    if (energy < 35) {
      choices.push([8 * sleepWeight, () => this.goSleep()])
      choices.push([3, () => this.setMode('stretch', 'stretch', rand(2.5, 4))])
      choices.push([3, () => this.setMode('groom', 'groom', rand(3, 5))])
      choices.push([3, () => this.setMode('sit', 'sit', rand(3, 6))])
    } else {
      choices.push([
        energy < 65 ? 1.8 * sleepWeight : 0.6,
        () => this.goSleep(),
      ])
    }

    // 4. Autonomous Play with Toys
    if (energy > 25) {
      const randomToy = this.toys[Math.floor(Math.random() * this.toys.length)]
      choices.push([
        3.5 *
          (this.personality === 'playful'
            ? 2.0
            : this.personality === 'lazy'
              ? 0.45
              : 1),
        () => this.startPlay(randomToy),
      ])
    }

    // 5. Exploration & Living Behaviors
    choices.push([
      4 *
        (this.personality === 'independent' || this.personality === 'curious'
          ? 1.45
          : 1),
      () => this.wander(),
    ])
    choices.push([3, () => this.setMode('sit', 'sit', rand(3, 6))])
    choices.push([2, () => this.setMode('idle', 'idle', rand(1.5, 3))])
    choices.push([2.5, () => this.setMode('stretch', 'stretch', rand(2.5, 4))])
    choices.push([2.5, () => this.setMode('groom', 'groom', rand(3, 5))])
    choices.push([
      2.5 * (this.personality === 'curious' ? 2.1 : 1),
      () => this.investigate(),
    ])
    choices.push([2, () => this.goWindow()])
    choices.push([2, () => this.goScratch()])
    choices.push([1.8, () => this.goBox()])
    choices.push([
      this.personality === 'curious' ? 2.4 : 1.1,
      () => this.goTank(),
    ])
    choices.push([
      this.personality === 'playful' ? 2.2 : 1,
      () => this.goTower(),
    ])

    if (this.water > 0) {
      choices.push([1.2, () => this.goDrink()])
    }

    // 6. Follow Player autonomously if near
    if (dist(this.player, this.cat) > 45 && Math.random() < 0.35) {
      choices.push([
        3 *
          (this.personality === 'affectionate'
            ? 2.1
            : this.personality === 'independent'
              ? 0.55
              : 1),
        () => this.followPlayer(),
      ])
    }

    const total = choices.reduce((s, [w]) => s + w, 0)
    let r = Math.random() * total
    for (const [w, fn] of choices) {
      r -= w
      if (r <= 0) return fn()
    }
    c.mode = 'idle'
  }

  private zoomies() {
    this.say('meow!')
    const waypoints = [
      { x: 120, y: 220 }, // box
      { x: 340, y: 180 }, // post
      { x: 210, y: 126 }, // window
      { x: 236, y: 190 }, // rug
      { x: 160, y: 160 },
    ]
    const p1 = waypoints[Math.floor(Math.random() * waypoints.length)]
    const p2 = waypoints[Math.floor(Math.random() * waypoints.length)]

    this.goTo(
      p1.x,
      p1.y,
      () => {
        this.jump(p2.x, p2.y, () => {
          this.setMode('alert', 'alert', 1.5, () => {
            this.stats.energy = clamp100(this.stats.energy - 8)
            this.think()
          })
        })
      },
      CAT_SPEED_SPRINT,
    )
  }

  private wander() {
    for (let i = 0; i < 20; i++) {
      const x = rand(BOUNDS.minX + 12, BOUNDS.maxX - 12)
      const y = rand(BOUNDS.minY + 8, BOUNDS.maxY - 6)
      if (insideCollider(x, y, 8)) continue
      if (dist({ x, y }, this.cat) < 28) continue
      const speed = this.stats.energy > 60 ? CAT_SPEED_TROT : CAT_SPEED_WALK
      return this.goTo(
        x,
        y,
        () => {
          this.setMode('idle', 'idle', rand(1.5, 3))
        },
        speed,
      )
    }
    this.setMode('idle', 'idle', 2)
  }

  private followPlayer() {
    const c = this.cat
    c.followingPlayer = true
    c.followTimer = rand(3.5, 6.0)

    const p = this.player
    const ang = Math.atan2(p.y - c.y, p.x - c.x)
    const targetX = clamp(
      p.x - Math.cos(ang) * 32,
      BOUNDS.minX + 12,
      BOUNDS.maxX - 12,
    )
    const targetY = clamp(
      p.y - Math.sin(ang) * 32,
      BOUNDS.minY + 8,
      BOUNDS.maxY - 4,
    )

    this.goTo(
      targetX,
      targetY,
      () => {
        c.followingPlayer = false
        c.facing = this.player.x >= c.x ? 1 : -1
        const dice = Math.random()
        if (dice < 0.4) {
          this.say('purrr...')
          this.setMode('happy', 'happy', 1.6, () => this.think())
        } else if (dice < 0.7) {
          this.setMode('groom', 'groom', rand(2.5, 4), () => this.think())
        } else {
          this.think()
        }
      },
      CAT_SPEED_TROT,
    )
  }

  private investigate() {
    const p = INVESTIGATE[Math.floor(Math.random() * INVESTIGATE.length)]
    this.goTo(
      p.x,
      p.y,
      () => {
        this.cat.facing = p.face
        this.setMode('idle', 'idle', rand(2, 4))
        if (Math.random() < 0.35) this.say('mrrp')
      },
      CAT_SPEED_WALK,
    )
  }

  private goEat() {
    this.goTo(
      POI.foodSpot.x,
      POI.foodSpot.y,
      () => {
        this.cat.facing = 1
        if (this.food <= 0) {
          this.say('feed me', 2.0)
          this.setMode('sit', 'sit', rand(2.5, 4))
          return
        }
        this.setMode('eat', 'eat', 3.6, () => {
          this.stats.hunger = clamp100(this.stats.hunger + 35)
          this.stats.happiness = clamp100(this.stats.happiness + 8)
          this.food = Math.max(0, this.food - 1)
          this.setMode('stretch', 'stretch', 2)
          this.saveToStorage()
        })
        this.say('nom nom', 2.6)
      },
      CAT_SPEED_TROT,
    )
  }

  private goBeg() {
    this.goTo(
      POI.foodSpot.x,
      POI.foodSpot.y,
      () => {
        this.cat.facing = 1
        this.say('feed me', 2.2)
        this.setMode('sit', 'sit', rand(3, 5))
      },
      CAT_SPEED_WALK,
    )
  }

  private goDrink() {
    this.goTo(
      POI.waterSpot.x,
      POI.waterSpot.y,
      () => {
        this.cat.facing = 1
        this.setMode('drink', 'eat', rand(2.4, 3.5), () => {
          this.water = Math.max(0, this.water - 1)
          this.stats.happiness = clamp100(this.stats.happiness + 4)
          this.say('mrrp')
          this.setMode('groom', 'groom', 2.5)
          this.saveToStorage()
        })
        this.spawnWaterSplashes(POI.waterBowl.x, POI.waterBowl.y - 2)
      },
      CAT_SPEED_WALK,
    )
  }

  private goScratch() {
    this.goTo(
      POI.post.x - 24,
      POI.post.y + 4,
      () => {
        this.cat.facing = 1
        this.setMode('scratch', 'scratch', rand(3, 4.5), () => {
          this.stats.happiness = clamp100(this.stats.happiness + 6)
          this.setMode('stretch', 'stretch', 2.0)
        })
        if (Math.random() < 0.4) this.say('purrr...')
      },
      CAT_SPEED_WALK,
    )
  }

  private goBox() {
    if (Math.random() < 0.24) {
      this.goTo(
        POI.box.x,
        POI.box.y - 14,
        () => {
          this.say('where did I go?', 1.7)
          this.setMode('sit', 'sit', rand(3.5, 7), () => this.think())
        },
        CAT_SPEED_STROLL,
      )
      return
    }
    this.goTo(
      POI.box.x,
      POI.box.y - 14,
      () => {
        this.cat.facing = 1
        this.setMode('sit', 'sit', rand(5, 9), () => this.think())
        this.say(':3', 2.2)
      },
      CAT_SPEED_WALK,
    )
  }

  private goTank() {
    this.goTo(
      POI.tank.x,
      POI.tank.y + 2,
      () => {
        this.cat.facing = -1
        this.setMode('sit', 'sit', rand(4, 8), () => this.think())
        if (Math.random() < 0.55) this.say('...')
      },
      CAT_SPEED_STROLL,
    )
  }

  private goTower() {
    const perch = { x: POI.post.x, y: POI.post.y - 40 }
    this.goTo(
      POI.post.x - 24,
      POI.post.y - 20,
      () => {
        this.jump(perch.x, perch.y, () => {
          this.setMode('sit', 'sit', rand(3, 6), () => {
            this.jump(POI.post.x - 24, POI.post.y - 20, () => this.think())
          })
        })
      },
      CAT_SPEED_WALK,
    )
  }

  private goWindow() {
    this.goTo(
      POI.window.x,
      POI.window.y + 6,
      () => {
        this.cat.facing = 1
        this.setMode('sit', 'sit', rand(4, 9), () => this.think())
        if (Math.random() < 0.4) this.say('meow')
      },
      CAT_SPEED_STROLL,
    )
  }

  private goSleep(forceBed = false) {
    const sleepSpots: { x: number; y: number }[] = [
      { x: POI.bed.x, y: POI.bed.y + 10 },
      { x: 236, y: 190 }, // warm center rug
      { x: 210, y: 130 }, // sunny/moonlit window light
      { x: 120, y: 206 }, // cardboard box
      { x: 334, y: 134 }, // under desk lamp
      { x: 170, y: 160 }, // peaceful floor
      { x: 270, y: 180 }, // quiet corner
    ]
    const spot = forceBed
      ? sleepSpots[0]
      : sleepSpots[Math.floor(Math.random() * sleepSpots.length)]

    this.goTo(
      spot.x,
      spot.y,
      () => {
        // Cat arrives, sits, stretches, then loafs down to sleep
        this.setMode('sit', 'sit', rand(1.5, 2.5), () => {
          this.setMode('stretch', 'stretch', 2.0, () => {
            this.setMode('sleep', 'sleep', rand(16, 28), () => {
              // Waking up peacefully
              this.setMode('stretch', 'stretch', 2.5, () => this.think())
              this.say('mrrp')
            })
            this.say('zzz...', 2.4)
          })
        })
      },
      CAT_SPEED_STROLL,
    )
  }

  private startPlay(toy: Toy) {
    this.cat.playLeft = 2 + Math.floor(Math.random() * 3)
    this.chasePlay(toy)
  }

  private chasePlay(toy: Toy) {
    this.goTo(
      toy.x,
      toy.y,
      () => {
        this.bat(toy)
      },
      CAT_SPEED_RUN,
    )
    this.cat.chasing = toy
  }

  private bat(toy: Toy) {
    const c = this.cat
    c.facing = toy.x >= c.x ? 1 : -1
    this.setMode('bat', 'play', 1.1, () => {
      c.playLeft--
      if (c.playLeft > 0 && this.stats.energy > 15) this.chasePlay(toy)
      else this.think()
    })
  }

  private updateCat(dt: number) {
    const c = this.cat
    const p = this.player
    c.animT += dt
    if (this.carryingCat) {
      c.x = p.x + p.facing * 8
      c.y = p.y - 21
      c.facing = p.facing
      c.mode = 'sit'
      c.anim = 'sit'
      return
    }
    c.noticeCd -= dt

    if (c.pending) {
      c.pending.t -= dt
      if (c.pending.t <= 0) {
        if (
          ['idle', 'walk', 'sit', 'notice', 'stretch', 'groom'].includes(c.mode)
        ) {
          const fn = c.pending.fn
          c.pending = null
          fn()
        } else if (c.pending.t < -3) c.pending = null
      }
    }

    // 1. Jumping Physics (Playful airborne pounce)
    if (c.jumping) {
      const j = c.jumping
      j.progress += dt * 2.2
      if (j.progress >= 1) {
        c.x = j.targetX
        c.y = j.targetY
        c.jumpY = 0
        c.jumping = null
        j.onEnd()
      } else {
        c.x = j.startX + (j.targetX - j.startX) * j.progress
        c.y = j.startY + (j.targetY - j.startY) * j.progress
        c.jumpY = -Math.sin(j.progress * Math.PI) * 14
      }
      return
    }

    // 2. Noticing Player
    const dp = dist(p, c)
    if (
      dp < 60 &&
      c.noticeCd <= 0 &&
      ['idle', 'walk', 'sit'].includes(c.mode)
    ) {
      c.noticeCd = rand(14, 22)
      c.facing = p.x >= c.x ? 1 : -1
      this.setMode('notice', 'alert', 1.4, () => {
        if (Math.random() < 0.35) {
          this.followPlayer()
        } else {
          this.think()
        }
      })
      const greetings = ['meow?', 'meow', 'mrrp', ':3']
      if (Math.random() < 0.45)
        this.say(greetings[Math.floor(Math.random() * greetings.length)])
    } else if (
      (c.mode === 'idle' || c.mode === 'sit') &&
      dp < 85 &&
      Math.abs(p.x - c.x) > 6
    ) {
      c.facing = p.x >= c.x ? 1 : -1
    }

    // 3. Walking / Running movement & collision
    if (c.mode === 'walk') {
      let tx = c.target!.x
      let ty = c.target!.y
      if (c.chasing) {
        const side = c.x < c.chasing.x ? -1 : 1
        tx = c.chasing.x + side * 12
        ty = c.chasing.y + 1
      }
      c.walkT += dt
      const dx = tx - c.x
      const dy = ty - c.y
      const d = Math.hypot(dx, dy)

      // Stuck detection: if barely moved for 1.8s
      const movedDist = Math.hypot(c.x - c.lastX, c.y - c.lastY)
      if (movedDist < 1.0) {
        c.stuckTimer += dt
        if (c.stuckTimer > 1.8) {
          c.stuckTimer = 0
          this.unstickCat()
          return
        }
      } else {
        c.stuckTimer = 0
      }
      c.lastX = c.x
      c.lastY = c.y

      if (c.walkT > 10) {
        this.think()
      } else if (d < 3.0) {
        const then = c.then
        c.then = null
        then?.()
      } else {
        const s = Math.min(d, c.speed * dt)
        const stepX = (dx / d) * s
        const stepY = (dy / d) * s
        const nx = clamp(c.x + stepX, BOUNDS.minX + 8, BOUNDS.maxX - 8)
        const ny = clamp(c.y + stepY, BOUNDS.minY + 6, BOUNDS.maxY - 4)

        if (!insideCollider(nx, c.y, 4)) c.x = nx
        if (!insideCollider(c.x, ny, 4)) c.y = ny

        if (Math.abs(dx) > 0.4) c.facing = dx > 0 ? 1 : -1
        c.anim = c.speed >= CAT_SPEED_RUN ? 'run' : 'walk'
      }
      return
    }

    // 4. Toy Batting Impulse
    if (
      c.mode === 'bat' &&
      !c.impulsed &&
      c.timer < 0.65 &&
      c.chasing === null
    ) {
      c.impulsed = true
      const toy = this.toys.reduce((a, b) => (dist(a, c) < dist(b, c) ? a : b))
      const ang = (c.facing === 1 ? 0 : Math.PI) + rand(-0.7, 0.7)
      toy.vx = Math.cos(ang) * 120
      toy.vy = Math.sin(ang) * 60
      this.stats.happiness = clamp100(this.stats.happiness + 6)
      this.stats.energy = clamp100(this.stats.energy - 3)
      this.saveToStorage()
    }

    // 5. Sleep Z-particles
    if (c.mode === 'sleep') {
      this.zTimer -= dt
      if (this.zTimer <= 0) {
        this.zTimer = 1.1
        this.particles.push({
          kind: 'z',
          x: c.x + 10,
          y: c.y - 18,
          vx: 4,
          vy: -7,
          t: 0,
          ttl: 2.2,
        })
      }
      if (this.stats.energy >= 99) c.timer = Math.min(c.timer, 0)
    }

    // 6. Petting Hearts
    if (c.mode === 'pet') {
      this.heartTimer -= dt
      if (this.heartTimer <= 0) {
        this.heartTimer = 0.4
        this.spawnHearts(1)
      }
    }

    c.timer -= dt
    if (c.timer <= 0) {
      const end = c.onEnd
      c.onEnd = null
      if (end) end()
      else this.think()
    }
  }

  private unstickCat() {
    const c = this.cat
    c.chasing = null
    c.target = null
    c.then = null
    c.jumping = null
    c.jumpY = 0
    c.x = clamp(c.x, BOUNDS.minX + 16, BOUNDS.maxX - 16)
    c.y = clamp(c.y, BOUNDS.minY + 16, BOUNDS.maxY - 16)
    if (insideCollider(c.x, c.y, 6)) {
      c.x = 236
      c.y = 190
    }
    this.setMode('idle', 'idle', 1.0, () => this.think())
  }

  private spawnHearts(n: number) {
    const c = this.cat
    for (let i = 0; i < n; i++) {
      this.particles.push({
        kind: 'heart',
        x: c.x + rand(-6, 10),
        y: c.y - 28,
        vx: rand(-4, 4),
        vy: -rand(12, 18),
        t: 0,
        ttl: 1.4,
      })
    }
  }

  private spawnWaterSplashes(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        kind: 'water',
        x: x + rand(-4, 4),
        y: y + rand(-2, 2),
        vx: rand(-8, 8),
        vy: -rand(10, 18),
        t: 0,
        ttl: 0.6,
      })
    }
  }

  // ------------------------------------------------------------------- Update

  private update(dt: number) {
    this.interactCd -= dt
    this.updatePlayer(dt)
    this.updateToys(dt)
    this.updateCat(dt)
    this.updateStats(dt)

    if (this.autoTime) {
      const current = getLocalTimeOfDay()
      if (current !== this.timeOfDay) {
        this.timeOfDay = current
        this.lampOn = current === 'night'
        this.rebuildBg()
      }
    }

    this.saveTimer += dt
    if (this.saveTimer > 6.0) {
      this.saveTimer = 0
      this.saveToStorage()
    }

    for (const q of this.particles) {
      q.t += dt
      q.x += q.vx * dt
      q.y += q.vy * dt
    }
    this.particles = this.particles.filter((q) => q.t < q.ttl)

    if (this.bubble) {
      this.bubble.t += dt
      if (this.bubble.t > this.bubble.ttl) this.bubble = null
    }
    if (this.message) {
      this.message.t -= dt
      if (this.message.t <= 0) this.message = null
    }
    if (this.discoveryHint) {
      this.discoveryTimer -= dt
      if (this.discoveryTimer <= 0) this.discoveryHint = null
    }
    if (this.interactionFeedback) {
      this.interactionFeedbackTimer -= dt
      if (this.interactionFeedbackTimer <= 0) this.interactionFeedback = null
    }

    const tx = clamp(
      this.player.x - this.viewW / 2,
      0,
      Math.max(0, W - this.viewW),
    )
    const ty = clamp(
      this.player.y - this.viewH / 2 - 12,
      0,
      Math.max(0, H - this.viewH),
    )
    const k = 1 - Math.exp(-4.5 * dt)
    this.cam.x += (tx - this.cam.x) * k
    this.cam.y += (ty - this.cam.y) * k

    this.hudAcc += dt
    if (this.hudAcc > 0.12) {
      this.hudAcc = 0
      this.emitHud()
    }
  }

  private updateStats(dt: number) {
    const s = this.stats
    const sleeping = this.cat.mode === 'sleep'
    s.hunger = clamp100(s.hunger - (sleeping ? 0.06 : 0.16) * dt)
    s.happiness = clamp100(s.happiness - 0.1 * dt)
    s.energy = clamp100(s.energy + (sleeping ? 1.8 : -0.12) * dt)
  }

  private updatePlayer(dt: number) {
    const p = this.player
    const k = this.keys
    let ix =
      (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) -
      (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0)
    let iy =
      (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) -
      (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0)
    ix += this.joy.x
    iy += this.joy.y
    const len = Math.hypot(ix, iy)
    p.moving = len > 0.15

    if (p.moving) {
      if (!this.tutorialSeen.includes('walk-around')) {
        this.tutorialSeen.push('walk-around')
        this.saveToStorage()
      }
      p.action = this.carryingCat ? 'carry' : 'walk'
      p.actionTimer = 0

      if (len > 1) {
        ix /= len
        iy /= len
      }

      const nx = clamp(p.x + ix * PLAYER_SPEED * dt, BOUNDS.minX, BOUNDS.maxX)
      const ny = clamp(p.y + iy * PLAYER_SPEED * dt, BOUNDS.minY, BOUNDS.maxY)

      if (!insideCollider(nx, p.y)) p.x = nx
      if (!insideCollider(p.x, ny)) p.y = ny

      const l = Math.hypot(ix, iy)
      p.dir = { x: ix / l, y: iy / l }

      if (Math.abs(iy) > Math.abs(ix) * 1.2) {
        p.direction = iy < 0 ? 'up' : 'down'
      } else {
        p.direction = 'side'
        if (Math.abs(ix) > 0.15) p.facing = ix > 0 ? 1 : -1
      }
    } else {
      if (p.actionTimer > 0) {
        p.actionTimer -= dt
      } else if (this.carryingCat) {
        p.action = 'carry'
      } else {
        p.action = 'idle'
      }
    }

    p.stepT += dt
    if (p.stepT > 0.14) {
      p.stepT = 0
      p.step++
    }
  }

  private updateToys(dt: number) {
    const f = Math.pow(0.1, dt)
    for (const t of this.toys) {
      if (t.vx === 0 && t.vy === 0) continue
      t.x += t.vx * dt
      t.y += t.vy * dt
      t.vx *= f
      t.vy *= f
      t.spin += Math.hypot(t.vx, t.vy) * dt * 0.2
      if (t.x < BOUNDS.minX) {
        t.x = BOUNDS.minX
        t.vx = Math.abs(t.vx) * 0.6
      }
      if (t.x > BOUNDS.maxX) {
        t.x = BOUNDS.maxX
        t.vx = -Math.abs(t.vx) * 0.6
      }
      if (t.y < BOUNDS.minY) {
        t.y = BOUNDS.minY
        t.vy = Math.abs(t.vy) * 0.6
      }
      if (t.y > BOUNDS.maxY) {
        t.y = BOUNDS.maxY
        t.vy = -Math.abs(t.vy) * 0.6
      }
      if (Math.hypot(t.vx, t.vy) < 4) {
        t.vx = 0
        t.vy = 0
      }
    }
  }

  private emitHud() {
    const t = this.target()
    const c = this.cat
    if (t) {
      let id: string
      let label: string
      if (t.kind === 'cat') {
        id = 'cat'
        label = 'Your cat'
      } else if (t.kind === 'toy') {
        id = `toy-${t.toy.kind}`
        label = `${t.toy.kind} toy`
      } else {
        const definition = INTERACTION_REGISTRY.find(
          (target) => target.kind === t.kind,
        )
        id = definition?.id ?? t.kind
        label = definition?.label ?? t.label
      }
      const discoveryKey = `found:${id}`
      if (!this.discovered.includes(discoveryKey)) {
        this.discovered.push(discoveryKey)
        this.discoveryHint = `${label} · discovered`
        this.discoveryTimer = 2.8
        this.saveToStorage()
      }
    }
    const hud: Hud = {
      hunger: Math.round(this.stats.hunger),
      happiness: Math.round(this.stats.happiness),
      energy: Math.round(this.stats.energy),
      food: this.food,
      water: this.water,
      timeOfDay: this.timeOfDay,
      lampOn: this.lampOn,
      laserOn: this.laserOn,
      prompt: t ? t.label : null,
      message: this.message?.text ?? null,
      state: c.mode,
      catName: this.catName,
      carrying: this.carryingCat,
      actions: t
        ? TARGET_ACTIONS[t.kind]
            .filter((choice) =>
              choice.action === 'feed'
                ? dist(this.player, this.cat) <= 52
                : choice.action === 'play'
                  ? dist(this.player, this.cat) <= 100
                  : true,
            )
            .map((choice) =>
              choice.action === 'carry' && this.carryingCat
                ? { ...choice, label: 'Set down' }
                : t.kind === 'bed' && this.carryingCat
                  ? { ...choice, label: 'Place in bed' }
                  : t.kind === 'toy' && choice.action === 'interact'
                    ? {
                        ...choice,
                        label:
                          t.toy.kind === 'wand'
                            ? 'Wave wand'
                            : 'Pick up & toss',
                      }
                    : choice,
            )
        : [],
      globalActions: [...GLOBAL_ACTIONS],
      affection: Math.round(this.affection),
      tutorialHint: this.tutorialSeen.includes('walk-around')
        ? null
        : TUTORIAL_HINTS['walk-around'],
      discoveryHint: this.discoveryHint,
      interactionFeedback: this.interactionFeedback,
      hasSeenHelp: this.hasSeenHelp,
    }
    const key = JSON.stringify(hud)
    if (key === this.lastHud) return
    this.lastHud = key
    this.onHud(hud)
  }

  // ------------------------------------------------------------------- Render

  private render() {
    const ctx = this.ctx
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, this.viewW, this.viewH)

    ctx.save()
    ctx.translate(-Math.round(this.cam.x), -Math.round(this.cam.y))

    ctx.drawImage(this.bg, 0, 0)

    // A couple of tiny swimmers and slow bubbles keep the aquarium quietly alive.
    const aquariumT = performance.now() / (this.reducedMotion ? 4000 : 1000)
    for (let i = 0; i < 2; i++) {
      const fishX = 148 + ((aquariumT * (i ? 3.1 : 2.2) + i * 13) % 23)
      const fishY = 94 + Math.sin(aquariumT * 1.4 + i * 2) * 3
      ctx.fillStyle = i === 0 ? '#edb578' : '#eee0ad'
      ctx.fillRect(Math.round(fishX), Math.round(fishY), 4, 2)
      ctx.fillRect(Math.round(fishX - 1), Math.round(fishY - 1), 1, 4)
      ctx.fillStyle = '#18252c'
      ctx.fillRect(Math.round(fishX + 3), Math.round(fishY), 1, 1)
    }
    ctx.fillStyle = 'rgba(210,235,236,.62)'
    for (let i = 0; i < 3; i++) {
      const bubbleY = 101 - ((aquariumT * 5 + i * 7) % 13)
      ctx.fillRect(158 + i * 5, Math.round(bubbleY), 1, 1)
    }

    drawBowlFood(ctx, this.food)
    drawBowlWater(ctx, this.water)

    const c = this.cat
    const p = this.player

    const sortables: { y: number; draw: () => void }[] = [
      { y: POI.foodStorage.y, draw: () => drawFoodStorage(ctx) },
      { y: POI.desk.y, draw: () => drawDeskAndChair(ctx) },
      { y: POI.post.y, draw: () => drawPost(ctx) },
      { y: POI.box.y, draw: () => drawBox(ctx) },
      { y: POI.plant.y, draw: () => drawPlant(ctx) },
      ...this.toys.map((t) => ({
        y: t.y,
        draw: () => drawToy(ctx, t.kind, t.x, t.y, Math.floor(t.spin)),
      })),
      {
        y: c.y,
        draw: () => {
          if (this.carryingCat) return
          const wide = c.mode === 'sleep'
          ctx.fillStyle = 'rgba(0,0,0,0.45)'
          ctx.fillRect(
            Math.round(c.x) - (wide ? 12 : 9),
            Math.round(c.y) - 1,
            wide ? 24 : 18,
            2,
          )
          const a = ANIMATIONS[c.anim]
          const animationRate = this.reducedMotion ? 0.5 : 1
          drawCat(
            ctx,
            c.anim,
            Math.floor(c.animT * a.fps * animationRate),
            c.x,
            c.y + c.jumpY,
            c.facing,
          )
        },
      },
      {
        y: p.y,
        draw: () =>
          drawPlayer(ctx, p.x, p.y, p.facing, p.direction, p.step, p.action),
      },
    ]

    sortables.sort((a, b) => a.y - b.y).forEach((s) => s.draw())

    if (this.carryingCat) {
      const a = ANIMATIONS.sit
      drawCat(
        ctx,
        'sit',
        Math.floor(c.animT * a.fps * (this.reducedMotion ? 0.5 : 1)),
        c.x,
        c.y,
        c.facing,
      )
    }

    // When the cat settles into the cardboard box, its little face stays visible
    // above the folded front flap while its paws disappear inside.
    if (
      !this.carryingCat &&
      dist(c, POI.box) < 26 &&
      ['sit', 'sleep'].includes(c.mode)
    ) {
      ctx.fillStyle = '#6e5640'
      ctx.fillRect(POI.box.x - 15, POI.box.y - 15, 30, 13)
      ctx.fillStyle = '#8c7054'
      ctx.fillRect(POI.box.x - 15, POI.box.y - 15, 30, 2)
      ctx.fillStyle = '#4e3c2c'
      ctx.fillRect(POI.box.x - 2, POI.box.y - 13, 4, 11)
    }

    // Red Laser Dot
    if (this.laserOn) {
      drawLaserDot(ctx, this.laserPos.x, this.laserPos.y)
    }

    for (const q of this.particles) {
      ctx.globalAlpha = Math.min(1, (q.ttl - q.t) / 0.4)
      if (q.kind === 'z') {
        drawText(ctx, 'Z', q.x, q.y, '#e0e0e0')
      } else if (q.kind === 'heart') {
        drawHeart(ctx, q.x, q.y, '#ff6b81')
      } else if (q.kind === 'water') {
        ctx.fillStyle = '#64b5f6'
        ctx.fillRect(Math.round(q.x), Math.round(q.y), 2, 2)
      }
    }
    ctx.globalAlpha = 1

    if (this.bubble) {
      const anchor =
        c.mode === 'sleep'
          ? 20
          : c.mode === 'eat' || c.mode === 'drink'
            ? 22
            : c.mode === 'sit' || c.mode === 'groom'
              ? 32
              : c.mode === 'stretch'
                ? 26
                : 30
      const left = this.bubble.ttl - this.bubble.t
      drawBubble(
        ctx,
        this.bubble.text,
        c.x + c.facing * 4,
        c.y + c.jumpY - anchor,
        Math.min(1, left / 0.25),
      )
    }

    const t = this.target()
    if (t) {
      let pos: Pt
      if (t.kind === 'door') pos = { x: POI.door.x, y: POI.door.y - 40 }
      else if (t.kind === 'cat') pos = { x: c.x, y: c.y - 32 }
      else if (t.kind === 'toy') pos = { x: t.toy.x, y: t.toy.y - 12 }
      else if (t.kind === 'food')
        pos = { x: POI.foodBowl.x, y: POI.foodBowl.y - 14 }
      else if (t.kind === 'water')
        pos = { x: POI.waterBowl.x, y: POI.waterBowl.y - 14 }
      else if (t.kind === 'foodStorage')
        pos = { x: POI.foodStorage.x, y: POI.foodStorage.y - 22 }
      else if (t.kind === 'bed') pos = { x: POI.bed.x, y: POI.bed.y - 20 }
      else if (t.kind === 'post') pos = { x: POI.post.x, y: POI.post.y - 44 }
      else if (t.kind === 'box') pos = { x: POI.box.x, y: POI.box.y - 28 }
      else if (t.kind === 'plant') pos = { x: POI.plant.x, y: POI.plant.y - 44 }
      else if (t.kind === 'lamp') pos = { x: POI.lamp.x, y: POI.lamp.y - 36 }
      else if (t.kind === 'window')
        pos = { x: POI.window.x, y: POI.window.y - 40 }
      else if (t.kind === 'desk') pos = { x: POI.desk.x, y: POI.desk.y - 26 }
      else pos = { x: p.x, y: p.y - 44 }

      if (!(t.kind === 'cat' && this.bubble)) {
        const bob = Math.floor(performance.now() / 320) % 2
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(Math.round(pos.x) - 2, Math.round(pos.y) + bob, 5, 1)
        ctx.fillRect(Math.round(pos.x) - 1, Math.round(pos.y) + 1 + bob, 3, 1)
        ctx.fillRect(Math.round(pos.x), Math.round(pos.y) + 2 + bob, 1, 1)
      }
    }

    ctx.restore()
  }
}
