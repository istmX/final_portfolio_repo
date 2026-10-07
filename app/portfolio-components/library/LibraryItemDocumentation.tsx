'use client'

import { useState } from 'react'
import PillTabs from '@/app/portfolio-components/PillTabs'
import CodeBlock from '@/app/portfolio-components/CodeBlock'
import DoubleBorderCard from '@/app/portfolio-components/DoubleBorderCard'
import PortfolioSectionFrame from '@/app/portfolio-components/PortfolioSectionFrame'
import {
  IconArrowsJoin,
  IconBraces,
  IconPackage,
  IconPoint,
} from '@tabler/icons-react'
import { AnimatedText } from '@/components/ui/animated-text'
import { TechIcon, type TechIconName } from '../icons'
import InstallCommand from './InstallCommand'
import type { LibraryItem } from './library-items'

const DIFF_EXAMPLE = `+ import { AnimatedText } from "@/components/ui/animated-text"

- <h1 className="text-xl">I am an AI Engineer</h1>
+ <AnimatedText
+   prefix="I am"
+   items={["an AI Engineer", "a Full-Stack Developer", "a Builder"]}
+ />`

function Preview({ item }: { item: LibraryItem }) {
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
          Install Motion and the class utilities used by this component.
        </p>
        <InstallCommand
          component="motion clsx tailwind-merge"
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
          Import it from the file you added and customize the words and effect.
        </p>
        <CodeBlock label="Usage">{item.usage}</CodeBlock>
        <div className="mt-4">
          <p className="text-muted mb-2 font-mono text-[10px] tracking-[0.14em] uppercase">
            Diff / Migration example
          </p>
          <CodeBlock label="Migration diff" diff>
            {DIFF_EXAMPLE}
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
  const [installMode, setInstallMode] = useState<'command' | 'manual'>(
    'command',
  )
  const sourcePath = `components/ui/${item.slug}.tsx`

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
          <span className="text-muted font-mono text-[9px] tracking-[0.12em] uppercase">
            {view === 'preview' ? 'Live preview' : 'Source code'}
          </span>
        </div>

        {view === 'preview' ? (
          <DoubleBorderCard
            className="mt-3"
            innerClassName="bg-background flex min-h-52 items-center justify-center p-4 sm:p-6"
          >
            <Preview item={item} />
          </DoubleBorderCard>
        ) : (
          <CodeBlock label={sourcePath} expandable>
            {item.sourceCode}
          </CodeBlock>
        )}
      </section>

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
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="attributes-title">
        <h2
          id="attributes-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Data attributes
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          AnimatedText does not expose custom data attributes.
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
          Designed for ISTMX. The source-first, copy-and-own philosophy is
          inspired by shadcn/ui.
        </p>
      </PortfolioSectionFrame>
    </div>
  )
}
