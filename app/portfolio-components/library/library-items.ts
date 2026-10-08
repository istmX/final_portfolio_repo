import { dockNavigationSourceCode } from './dock-navigation-source'
import { buttonSourceCode } from './button-source'
import { imageAccordionSourceCode } from './image-accordion-source'
import { imageTrailSourceCode } from './image-trail-source'
import { infiniteImageCanvasSourceCode } from './infinite-image-canvas-source'
import { mobileMenuDockSourceCode } from './mobile-menu-dock-source'
import { pixelCatSourceCode } from './pixel-cat-source'
import { scrollStoryCardsSourceCode } from './scroll-story-cards-source'
import { textRevealSourceCode } from './text-reveal-source'

export type LibraryProp = {
  name: string
  type: string
  description: string
}

export type LibraryItem = {
  slug: string
  name: string
  description: string
  seoTitle: string
  seoDescription: string
  keywords: string[]
  accessibility: string
  interaction: string
  limitations: string
  category: string
  commandName: string
  dependencies: string[]
  features: string[]
  composition: string[]
  props: LibraryProp[]
  sourceCode: string
  usage: string
  example: string
  migrationExample?: string
}

export const LIBRARY_ITEMS: LibraryItem[] = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'An animated action button with solid save, share, and delete colors, optional icons, and success feedback.',
    seoTitle: 'Button — Motion-Ready React Button | ISTMX',
    seoDescription:
      'A reusable React button with primary, secondary, outline, ghost, and soft variants, multiple sizes, link support, and reduced-motion-aware interaction.',
    keywords: [
      'react button',
      'motion button',
      'tailwind button',
      'button component',
    ],
    accessibility:
      'Uses native button or anchor semantics, an announced polite feedback label, visible keyboard focus, disabled link handling, and reduced-motion-aware transitions.',
    interaction:
      'Save uses emerald, share uses sky, and delete uses rose. A matching hover glow and spring press response keep each action lively. Optional feedback animates the label and icon, then returns to the original state after its duration. Motion is reduced when the user prefers reduced motion.',
    limitations:
      'This is a single-action control. Use a separate Toggle or Tabs component when the control represents persistent selection or a group of choices.',
    category: 'Controls',
    commandName: 'button',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Use as a native button or provide href for an anchor link.',
      'Choose primary, secondary, outline, ghost, or soft visual variants.',
      'Choose small, medium, large, or icon sizing.',
      'Pass an optional icon and feedback label/icon for animated action confirmation.',
      'Adds an intent-matched hover glow, focus ring, lift, and press response.',
      'Keeps keyboard focus visible and respects reduced-motion preferences.',
    ],
    composition: ['Button', '├── Surface and sheen', '└── Action content'],
    props: [
      {
        name: 'children',
        type: 'ReactNode',
        description: 'Button label or content.',
      },
      {
        name: 'href?',
        type: 'string',
        description: 'When provided, renders an anchor instead of a button.',
      },
      {
        name: 'variant?',
        type: 'ButtonVariant',
        description:
          'primary, secondary, outline, ghost, or soft. Defaults to primary.',
      },
      {
        name: 'intent?',
        type: 'ButtonIntent',
        description:
          'Sets the primary action color: save (emerald), share (sky), or delete (rose). Defaults to save.',
      },
      {
        name: 'size?',
        type: 'ButtonSize',
        description: 'sm, md, lg, or icon. Defaults to md.',
      },
      {
        name: 'disabled?',
        type: 'boolean',
        description: 'Disables a button or prevents navigation for an anchor.',
      },
      {
        name: 'icon?',
        type: 'ReactNode',
        description: 'Optional leading icon shown beside the idle label.',
      },
      {
        name: 'feedback?',
        type: '{ label: string; icon?: ReactNode; duration?: number }',
        description:
          'After activation, briefly swaps to a confirmation label and optional icon. Defaults to a check mark and 1800 ms.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional Tailwind classes for the control.',
      },
      {
        name: 'type?',
        type: '"button" | "submit" | "reset"',
        description: 'Native button type; defaults to button.',
      },
    ],
    sourceCode: buttonSourceCode,
    usage: `import Button from '@/components/ui/button'

<Button onClick={() => console.log('Saved')}>
  Save changes
</Button>

<Button
  icon={<BookmarkIcon />}
  feedback={{ label: 'Saved', icon: <CheckIcon /> }}
  onClick={saveItem}
>
  Save
</Button>

<Button intent="share" feedback={{ label: 'Link copied' }} onClick={shareLink}>
  Share
</Button>

<Button intent="delete" feedback={{ label: 'Deleted' }} onClick={deleteItem}>
  Delete
</Button>

<Button href="/stays" variant="outline" size="lg">
  Explore stays
</Button>`,
    example:
      'Use the primary variant for the main action and opt into feedback when the user needs confirmation that a save, send, or similar action completed. The component accepts native button props and anchor props when href is supplied.',
    migrationExample: `+ import Button from '@/components/ui/button'

- <button className="rounded-full bg-black px-4 py-2 text-white">Save</button>
+ <Button>Save</Button>`,
  },
  {
    slug: 'animated-text',
    name: 'Animated Text',
    description:
      'Rotating text with composable blur, fade, shimmer, slide, and character-wave effects, plus adjustable scale.',
    seoTitle: 'Animated Text — React Text Animation Component | ISTMX',
    seoDescription:
      'A customizable React component for rotating text with blur, shimmer, fade, slide, and per-character wave effects.',
    keywords: [
      'react animated text',
      'animated text react component',
      'react text animation',
      'react rotating text',
      'react shimmer text',
    ],
    accessibility:
      'The text remains real DOM text. The component respects prefers-reduced-motion by stopping its automatic rotation and rendering the current text without transition effects.',
    interaction:
      'Animated Text rotates through the supplied strings on an interval. Each transition can combine blur, fade, shimmer, slide, and wave effects; effect values and timing are configurable.',
    limitations:
      'The rotating values are plain strings. Use the component for short labels or phrases rather than rich text or arbitrary React children.',
    category: 'Text',
    commandName: 'animated-text',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Rotates through a list of words or short phrases.',
      'Combine effects with effects, or use one effect such as effect="fade".',
      'Wave animates individual characters in a staggered sequence.',
      'Available effects: blur, fade, shimmer, slide, and wave.',
      'Optionally set the starting scale for each text transition.',
      'Tune blur, fade, slide, shimmer, and wave values through effectOptions.',
      'Set the direction, timing, prefix, and text classes.',
      'Respects reduced-motion preferences.',
    ],
    composition: ['AnimatedText', '├── Entering text', '└── Exiting text'],
    props: [
      {
        name: 'items?',
        type: 'string[]',
        description: 'Text values to rotate through.',
      },
      {
        name: 'prefix?',
        type: 'string',
        description: 'Text to keep before the rotating item.',
      },
      {
        name: 'effect?',
        type: 'AnimatedTextEffect',
        description:
          'Choose one effect, such as effect="fade". Defaults to blur; use effects to combine multiple effects.',
      },
      {
        name: 'effects?',
        type: 'AnimatedTextEffect[]',
        description:
          'Combine blur, fade, shimmer, slide, and wave. Defaults to blur.',
      },
      {
        name: 'effectOptions?',
        type: 'AnimatedTextEffectOptions',
        description:
          'Tune blur, fade, slide, shimmer, and wave values. Shimmer color and highlight can be set directly.',
      },
      {
        name: 'scale?',
        type: 'number',
        description:
          'Optional starting scale for transitions, such as 0.96. Omit to disable scaling.',
      },
      {
        name: 'direction?',
        type: '"up" | "down" | "left" | "right" | "none"',
        description:
          'Direction for blur and slide transitions. Defaults to up.',
      },
      {
        name: 'interval?',
        type: 'number',
        description: 'Delay between text changes in milliseconds.',
      },
      {
        name: 'speed?',
        type: 'number',
        description: 'Transition duration in seconds.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Classes for the component wrapper.',
      },
      {
        name: 'textClassName?',
        type: 'string',
        description: 'Classes for the changing text.',
      },
    ],
    sourceCode: String.raw`'use client'

import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

const DEFAULT_ITEMS = [
  'an AI Engineer',
  'a Full-Stack Developer',
  'a Student',
  'a Mobile Developer',
]

const DIRECTIONS = {
  up: { enter: 5, exit: -5 },
  down: { enter: -5, exit: 5 },
  left: { enter: 7, exit: -7 },
  right: { enter: -7, exit: 7 },
  none: { enter: 0, exit: 0 },
} as const

export type AnimatedTextEffect = 'blur' | 'shimmer' | 'fade' | 'slide' | 'wave'
export type AnimatedTextDirection = keyof typeof DIRECTIONS
export type AnimatedTextEffectOptions = {
  blur?: { amount?: number }
  fade?: { from?: number }
  slide?: { distance?: number }
  shimmer?: {
    duration?: number
    width?: number
    color?: string
    highlight?: string
  }
  wave?: { amplitude?: number; stagger?: number }
}

export type AnimatedTextProps = {
  items?: string[]
  prefix?: string
  effect?: AnimatedTextEffect
  effects?: AnimatedTextEffect[]
  effectOptions?: AnimatedTextEffectOptions
  scale?: number
  direction?: AnimatedTextDirection
  interval?: number
  speed?: number
  className?: string
  textClassName?: string
}

export function AnimatedText({
  items = DEFAULT_ITEMS,
  prefix,
  effect = 'blur',
  effects = [effect],
  effectOptions,
  scale,
  direction = 'up',
  interval = 2600,
  speed = 0.32,
  className,
  textClassName,
}: AnimatedTextProps) {
  const [itemIndex, setItemIndex] = useState(0)
  const shouldReduceMotion = useReducedMotion()
  const values = items.length > 0 ? items : ['']
  const currentItem = values[itemIndex % values.length]
  const offset = DIRECTIONS[direction]
  const activeEffects = new Set(effects)
  const hasBlur = activeEffects.has('blur')
  const hasFade = activeEffects.has('fade') || hasBlur
  const hasSlide = activeEffects.has('slide') || hasBlur
  const blurAmount = Math.max(0, effectOptions?.blur?.amount ?? 5)
  const fadeFrom = Math.min(1, Math.max(0, effectOptions?.fade?.from ?? 0))
  const shimmerDuration = Math.max(0.1, effectOptions?.shimmer?.duration ?? 2.6)
  const shimmerWidth = Math.min(
    80,
    Math.max(5, effectOptions?.shimmer?.width ?? 30),
  )
  const shimmerColor = effectOptions?.shimmer?.color ?? 'var(--muted, #71717a)'
  const shimmerHighlight =
    effectOptions?.shimmer?.highlight ?? 'var(--foreground, #18181b)'
  const slideDistance = Math.max(
    0,
    effectOptions?.slide?.distance ?? Math.abs(offset.enter),
  )
  const waveAmplitude = Math.max(0, effectOptions?.wave?.amplitude ?? 4)
  const waveStagger = Math.max(0, effectOptions?.wave?.stagger ?? 0.025)
  const scaleFrom =
    typeof scale === 'number' &&
    Number.isFinite(scale) &&
    scale > 0 &&
    scale !== 1
      ? scale
      : undefined
  const shimmerEnabled = activeEffects.has('shimmer') && !shouldReduceMotion
  const waveEnabled = activeEffects.has('wave')
  const enterX =
    direction === 'left' || direction === 'right'
      ? Math.sign(offset.enter) * slideDistance
      : 0
  const enterY =
    direction === 'up' || direction === 'down'
      ? Math.sign(offset.enter) * slideDistance
      : 0
  const exitX =
    direction === 'left' || direction === 'right'
      ? Math.sign(offset.exit) * slideDistance
      : 0
  const exitY =
    direction === 'up' || direction === 'down'
      ? Math.sign(offset.exit) * slideDistance
      : 0
  const initialState = {
    ...(hasFade ? { opacity: fadeFrom } : {}),
    ...(hasSlide ? { x: enterX, y: enterY } : {}),
    ...(hasBlur ? { filter: 'blur(' + blurAmount + 'px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: scaleFrom } : {}),
  }
  const animateState = {
    ...(hasFade ? { opacity: 1 } : {}),
    ...(hasSlide ? { x: 0, y: 0 } : {}),
    ...(hasBlur ? { filter: 'blur(0px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: 1 } : {}),
    ...(shimmerEnabled ? { backgroundPosition: ['100% 0', '-120% 0'] } : {}),
  }
  const exitState = {
    ...(hasFade ? { opacity: fadeFrom } : {}),
    ...(hasSlide ? { x: exitX, y: exitY } : {}),
    ...(hasBlur ? { filter: 'blur(' + blurAmount + 'px)' } : {}),
    ...(scaleFrom !== undefined ? { scale: scaleFrom } : {}),
  }

  useEffect(() => {
    if (shouldReduceMotion || values.length < 2 || interval <= 0) return

    const timer = window.setInterval(() => {
      setItemIndex((index) => (index + 1) % values.length)
    }, interval)

    return () => window.clearInterval(timer)
  }, [interval, shouldReduceMotion, values.length])

  return (
    <span
      className={cn(
        'relative inline-flex min-h-5 items-center overflow-hidden align-top text-sm sm:text-base',
        className,
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      {prefix ? <span className="mr-1.5 shrink-0">{prefix}</span> : null}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={itemIndex + ':' + currentItem}
          initial={shouldReduceMotion ? false : initialState}
          animate={animateState}
          exit={shouldReduceMotion ? { opacity: 0 } : exitState}
          transition={{
            duration: shouldReduceMotion ? 0 : speed,
            ease: 'easeOut',
            ...(shimmerEnabled
              ? {
                  backgroundPosition: {
                    duration: shimmerDuration,
                    ease: 'easeInOut',
                    repeat: Infinity,
                  },
                }
              : {}),
          }}
          className={cn(
            'font-medium whitespace-nowrap',
            activeEffects.has('shimmer') &&
              (shimmerEnabled
                ? 'bg-[linear-gradient(100deg,var(--shimmer-color)_var(--shimmer-start),var(--shimmer-highlight)_50%,var(--shimmer-color)_var(--shimmer-end))] bg-[length:220%_100%] bg-clip-text text-transparent'
                : 'text-foreground'),
            textClassName,
          )}
          style={
            {
              '--shimmer-start': 50 - shimmerWidth / 2 + '%',
              '--shimmer-end': 50 + shimmerWidth / 2 + '%',
              '--shimmer-color': shimmerColor,
              '--shimmer-highlight': shimmerHighlight,
            } as CSSProperties
          }
        >
          {waveEnabled ? (
            <>
              <span className="sr-only">{currentItem}</span>
              <span aria-hidden="true" className="inline-flex">
                {Array.from(currentItem).map((character, index) => (
                  <motion.span
                    key={index + '-' + character}
                    initial={shouldReduceMotion ? false : { y: waveAmplitude }}
                    animate={
                      shouldReduceMotion
                        ? { y: 0 }
                        : { y: [waveAmplitude, -waveAmplitude * 0.75, 0] }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : speed * 0.7,
                      delay: shouldReduceMotion ? 0 : index * waveStagger,
                      ease: 'easeOut',
                    }}
                    className="inline-block"
                  >
                    {character === ' ' ? '\u00a0' : character}
                  </motion.span>
                ))}
              </span>
            </>
          ) : (
            currentItem
          )}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export default AnimatedText`,
    usage: `import { AnimatedText } from "@/components/ui/animated-text"

<AnimatedText
  prefix="I’m"
  items={["an AI Engineer", "a Builder"]}
  effects={["blur", "fade", "shimmer", "wave"]}
  effectOptions={{
    blur: { amount: 6 },
    fade: { from: 0 },
    slide: { distance: 8 },
    shimmer: {
      duration: 2.2,
      width: 36,
      color: "#71717a",
      highlight: "#f4f4f5",
    },
    wave: { amplitude: 5, stagger: 0.02 },
  }}
  scale={0.96}
  direction="up"
/>`,
    example:
      'Use for a portfolio role, status, or short list of rotating labels.',
  },
  {
    slug: 'text-reveal',
    name: 'Text Reveal',
    description:
      'Reveal text line by line with blur, opacity, and a character wave. Scroll through the pinned preview to control its progress.',
    seoTitle: 'Text Reveal — Scroll-Driven React Text Animation | ISTMX',
    seoDescription:
      'Reveal text line by line with configurable character timing, blur, vertical wave, and reversible scroll-linked progress.',
    keywords: [
      'react text reveal component',
      'scroll text animation react',
      'character reveal animation',
      'react blur text animation',
    ],
    accessibility:
      'The complete text is available as one screen-reader string while the animated glyphs are hidden from assistive technology. Reduced-motion preferences show the text without the entrance animation or scroll pinning.',
    interaction:
      'Text reveals one line and character at a time with opacity, blur, and a small vertical wave. By default the sequence begins when it enters the viewport. Pass a Motion scroll progress value to pin a preview, scrub the reveal forward and backward, and release the page when it completes.',
    limitations:
      'Pass plain text and use newline characters to define line breaks. Scroll-linked mode requires a MotionValue from useScroll and a parent with enough scroll distance to complete the reveal.',
    category: 'Text / Scroll',
    commandName: 'text-reveal',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Reveals plain text line by line and character by character.',
      'Keeps words together when lines wrap naturally.',
      'Configure character stagger, line spacing, duration, blur, opacity, scale, vertical wave, and horizontal drift.',
      'Use viewport-triggered animation by default, or supply Motion scroll progress for reversible scroll-linked control.',
      'Tune the viewport trigger threshold and whether it runs once or again on re-entry.',
      'Provides a single accessible text string and respects reduced-motion preferences.',
    ],
    composition: [
      'TextReveal',
      '├── Screen-reader text',
      '└── Line wrappers',
      '    └── Word-safe animated characters',
    ],
    props: [
      {
        name: 'text',
        type: 'string',
        description:
          'Plain text to reveal. Use newline characters to set explicit line breaks.',
      },
      {
        name: 'characterStagger?',
        type: 'number',
        description:
          'In viewport mode, seconds between character starts. In scroll mode, relative scroll weight per character. Defaults to 0.024.',
      },
      {
        name: 'lineStagger?',
        type: 'number',
        description:
          'In viewport mode, seconds between lines. In scroll mode, relative scroll weight between lines. Defaults to 0.24.',
      },
      {
        name: 'duration?',
        type: 'number',
        description:
          'Character transition duration in seconds for viewport mode. Defaults to 0.7.',
      },
      {
        name: 'waveDistance?',
        type: 'number',
        description:
          'Vertical travel distance in pixels for the character wave. Defaults to 5.',
      },
      {
        name: 'waveOvershoot?',
        type: 'number',
        description:
          'Distance in pixels each character rises above its resting baseline before settling. Defaults to 75% of waveDistance.',
      },
      {
        name: 'sidewaysDistance?',
        type: 'number',
        description:
          'Horizontal drift in pixels during the character wave. Defaults to 12% of waveDistance.',
      },
      {
        name: 'blurAmount?',
        type: 'number',
        description:
          'Starting blur in pixels, which resolves as each character settles. Defaults to 7.',
      },
      {
        name: 'opacityFrom?',
        type: 'number',
        description:
          'Starting character opacity from 0 to 1. Defaults to 0.08.',
      },
      {
        name: 'opacityPeak?',
        type: 'number',
        description:
          'Intermediate character opacity from 0 to 1 during the wave. Defaults to 0.72.',
      },
      {
        name: 'scaleFrom?',
        type: 'number',
        description: 'Starting character scale. Defaults to 0.96.',
      },
      {
        name: 'scalePeak?',
        type: 'number',
        description:
          'Intermediate character scale during the wave. Defaults to 1.025.',
      },
      {
        name: 'scrollProgress?',
        type: 'MotionValue<number>',
        description:
          'Optional 0–1 Motion value, usually from useScroll. When provided, scroll controls the reveal and scrolling backward reverses it.',
      },
      {
        name: 'once?',
        type: 'boolean',
        description:
          'In viewport mode, reveal once or replay after leaving and re-entering. Defaults to true.',
      },
      {
        name: 'viewportAmount?',
        type: 'number',
        description:
          'Fraction of the component that must enter the viewport before revealing, from 0 to 1. Defaults to 0.4.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional classes for the paragraph wrapper.',
      },
    ],
    sourceCode: textRevealSourceCode,
    usage: `import TextReveal from '@/components/ui/text-reveal'

<TextReveal
  text={'Every word arrives softly,\\none character at a time.'}
  characterStagger={0.028}
  lineStagger={0.2}
  duration={0.65}
  waveDistance={8}
  waveOvershoot={6}
  sidewaysDistance={1.5}
  blurAmount={6}
  opacityFrom={0.08}
  opacityPeak={0.72}
  scaleFrom={0.96}
  scalePeak={1.025}
  once
/>`,
    example:
      'Use scrollProgress from Motion useScroll to make a pinned story reveal scrub forward and backward with the page. Without it, the component starts when it enters the viewport.',
    migrationExample: `+ import TextReveal from '@/components/ui/text-reveal'

- <p className="opacity-0">A sentence revealed with custom scroll handlers.</p>
+ <TextReveal text="A sentence revealed one character at a time." />`,
  },
  {
    slug: 'image-accordion',
    name: 'Image Accordion',
    description:
      'A selectable image stack that animates the chosen image into a preview canvas while keeping the full collection in rotation.',
    seoTitle: 'Image Accordion — React Image Stack Component | ISTMX',
    seoDescription:
      'A React image stack component that moves a selected card into a preview canvas and rotates the remaining images forward.',
    keywords: [
      'react image accordion',
      'image accordion react component',
      'react image stack',
      'interactive image stack',
      'react image gallery animation',
    ],
    accessibility:
      'Image cards are keyboard operable and use the supplied alt text. Captions can describe each image, and reduced-motion preferences disable the spring transitions.',
    interaction:
      'The selected card animates into the preview canvas and moves to the back of the stack. When there are more items than the visible count, the next image rotates into view.',
    limitations:
      'The component renders the image URLs supplied by the consuming app; image hosting, loading behavior, and accurate alt text remain the app author’s responsibility. The initial images collection is used to initialize its interactive stack.',
    category: 'Media',
    commandName: 'image-accordion',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Accepts any number of images; five cards are shown in the stack by default.',
      'Selecting a card animates that same image into the preview canvas and moves it to the end of the collection.',
      'When the collection has more images than visibleCount, the next image rotates into view as cards are selected.',
      'Customize wrapper, stack, card, preview, and image classes globally or per image item.',
      'Tune the radial glow color, position, size, opacity, and blur, or disable it with glow={false}.',
      'Configure the shared spring with stiffness, damping, and mass.',
      'Supports keyboard activation, image alt text, captions, and reduced-motion preferences.',
    ],
    composition: [
      'ImageAccordion',
      '├── Image stack (up to visibleCount cards)',
      '│   └── Selectable image cards',
      '└── Preview canvas',
      '    └── Selected image and optional caption',
    ],
    props: [
      {
        name: 'images',
        type: 'ImageAccordionItem[]',
        description:
          'The full image collection. Each item accepts id?, src, alt, title, description?, className?, and imageClassName?. Add unique id values if the same src can appear more than once.',
      },
      {
        name: 'visibleCount?',
        type: 'number',
        description:
          'Maximum cards shown in the stack. Defaults to 5; values are rounded down and clamped to at least 1. The full collection remains available and rotates through the visible stack.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Tailwind classes applied to the outer component layout.',
      },
      {
        name: 'stackClassName?',
        type: 'string',
        description: 'Classes applied to the image-stack column wrapper.',
      },
      {
        name: 'cardClassName?',
        type: 'string',
        description:
          'Classes applied to every selectable card. An item className adds per-card styling through cn().',
      },
      {
        name: 'imageClassName?',
        type: 'string',
        description:
          'Classes applied to thumbnail and preview images. An item imageClassName adds per-image styling.',
      },
      {
        name: 'previewClassName?',
        type: 'string',
        description: 'Classes applied to the preview canvas.',
      },
      {
        name: 'glow?',
        type: 'false | ImageAccordionGlow',
        description:
          'Set false to disable the glow; otherwise configure color?, position?, size?, opacity?, and blur?. Defaults to a restrained foreground radial glow.',
      },
      {
        name: 'transition?',
        type: '{ stiffness?: number; damping?: number; mass?: number }',
        description:
          'Spring values for the shared image transition. Defaults to stiffness 190, damping 24, and mass 0.8.',
      },
    ],
    sourceCode: imageAccordionSourceCode,
    usage: `import ImageAccordion from '@/components/ui/image-accordion'

const images = [
  { src: '/images/one.jpg', alt: 'Coastal cliffs', title: 'The coast' },
  { src: '/images/two.jpg', alt: 'A quiet forest', title: 'The forest' },
  { src: '/images/three.jpg', alt: 'A city at dusk', title: 'The city' },
  { src: '/images/four.jpg', alt: 'A mountain lake', title: 'The lake' },
  { src: '/images/five.jpg', alt: 'A desert path', title: 'The desert' },
  { src: '/images/six.jpg', alt: 'Snowy peaks', title: 'The peaks' },
]

<ImageAccordion
  images={images}
  visibleCount={5}
  className="mx-auto max-w-5xl"
  stackClassName="md:pr-4"
  cardClassName="rounded-lg"
  imageClassName="object-cover"
  previewClassName="min-h-80"
  glow={{ color: '#d4d4d8', opacity: 0.2, blur: 16 }}
  transition={{ stiffness: 190, damping: 24, mass: 0.8 }}
/>`,
    example:
      'Pass a collection of any length. Five items are visible by default; selecting a visible image moves it to the end and brings the next item into the stack. Set visibleCount to change the visible window, and use className fields to style the layout or individual images.',
    migrationExample: `+ import ImageAccordion from '@/components/ui/image-accordion'
+
+- <div>{images.map((image) => <img key={image.src} {...image} />)}</div>
++ <ImageAccordion images={images} visibleCount={5} className="my-gallery" />`,
  },
  {
    slug: 'infinite-image-canvas',
    name: 'Infinite Image Canvas',
    description:
      'An endless, pannable image grid with spring-smooth movement, animated tiles, and pastel image labels.',
    seoTitle: 'Infinite Image Canvas — React Image Grid | ISTMX',
    seoDescription:
      'Explore a repeating image canvas with wheel, drag, and keyboard navigation, animated tile transitions, and editable React source.',
    keywords: [
      'infinite image canvas react',
      'pannable image grid',
      'react infinite gallery',
      'motion image canvas',
    ],
    accessibility:
      'The canvas is a labeled keyboard-focusable region. Arrow keys pan the grid, each image is treated as decorative, and reduced-motion preferences disable tile transitions.',
    interaction:
      'Scroll over the canvas, drag it, or focus it and use the arrow keys to explore. Tiles are generated around the current view, with enter and exit transitions as they move into and out of view. Scroll outside the canvas to move the page.',
    limitations:
      'Image positions repeat from the supplied collection as the canvas expands. The app is responsible for hosting the image URLs and providing image names and pastel colors.',
    category: 'Media',
    commandName: 'infinite-image-canvas',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Creates an endless image grid with at least eight rows and columns around the current view.',
      'Pan with the mouse wheel, drag, or keyboard arrow keys.',
      'Scroll outside the canvas to continue scrolling the page.',
      'Uses spring motion for smooth tile movement and fades, scales, and blurs tiles as they enter or leave view.',
      'Displays each image name in a solid pastel label beneath the image.',
      'Respects reduced-motion preferences.',
    ],
    composition: [
      'InfiniteImageCanvas',
      '├── Pannable image grid',
      '├── Animated image tiles',
      '└── Pastel name labels',
    ],
    props: [
      {
        name: 'images',
        type: 'InfiniteImageCanvasItem[]',
        description:
          'Required image collection. Each item has src, alt, name, and color fields.',
      },
      {
        name: 'heading?',
        type: 'string',
        description:
          'Centered heading layered over the images. Defaults to “Somewhere, Everywhere”.',
      },
      {
        name: 'description?',
        type: 'string',
        description: 'Supporting text below the centered heading.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Classes applied to the outer canvas section.',
      },
      {
        name: 'tileWidth?',
        type: 'number',
        description: 'Grid cell width in pixels. Defaults to 210.',
      },
      {
        name: 'tileHeight?',
        type: 'number',
        description: 'Grid cell height in pixels. Defaults to 270.',
      },
    ],
    sourceCode: infiniteImageCanvasSourceCode,
    usage: `import InfiniteImageCanvas from '@/components/ui/infinite-image-canvas'

const images = [
  {
    src: '/images/one.jpg',
    alt: 'A quiet mountain lake',
    name: 'Stillwater',
    color: '#d9c9ff',
  },
  {
    src: '/images/two.jpg',
    alt: 'Sunlight over the coast',
    name: 'Sunday Light',
    color: '#ffd8c4',
  },
]

<InfiniteImageCanvas
  images={images}
  heading="Somewhere, Everywhere"
  description="An endless field of images, waiting to be explored."
  className="h-[42rem]"
/>`,
    example:
      'Provide image URLs, descriptive alt text, a short image name, and a solid pastel color for each item. Pan the canvas with the wheel, drag, or arrow keys; scrolling outside the canvas continues to move the page.',
    migrationExample: `+ import InfiniteImageCanvas from '@/components/ui/infinite-image-canvas'

- <div className="grid">{images.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}</div>
+ <InfiniteImageCanvas images={images} heading="Somewhere, Everywhere" />`,
  },
  {
    slug: 'image-trail',
    name: 'Image Trail',
    description:
      'A pointer-driven trail of floating image cards, staggered and faded with Motion.',
    seoTitle: 'Image Trail — Animated React Image Effect | ISTMX',
    seoDescription:
      'Create a throttled image trail that follows pointer movement with editable React, Motion, and Tailwind CSS source.',
    keywords: [
      'react image trail',
      'image trail effect',
      'animated image cards',
      'motion image trail',
    ],
    accessibility:
      'The canvas has an accessible label and supports pointer and touch input. Decorative trail images are hidden from assistive technology, and the effect is disabled for users who prefer reduced motion.',
    interaction:
      'Move or tap over the canvas to place image cards. New cards are throttled, drift slightly as they fade, and are removed after their animation completes.',
    limitations:
      'The component renders the supplied image URLs directly. Keep the images array stable, provide useful alt text for the source data, and ensure the image host permits embedding.',
    category: 'Media',
    commandName: 'image-trail',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Cycles through the supplied images as the pointer moves or the canvas is tapped.',
      'Throttles image creation to keep the interaction smooth.',
      'Adds a small rotation and drift as each image fades away.',
      'Limits the number of active trail cards.',
      'Supports custom container and image classes.',
      'Respects reduced-motion preferences.',
    ],
    composition: [
      'ImageTrail',
      '├── Interactive canvas',
      '├── Pointer and touch input',
      '└── Animated image trail',
    ],
    props: [
      {
        name: 'images',
        type: 'ImageTrailItem[]',
        description: 'Required image list. Each item contains src and alt.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Classes for the canvas container.',
      },
      {
        name: 'imageClassName?',
        type: 'string',
        description: 'Classes applied to each trail image.',
      },
      {
        name: 'throttle?',
        type: 'number',
        description:
          'Minimum interval between image spawns in milliseconds. Defaults to 160.',
      },
      {
        name: 'maxTrailItems?',
        type: 'number',
        description:
          'Maximum number of trail images active at once. Defaults to 5.',
      },
    ],
    sourceCode: imageTrailSourceCode,
    usage: `import ImageTrail from '@/components/ui/image-trail'

const images = [
  { src: '/images/one.jpg', alt: 'Mountain lake' },
  { src: '/images/two.jpg', alt: 'Coastal cliffs' },
]

<ImageTrail
  images={images}
  throttle={160}
  maxTrailItems={5}
  className="h-[30rem]"
  imageClassName="rounded-2xl"
/>`,
    example:
      'Move the pointer across the canvas or tap to place image cards. Lower throttle values create a denser trail; maxTrailItems controls how many cards remain active together.',
    migrationExample: `+ import ImageTrail from '@/components/ui/image-trail'

- <img src={activeImage} alt="" />
+ <ImageTrail images={images} throttle={160} maxTrailItems={5} />`,
  },
  {
    slug: 'dock-navigation',
    name: 'Dock Navigation',
    description:
      'A magnifying icon dock with an elastic upward lift, moving labels, and a configurable radial highlight.',
    seoTitle: 'Dock Navigation — Animated React Navigation Dock | ISTMX',
    seoDescription:
      'A customizable React navigation dock with pointer-based icon magnification, an elastic lift, tooltips, and reduced-motion support.',
    keywords: [
      'react dock navigation',
      'animated navigation dock',
      'mac style dock react',
      'react icon navigation',
    ],
    accessibility:
      'Navigation uses links with accessible labels, keyboard focus styles, and active-page indication. Pointer magnification and lift are reduced when the user prefers reduced motion.',
    interaction:
      'Pointer distance continuously drives each icon’s scale and upward lift. Tooltips follow the same motion, while touch users can activate the links without dragging.',
    limitations:
      'Proximity magnification is pointer-driven and does not run on touch. Supply an icon and destination for each link; the component does not generate navigation items.',
    category: 'Navigation',
    commandName: 'dock-navigation',
    dependencies: [
      'React',
      'Motion',
      'Tailwind CSS',
      'clsx',
      'tailwind-merge',
      '@tabler/icons-react',
      '@tabler/icons-react',
    ],
    features: [
      'Magnifies nearby icons based on pointer distance, with a springy lift inspired by desktop docks.',
      'Moves each tooltip with its icon and keeps a comfortable gap while the icon grows.',
      'Accepts custom labels, hrefs, React icons, and an optional active state for every item.',
      'Tune the radial glow color, opacity, and blur, or disable it with glow={false}.',
      'Apply custom classes to the dock, each link, and each icon surface.',
      'Supports keyboard focus, tap feedback, external links, and reduced-motion preferences.',
    ],
    composition: [
      'DockNavigation',
      '└── Navigation list',
      '    └── Dock item',
      '        ├── Icon surface',
      '        └── Moving tooltip',
    ],
    props: [
      {
        name: 'items',
        type: 'DockNavigationItem[]',
        description:
          'Required links with label, href, icon (ReactNode), and optional active and external fields.',
      },
      {
        name: 'label?',
        type: 'string',
        description:
          'Accessible name for the navigation landmark. Defaults to Primary navigation.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Classes applied to the dock frame.',
      },
      {
        name: 'itemClassName?',
        type: 'string',
        description: 'Classes applied to each link hit area.',
      },
      {
        name: 'iconClassName?',
        type: 'string',
        description: 'Classes applied to each animated icon surface.',
      },
      {
        name: 'glow?',
        type: 'false | DockNavigationGlow',
        description:
          'Set false to disable the radial glow; otherwise configure color?, opacity?, and blur?. Defaults to a subtle foreground glow.',
      },
    ],
    sourceCode: dockNavigationSourceCode,
    usage: `import DockNavigation from '@/components/ui/dock-navigation'
import { IconHome, IconUser, IconCode, IconComponents, IconMail } from '@tabler/icons-react'

const items = [
  { label: 'Home', href: '/', icon: <IconHome size={19} /> },
  { label: 'About', href: '/about', icon: <IconUser size={19} /> },
  { label: 'Projects', href: '/projects', icon: <IconCode size={19} /> },
  { label: 'Components', href: '/components', icon: <IconComponents size={19} />, active: true },
  { label: 'Contact', href: '/contact', icon: <IconMail size={19} /> },
]

<DockNavigation
  items={items}
  label="Main navigation"
  glow={{ color: 'var(--foreground)', opacity: 0.2, blur: 12 }}
  className="mx-auto"
/>`,
    example:
      'Set active on the current item to show its persistent dot and radial highlight. The pointer-proximity spring, upward lift, tooltip spacing, and metallic icon sheen work together to give the dock a responsive desktop-style feel.',
    migrationExample: `+ import DockNavigation from '@/components/ui/dock-navigation'
+ import { IconHome, IconCode } from '@tabler/icons-react'
+
+- <nav><a href="/">Home</a><a href="/projects">Projects</a></nav>
++ <DockNavigation
++   items={[
++     { label: 'Home', href: '/', icon: <IconHome /> },
++     { label: 'Projects', href: '/projects', icon: <IconCode /> },
++   ]}
++ />`,
  },
  {
    slug: 'mobile-menu-dock',
    name: 'Mobile Menu Dock',
    description:
      'A compact mobile navigation dock with live component search, a filtered section menu, and a small credit to its design inspiration.',
    seoTitle: 'Mobile Menu Dock — Searchable React Mobile Navigation | ISTMX',
    seoDescription:
      'A source-first React mobile navigation dock with searchable component results, section links, safe-area spacing, and a compact menu.',
    keywords: [
      'react mobile navigation menu',
      'searchable mobile navigation',
      'react mobile menu dock',
      'component library search navigation',
    ],
    accessibility:
      'The search field and menu toggle have accessible labels. Results are links, Escape closes the menu, and panel transitions respect reduced-motion preferences.',
    interaction:
      'Typing filters component names, categories, and descriptions and links to matching component pages. With an empty query, the menu shows the supplied site navigation links.',
    limitations:
      'Search only filters the supplied component records and follows each record’s href. It does not discover routes or fetch a remote catalog.',
    category: 'Navigation',
    commandName: 'mobile-menu-dock',
    dependencies: [
      'React',
      'Motion',
      'Tailwind CSS',
      'clsx',
      'tailwind-merge',
      '@tabler/icons-react',
    ],
    features: [
      'Combines a component search field and a compact menu toggle in a fixed mobile dock.',
      'Searches component names, categories, and descriptions, then links directly to each component page.',
      'Lists the supplied site navigation items when the menu is opened without a search query.',
      'Supports an active navigation item, safe-area spacing, reduced motion, and Escape to close.',
      'Includes an optional className for positioning and responsive display.',
      'Credits Chánh Đại as the visual inspiration in the Components section, outside the reusable component.',
    ],
    composition: [
      'MobileMenuDock',
      '├── Filterable menu panel',
      '│   └── Navigation or component results',
      '└── Search field + menu toggle',
    ],
    props: [
      {
        name: 'items',
        type: 'MobileMenuDockItem[]',
        description:
          'Navigation entries with a label, href, and optional active state.',
      },
      {
        name: 'searchItems',
        type: 'MobileMenuDockSearchItem[]',
        description:
          'Component entries with name, slug, href, category, and description fields used by the live search.',
      },
      {
        name: 'label?',
        type: 'string',
        description:
          'Accessible label for the expanded navigation landmark. Defaults to Mobile navigation.',
      },
      {
        name: 'placement?',
        type: '"fixed" | "inline"',
        description:
          'Choose a safe-area-aware fixed mobile dock or inline placement for previews and embedded layouts. Defaults to fixed.',
      },
      {
        name: 'className?',
        type: 'string',
        description:
          'Classes applied to the fixed dock wrapper, useful for positioning and visibility breakpoints.',
      },
    ],
    sourceCode: mobileMenuDockSourceCode,
    usage: `import MobileMenuDock from '@/components/ui/mobile-menu-dock'

const navigationItems = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/#projects' },
  { label: 'Components', href: '/library', active: true },
  { label: 'Blog', href: '/blogs' },
]

const components = [
  {
    name: 'Animated Text',
    slug: 'animated-text',
    href: '/library/animated-text',
    category: 'Text',
    description: 'Composable text effects.',
  },
]

<MobileMenuDock items={navigationItems} searchItems={components} />`,
    example:
      'On phones, type a component name or category to open matching Library results. Clear the query to show the site links, or use the grid button to toggle the menu. Escape closes the menu.',
    migrationExample: `+ import MobileMenuDock from '@/components/ui/mobile-menu-dock'

- <button aria-label="Open menu">...</button>
- <nav>{links}</nav>
+ <MobileMenuDock items={navigationItems} searchItems={components} />`,
  },
  {
    slug: 'scroll-story-cards',
    name: 'Scroll Story Cards',
    description:
      'A scroll-scrubbed image story where cards travel along a shallow arc and continuously shape the scene around the centered frame.',
    seoTitle:
      'Scroll Story Cards — Scroll-Driven React Story Component | ISTMX',
    seoDescription:
      'A scroll-driven React story component where portrait cards rise along a curved path and continuously update the centered image and color.',
    keywords: [
      'react scroll story component',
      'scroll driven cards react',
      'scroll animation cards',
      'react image storytelling animation',
    ],
    accessibility:
      'Cards include configurable image alt text and semantic CTA links. Reduced-motion preferences soften the curved movement and depth transforms while preserving the scroll sequence.',
    interaction:
      'Document scroll progress continuously moves cards upward along a shallow arc. The card nearest the center influences the displayed story and interpolated scene color; scrolling backward reverses the same timeline.',
    limitations:
      'The pinned scene occupies the configured scroll distance. Use a shorter distance for compact pages, and provide image alt text and at least two cards for a meaningful transition.',
    category: 'Scroll / Image',
    commandName: 'scroll-story-cards',
    dependencies: [
      'React',
      'Motion',
      'Tailwind CSS',
      'clsx',
      'tailwind-merge',
      '@tabler/icons-react',
    ],
    features: [
      'Keeps five separated image previews partially visible at the bottom of the pinned scene.',
      'Moves the full card sequence upward continuously as the user scrolls; the incoming card follows a shallow arc into the center and then continues upward.',
      'The card nearest the center supplies the active story without a click, horizontal exit, or snap.',
      'Interpolates the hero background color from the card nearest the center.',
      'Pairs a nearly square, gently tinted portrait with a location label, larger story copy, and a premium icon CTA anchored at the lower-right.',
      'Pins the 400vh story sequence, then releases naturally into the following page content.',
      'Supports custom card data, image alt text, CTA links, sizing, curve depth, overlay strength, and scroll distance.',
      'Reduces the arc, rotation, and scale changes when reduced motion is requested while retaining vertical scroll progression.',
    ],
    composition: [
      'ScrollStoryCards',
      '├── Sticky story scene',
      '│   ├── Fixed heading and eyebrow',
      '│   ├── Rising image cards with copy and CTA',
      '│   └── Five-card waiting stack',
      '└── Natural scroll release',
    ],
    props: [
      {
        name: 'cards',
        type: 'ScrollStoryCard[]',
        description:
          'Cards with id, optional eyebrow, title, description, image, imageAlt, and a hex color for the scene background. overlayColor optionally tints the image and defaults to color; buttonColor defaults to overlayColor or color.',
      },
      {
        name: 'eyebrow? / heading? / description?',
        type: 'string',
        description:
          'Fixed scene label, heading, and optional supporting copy shown above the changing card content.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Classes applied to the outer scroll section.',
      },
      {
        name: 'curveAmount?',
        type: 'number',
        description:
          'Horizontal curve width in pixels as a card moves toward and away from the center. Defaults to 64.',
      },
      {
        name: 'cardWidth? / cardHeight?',
        type: 'number',
        description:
          'Maximum square size in pixels for the separated waiting previews. Defaults to 156px; featured cards cap at 620px wide and 17rem high on desktop.',
      },
      {
        name: 'overlayOpacity?',
        type: 'number',
        description:
          'Default color-overlay opacity from 0 to 1. Defaults to 0.38.',
      },
      {
        name: 'scrollDistance?',
        type: 'number',
        description:
          'Pinned story timeline in viewport units. Defaults to 400vh, then releases directly into following page content.',
      },
      {
        name: 'scrollContainerRef?',
        type: 'RefObject<HTMLElement | null>',
        description:
          'Optional scrollable ancestor for embedded previews. Omit it to track the document scroll position.',
      },
      {
        name: 'showCardLabels?',
        type: 'boolean',
        description: 'Show each moving card title. Defaults to true.',
      },
      {
        name: 'onActiveChange?',
        type: '(card: ScrollStoryCard) => void',
        description:
          'Called when a different card is nearest the center. Continuous visual motion remains scroll-linked.',
      },
    ],
    sourceCode: scrollStoryCardsSourceCode,
    usage: `import ScrollStoryCards, { type ScrollStoryCard } from '@/components/ui/scroll-story-cards'

const cards: ScrollStoryCard[] = [
  {
    id: 'coast',
    eyebrow: 'South coast',
    title: 'The coast',
    description: 'A slower frame at the edge of the water.',
    image: '/images/coast.jpg',
    imageAlt: 'A quiet coastline in late afternoon light',
    color: '#e8e0f4',
    overlayColor: '#cbbce5',
    overlayOpacity: 0.34,
    buttonLabel: 'Explore',
    buttonHref: '/coast',
  },
  // Add more cards with their own images and colors.
]

<ScrollStoryCards
  cards={cards}
  eyebrow="Selected stories"
  heading="A collection worth exploring."
  description="Move through the frames by scrolling."
  curveAmount={64}
  cardWidth={156}
  cardHeight={156}
  overlayOpacity={0.38}
  scrollDistance={400}
/>`,
    example:
      'Use at least two cards to see color and image blending. Scroll position continuously moves the nearest card through the center; stopping or reversing preserves the exact intermediate state. Cards require imageAlt text and may include CTA links.',
    migrationExample: `+ import ScrollStoryCards from '@/components/ui/scroll-story-cards'

- <ImageCarousel images={images} onSelect={setActiveImage} />
+ <ScrollStoryCards cards={cards} heading="A story in motion." />`,
  },
  {
    slug: 'pixel-cat',
    name: 'Pixel Cat',
    description:
      'A tiny, source-first pixel-art cat companion that wanders within its parent by default, with configurable coat patterns, poses, cursor curiosity, and petting reactions.',
    seoTitle: 'Pixel Cat — Animated Pixel Art React Component | ISTMX',
    seoDescription:
      'A configurable pixel-art cat React component that wanders within its parent, reacts to pointer movement, and supports petting interactions.',
    keywords: [
      'pixel cat react component',
      'pixel art react component',
      'animated pixel pet react',
      'interactive pixel cat',
    ],
    accessibility:
      'The cat supports reduced-motion preferences. Interactive petting can be disabled, and the component remains within its measured parent container by default.',
    interaction:
      'A ResizeObserver measures the parent boundary and constrains autonomous movement to it. Optional pointer curiosity and petting interactions trigger pose and particle responses.',
    limitations:
      'Parent-bounded movement needs a parent with measurable dimensions. In a zero-size parent, the component uses fallback bounds until it can measure the container.',
    category: 'Interactive',
    commandName: 'pixel-cat',
    dependencies: ['React', 'Motion', 'Tailwind CSS', 'clsx', 'tailwind-merge'],
    features: [
      'Wanders inside its parent container by default, with an optional viewport boundary.',
      'Calculates movement boundaries dynamically and responds to parent resizing.',
      'Uses ResizeObserver to clamp the cat inside resized parent boundaries.',
      'Six coat palettes: White, Orange Tabby, Midnight with golden eyes, Calico, Silver Gray, and Theme.',
      'Multiple authentic pixel-art poses: idle, walk, sit, sleep (loaf), alert, happy, stretch, groom.',
      'Autonomous wandering engine with natural pacing and idle variation.',
      'Cursor awareness: perks ears, tracks movement, steps curiously closer, or playfully scampers away.',
      'Interactive petting reaction: joyful bounce, speech bubbles, and floating heart particles.',
      'Configurable speed, size, padding, position, and fixed pose locks.',
      'Full reduced-motion accessibility support.',
    ],
    composition: [
      'PixelCat',
      '├── Container boundary tracker (ResizeObserver)',
      '├── Parametric 32×32 pixel canvas sprite engine',
      '├── Wandering & cursor curiosity controller',
      '├── Speech bubble notification',
      '└── Heart emote particles',
    ],
    props: [
      {
        name: 'size?',
        type: 'number',
        description: 'Size in pixels (width and height). Defaults to 36.',
      },
      {
        name: 'breed?',
        type: "'white' | 'orange' | 'black' | 'calico' | 'gray' | 'theme'",
        description: "Coat pattern / fur palette. Defaults to 'white'.",
      },
      {
        name: 'palette?',
        type: 'Record<1 | 2 | 3 | 4, string>',
        description: 'Custom 4-color palette overriding the breed colors.',
      },
      {
        name: 'wandering?',
        type: 'boolean',
        description:
          'Whether the cat autonomously wanders within its parent container. Defaults to true.',
      },
      {
        name: 'speed?',
        type: 'number',
        description: 'Movement speed multiplier. Defaults to 1.',
      },
      {
        name: 'boundary?',
        type: "'parent' | 'viewport'",
        description:
          "Movement boundary: 'parent' container (default) or 'viewport'.",
      },
      {
        name: 'position?',
        type: 'PixelCatPosition',
        description:
          "Initial placement: 'random', 'center', a corner, or { x, y } percentages from 0 to 100.",
      },
      {
        name: 'initialPose?',
        type: 'PixelCatPose',
        description: "Initial pose when rendered. Defaults to 'sit'.",
      },
      {
        name: 'pose?',
        type: 'PixelCatPose',
        description:
          'Fixed pose to lock the cat into (e.g. sleep, groom, sit). Disables random pose changes.',
      },
      {
        name: 'interactive?',
        type: 'boolean',
        description:
          'Whether clicking or tapping pets the cat. Defaults to true.',
      },
      {
        name: 'cursorInteraction?',
        type: 'boolean',
        description:
          'Whether the cat turns toward and responds to cursor proximity inside the container. Defaults to true.',
      },
      {
        name: 'messages?',
        type: 'string[]',
        description:
          'Custom list of speech bubble texts when meowing or petted.',
      },
      {
        name: 'showBubble?',
        type: 'boolean',
        description: 'Whether speech bubbles are displayed. Defaults to true.',
      },
      {
        name: 'onPet?',
        type: '(state: { count: number; pose: PixelCatPose }) => void',
        description: 'Callback fired when user pets (clicks) the cat.',
      },
      {
        name: 'onPoseChange?',
        type: '(pose: PixelCatPose) => void',
        description: 'Callback fired when pose changes.',
      },
      {
        name: 'padding?',
        type: 'number',
        description:
          'Inner padding in pixels from container edges. Defaults to 8.',
      },
      {
        name: 'className?',
        type: 'string',
        description: 'Additional CSS classes for the container wrapper.',
      },
      {
        name: 'style?',
        type: 'CSSProperties',
        description:
          'Inline styles merged onto the animated wrapper after its computed size and position.',
      },
    ],
    sourceCode: pixelCatSourceCode,
    usage: `import { PixelCat } from '@/components/ui/pixel-cat'

export default function InteractiveCard() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold text-foreground">Interactive Card</h3>
      <p className="text-muted-foreground text-sm">
        The cat wanders exclusively inside this container.
      </p>

      {/* Wandering orange tabby cat */}
      <PixelCat breed="orange" size={36} wandering={true} />
    </div>
  )
}`,
    example:
      'Place PixelCat inside any parent container with relative positioning and overflow-hidden. The cat automatically measures the container width and height using ResizeObserver, clamping its movement area so it never leaves the frame.',
    migrationExample: `+ import { PixelCat } from '@/components/ui/pixel-cat'

- <div className="h-64 border rounded-xl">...</div>
+ <div className="relative h-64 border rounded-xl overflow-hidden">
+   ...
+   <PixelCat breed="orange" size={36} />
+ </div>`,
  },
]

export function getLibraryItem(slug: string) {
  return LIBRARY_ITEMS.find((item) => item.slug === slug)
}
