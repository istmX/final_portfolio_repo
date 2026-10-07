import { POI } from './room'

export type InteractionAction =
  'interact' | 'cuddle' | 'call' | 'carry' | 'play' | 'feed' | 'laser' | 'nap'

export type InteractionChoice = {
  key: string
  label: string
  action: InteractionAction
}

type WorldTargetKind =
  | 'food'
  | 'water'
  | 'foodStorage'
  | 'bed'
  | 'post'
  | 'box'
  | 'plant'
  | 'lamp'
  | 'window'
  | 'desk'
  | 'tank'
  | 'bookshelf'
  | 'door'

type WorldTargetDefinition = {
  id: string
  kind: WorldTargetKind
  point: keyof typeof POI
  radius: number
  label: string
  discovery?: string
}

/** Room interaction metadata stays together; the engine supplies live state and runs actions. */
export const INTERACTION_REGISTRY: readonly WorldTargetDefinition[] = [
  {
    id: 'food-bowl',
    kind: 'food',
    point: 'foodSpot',
    radius: 32,
    label: 'Food bowl',
  },
  {
    id: 'water-bowl',
    kind: 'water',
    point: 'waterSpot',
    radius: 32,
    label: 'Water bowl',
  },
  {
    id: 'food-cabinet',
    kind: 'foodStorage',
    point: 'foodStorage',
    radius: 32,
    label: 'Food cabinet',
  },
  { id: 'bed', kind: 'bed', point: 'bed', radius: 38, label: 'Cat bed' },
  { id: 'tower', kind: 'post', point: 'post', radius: 34, label: 'Cat tower' },
  {
    id: 'box',
    kind: 'box',
    point: 'box',
    radius: 34,
    label: 'Cardboard box',
    discovery: 'box',
  },
  {
    id: 'plant',
    kind: 'plant',
    point: 'plant',
    radius: 32,
    label: 'Houseplant',
  },
  { id: 'lamp', kind: 'lamp', point: 'lamp', radius: 36, label: 'Lamp' },
  {
    id: 'window',
    kind: 'window',
    point: 'window',
    radius: 36,
    label: 'Window',
  },
  { id: 'desk', kind: 'desk', point: 'desk', radius: 36, label: 'Desk' },
  {
    id: 'fish-tank',
    kind: 'tank',
    point: 'tank',
    radius: 34,
    label: 'Fish tank',
    discovery: 'fish-tank',
  },
  {
    id: 'bookshelf',
    kind: 'bookshelf',
    point: 'bookshelf',
    radius: 38,
    label: 'Bookshelf',
    discovery: 'bookshelf',
  },
  {
    id: 'portfolio-door',
    kind: 'door',
    point: 'door',
    radius: 34,
    label: 'Portfolio door',
  },
]

export const TARGET_ACTIONS: Record<
  WorldTargetKind | 'cat' | 'toy',
  readonly InteractionChoice[]
> = {
  cat: [
    { key: 'E', label: 'Pet', action: 'interact' },
    { key: 'C', label: 'Cuddle', action: 'cuddle' },
    { key: 'Q', label: 'Call', action: 'call' },
    { key: 'H', label: 'Carry', action: 'carry' },
  ],
  toy: [
    { key: 'E', label: 'Play with toy', action: 'interact' },
    { key: 'R', label: 'Invite to play', action: 'play' },
  ],
  food: [
    { key: 'E', label: 'Fill bowl', action: 'interact' },
    { key: 'F', label: 'Offer food', action: 'feed' },
  ],
  water: [{ key: 'E', label: 'Refresh water', action: 'interact' }],
  foodStorage: [{ key: 'E', label: 'Restock food', action: 'interact' }],
  bed: [{ key: 'E', label: 'Invite to nap', action: 'interact' }],
  post: [{ key: 'E', label: 'Inspect tower', action: 'interact' }],
  box: [{ key: 'E', label: 'Investigate box', action: 'interact' }],
  plant: [{ key: 'E', label: 'Check plant', action: 'interact' }],
  lamp: [{ key: 'E', label: 'Toggle lamp', action: 'interact' }],
  window: [{ key: 'E', label: 'Look outside', action: 'interact' }],
  desk: [{ key: 'E', label: 'Sit at desk', action: 'interact' }],
  tank: [{ key: 'E', label: 'Watch fish', action: 'interact' }],
  bookshelf: [{ key: 'E', label: 'Browse books', action: 'interact' }],
  door: [{ key: 'E', label: 'Return to portfolio', action: 'interact' }],
}

export const GLOBAL_ACTIONS: readonly InteractionChoice[] = [
  { key: 'L', label: 'Laser pointer', action: 'laser' },
  { key: 'Z', label: 'Encourage a nap', action: 'nap' },
]
