import ImageAccordion from '@/components/ui/image-accordion'
import Navbar from '@/app/portfolio-components/Navbar'
import { IMAGE_ACCORDION_IMAGES } from '@/app/portfolio-components/library/image-accordion-data'

export default function TestPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-5 pt-32 pb-24 sm:px-8">
        <p className="text-muted font-mono text-[10px] tracking-[0.18em] uppercase">
          ISTMX / Interaction study
        </p>
        <h1 className="font-display mt-4 text-3xl tracking-tight sm:text-5xl">
          Image Accordion
        </h1>
        <p className="text-muted mt-3 max-w-xl text-sm leading-6 sm:text-base">
          Five images overlap on the left. Select one to animate it into the
          canvas; it moves to the back of the stack and the numbering updates.
        </p>

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
      </main>
    </>
  )
}
