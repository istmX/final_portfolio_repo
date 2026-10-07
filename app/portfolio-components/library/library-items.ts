export type LibraryProp = {
  name: string
  type: string
  description: string
}

export type LibraryItem = {
  slug: string
  name: string
  description: string
  category: string
  commandName: string
  dependencies: string[]
  features: string[]
  composition: string[]
  props: LibraryProp[]
  usage: string
  example: string
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    slug: 'shimmer-text',
    name: 'Shimmer Text',
    description: 'A small shimmer treatment for short bits of interface text.',
    category: 'Text',
    commandName: 'shimmer-text',
    dependencies: ['React', 'Tailwind CSS'],
    features: [
      'Works with any text content.',
      'Uses the current foreground and muted theme colors.',
      'Keeps the effect small and easy to restyle.',
    ],
    composition: ['ShimmerText', '└── Your text or inline content'],
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Content to render with the shimmer.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional classes for local styling.',
      },
    ],
    usage: `import { ShimmerText } from "@/components/ui/shimmer-text"

<ShimmerText>AI Engineer</ShimmerText>`,
    example:
      'Use the shimmer sparingly for a short label or highlighted phrase.',
  },
  {
    slug: 'animated-text',
    name: 'Animated Text',
    description: 'A blur and slide transition for changing text or roles.',
    category: 'Text',
    commandName: 'animated-text',
    dependencies: ['React', 'Motion', 'Tailwind CSS'],
    features: [
      'Transitions between a list of text values.',
      'Combines a short upward movement with a soft blur.',
      'Respects reduced-motion preferences.',
    ],
    composition: ['AnimatedText', '├── Entering text', '└── Exiting text'],
    props: [
      {
        name: 'items',
        type: 'string[]',
        description: 'Text values to rotate through.',
      },
      {
        name: 'interval?',
        type: 'number',
        description: 'Delay between changes in milliseconds.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional classes for local styling.',
      },
    ],
    usage: `import { AnimatedText } from "@/components/ui/animated-text"

<AnimatedText items={["AI Engineer", "Builder"]} />`,
    example: 'Use for a small rotating role, status, or short list of labels.',
  },
  {
    slug: 'layered-button',
    name: 'Layered Button',
    description: 'An editorial button with thin borders and a subtle lift.',
    category: 'Buttons',
    commandName: 'layered-button',
    dependencies: ['React', 'Tailwind CSS', 'Motion'],
    features: [
      'Uses a thin layered edge for depth.',
      'Includes restrained hover and press feedback.',
      'Designed to work with light and dark themes.',
    ],
    composition: ['LayeredButton', '└── Label and optional icon'],
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Button label and optional inline content.',
      },
      {
        name: 'href?',
        type: 'string',
        description: 'When provided, render as a link.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional classes for local styling.',
      },
    ],
    usage: `import { LayeredButton } from "@/components/ui/layered-button"

<LayeredButton href="/projects">Explore projects</LayeredButton>`,
    example:
      'Use for a primary action that should feel tactile without a strong glow.',
  },
  {
    slug: 'pixel-cat',
    name: 'Pixel Cat',
    description:
      'A tiny idle companion with room for interaction and movement.',
    category: 'Interactive',
    commandName: 'pixel-cat',
    dependencies: ['React'],
    features: [
      'Supports a configurable display size.',
      'Can idle, blink, and respond to interaction.',
      'Designed as a small companion rather than a game engine.',
    ],
    composition: [
      'PixelCat',
      '├── Pixel-art sprite',
      '└── Optional interaction callbacks',
    ],
    props: [
      {
        name: 'size?',
        type: 'number',
        description: 'Rendered size in pixels.',
      },
      {
        name: 'interactive?',
        type: 'boolean',
        description: 'Enable pointer interaction.',
      },
      {
        name: 'onClick?',
        type: '() => void',
        description: 'Called when the cat is activated.',
      },
    ],
    usage: `import { PixelCat } from "@/components/ui/pixel-cat"

<PixelCat size={96} interactive />`,
    example: 'Place in a quiet corner of a page and keep movement optional.',
  },
]

export function getLibraryItem(slug: string) {
  return LIBRARY_ITEMS.find((item) => item.slug === slug)
}
