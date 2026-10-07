'use client'

import { useState } from 'react'
import { IconArrowUpRight } from '@tabler/icons-react'
import AnimatedRole from '@/app/portfolio-components/AnimatedRole'
import ShimmerText from '@/app/portfolio-components/ShimmerText'
import InstallCommand from './InstallCommand'
import type { LibraryItem } from './library-items'

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="border-border bg-surface/50 overflow-x-auto rounded-lg border p-4 font-mono text-[11px] leading-6 sm:p-5 sm:text-xs">
      <code>{children}</code>
    </pre>
  )
}

function Preview({ item }: { item: LibraryItem }) {
  if (item.slug === 'shimmer-text') {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <ShimmerText className="text-xl font-medium sm:text-2xl">
          AI Engineer
        </ShimmerText>
      </div>
    )
  }

  if (item.slug === 'animated-text') {
    return (
      <div className="flex min-h-52 items-center justify-center gap-2 text-lg font-medium">
        <span>I am</span>
        <AnimatedRole />
      </div>
    )
  }

  if (item.slug === 'layered-button') {
    return (
      <div className="flex min-h-52 items-center justify-center">
        <button
          type="button"
          className="border-border bg-background text-foreground inline-flex items-center gap-4 border px-5 py-3 text-sm font-medium shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Explore projects <IconArrowUpRight size={16} stroke={1.6} />
        </button>
      </div>
    )
  }

  return (
    <div className="text-muted flex min-h-52 items-center justify-center font-mono text-5xl">
      ᓚᘏᗢ
    </div>
  )
}

export default function LibraryItemDocumentation({
  item,
}: {
  item: LibraryItem
}) {
  const [view, setView] = useState<'preview' | 'code'>('preview')
  const sourcePath = `components/ui/${item.slug}.tsx`

  return (
    <div className="px-8 pb-24 sm:px-10">
      <header className="pt-12 sm:pt-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted font-mono text-[10px] tracking-[0.16em] uppercase">
            {item.category} / COMPONENT
          </span>
          <span className="text-muted border-border/70 rounded-full border px-2 py-0.5 font-mono text-[9px]">
            Draft
          </span>
        </div>
        <h1 className="font-display mt-3 text-4xl font-medium tracking-[-0.05em] sm:text-5xl">
          {item.name}
        </h1>
        <p className="text-muted mt-3 max-w-xl text-sm leading-6">
          {item.description}
        </p>
      </header>

      <section className="mt-8" aria-label={`${item.name} preview and code`}>
        <div
          role="group"
          aria-label="Component view"
          className="border-border/70 flex gap-1 border-b border-dotted"
        >
          {(['preview', 'code'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={view === tab}
              onClick={() => setView(tab)}
              className={`focus-visible:outline-foreground rounded-t-md px-3 py-2 text-xs capitalize transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                view === tab
                  ? 'text-foreground border-foreground border-b'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
          <span className="text-muted ml-auto self-center font-mono text-[9px] tracking-[0.12em] uppercase">
            {view === 'preview' ? 'Live preview' : 'Source draft'}
          </span>
        </div>

        {view === 'preview' ? (
          <div className="border-border/70 bg-background mt-3 overflow-hidden rounded-lg border">
            <Preview item={item} />
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-muted mb-2 text-xs">
              Source will be published here when this component is implemented.
            </p>
            <CodeBlock>{`// ${sourcePath}\n// Editable component source is coming soon.`}</CodeBlock>
          </div>
        )}
      </section>

      <section className="mt-10" aria-labelledby="features-title">
        <h2 id="features-title" className="font-display text-xl font-medium">
          Features
        </h2>
        <ul className="text-muted mt-3 grid gap-2 text-sm leading-6">
          {item.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden="true" className="text-foreground">
                ·
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      <section
        className="border-border/70 mt-10 border-t border-dotted pt-7"
        aria-labelledby="installation-title"
      >
        <h2
          id="installation-title"
          className="font-display text-xl font-medium"
        >
          Installation
        </h2>
        <p className="text-muted mt-2 mb-4 text-sm leading-6">
          Choose your package manager to get the component command.
        </p>
        <InstallCommand component={item.commandName} />

        <h3 className="mt-7 text-sm font-medium">Manual installation</h3>
        <ol className="text-muted mt-3 list-inside list-decimal space-y-2 text-xs leading-5 sm:text-sm">
          <li>Install the dependencies listed below in your own project.</li>
          <li>
            Copy the component source into{' '}
            <code className="text-foreground font-mono">{sourcePath}</code>.
          </li>
          <li>Adjust imports and styles to match your project.</li>
        </ol>

        <div className="mt-5">
          <p className="text-muted mb-2 font-mono text-[9px] tracking-[0.12em] uppercase">
            Dependencies
          </p>
          <div className="flex flex-wrap gap-2">
            {item.dependencies.map((dependency) => (
              <span
                key={dependency}
                className="border-border/70 text-muted rounded-full border px-2.5 py-1 text-[10px]"
              >
                {dependency}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section
        className="border-border/70 mt-10 border-t border-dotted pt-7"
        aria-labelledby="usage-title"
      >
        <h2 id="usage-title" className="font-display text-xl font-medium">
          Usage
        </h2>
        <p className="text-muted mt-2 mb-4 text-sm leading-6">
          Import the component from the file you copied it to, then use it like
          any other React component.
        </p>
        <CodeBlock>{item.usage}</CodeBlock>
      </section>

      <section className="mt-10" aria-labelledby="composition-title">
        <h2 id="composition-title" className="font-display text-xl font-medium">
          Composition
        </h2>
        <pre className="text-muted border-border/70 bg-surface/30 mt-3 overflow-x-auto rounded-lg border border-dotted p-4 font-mono text-xs leading-6">
          {item.composition.join('\n')}
        </pre>
      </section>

      <section className="mt-10" aria-labelledby="api-title">
        <h2 id="api-title" className="font-display text-xl font-medium">
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
          Draft API — names and types may change before source release.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="attributes-title">
        <h2 id="attributes-title" className="font-display text-xl font-medium">
          Data attributes
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          No custom data attributes are defined in this draft.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="examples-title">
        <h2 id="examples-title" className="font-display text-xl font-medium">
          Examples
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.example}</p>
      </section>

      <section
        className="border-border/70 mt-10 border-t border-dotted pt-7"
        aria-labelledby="credits-title"
      >
        <h2 id="credits-title" className="font-display text-xl font-medium">
          Credits &amp; inspiration
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Designed for ISTMX. The source-first, copy-and-own philosophy is
          inspired by shadcn/ui.
        </p>
      </section>
    </div>
  )
}
