'use client'

import { useState } from 'react'
import { TechIcon, type TechIconName } from './icons'

export default function TechStackPills({
  technologies,
}: {
  technologies: TechIconName[]
}) {
  const [selected, setSelected] = useState<TechIconName | null>(null)

  return (
    <ul
      aria-label="Technologies"
      className="border-border/50 bg-surface/15 flex flex-wrap justify-center gap-1.5 rounded-[16px] border p-3 sm:justify-start sm:gap-2 sm:p-3.5"
    >
      {technologies.map((technology) => {
        const isSelected = selected === technology

        return (
          <li key={technology}>
            <button
              type="button"
              aria-label={`Highlight ${technology}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(isSelected ? null : technology)}
              className={`focus-visible:outline-foreground inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] leading-4 font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xs ${isSelected ? 'border-foreground/45 bg-surface text-foreground' : 'border-border/45 bg-background/55 text-foreground/85 hover:border-border hover:bg-surface/45'}`}
            >
              <span
                className={`flex size-4 shrink-0 items-center justify-center ${technology === 'AWS' || technology === 'Vercel' ? 'rounded-[3px] bg-white p-px' : ''}`}
              >
                <TechIcon name={technology} className="size-full" />
              </span>
              {technology}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
