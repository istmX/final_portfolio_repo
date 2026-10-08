import Link from 'next/link'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AnimatedText } from '@/components/ui/animated-text'
import ImageAccordion from '@/components/ui/image-accordion'
import ImageTrail from '@/components/ui/image-trail'
import ScrollParallaxHero from '@/components/ui/scroll-parallax-hero'
import InfiniteImageCanvas from '@/components/ui/infinite-image-canvas'
import MobileMenuDock from '@/components/ui/mobile-menu-dock'
import ScrollStoryCards from '@/components/ui/scroll-story-cards'
import { IMAGE_ACCORDION_IMAGES } from '@/app/portfolio-components/library/image-accordion-data'
import { IMAGE_TRAIL_IMAGES } from '@/app/portfolio-components/library/image-trail-data'
import { INFINITE_IMAGE_CANVAS_IMAGES } from '@/app/portfolio-components/library/infinite-image-canvas-data'
import { SCROLL_STORY_CARDS } from '@/app/portfolio-components/library/scroll-story-cards-data'
import { COMPONENT_SEARCH_ITEMS } from '@/app/portfolio-components/library/component-search-data'
import StateButtonShowcase from '@/app/portfolio-components/StateButtonShowcase'
import DockNavigationDemo from './DockNavigationDemo'
import CatPlayground from './CatPlayground'
import TextRevealDemo from './TextRevealDemo'

export const metadata: Metadata = {
  title: 'Component playground | Aryan',
  description: 'A development playground for ISTMX component previews.',
  robots: { index: false, follow: false },
}

const DEMOS = [
  { id: 'action-buttons', label: 'Action buttons' },
  { id: 'animated-text', label: 'Animated text' },
  { id: 'text-reveal', label: 'Text reveal' },
  { id: 'image-accordion', label: 'Image accordion' },
  { id: 'image-trail', label: 'Image trail' },
  { id: 'scroll-parallax', label: 'Scroll parallax' },
  { id: 'infinite-image-canvas', label: 'Infinite canvas' },
  { id: 'dock-navigation', label: 'Dock navigation' },
  { id: 'mobile-menu-dock', label: 'Mobile menu dock' },
  { id: 'scroll-story-cards', label: 'Scroll story cards' },
  { id: 'pixel-cat', label: 'Pixel cat' },
] as const

function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-border/70 bg-surface/10 scroll-mt-6 rounded-2xl border p-4 sm:p-6"
    >
      <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1">
          <h2
            id={`${id}-title`}
            className="font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            {title}
          </h2>
          <p className="text-muted mt-1 max-w-2xl text-sm leading-6">
            {description}
          </p>
        </div>
      </div>
      <div className="border-border/50 mt-5 border-t pt-5 sm:mt-6 sm:pt-6">
        {children}
      </div>
    </section>
  )
}

