import ImageAccordion from '@/components/ui/image-accordion'
import CatPlayground from './CatPlayground'
import Navbar from '@/app/portfolio-components/Navbar'
import { IMAGE_ACCORDION_IMAGES } from '@/app/portfolio-components/library/image-accordion-data'
import DockNavigationDemo from './DockNavigationDemo'
import ScrollStoryCards from '@/components/ui/scroll-story-cards'
import { SCROLL_STORY_CARDS } from '@/app/portfolio-components/library/scroll-story-cards-data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Component playground | Aryan',
  description: 'A development playground for ISTMX component previews.',
  robots: { index: false, follow: false },
}

export default function TestPage() {
  return (
    <>
      <Navbar />
      <main className="w-full pt-4 pb-24">
        <ScrollStoryCards
          cards={SCROLL_STORY_CARDS}
          eyebrow="Selected work / scroll study"
          heading="Scroll Animations Worth Saving"
          description="Five portrait-led stories unfold as you scroll. Each frame brings its own image, color, and perspective into focus."
          scrollDistance={400}
        />

        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <section className="border-border mt-24 border-t pt-12">
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Pixel Cat
            </h2>
            <p className="text-muted mt-3 max-w-xl text-sm leading-6 sm:text-base">
              A tiny, source-first pixel-art cat companion that lives strictly
              inside its parent container. Customizable breeds, sizes, poses,
              and delightful petting interactions.
            </p>
            <CatPlayground />
          </section>

          <div className="border-border mt-24 border-t pt-12">
            <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
              Image Accordion
            </h2>
            <ImageAccordion
              images={IMAGE_ACCORDION_IMAGES}
              glow={{
                color: 'var(--foreground)',
                position: 'center',
                size: '72%',
                opacity: 0.24,
                blur: 18,
              }}
              className="mt-12"
            />
          </div>

          <DockNavigationDemo />
        </div>
      </main>
    </>
  )
}
