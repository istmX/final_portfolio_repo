import { IMAGE_TRAIL_IMAGES } from './image-trail-data'
import type { InfiniteImageCanvasItem } from '@/components/ui/infinite-image-canvas'

const IMAGE_NAMES = [
  'Stillwater',
  'Sunday Light',
  'Soft Focus',
  'Blue Hour',
  'Quiet Bloom',
  'Golden Pause',
  'Cloud Study',
  'Daydream',
  'Open Air',
  'Slow Morning',
  'Faraway',
]

const PASTEL_COLORS = [
  '#d9c9ff',
  '#ffd8c4',
  '#c9eadc',
  '#c9e5ff',
  '#ffe9aa',
  '#f5cadd',
  '#d5dcff',
  '#f8d9b8',
  '#c7e7e7',
  '#e6d2ff',
  '#f7d3ca',
]

export const INFINITE_IMAGE_CANVAS_IMAGES: InfiniteImageCanvasItem[] =
  IMAGE_TRAIL_IMAGES.map((image, index) => ({
    ...image,
    name: IMAGE_NAMES[index % IMAGE_NAMES.length],
    color: PASTEL_COLORS[index % PASTEL_COLORS.length],
  }))
