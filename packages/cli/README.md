# ISTMX UI

Editable UI components for your codebase. ISTMX adds the component source to
your project so you can read it, change it, and make it yours.

**Website:** [aryanonai.vercel.app](https://aryanonai.vercel.app/)

## Add a component

Run the command from your project root:

```sh
npx @istmx/ui add animated-text
```

Add the practical controls:

```sh
npx @istmx/ui add button
```

Or use your preferred package manager:

```sh
pnpm dlx @istmx/ui add animated-text
yarn dlx @istmx/ui add animated-text
bunx @istmx/ui add animated-text
```

Add the image stack component with:

```sh
npx @istmx/ui add image-accordion
```

Add the pointer-driven image trail with:

```sh
npx @istmx/ui add image-trail
```

Add the pannable infinite image canvas with:

```sh
npx @istmx/ui add infinite-image-canvas
```

Add the magnifying dock navigation with:

```sh
npx @istmx/ui add dock-navigation
```

Add the searchable mobile menu dock with:

```sh
npx @istmx/ui add mobile-menu-dock
```

Add the scroll-scrubbed image story with:

```sh
npx @istmx/ui add scroll-story-cards
```

Add the interactive pixel cat with:

```sh
npx @istmx/ui add pixel-cat
```

Add the streaming AI response text with:

```sh
npx @istmx/ui add streaming-text
```

Add the complete AI chat block with:

```sh
npx @istmx/ui add ai-chat-block
```

Add only the reusable chat input with:

```sh
npx @istmx/ui add ai-chat-input
```

This command copies the input and its attachment, voice, send, type, and class
helper files into `components/ai-chat/`. The composer and upload menu each
contain their own accent-border effect, so there is no extra effect file to
install. Import the input from
`@/components/ai-chat/ai-chat-input`. It installs Motion, Tabler Icons, clsx,
and tailwind-merge when they are missing. React and Tailwind CSS are expected
to be configured by your app. The input uses Tailwind utility classes and does
not need a stylesheet.

The CLI detects your package manager, copies the editable component to
`components/ui/animated-text.tsx`, adds the shared `cn` helper at
`lib/utils.ts` if it is missing, and installs any missing dependencies:

- [Motion](https://motion.dev/) for animation
- [clsx](https://www.npmjs.com/package/clsx) and [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) for class composition
- `@tabler/icons-react` for components that include Tabler icons

Your project should already use React and have Tailwind CSS configured. After
installation, the component is yours to edit; your app does not need to import
runtime code from `@istmx/ui`.

The `ai-chat-block` command is a multi-file install. It creates
`components/ai-chat-block/`, including the block, input, sidebar, message,
attachment, streaming, and local utility files. Its helper stays inside that
folder, and the CLI installs any missing Motion, Tabler Icons, clsx, and
tailwind-merge dependencies.

## Animated Text

Import the copied source into your app:

```tsx
import AnimatedText from '@/components/ui/animated-text'

export function Intro() {
  return (
    <p>
      I&apos;m{' '}
      <AnimatedText
        items={['an AI engineer', 'a full-stack developer', 'a builder']}
        effects={['blur', 'fade', 'shimmer']}
        interval={2400}
      />
    </p>
  )
}
```

Available effects are `blur`, `fade`, `shimmer`, `slide`, and `wave`. Use the
`effect` prop for one effect, or `effects` to combine several. The component
respects the user's reduced-motion setting.

### Customize the text and shimmer

Use `className` to style the wrapper and `textClassName` to style the changing
text. For shimmer, set custom CSS colors with `effectOptions`:

```tsx
<AnimatedText
  items={['an AI engineer', 'a builder']}
  effects={['blur', 'shimmer']}
  textClassName="font-semibold"
  effectOptions={{
    shimmer: {
      color: '#71717a',
      highlight: '#f4f4f5',
      duration: 2.2,
      width: 36,
    },
  }}
/>
```

Other options include `direction`, `interval`, `speed`, `scale`, and effect
settings for blur, fade, slide, and wave. The full component implementation is
in your `components/ui/animated-text.tsx` file.

## Text Reveal

Install the editable source with:

```sh
npx @istmx/ui add text-reveal
```

`TextReveal` reveals plain text line by line and character by character. It
supports a viewport-triggered entrance by default, or reversible scroll-linked
animation by passing a Motion value from `useScroll`.

```tsx
import TextReveal from '@/components/ui/text-reveal'

export function Quote() {
  return (
    <TextReveal
      text={'Every word arrives softly,\none character at a time.'}
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
    />
  )
}
```

Tune `characterStagger`, `lineStagger`, `duration`, `waveDistance`,
`waveOvershoot`, `sidewaysDistance`, `blurAmount`, opacity, and scale props to
shape the reveal. The component keeps words together across natural line wraps
and provides a single screen-reader text string.

## Streaming Text

Install the editable source with:

```sh
npx @istmx/ui add streaming-text
```

`StreamingText` reveals a string character by character, like a model still
writing its answer. Each new character settles in with a soft micro-interaction
and an optional blinking caret marks the live cursor.

```tsx
import StreamingText from '@/components/ui/streaming-text'

export function Answer({ answer }) {
  return (
    <StreamingText
      text={answer}
      speed={42}
      effect="blur"
      cursor
      onComplete={() => console.log('streamed')}
    />
  )
}
```

Choose how characters enter with `effect`: `blur`, `fade`, `slide`, or a
springy `wave`. Tune `speed` (characters per second), `startDelay`,
`glyphDuration`, `blurAmount`, and `slideDistance`. Set `cursorAfterComplete`
to keep the caret, or `loop` to re-stream with a `loopDelay` pause. The
component announces the finished message once through a polite live region and
renders the full string immediately under reduced motion.

## CLI options

```sh
npx @istmx/ui add animated-text --no-install
npx @istmx/ui add animated-text --overwrite
npx @istmx/ui add button
npx @istmx/ui add text-reveal
npx @istmx/ui add streaming-text
npx @istmx/ui add image-accordion
npx @istmx/ui add image-trail
npx @istmx/ui add infinite-image-canvas
npx @istmx/ui add dock-navigation
npx @istmx/ui add mobile-menu-dock
npx @istmx/ui add pixel-cat
npx @istmx/ui add ai-chat-input
npx @istmx/ui add ai-chat-block
npx @istmx/ui add scroll-story-cards
```

- `--no-install` copies the source and prints the dependency command instead
  of installing packages.
- `--overwrite` replaces component and helper files that already exist.

Component names accept either hyphens or spaces: `animated-text` or `animated
text`.

## Scroll Story Cards

The CLI copies an editable component to
`components/ui/scroll-story-cards.tsx`. All cards wait in a separated preview
dock at the bottom; it clears as soon as the story starts. Scrolling raises
each narrower, shorter story panel through a shallow curve toward the hero
center. Its portrait, larger copy, scene color, and Tabler CTA move together.
The sequence reverses when scrolling backward, then releases directly into
the following page content after the 400vh story timeline. The Library preview
can be opened fullscreen to give the scroll scene room on smaller screens.

```tsx
import ScrollStoryCards, {
  type ScrollStoryCard,
} from '@/components/ui/scroll-story-cards'

const cards: ScrollStoryCard[] = [
  {
    id: 'coast',
    eyebrow: 'South coast',
    title: 'The coast',
    description:
      'Soft light settles across the frame while an open horizon leaves room for the story to unfold. The colors shift gently as this portrait approaches the center.',
    image: '/images/coast.jpg',
    imageAlt: 'A quiet coastline in late afternoon light',
    color: '#e8e0f4',
    overlayColor: '#cbbce5',
    overlayOpacity: 0.34,
    buttonLabel: 'Explore',
    buttonHref: '/coast',
  },
  {
    id: 'forest',
    title: 'The forest',
    description: 'A new palette carries the story forward.',
    image: '/images/forest.jpg',
    imageAlt: 'Sunlight moving through a green forest',
    color: '#e2eedf',
    overlayColor: '#b9d5ad',
  },
]

export function Story() {
  return (
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
    />
  )
}
```

`ScrollStoryCard` supports `id`, `title`, `description`, `image`, required
`imageAlt`, and a hex `color` for the scene background. Optional fields are
`overlayColor` (defaults to `color`), `overlayOpacity`, `buttonLabel`,
`buttonHref`, and `buttonColor` (defaults to the overlay color). The component
also accepts `className`, `curveAmount`, `cardWidth`, `cardHeight`,
`overlayOpacity`, `scrollDistance`, `showCardLabels`, and an optional
`scrollContainerRef` when the story lives inside a separately scrolling panel.
Use at least two
cards to see the continuous color and image transitions. The pinned story
timeline defaults to 400vh and then releases naturally into the page. The
moving panels are image-led, narrower, and use light pastel purple,
green, yellow, blue, and pink scene colors. The CTA uses a Tabler arrow icon and
subtle hover/press feedback. Reduced-motion preferences remove the lateral arc
and extra scale and rotation while retaining the vertical scroll sequence.
`onActiveChange` optionally reports which card is nearest the center; it does
not control the scroll animation.

## Pixel Cat

The CLI copies the interactive cat to `components/ui/pixel-cat.tsx`:

```tsx
import { PixelCat } from '@/components/ui/pixel-cat'

export function CatCard() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border p-5">
      <PixelCat breed="orange" position="center" />
    </div>
  )
}
```

`PixelCat` supports `size`, `breed`, `palette`, `wandering`, `speed`,
`boundary`, `position`, `initialPose`, `pose`, `interactive`,
`cursorInteraction`, `messages`, `showBubble`, `onPet`, `onPoseChange`,
`padding`, `className`, and `style`. The exported types
The exports also include `PixelCatProps`, `PixelCatBreed`, `PixelCatPose`,
`PixelCatPosition`, `CAT_PALETTES`, `CAT_SIZE`, and `CAT_FEET_Y`. It wanders
within its parent by default; use a relatively positioned parent with a defined
size. Fixed poses disable automatic pose cycling, and reduced-motion
preferences pause movement.

## Image Accordion

The CLI copies an editable component to `components/ui/image-accordion.tsx`.
Pass any number of image objects; five are visible in the stack by default.
Selecting an image animates it into the preview canvas, moves it to the end of
the collection, and rotates the next image into the visible stack. Set
`visibleCount` to change how many cards are shown.

```tsx
import ImageAccordion from '@/components/ui/image-accordion'

export function Gallery() {
  return (
    <ImageAccordion
      images={[
        { src: '/images/coast.jpg', alt: 'Coastal cliffs', title: 'The coast' },
        { src: '/images/forest.jpg', alt: 'A forest', title: 'The forest' },
        { src: '/images/city.jpg', alt: 'A city at dusk', title: 'The city' },
        { src: '/images/lake.jpg', alt: 'A mountain lake', title: 'The lake' },
        {
          src: '/images/desert.jpg',
          alt: 'A desert path',
          title: 'The desert',
        },
        { src: '/images/peaks.jpg', alt: 'Snowy peaks', title: 'The peaks' },
      ]}
      visibleCount={5}
      className="mx-auto max-w-5xl"
      cardClassName="rounded-lg"
      imageClassName="object-cover"
      glow={{ color: '#d4d4d8', opacity: 0.2, blur: 16 }}
      transition={{ stiffness: 190, damping: 24, mass: 0.8 }}
    />
  )
}
```

`ImageAccordionItem` supports `id`, `src`, `alt`, `title`, optional
`description`, and per-card `className` and `imageClassName`. The component
also accepts `stackClassName` and `previewClassName`; `glow={false}` disables
the radial hover glow. Its spring, glow color/position/size/opacity/blur, and
visible stack count are configurable. React, Motion, Tailwind CSS, `clsx`, and
`tailwind-merge` are used; React and Tailwind CSS should already be configured
in the consuming project.

## Dock Navigation

Add the reusable, editable dock with:

```sh
npx @istmx/ui add dock-navigation
```

It writes `components/ui/dock-navigation.tsx` and installs any missing Motion,
`clsx`, `tailwind-merge`, and `@tabler/icons-react` packages. The component
accepts an array of labeled links and React icons. Nearby icons magnify and lift
with an elastic spring; labels follow the movement, and an optional radial glow
can be tuned or disabled.

```tsx
import DockNavigation from '@/components/ui/dock-navigation'
import {
  IconHome,
  IconUser,
  IconCode,
  IconComponents,
  IconMail,
} from '@tabler/icons-react'

const items = [
  { label: 'Home', href: '/', icon: <IconHome size={19} /> },
  { label: 'About', href: '/about', icon: <IconUser size={19} /> },
  {
    label: 'Projects',
    href: '/projects',
    icon: <IconCode size={19} />,
  },
  {
    label: 'Components',
    href: '/components',
    icon: <IconComponents size={19} />,
    active: true,
  },
  { label: 'Contact', href: '/contact', icon: <IconMail size={19} /> },
]

export function SiteDock() {
  return (
    <DockNavigation
      items={items}
      label="Main navigation"
      glow={{ color: 'var(--foreground)', opacity: 0.2, blur: 12 }}
    />
  )
}
```

Each item takes `label`, `href`, and `icon` (`ReactNode`), with optional
`active` and `external` flags. Pass custom classes through `className`,
`itemClassName`, and `iconClassName`; set `glow={false}` to disable the glow.
The component honors reduced-motion preferences.

The CLI requires Node.js 18 or later. The npm package is `@istmx/ui`; the
installed executable is named `istmx`.
