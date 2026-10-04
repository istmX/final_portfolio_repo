'use client'

import { useState } from 'react'
import { TechIcon, type TechIconName } from './icons'

export default function TechStackPills({ technologies }: { technologies: TechIconName[] }) {
  const [selected, setSelected] = useState<TechIconName | null>(null)

  return (
    <ul aria-label="Technologies" className="flex flex-wrap justify-center gap-1.5 rounded-[16px] border border-border/50 bg-surface/15 p-3 sm:justify-start sm:gap-2 sm:p-3.5">
      {technologies.map((technology) => {
        const isSelected = selected === technology

        return (
          <li key={technology}>
            <button
              type="button"
              aria-label={`Highlight ${technology}`}
              aria-pressed={isSelected}
              onClick={() => setSelected(isSelected ? null : technology)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium leading-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground sm:text-xs ${isSelected ? 'border-foreground/45 bg-surface text-foreground' : 'border-border/45 bg-background/55 text-foreground/85 hover:border-border hover:bg-surface/45'}`}
            >
              <span className={`flex size-4 shrink-0 items-center justify-center ${technology === 'AWS' || technology === 'Vercel' ? 'rounded-[3px] bg-white p-px' : ''}`}>
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
