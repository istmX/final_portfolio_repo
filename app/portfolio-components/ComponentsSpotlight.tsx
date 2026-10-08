import Link from 'next/link'
import {
  IconArrowCurveRight,
  IconArrowsMoveVertical,
  IconArrowRight,
  IconCat,
  IconHandClick,
  IconLayoutNavbar,
  IconLetterT,
  IconPhoto,
  IconSearch,
  IconWorld,
} from '@tabler/icons-react'
import { COMPONENT_SEARCH_ITEMS } from './library/component-search-data'

export const COMPONENT_ICONS = {
  button: IconHandClick,
  'animated-text': IconLetterT,
  'text-reveal': IconLetterT,
  'infinite-image-canvas': IconWorld,
  'image-trail': IconPhoto,
  'image-accordion': IconPhoto,
  'dock-navigation': IconLayoutNavbar,
  'mobile-menu-dock': IconSearch,
  'scroll-story-cards': IconArrowsMoveVertical,
  'pixel-cat': IconCat,
} as const

export default function ComponentsSpotlight() {
  return (
    <section
      id="components"
      aria-labelledby="components-spotlight-title"
      className="border-border/60 border-y border-dotted px-8 py-5 sm:px-8 sm:py-7"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="components-spotlight-title"
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Components
          <sup className="text-muted ml-1.5 align-super font-sans text-xs font-normal">
            ({String(COMPONENT_SEARCH_ITEMS.length).padStart(2, '0')})
          </sup>
        </h2>
        <div className="text-muted flex items-center gap-2 pb-1">
          <p className="text-xs italic">Free to copy. Yours to keep.</p>
          <IconArrowCurveRight
            aria-hidden="true"
            className="text-muted/80 mt-2 rotate-90"
            size={24}
            stroke={1.4}
          />
        </div>
      </div>

      <ul className="border-border/60 mt-3 grid grid-cols-1 border-t border-l sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENT_SEARCH_ITEMS.map((item) => {
          const Icon = COMPONENT_ICONS[item.slug]

          return (
            <li key={item.slug} className="border-border/60 border-r border-b">
              <Link
                href={`/library/${item.slug}`}
                className="group hover:bg-surface/35 focus-visible:bg-surface/35 focus-visible:outline-foreground flex min-h-16 items-center gap-3 px-3 py-3 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 sm:px-4"
              >
                <span className="border-border/60 bg-surface/40 text-muted group-hover:text-foreground inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors">
                  <Icon aria-hidden="true" size={16} stroke={1.6} />
                </span>
                <span className="font-display text-sm font-medium tracking-tight sm:text-[15px]">
                  {item.name}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="flex flex-wrap items-center justify-end gap-2 pt-3">
        <Link
          href="/library"
          className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex items-center gap-1.5 px-1 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          All components
          <IconArrowRight aria-hidden="true" size={15} stroke={1.7} />
        </Link>
      </div>
    </section>
  )
}
