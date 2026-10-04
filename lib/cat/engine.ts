import { ANIMATIONS, CatAnim, drawCat } from './sprite'
import { drawBubble, drawHeart, drawText } from './pixel-font'
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
  prompt: string | null
  message: string | null
  state: string
}

type Mode =
  | 'idle'
  | 'walk'
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

type Pt = { x: number; y: number }
type Toy = { kind: ToyKind; x: number; y: number; vx: number; vy: number; spin: number }
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
  | { kind: 'door'; label: string; dist: number }
  | { kind: 'toy'; label: string; dist: number; toy: Toy }

const rand = (a: number, b: number) => a + Math.random() * (b - a)
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const clamp100 = (v: number) => clamp(v, 0, 100)
const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y)

const CAT_SPEED = 34
const PLAYER_SPEED = 68
const MAX_FOOD = 3
const MAX_WATER = 3
const STORAGE_KEY = 'cathome_v2_state'

export class CatHomeEngine {
  private ctx: CanvasRenderingContext2D
  private bg!: HTMLCanvasElement
  private raf = 0
  private last = 0
  private running = false

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
  private food = 1
  private water = 2
  private lampOn = true
  private timeOfDay: TimeOfDay = 'night'
  private autoTime = true

  private toys: Toy[] = [
    { kind: 'ball', ...TOY_START.ball, vx: 0, vy: 0, spin: 0 },
    { kind: 'yarn', ...TOY_START.yarn, vx: 0, vy: 0, spin: 0 },
    { kind: 'mouse', ...TOY_START.mouse, vx: 0, vy: 0, spin: 0 },
    { kind: 'fish', ...TOY_START.fish, vx: 0, vy: 0, spin: 0 },
    { kind: 'wand', ...TOY_START.wand, vx: 0, vy: 0, spin: 0 },
  ]

  private particles: Particle[] = []
  private bubble: { text: string; t: number; ttl: number } | null = null
  private message: { text: string; t: number } | null = null
  private zTimer = 0
  private heartTimer = 0
  private saveTimer = 0

