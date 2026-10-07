import type { Metadata } from 'next'
import CatSprite from '@/app/portfolio-components/CatSprite'
import PremiumLink from '@/app/portfolio-components/PremiumLink'

export const metadata: Metadata = {
  title: 'Lost? | Aryan',
  description: 'This page could not be found. Head back to Aryan’s portfolio.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <section
        aria-labelledby="lost-title"
        className="flex w-full max-w-3xl flex-col items-center justify-center text-center"
      >
        <div
          aria-hidden="true"
          className="mb-5 size-72 sm:mb-7 sm:size-80 md:size-96"
        >
          <CatSprite anim="sit" animated />
        </div>
        <p className="text-muted font-mono text-[10px] tracking-[0.2em] uppercase">
          404 · page not found
        </p>
        <h1
          id="lost-title"
          className="font-display mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl"
        >
          Did you get lost or something?
        </h1>
        <p className="text-muted mt-3 max-w-sm text-sm leading-6 sm:text-base">
          This little corner doesn’t exist. The cat looks just as confused as
          you do.
        </p>
        <div className="mt-7">
          <PremiumLink href="/">Take me home</PremiumLink>
        </div>
      </section>
    </main>
  )
}
