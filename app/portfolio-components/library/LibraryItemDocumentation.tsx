'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useReducedMotion, useScroll, useSpring } from 'motion/react'
import PillTabs from '@/app/portfolio-components/PillTabs'
import CodeBlock from '@/app/portfolio-components/CodeBlock'
import DoubleBorderCard from '@/app/portfolio-components/DoubleBorderCard'
import PortfolioSectionFrame from '@/app/portfolio-components/PortfolioSectionFrame'
import {
  IconArrowsJoin,
  IconArrowsMaximize,
  IconBraces,
  IconCode,
  IconChevronDown,
  IconComponents,
  IconExternalLink,
  IconHome,
  IconMail,
  IconPackage,
  IconPoint,
  IconUser,
  IconX,
} from '@tabler/icons-react'
import DockNavigation from '@/components/ui/dock-navigation'
import Button from '@/components/ui/button'
import MobileMenuDock from '@/components/ui/mobile-menu-dock'
import { AnimatedText } from '@/components/ui/animated-text'
import TextReveal from '@/components/ui/text-reveal'
import ImageAccordion from '@/components/ui/image-accordion'
import ImageTrail from '@/components/ui/image-trail'
import InfiniteImageCanvas from '@/components/ui/infinite-image-canvas'
import ScrollStoryCards from '@/components/ui/scroll-story-cards'
import {
  PixelCat,
  type PixelCatBreed,
  type PixelCatPose,
} from '@/components/ui/pixel-cat'
import { TechIcon, type TechIconName } from '../icons'
import InstallCommand from './InstallCommand'
import type { LibraryItem } from './library-items'
import { IMAGE_ACCORDION_IMAGES } from './image-accordion-data'
import { IMAGE_TRAIL_IMAGES } from './image-trail-data'
import { INFINITE_IMAGE_CANVAS_IMAGES } from './infinite-image-canvas-data'
import { SCROLL_STORY_CARDS } from './scroll-story-cards-data'
import { TEXT_REVEAL_QUOTE } from './text-reveal-data'

const DIFF_EXAMPLE = `+ import { AnimatedText } from "@/components/ui/animated-text"

- <h1 className="text-xl">I am an AI Engineer</h1>
+ <AnimatedText
+   prefix="I am"
+   items={["an AI Engineer", "a Full-Stack Developer", "a Builder"]}
+ />`

function TextRevealPinnedPreview({
  scrollContainerRef,
}: {
  scrollContainerRef?: RefObject<HTMLElement | null>
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    skipInitialAnimation: true,
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Text reveal scroll preview"
      className={shouldReduceMotion ? 'relative' : 'relative min-h-[260svh]'}
    >
      <div
        className={
          shouldReduceMotion
            ? 'flex min-h-64 items-center'
            : 'sticky top-20 flex min-h-[calc(100svh-5rem)] items-center'
        }
      >
        <DoubleBorderCard
          className="w-full"
          innerClassName="bg-background/70 flex min-h-[min(32rem,75svh)] items-center justify-center p-4 sm:p-6"
        >
          <TextReveal
            text={TEXT_REVEAL_QUOTE}
            scrollProgress={shouldReduceMotion ? undefined : smoothProgress}
            characterStagger={0.024}
            lineStagger={0.24}
            waveDistance={12}
            blurAmount={8}
            className="font-display max-w-3xl text-center text-xl leading-relaxed font-medium tracking-tight sm:text-3xl"
          />
        </DoubleBorderCard>
      </div>
    </section>
  )
}