export default function TestPage() {
  return (
    <main
      id="test-top"
      className="mx-auto w-full max-w-7xl px-4 pt-8 pb-24 sm:px-8 sm:pt-12 lg:px-12"
    >
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div>
          <p className="text-muted text-[10px] font-medium tracking-[0.2em] uppercase">
            ISTMX / component playground
          </p>
          <h1 className="font-display mt-2 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Try the components.
          </h1>
          <p className="text-muted mt-3 max-w-xl text-sm leading-6 sm:text-base">
            Every component has its own space here. Interact, scroll, and see
            what each one does before you use it.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/library"
            className="border-border/70 text-muted hover:border-foreground/30 hover:text-foreground inline-flex min-h-9 items-center rounded-lg border px-3 text-xs font-medium transition-colors"
          >
            Browse the library
            <span aria-hidden="true" className="ml-2">
              ↗
            </span>
          </Link>
        </div>
      </header>

      <nav
        aria-label="Component previews"
        className="border-border/60 mb-8 flex flex-wrap gap-2 border-y py-3 sm:mb-10"
      >
        {DEMOS.map((demo) => (
          <a
            key={demo.id}
            href={`#${demo.id}`}
            className="border-border/60 bg-surface/20 text-muted hover:border-foreground/30 hover:bg-surface/60 hover:text-foreground focus-visible:outline-foreground inline-flex items-center rounded-full border px-3.5 py-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {demo.label}
          </a>
        ))}
      </nav>

      <div className="grid gap-5 sm:gap-6">
        <DemoSection
          id="action-buttons"
          title="Action state buttons"
          description="Each action has a distinct intent color. Click to see the temporary confirmation, then watch it return to its original label."
        >
          <StateButtonShowcase />
        </DemoSection>

        <DemoSection
          id="animated-text"
          title="Animated text"
          description="Rotating words with a mix of blur, fade, and slide transitions."
        >
          <div className="bg-surface/30 flex min-h-40 flex-wrap items-center justify-center gap-x-3 rounded-xl px-4 py-8 text-center sm:min-h-48">
            <span className="font-display text-2xl tracking-tight sm:text-4xl">
              Make things
            </span>
            <AnimatedText
              items={['that matter', 'with care', 'for people']}
              effects={['blur', 'fade', 'slide']}
              interval={2400}
              speed={0.42}
              className="font-display min-h-[1.3em] text-2xl font-semibold tracking-tight text-emerald-400 sm:text-4xl"
              textClassName="font-display font-semibold tracking-tight"
            />
          </div>
        </DemoSection>

        <DemoSection
          id="text-reveal"
          title="Text reveal"
          description="Scroll through the pinned preview to reveal the quote line by line. Scroll back up to reverse the subtle, blurred character wave."
        >
          <TextRevealDemo />
        </DemoSection>

        <DemoSection
          id="image-accordion"
          title="Image accordion"
          description="Select an image to expand it and explore the rest of the collection."
        >
          <ImageAccordion
            images={IMAGE_ACCORDION_IMAGES}
            glow={{
              color: 'var(--foreground)',
              position: 'center',
              size: '72%',
              opacity: 0.2,
              blur: 18,
            }}
          />
        </DemoSection>

        <DemoSection
          id="image-trail"
          title="Image trail"
          description="Move your pointer through the area to create a throttled trail of image cards."
        >
          <ImageTrail
            images={IMAGE_TRAIL_IMAGES}
            className="min-h-64 sm:min-h-80"
            throttle={160}
            maxTrailItems={5}
          />
        </DemoSection>

        <DemoSection
          id="scroll-parallax"
          title="Scroll parallax"
          description="A centered text hero gives way to a contrasting pinned section. Scroll to expand the image from a 60vw frame to the full viewport while its contents move at a different pace."
        >
          <ScrollParallaxHero
            image={IMAGE_ACCORDION_IMAGES[4].src}
            imageAlt={IMAGE_ACCORDION_IMAGES[4].alt}
          />
        </DemoSection>

        <DemoSection
          id="infinite-image-canvas"
          title="Infinite image canvas"
          description="Pan around the canvas and explore the repeating image field."
        >
          <InfiniteImageCanvas
            images={INFINITE_IMAGE_CANVAS_IMAGES}
            heading="Somewhere, Everywhere"
            description="An endless field of images, waiting to be explored."
          />
        </DemoSection>

        <DemoSection
          id="dock-navigation"
          title="Dock navigation"
          description="Move across the dock to lift and magnify nearby icons."
        >
          <DockNavigationDemo />
        </DemoSection>

        <DemoSection
          id="mobile-menu-dock"
          title="Mobile menu dock"
          description="Open the compact menu, search the component catalog, or follow one of the sample links."
        >
          <div className="bg-surface/30 flex min-h-64 items-center justify-center rounded-xl p-4 sm:min-h-72">
            <MobileMenuDock
              placement="inline"
              searchItems={COMPONENT_SEARCH_ITEMS}
              items={[
                { label: 'Overview', href: '#test-top' },
                { label: 'Components', href: '#action-buttons', active: true },
                { label: 'Library', href: '/library' },
              ]}
              className="max-w-sm"
            />
          </div>
        </DemoSection>

        <DemoSection
          id="scroll-story-cards"
          title="Scroll story cards"
          description="Scroll through the sequence to scrub each story card into view."
        >
          <ScrollStoryCards
            cards={SCROLL_STORY_CARDS}
            eyebrow="Selected work / scroll study"
            heading="Scroll Animations Worth Saving"
            description="Five portrait-led stories unfold as you scroll."
            scrollDistance={360}
          />
        </DemoSection>

        <DemoSection
          id="pixel-cat"
          title="Pixel cat"
          description="Choose a breed, pose, and movement style, then interact with the cat in its bounded playground."
        >
          <CatPlayground />
        </DemoSection>
      </div>
    </main>
  )
}