  // Cat autonomous state
  private cat = {
    x: 230,
    y: 180,
    facing: -1 as 1 | -1,
    mode: 'idle' as Mode,
    anim: 'idle' as CatAnim,
    animT: 0,
    timer: 2.0,
    onEnd: null as (() => void) | null,
    target: null as Pt | null,
    then: null as (() => void) | null,
    chasing: null as Toy | null,
    walkT: 0,
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

    this.loadFromStorage()
    this.rebuildBg()

    this.cam.x = clamp(this.player.x - VW / 2, 0, W - VW)
    this.cam.y = clamp(this.player.y - VH / 2, 0, H - VH)
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
      const data = JSON.parse(raw)
      if (typeof data.hunger === 'number') this.stats.hunger = clamp100(data.hunger)
      if (typeof data.happiness === 'number') this.stats.happiness = clamp100(data.happiness)
      if (typeof data.energy === 'number') this.stats.energy = clamp100(data.energy)
      if (typeof data.food === 'number') this.food = clamp(data.food, 0, MAX_FOOD)
      if (typeof data.water === 'number') this.water = clamp(data.water, 0, MAX_WATER)
      if (typeof data.lampOn === 'boolean') this.lampOn = data.lampOn

      if (typeof data.lastSaved === 'number') {
        const elapsedMins = (Date.now() - data.lastSaved) / 60000
        if (elapsedMins > 1) {
          const hungerDrop = Math.min(40, elapsedMins * 0.08)
          this.stats.hunger = clamp100(this.stats.hunger - hungerDrop)
          this.stats.energy = clamp100(this.stats.energy + Math.min(50, elapsedMins * 0.15))
        }
      }
    } catch {
      // Safe fallback
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return
    try {
      const payload = {
        hunger: Math.round(this.stats.hunger),
        happiness: Math.round(this.stats.happiness),
        energy: Math.round(this.stats.energy),
        food: this.food,
        water: this.water,
        lampOn: this.lampOn,
        lastSaved: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore
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

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
    this.saveToStorage()
  }

  keyDown(code: string, repeat = false) {
    this.keys.add(code)
    if ((code === 'KeyE' || code === 'Enter') && !repeat) this.interact()
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

  // -------------------------------------------------------------- Interaction

  private target(): Target | null {
    const p = this.player
    const c = this.cat
    const options: Target[] = []

    const dDoor = dist(p, POI.door)
    if (dDoor < 34) {
      options.push({ kind: 'door', label: 'Leave Cat Home (return to portfolio)', dist: dDoor - 14 })
    }

    const dc = dist(p, c)
    if (dc < 36) {
      options.push({ kind: 'cat', label: 'pet the cat', dist: dc - 10 })
    }

    const dFood = dist(p, POI.foodSpot)
    if (dFood < 32) {
      options.push({
        kind: 'food',
        label: this.food >= MAX_FOOD ? 'food bowl is full' : 'fill food bowl (kibble)',
        dist: dFood,
      })
    }

    const dWater = dist(p, POI.waterSpot)
    if (dWater < 32) {
      options.push({
        kind: 'water',
        label: this.water >= MAX_WATER ? 'water bowl is full' : 'fill water bowl (fresh water)',
        dist: dWater,
      })
    }

    const dStorage = dist(p, POI.foodStorage)
    if (dStorage < 32) {
      options.push({ kind: 'foodStorage', label: 'cat food cabinet', dist: dStorage })
    }

    const dBed = dist(p, { x: POI.bed.x, y: POI.bed.y + 6 })
    if (dBed < 38) {
      options.push({ kind: 'bed', label: 'tuck cat in bed', dist: dBed })
    }

    const dPost = dist(p, POI.post)
    if (dPost < 34) {
      options.push({ kind: 'post', label: 'scratching post', dist: dPost })
    }

    const dBox = dist(p, POI.box)
    if (dBox < 34) {
      options.push({ kind: 'box', label: 'cardboard box', dist: dBox })
    }

    const dPlant = dist(p, POI.plant)
    if (dPlant < 32) {
      options.push({ kind: 'plant', label: 'water houseplant', dist: dPlant })
    }

    const dLamp = dist(p, POI.lamp)
    if (dLamp < 36) {
      options.push({ kind: 'lamp', label: this.lampOn ? 'turn lamp off' : 'turn lamp on', dist: dLamp })
    }

    const dWindow = dist(p, POI.window)
    if (dWindow < 36) {
      options.push({ kind: 'window', label: 'look out window', dist: dWindow })
    }

    const dDesk = dist(p, POI.desk)
    if (dDesk < 36) {
      options.push({ kind: 'desk', label: 'sit at study desk', dist: dDesk })
    }

    for (const toy of this.toys) {
      const d = dist(p, toy)
      if (d < 24) {
        const actionVerb =
          toy.kind === 'wand'
            ? 'wave feather wand'
            : toy.kind === 'fish'
              ? 'toss catnip fish'
              : `play with ${toy.kind}`
        options.push({ kind: 'toy', label: actionVerb, dist: d - 4, toy })
      }
    }

    options.sort((a, b) => a.dist - b.dist)
    return options[0] ?? null
  }

  interact() {
    if (this.interactCd > 0) return
    const t = this.target()
    if (!t) return
    this.interactCd = 0.25

    switch (t.kind) {
      case 'door':
        this.flash('returning to portfolio...')
        if (this.onExit) this.onExit()
        break

      case 'cat':
        this.pet()
        break

      case 'food':
        this.player.action = 'pour'
        this.player.actionTimer = 1.4
        if (this.food >= MAX_FOOD) {
          this.flash('the food bowl is already full!')
        } else {
          this.food = MAX_FOOD
          this.flash('kibble bowl filled!')
          this.react(0.4, () => {
            if (this.stats.hunger < 70) {
              this.setMode('happy', 'happy', 1, () => this.goEat())
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
          this.flash('poured fresh water!')
          this.spawnWaterSplashes(POI.waterSpot.x, POI.waterSpot.y)
          this.react(0.5, () => {
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
        this.flash('restocked cat food!')
        this.react(0.5, () => this.say('meow!'))
        this.saveToStorage()
        break

      case 'toy':
        if (t.toy.kind === 'wand') {
          // Player waves feather wand!
          this.player.action = 'wave'
          this.player.actionTimer = 3.2
          this.flash('waving feather teaser wand!')
          this.react(0.3, () => {
            this.goTo(this.player.x + (this.player.facing === 1 ? 16 : -16), this.player.y + 2, () => {
              this.setMode('happy', 'play', 2.5)
              this.say('play!', 1.6)
              this.stats.happiness = clamp100(this.stats.happiness + 10)
            })
          })
        } else {
          this.kick(t.toy)
        }
        break

      case 'bed':
        if (this.cat.mode === 'sleep') {
          this.flash('shh... the cat is sleeping peacefully')
        } else if (this.stats.energy > 90) {
          this.flash('cat is wide awake and energetic!')
          this.say('mrrp')
        } else {
          this.flash('time for a cozy nap')
          this.goSleep()
        }
        break

      case 'post':
        this.flash('jiggled the scratching post ball!')
        this.react(0.4, () => this.goScratch())
        break

      case 'box':
        this.flash('cat examines the box ("if it fits, I sits")')
        this.react(0.4, () => this.goBox())
        break

      case 'plant':
        this.player.action = 'pour'
        this.player.actionTimer = 1.2
        this.flash('watered the plant (it looks vibrant)')
        this.spawnWaterSplashes(POI.plant.x, POI.plant.y - 6)
        break

      case 'lamp':
        this.toggleLamp()
        break

      case 'window':
        if (this.timeOfDay === 'day') {
          this.flash('sunny day outside, birds singing in the distance')
        } else if (this.timeOfDay === 'sunset') {
          this.flash('golden sunset glow across the sky')
        } else {
          this.flash('quiet starry night, soft moonlight outside')
        }
        this.react(0.6, () => this.goWindow())
        break

      case 'desk':
        this.player.action = 'sit'
        this.player.actionTimer = 3.5
        this.flash('sitting at desk: coding & enjoying tea')
        break
    }
  }

  private pet() {
    const c = this.cat
    const wasSleeping = c.mode === 'sleep'
    this.player.facing = c.x >= this.player.x ? 1 : -1
    this.player.action = 'pet'
    this.player.actionTimer = 2.8

    c.facing = this.player.x >= c.x ? 1 : -1
    if (c.mode !== 'pet') {
      this.setMode('pet', 'pet', 2.8, () => this.think())
      const phrases = wasSleeping ? ['mrrp', 'purrr...'] : ['purrr...', 'meow', ':3']
      this.say(phrases[Math.floor(Math.random() * phrases.length)], 2.4)
    } else {
      c.timer = 2.8
    }
    this.stats.happiness = clamp100(this.stats.happiness + 8)
    this.spawnHearts(3)
    this.saveToStorage()
  }

  private kick(toy: Toy) {
    const dir = this.player.dir
    toy.vx = (dir.x || this.player.facing) * 160
    toy.vy = (dir.y || (Math.random() - 0.5)) * 90
    this.react(0.4, () => {
      if (this.stats.energy > 15) {
        this.setMode('happy', 'happy', 0.8, () => this.startPlay(toy))
        this.say('play?', 1.6)
      }
    })
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

  private goTo(x: number, y: number, then: () => void) {
    const c = this.cat
    this.setMode('walk', 'walk', 0)
    c.target = { x, y }
    c.then = then
    c.walkT = 0
  }

  private think = () => {
    const c = this.cat
    const { hunger, energy } = this.stats
    const choices: [number, () => void][] = []

    const sleepWeight = this.timeOfDay === 'night' ? 4 : 1.5

    if (hunger < 40 && this.food > 0) {
      choices.push([7, () => this.goEat()])
    } else if (hunger < 40 && this.food === 0) {
      choices.push([4, () => this.goBeg()])
    }

    if (energy < 35) {
      choices.push([9 * sleepWeight, () => this.goSleep()])
    } else {
      choices.push([energy < 70 ? 2 * sleepWeight : 0.6, () => this.goSleep()])
    }

    choices.push([4, () => this.wander()])
    choices.push([3, () => this.setMode('sit', 'sit', rand(3, 7))])
    choices.push([2, () => this.setMode('idle', 'idle', rand(1.5, 3.5))])
    choices.push([2, () => this.setMode('stretch', 'stretch', rand(2.5, 4))])
    choices.push([2.5, () => this.setMode('groom', 'groom', rand(3, 5))])
    choices.push([2.5, () => this.investigate()])
    choices.push([1.5, () => this.goWindow()])
    choices.push([1.8, () => this.goScratch()])

    if (this.water > 0) {
      choices.push([1.2, () => this.goDrink()])
    }

    if (energy > 20) {
      choices.push([
        3.5,
        () => this.startPlay(this.toys[Math.floor(Math.random() * this.toys.length)]),
      ])
    }

    if (dist(this.player, this.cat) > 60 && Math.random() < 0.25) {
      choices.push([2, () => this.followPlayer()])
    }

    const total = choices.reduce((s, [w]) => s + w, 0)
    let r = Math.random() * total
    for (const [w, fn] of choices) {
      r -= w
      if (r <= 0) return fn()
    }
    c.mode = 'idle'
  }

  private wander() {
    for (let i = 0; i < 20; i++) {
      const x = rand(BOUNDS.minX + 10, BOUNDS.maxX - 10)
      const y = rand(BOUNDS.minY + 6, BOUNDS.maxY - 4)
      if (insideCollider(x, y, 10)) continue
      if (dist({ x, y }, this.cat) < 30) continue
      return this.goTo(x, y, () => this.setMode('idle', 'idle', rand(1.5, 3)))
    }
    this.setMode('idle', 'idle', 2)
  }

  private followPlayer() {
    const p = this.player
    const ang = Math.atan2(p.y - this.cat.y, p.x - this.cat.x)
    const targetX = clamp(p.x - Math.cos(ang) * 32, BOUNDS.minX + 8, BOUNDS.maxX - 8)
    const targetY = clamp(p.y - Math.sin(ang) * 32, BOUNDS.minY + 6, BOUNDS.maxY)
    this.goTo(targetX, targetY, () => {
      this.cat.facing = p.x >= this.cat.x ? 1 : -1
      this.setMode('sit', 'sit', rand(2, 4))
      if (Math.random() < 0.4) this.say('mrrp')
    })
  }

  private investigate() {
    const p = INVESTIGATE[Math.floor(Math.random() * INVESTIGATE.length)]
    this.goTo(p.x, p.y, () => {
      this.cat.facing = p.face
      this.setMode('idle', 'idle', rand(2, 4))
      if (Math.random() < 0.35) this.say('mrrp')
    })
  }

  private goEat() {
    this.goTo(POI.foodSpot.x, POI.foodSpot.y, () => {
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
    })
  }

  private goBeg() {
    this.goTo(POI.foodSpot.x, POI.foodSpot.y, () => {
      this.cat.facing = 1
      this.say('feed me', 2.2)
      this.setMode('sit', 'sit', rand(3, 5))
    })
  }

  private goDrink() {
    this.goTo(POI.waterSpot.x, POI.waterSpot.y, () => {
      this.cat.facing = 1
      this.setMode('drink', 'eat', rand(2.4, 3.5), () => {
        this.water = Math.max(0, this.water - 1)
        this.stats.happiness = clamp100(this.stats.happiness + 4)
        this.say('mrrp')
        this.setMode('groom', 'groom', 2.5)
        this.saveToStorage()
      })
      this.spawnWaterSplashes(POI.waterBowl.x, POI.waterBowl.y - 2)
    })
  }

  private goScratch() {
    this.goTo(POI.post.x - 14, POI.post.y + 4, () => {
      this.cat.facing = 1
      this.setMode('scratch', 'scratch', rand(3, 4.5), () => {
        this.stats.happiness = clamp100(this.stats.happiness + 6)
        this.setMode('stretch', 'stretch', 2.0)
      })
      if (Math.random() < 0.4) this.say('purrr...')
    })
  }

  private goBox() {
    this.goTo(POI.box.x, POI.box.y - 2, () => {
      this.cat.facing = 1
      this.setMode('sit', 'sit', rand(5, 9), () => this.think())
      this.say(':3', 2.2)
    })
  }

  private goWindow() {
    this.goTo(POI.window.x, POI.window.y + 6, () => {
      this.cat.facing = 1
      this.setMode('sit', 'sit', rand(4, 9), () => this.think())
      if (Math.random() < 0.4) this.say('meow')
    })
  }

  private goSleep() {
    this.goTo(POI.bed.x, POI.bed.y - 2, () => {
      this.cat.facing = 1
      this.setMode('sleep', 'sleep', rand(16, 30), () => {
        this.setMode('stretch', 'stretch', 2.5, () => this.think())
        this.say('mrrp')
      })
      this.say('zzz...', 2.4)
    })
  }

  private startPlay(toy: Toy) {
    this.cat.playLeft = 2 + Math.floor(Math.random() * 3)
    this.chasePlay(toy)
  }

  private chasePlay(toy: Toy) {
    this.goTo(toy.x, toy.y, () => this.bat(toy))
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
    c.noticeCd -= dt

    if (c.pending) {
      c.pending.t -= dt
      if (c.pending.t <= 0) {
        if (['idle', 'walk', 'sit', 'notice', 'stretch', 'groom'].includes(c.mode)) {
          const fn = c.pending.fn
          c.pending = null
          fn()
        } else if (c.pending.t < -3) c.pending = null
      }
    }

    const dp = dist(p, c)
    if (dp < 60 && c.noticeCd <= 0 && ['idle', 'walk', 'sit'].includes(c.mode)) {
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
      if (Math.random() < 0.45) this.say(greetings[Math.floor(Math.random() * greetings.length)])
    } else if ((c.mode === 'idle' || c.mode === 'sit') && dp < 85 && Math.abs(p.x - c.x) > 6) {
      c.facing = p.x >= c.x ? 1 : -1
    }

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
      if (c.walkT > 14) this.think()
      else if (d < 2.5) {
        const then = c.then
        c.then = null
        then?.()
      } else {
        const s = Math.min(d, CAT_SPEED * dt)
        c.x += (dx / d) * s
        c.y += (dy / d) * s
        if (Math.abs(dx) > 0.4) c.facing = dx > 0 ? 1 : -1
      }
      return
    }

    if (c.mode === 'bat' && !c.impulsed && c.timer < 0.65 && c.chasing === null) {
      c.impulsed = true
      const toy = this.toys.reduce((a, b) => (dist(a, c) < dist(b, c) ? a : b))
      const ang = (c.facing === 1 ? 0 : Math.PI) + rand(-0.7, 0.7)
      toy.vx = Math.cos(ang) * 120
      toy.vy = Math.sin(ang) * 60
      this.stats.happiness = clamp100(this.stats.happiness + 6)
      this.stats.energy = clamp100(this.stats.energy - 4)
      this.saveToStorage()
    }

    if (c.mode === 'sleep') {
      this.zTimer -= dt
      if (this.zTimer <= 0) {
        this.zTimer = 1.1
        this.particles.push({ kind: 'z', x: c.x + 10, y: c.y - 18, vx: 4, vy: -7, t: 0, ttl: 2.2 })
      }
      if (this.stats.energy >= 99) c.timer = Math.min(c.timer, 0)
    }

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

    const tx = clamp(this.player.x - VW / 2, 0, W - VW)
    const ty = clamp(this.player.y - VH / 2 - 12, 0, H - VH)
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
    s.hunger = clamp100(s.hunger - (sleeping ? 0.08 : 0.22) * dt)
    s.happiness = clamp100(s.happiness - 0.15 * dt)
    s.energy = clamp100(s.energy + (sleeping ? 1.8 : -0.15) * dt)
  }

  private updatePlayer(dt: number) {
    const p = this.player
    const k = this.keys
    let ix = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0)
    let iy = (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0) - (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0)
    ix += this.joy.x
    iy += this.joy.y
    const len = Math.hypot(ix, iy)
    p.moving = len > 0.15

    if (p.moving) {
      p.action = 'walk'
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
    const hud: Hud = {
      hunger: Math.round(this.stats.hunger),
      happiness: Math.round(this.stats.happiness),
      energy: Math.round(this.stats.energy),
      food: this.food,
      water: this.water,
      timeOfDay: this.timeOfDay,
      lampOn: this.lampOn,
      prompt: t ? t.label : null,
      message: this.message?.text ?? null,
      state: c.mode,
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
    ctx.fillRect(0, 0, VW, VH)

    ctx.save()
    ctx.translate(-Math.round(this.cam.x), -Math.round(this.cam.y))

    ctx.drawImage(this.bg, 0, 0)

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
          const wide = c.mode === 'sleep'
          ctx.fillStyle = 'rgba(0,0,0,0.45)'
          ctx.fillRect(Math.round(c.x) - (wide ? 12 : 9), Math.round(c.y) - 1, wide ? 24 : 18, 2)
          const a = ANIMATIONS[c.anim]
          drawCat(ctx, c.anim, Math.floor(c.animT * a.fps), c.x, c.y, c.facing)
        },
      },
      {
        y: p.y,
        draw: () => drawPlayer(ctx, p.x, p.y, p.facing, p.direction, p.step, p.action),
      },
    ]

    sortables.sort((a, b) => a.y - b.y).forEach((s) => s.draw())

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
        c.y - anchor,
        Math.min(1, left / 0.25),
      )
    }

    const t = this.target()
    if (t) {
      let pos: Pt
      if (t.kind === 'door') pos = { x: POI.door.x, y: POI.door.y - 40 }
      else if (t.kind === 'cat') pos = { x: c.x, y: c.y - 32 }
      else if (t.kind === 'toy') pos = { x: t.toy.x, y: t.toy.y - 12 }
      else if (t.kind === 'food') pos = { x: POI.foodBowl.x, y: POI.foodBowl.y - 14 }
      else if (t.kind === 'water') pos = { x: POI.waterBowl.x, y: POI.waterBowl.y - 14 }
      else if (t.kind === 'foodStorage') pos = { x: POI.foodStorage.x, y: POI.foodStorage.y - 22 }
      else if (t.kind === 'bed') pos = { x: POI.bed.x, y: POI.bed.y - 20 }
      else if (t.kind === 'post') pos = { x: POI.post.x, y: POI.post.y - 44 }
      else if (t.kind === 'box') pos = { x: POI.box.x, y: POI.box.y - 28 }
      else if (t.kind === 'plant') pos = { x: POI.plant.x, y: POI.plant.y - 44 }
      else if (t.kind === 'lamp') pos = { x: POI.lamp.x, y: POI.lamp.y - 36 }
      else if (t.kind === 'window') pos = { x: POI.window.x, y: POI.window.y - 40 }
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