function PixelCatPreview() {
  const [breed, setBreed] = useState<PixelCatBreed>('orange')
  const [wandering, setWandering] = useState(true)
  const [selectedPose, setSelectedPose] = useState<PixelCatPose | 'auto'>(
    'auto',
  )

  return (
    <div className="w-full space-y-4 px-2 py-4 sm:px-4">
      <div className="border-border/80 relative h-64 w-full overflow-hidden rounded-xl border bg-zinc-950/40 p-4 shadow-inner">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        <div className="text-muted pointer-events-none absolute top-3 left-3 text-[11px]">
          <span>Parent container world (ResizeObserver bounded)</span>
        </div>
        <PixelCat
          breed={breed}
          size={40}
          wandering={wandering}
          pose={selectedPose === 'auto' ? undefined : selectedPose}
          interactive={true}
          cursorInteraction={true}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-muted mr-1">Breed:</span>
          {(
            ['white', 'orange', 'black', 'calico', 'gray', 'theme'] as const
          ).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBreed(b)}
              aria-pressed={breed === b}
              className={`cursor-pointer rounded border px-2 py-0.5 capitalize transition-colors ${
                breed === b
                  ? 'border-foreground bg-foreground/10 text-foreground font-medium'
                  : 'border-border text-muted hover:text-foreground'
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center">
            <span className="sr-only">Cat pose</span>
            <select
              aria-label="Cat pose"
              value={selectedPose}
              onChange={(e) =>
                setSelectedPose(e.target.value as PixelCatPose | 'auto')
              }
              className="border-border bg-background text-foreground hover:border-foreground/40 focus-visible:outline-foreground h-8 min-w-36 cursor-pointer appearance-none rounded-sm border py-1 pr-8 pl-2.5 text-xs shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <option value="auto">Auto cycle</option>
              <option value="idle">Idle</option>
              <option value="walk">Walk</option>
              <option value="sit">Sit</option>
              <option value="sleep">Sleep (Loaf)</option>
              <option value="alert">Alert</option>
              <option value="happy">Happy</option>
              <option value="stretch">Stretch</option>
              <option value="groom">Groom</option>
            </select>
            <IconChevronDown
              aria-hidden="true"
              size={14}
              stroke={1.7}
              className="text-muted pointer-events-none absolute right-2"
            />
          </label>

          <label className="text-muted hover:text-foreground flex cursor-pointer items-center gap-1.5 select-none">
            <input
              type="checkbox"
              checked={wandering}
              onChange={(e) => setWandering(e.target.checked)}
              className="accent-foreground cursor-pointer"
            />
            <span>Wandering</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function Preview({
  item,
  scrollContainerRef,
}: {
  item: LibraryItem
  scrollContainerRef?: RefObject<HTMLElement | null>
}) {
  if (item.slug === 'button') {
    return (
      <div className="flex w-full flex-wrap items-center justify-center gap-3 px-4 py-8">
        <Button intent="save" feedback={{ label: 'Saved' }} onClick={() => {}}>
          Save
        </Button>
        <Button
          intent="share"
          feedback={{ label: 'Link copied' }}
          onClick={() => {}}
        >
          Share
        </Button>
        <Button
          intent="delete"
          feedback={{ label: 'Deleted' }}
          onClick={() => {}}
        >
          Delete
        </Button>
      </div>
    )
  }

  if (item.slug === 'mobile-menu-dock') {
    return (
      <div className="relative flex min-h-72 w-full items-center justify-center overflow-hidden px-4 py-6">
        <div className="border-border/60 bg-surface/15 relative flex w-full max-w-sm items-end justify-center border border-dotted px-4 pt-4 pb-5">
          <MobileMenuDock
            placement="inline"
            className="w-full"
            items={[
              { label: 'About', href: '#about' },
              { label: 'Projects', href: '#projects' },
              { label: 'Components', href: '#components', active: true },
              { label: 'Blog', href: '#blog' },
            ]}
            searchItems={[
              {
                name: 'Animated Text',
                href: '/library/animated-text',
                slug: 'animated-text',
                category: 'Text',
                description:
                  'Composable blur, fade, shimmer, slide, and wave effects.',
              },
              {
                name: 'Dock Navigation',
                href: '/library/dock-navigation',
                slug: 'dock-navigation',
                category: 'Navigation',
                description:
                  'An elastic icon dock with proximity-based magnification.',
              },
              {
                name: 'Scroll Story Cards',
                href: '/library/scroll-story-cards',
                slug: 'scroll-story-cards',
                category: 'Scroll',
                description:
                  'A scroll-scrubbed sequence of image-led story cards.',
              },
            ]}
          />
        </div>
        <p className="text-muted absolute right-5 bottom-2 text-[10px]">
          Type to filter components
        </p>
      </div>
    )
  }

  if (item.slug === 'dock-navigation') {
    return (
      <div className="flex min-h-52 w-full items-center justify-center px-4 py-14">
        <DockNavigation
          label="Dock navigation preview"
          items={[
            {
              label: 'Home',
              href: '#dock-home',
              icon: <IconHome size={19} stroke={1.6} />,
            },
            {
              label: 'About',
              href: '#dock-about',
              icon: <IconUser size={19} stroke={1.6} />,
            },
            {
              label: 'Projects',
              href: '#dock-projects',
              icon: <IconCode size={19} stroke={1.6} />,
            },
            {
              label: 'Components',
              href: '#dock-components',
              icon: <IconComponents size={19} stroke={1.6} />,
              active: true,
            },
            {
              label: 'Contact',
              href: '#dock-contact',
              icon: <IconMail size={19} stroke={1.6} />,
            },
          ]}
          glow={{ opacity: 0.2, blur: 12 }}
        />
      </div>
    )
  }

  if (item.slug === 'image-accordion') {
    return (
      <div className="w-full px-2 py-5 sm:px-4">
        <ImageAccordion
          images={IMAGE_ACCORDION_IMAGES}
          className="mx-auto w-full max-w-3xl gap-3 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-4"
          stackClassName="min-w-0"
          cardClassName="rounded-lg"
          imageClassName="object-cover"
          previewClassName="min-h-48 rounded-lg sm:min-h-64"
          glow={{ opacity: 0.18, blur: 14 }}
        />
      </div>
    )
  }

  if (item.slug === 'image-trail') {
    return (
      <div className="w-full py-3">
        <ImageTrail
          images={IMAGE_TRAIL_IMAGES}
          className="mx-auto h-[20rem] max-w-3xl sm:h-[25rem]"
          throttle={160}
          maxTrailItems={5}
        />
      </div>
    )
  }

  if (item.slug === 'infinite-image-canvas') {
    return (
      <div className="w-full py-3">
        <InfiniteImageCanvas
          images={INFINITE_IMAGE_CANVAS_IMAGES}
          heading="Somewhere, Everywhere"
          description="An endless field of images, waiting to be explored."
          className="mx-auto h-[23rem] max-w-3xl sm:h-[28rem]"
        />
      </div>
    )
  }

  if (item.slug === 'animated-text') {
    return (
      <div className="flex min-h-52 items-center justify-center text-lg font-medium">
        <AnimatedText
          prefix="I am"
          items={['an AI Engineer', 'a Full-Stack Developer', 'a Builder']}
          effects={['blur', 'shimmer', 'slide', 'wave']}
          effectOptions={{
            blur: { amount: 6 },
            slide: { distance: 8 },
            shimmer: { duration: 2.2 },
          }}
          scale={0.96}
          className="text-lg"
        />
      </div>
    )
  }

  if (item.slug === 'text-reveal') {
    return <TextRevealPinnedPreview scrollContainerRef={scrollContainerRef} />
  }

  if (item.slug === 'scroll-story-cards') {
    return (
      <ScrollStoryCards
        cards={SCROLL_STORY_CARDS}
        eyebrow="Portraits / visual story"
        heading="One scroll. Five changing frames."
        description="The frame at the center shapes the image, color, and story."
        scrollDistance={400}
        cardWidth={156}
        cardHeight={156}
        scrollContainerRef={scrollContainerRef}
      />
    )
  }

  if (item.slug === 'pixel-cat') {
    return <PixelCatPreview />
  }

  return null
}

const CN_HELPER = `import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}`

const DEPENDENCY_TECH_ICONS: Partial<Record<string, TechIconName>> = {
  React: 'React',
  Motion: 'Motion',
  'Tailwind CSS': 'Tailwind CSS',
}

function ManualInstallation({
  item,
  sourcePath,
}: {
  item: LibraryItem
  sourcePath: string
}) {
  return (
    <div className="mt-4 space-y-5">
      <section>
        <h3 className="text-sm font-medium">1. Install the dependencies</h3>
        <p className="text-muted mt-1 mb-3 text-xs leading-5">
          React and Tailwind CSS should already be set up in your project.
          Install the runtime and class utilities used by this component.
        </p>
        <InstallCommand
          component={item.dependencies
            .filter(
              (dependency) =>
                !['React', 'Next.js', 'Tailwind CSS'].includes(dependency),
            )
            .join(' ')}
          mode="dependencies"
        />
      </section>

      <section>
        <h3 className="text-sm font-medium">2. Add the cn helper</h3>
        <p className="text-muted mt-1 mb-3 text-xs leading-5">
          Create <code className="font-mono">lib/utils.ts</code> and add the
          helper used to merge Tailwind classes.
        </p>
        <CodeBlock label="lib/utils.ts">{CN_HELPER}</CodeBlock>
      </section>

      <section>
        <h3 className="text-sm font-medium">3. Add the component source</h3>
        <p className="text-muted mt-1 text-xs leading-5">
          Copy the source from the Code tab above into{' '}
          <code className="font-mono">{sourcePath}</code>, then update the
          <code className="mx-1 font-mono">@/</code> alias if your project uses
          a different import path.
        </p>
      </section>

      <section>
        <h3 className="text-sm font-medium">4. Use the component</h3>
        <p className="text-muted mt-1 mb-3 text-xs leading-5">
          Import it from the file you added and pass the props shown in the
          usage example.
        </p>
        <CodeBlock label="Usage">{item.usage}</CodeBlock>
        <div className="mt-4">
          <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.14em] uppercase">
            Diff / Migration example
          </p>
          <CodeBlock label="Migration diff" diff>
            {item.migrationExample ?? DIFF_EXAMPLE}
          </CodeBlock>
        </div>
      </section>
    </div>
  )
}

export default function LibraryItemDocumentation({
  item,
}: {
  item: LibraryItem
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false)
  const [installMode, setInstallMode] = useState<'command' | 'manual'>(
    'command',
  )
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const sourcePath = `components/ui/${item.slug}.tsx`

  useEffect(() => {
    if (!isPreviewFullscreen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsPreviewFullscreen(false)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isPreviewFullscreen])

  return (
    <div className="px-8 pb-14 sm:px-8 sm:pb-16">
      <header className="pt-7 sm:pt-9">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
            {item.category} / COMPONENT
          </span>
        </div>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {item.name}
        </h1>
        <p className="text-muted mt-2 max-w-xl text-xs leading-5 sm:text-sm">
          {item.description}
        </p>
      </header>

      <section className="mt-7" aria-label={`${item.name} preview and code`}>
        <div className="flex items-center justify-between gap-3">
          <PillTabs
            options={['preview', 'code'] as const}
            value={view}
            onChange={setView}
            layoutId="component-view-pill"
            ariaLabel="Component view"
          />
          <div className="flex items-center gap-2">
            <span className="text-muted font-mono text-[9px] tracking-[0.12em] uppercase">
              {view === 'preview' ? 'Live preview' : 'Source code'}
            </span>
            {view === 'preview' ? (
              <button
                type="button"
                onClick={() => setIsPreviewFullscreen(true)}
                aria-label={`Open ${item.name} preview in fullscreen`}
                title="Fullscreen preview"
                className="border-border text-muted hover:border-foreground/30 hover:text-foreground focus-visible:outline-foreground inline-flex size-8 items-center justify-center border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <IconArrowsMaximize aria-hidden="true" size={15} stroke={1.7} />
              </button>
            ) : null}
          </div>
        </div>

        {view === 'preview' && item.slug === 'scroll-story-cards' ? (
          <div className="mt-3">
            <Preview item={item} />
          </div>
        ) : view === 'preview' && item.slug === 'text-reveal' ? (
          <div className="mt-3">
            <Preview item={item} />
          </div>
        ) : view === 'preview' ? (
          <DoubleBorderCard
            className="mt-3"
            innerClassName={`bg-background flex items-center justify-center p-4 sm:p-6 ${item.slug === 'image-accordion' ? 'min-h-[25rem] sm:min-h-[29rem]' : item.slug === 'image-trail' ? 'min-h-[23rem] sm:min-h-[28rem]' : item.slug === 'infinite-image-canvas' ? 'min-h-[26rem] sm:min-h-[31rem]' : 'min-h-52'}`}
          >
            <Preview item={item} />
          </DoubleBorderCard>
        ) : (
          <CodeBlock label={sourcePath} expandable>
            {item.sourceCode}
          </CodeBlock>
        )}
      </section>

      <div className="mt-3 flex justify-end">
        <a
          href={`https://github.com/istmX/final_portfolio_repo/blob/main/components/ui/${item.slug}.tsx`}
          target="_blank"
          rel="noreferrer"
          className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex items-center gap-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          View the {item.name} source on GitHub
          <IconExternalLink aria-hidden="true" size={14} stroke={1.7} />
        </a>
      </div>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="how-it-works-title"
      >
        <h2
          id="how-it-works-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          How it works
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.interaction}</p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="accessibility-title"
      >
        <h2
          id="accessibility-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Accessibility
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          {item.accessibility}
        </p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="limitations-title"
      >
        <h2
          id="limitations-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Limitations
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.limitations}</p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="features-title">
        <h2
          id="features-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Features
        </h2>
        <ul className="text-muted mt-3 grid gap-2 text-sm leading-6">
          {item.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <IconPoint
                aria-hidden="true"
                className="text-foreground mt-0.5 shrink-0"
                size={15}
                stroke={2}
              />
              {feature}
            </li>
          ))}
        </ul>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="installation-title"
      >
        <h2
          id="installation-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Installation
        </h2>
        <p className="text-muted mt-2 mb-4 text-sm leading-6">
          Choose the CLI command or install the component manually.
        </p>
        <PillTabs
          options={['command', 'manual'] as const}
          value={installMode}
          onChange={setInstallMode}
          layoutId="installation-method-pill"
          ariaLabel="Installation method"
        />

        <div role="tabpanel" className="mt-4">
          {installMode === 'command' ? (
            <InstallCommand component={item.commandName} />
          ) : (
            <ManualInstallation item={item} sourcePath={sourcePath} />
          )}
        </div>

        {installMode === 'command' ? (
          <div className="mt-5">
            <p className="text-muted mb-2 font-mono text-[9px] tracking-[0.12em] uppercase">
              Dependencies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {item.dependencies.map((dependency) => (
                <span
                  key={dependency}
                  className="bg-surface/80 text-foreground inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs leading-4 font-medium"
                >
                  {DEPENDENCY_TECH_ICONS[dependency] ? (
                    <TechIcon
                      name={DEPENDENCY_TECH_ICONS[dependency]!}
                      className="size-4 shrink-0"
                    />
                  ) : dependency === 'clsx' ? (
                    <IconBraces
                      size={15}
                      stroke={1.7}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                  ) : dependency === 'tailwind-merge' ? (
                    <IconArrowsJoin
                      size={15}
                      stroke={1.7}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <IconPackage
                      size={15}
                      stroke={1.7}
                      className="shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {dependency}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="usage-title">
        <h2
          id="usage-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Usage
        </h2>
        <p className="text-muted mt-2 mb-4 text-sm leading-6">
          Import the component from the file you copied it to, then use it like
          any other React component.
        </p>
        <CodeBlock label="Usage">{item.usage}</CodeBlock>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="composition-title"
      >
        <h2
          id="composition-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Composition
        </h2>
        <div className="mt-3">
          <CodeBlock label="Composition">
            {item.composition.join('\n')}
          </CodeBlock>
        </div>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="api-title">
        <h2
          id="api-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          API reference
        </h2>
        <div className="border-border/70 mt-3 divide-y divide-dotted border-y border-dotted">
          {item.props.map((prop) => (
            <div
              key={prop.name}
              className="grid gap-1 py-3 sm:grid-cols-[minmax(7rem,0.7fr)_minmax(7rem,0.8fr)_2fr] sm:gap-4"
            >
              <code className="text-foreground font-mono text-xs">
                {prop.name}
              </code>
              <code className="text-muted font-mono text-[11px]">
                {prop.type}
              </code>
              <p className="text-muted text-xs leading-5">{prop.description}</p>
            </div>
          ))}
        </div>
        <p className="text-muted mt-2 text-[10px]">
          The listed props match the current component implementation.
        </p>
        {item.slug === 'pixel-cat' ? (
          <p className="text-muted mt-2 text-[10px] leading-5">
            Exports include <code>PixelCatProps</code>,{' '}
            <code>PixelCatBreed</code>, <code>PixelCatPose</code>,{' '}
            <code>PixelCatPosition</code>, <code>CAT_PALETTES</code>,{' '}
            <code>CAT_SIZE</code>, and <code>CAT_FEET_Y</code>.
          </p>
        ) : null}
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="attributes-title">
        <h2
          id="attributes-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Data attributes
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          {item.name} does not expose custom data attributes.
        </p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="examples-title">
        <h2
          id="examples-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Examples
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.example}</p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="credits-title">
        <h2
          id="credits-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Credits &amp; inspiration
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          {item.slug === 'mobile-menu-dock' ? (
            <>
              The mobile menu and search interaction is inspired by{' '}
              <a
                href="https://chanhdai.com"
                target="_blank"
                rel="noreferrer"
                className="text-foreground decoration-border hover:decoration-foreground underline underline-offset-4 transition-colors"
              >
                Chánh Đại
              </a>
              . This ISTMX version adapts that idea with searchable component
              results and a source-first implementation created by Aryan
              (istmX). The copy-and-own philosophy is inspired by shadcn/ui.
            </>
          ) : (
            <>
              Created by Aryan (istmX) for ISTMX. The source-first, copy-and-own
              philosophy is inspired by shadcn/ui.{' '}
              <a
                href="https://aryanonai.vercel.app/"
                className="text-foreground decoration-border hover:decoration-foreground underline underline-offset-4 transition-colors"
              >
                About the creator
              </a>
            </>
          )}
        </p>
      </PortfolioSectionFrame>

      {isPreviewFullscreen ? (
        <div
          ref={fullscreenRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${item.name} fullscreen preview`}
          className="bg-background fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
        >
          <button
            type="button"
            onClick={() => setIsPreviewFullscreen(false)}
            aria-label="Close fullscreen preview"
            className="bg-background/90 border-border text-foreground hover:bg-surface fixed top-3 right-3 z-[110] inline-flex size-10 items-center justify-center border shadow-sm backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <IconX aria-hidden="true" size={18} stroke={1.8} />
          </button>
          <Preview item={item} scrollContainerRef={fullscreenRef} />
        </div>
      ) : null}
    </div>
  )
}
