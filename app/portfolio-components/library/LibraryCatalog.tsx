'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import { useReducedMotion } from 'motion/react'
import InstallCommand from './InstallCommand'
import { LIBRARY_ITEMS } from './library-items'

export default function LibraryCatalog() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reduceMotion = useReducedMotion()
  const activeItem = LIBRARY_ITEMS[activeIndex]

  useEffect(() => {
    if (reduceMotion) return

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % LIBRARY_ITEMS.length)
    }, 2400)

    return () => window.clearInterval(interval)
  }, [reduceMotion])

  return (
    <div className="px-8 pb-24 sm:px-10">
      <section className="pt-14 sm:pt-20" aria-labelledby="library-title">
        <p className="text-muted mb-4 font-mono text-[10px] tracking-[0.2em] uppercase">
          ISTMX / SOURCE LIBRARY
        </p>
        <h1
          id="library-title"
          className="font-display text-5xl font-medium tracking-[-0.06em] sm:text-6xl"
        >
          Components
        </h1>
        <p className="text-muted mt-4 max-w-xl text-sm leading-6 sm:text-base">
          Small interface pieces to bring into your project, edit, and make your
          own.
        </p>
      </section>

      <section
        className="border-border/70 mt-10 border-y border-dotted py-5"
        aria-label="Install command"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">Add a component to your project</p>
          <span className="text-muted font-mono text-[9px] tracking-[0.12em] uppercase">
            Choose a package manager
          </span>
        </div>
        <InstallCommand component={activeItem.commandName} animated />
      </section>

      <section className="mt-10" aria-labelledby="browse-components">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-muted mb-1 font-mono text-[9px] tracking-[0.16em] uppercase">
              Browse
            </p>
            <h2
              id="browse-components"
              className="font-display text-xl font-medium tracking-tight"
            >
              All components
            </h2>
          </div>
          <span className="text-muted font-mono text-[10px]">
            {String(LIBRARY_ITEMS.length).padStart(2, '0')} entries
          </span>
        </div>

        <div className="divide-border/70 divide-y border-y border-dotted">
          {LIBRARY_ITEMS.map((item, index) => (
            <Link
              key={item.slug}
              href={`/library/${item.slug}`}
              className="group focus-visible:outline-foreground grid gap-2 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3"
            >
              <span className="text-muted font-mono text-[10px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-muted border-border/70 rounded-full border px-2 py-0.5 font-mono text-[9px]">
                    {item.category}
                  </span>
                </span>
                <span className="text-muted mt-1 block max-w-xl text-xs leading-5">
                  {item.description}
                </span>
              </span>
              <span className="text-muted group-hover:text-foreground flex items-center gap-1 text-[11px] transition-colors sm:justify-self-end">
                Explore <IconArrowUpRight size={14} stroke={1.6} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
