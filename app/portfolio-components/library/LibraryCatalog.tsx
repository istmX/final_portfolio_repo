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
    <div className="px-8 pb-14 sm:px-8 sm:pb-16">
      <section className="pt-8 sm:pt-12" aria-labelledby="library-title">
        <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
          ISTMX / SOURCE LIBRARY
        </p>
        <h1
          id="library-title"
          className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Components
        </h1>
        <p className="text-muted mt-2 max-w-xl text-xs leading-5 sm:text-sm">
          Small interface pieces to bring into your project, edit, and make your
          own.
        </p>
      </section>

      <section
        className="border-border/50 mt-7 border-y border-dotted py-4 sm:py-5"
        aria-label="Install command"
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium sm:text-sm">
            Add a component to your project
          </p>
          <span className="text-muted text-[10px] font-medium tracking-[0.12em] uppercase">
            Choose a package manager
          </span>
        </div>
        <InstallCommand component={activeItem.commandName} />
      </section>

      <section className="mt-8" aria-labelledby="browse-components">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
              Browse
            </p>
            <h2
              id="browse-components"
              className="font-display mt-1 text-xl font-semibold tracking-tight sm:text-2xl"
            >
              All components
            </h2>
          </div>
          <span className="text-muted font-mono text-[10px]">
            {String(LIBRARY_ITEMS.length).padStart(2, '0')} entries
          </span>
        </div>

        <div
          aria-hidden="true"
          className="h-1 bg-[radial-gradient(circle,var(--border)_1.5px,transparent_1.7px)] bg-[size:8px_4px] bg-[position:left_center] bg-repeat-x"
        />
        <div className="divide-border/70 border-border/70 divide-y border-b border-dotted">
          {LIBRARY_ITEMS.map((item, index) => (
            <Link
              key={item.slug}
              href={`/library/${item.slug}`}
              className="group focus-visible:outline-foreground grid cursor-pointer gap-1.5 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:grid-cols-[2rem_minmax(0,1fr)_auto] sm:items-center sm:gap-3 sm:py-3.5"
            >
              <span className="text-muted font-mono text-[10px]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="text-muted mb-0.5 block text-[10px] font-medium tracking-[0.14em] uppercase">
                  {item.category}
                </span>
                <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
                  {item.name}
                </span>
                <span className="text-muted mt-1 block max-w-xl text-xs leading-5 sm:text-[13px]">
                  {item.description}
                </span>
              </span>
              <span className="text-muted group-hover:text-foreground flex items-center gap-1 text-[10px] font-medium tracking-[0.06em] transition-colors sm:justify-self-end">
                Explore <IconArrowUpRight size={14} stroke={1.6} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
