import type { Metadata } from 'next'
import Link from 'next/link'
import CatSprite from '../components/CatSprite'
import Contanier from '../components/Contanier'

export const metadata: Metadata = {
  title: 'Lost? | Aryan',
  description: 'This page could not be found. Head back to Aryan’s portfolio.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <Contanier>
        <section aria-labelledby="lost-title" className="flex min-h-[70dvh] flex-col items-center justify-center text-center">
          <div aria-hidden="true" className="mb-6 size-52 sm:mb-8 sm:size-64">
            <CatSprite anim="sit" animated />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">404 · page not found</p>
          <h1 id="lost-title" className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Did you get lost or something?
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted sm:text-base">
            This little corner doesn’t exist. The cat looks just as confused as you do.
          </p>
          <Link
            href="/"
            className="group mt-7 inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-5 py-3 text-sm font-medium text-foreground shadow-sm transition hover:-translate-y-0.5 hover:border-border hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground motion-reduce:transition-none"
          >
            <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none">←</span>
            Take me home
          </Link>
        </section>
      </Contanier>
    </main>
  )
}
