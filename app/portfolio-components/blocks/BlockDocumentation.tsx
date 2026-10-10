'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  IconArrowLeft,
  IconArrowsJoin,
  IconArrowsMaximize,
  IconBraces,
  IconPackage,
  IconPoint,
} from '@tabler/icons-react'
import CodeBlock from '@/app/portfolio-components/CodeBlock'
import PillTabs from '@/app/portfolio-components/PillTabs'
import PortfolioSectionFrame from '@/app/portfolio-components/PortfolioSectionFrame'
import AiChatBlockDemo from './AiChatBlockDemo'
import type { BlockItem } from './block-items'
import PortfolioButton from '../PortfolioButton'
import InstallCommand from '@/app/portfolio-components/library/InstallCommand'
import { TechIcon } from '@/app/portfolio-components/icons'

export default function BlockDocumentation({ item }: { item: BlockItem }) {
  const [view, setView] = useState<'preview' | 'code'>('preview')

  return (
    <div className="min-w-0 px-4 pb-14 sm:px-8 sm:pb-16">
      <header className="pt-6 sm:pt-9">
        <Link
          href="/blocks"
          className="text-muted hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
        >
          <IconArrowLeft size={14} aria-hidden="true" />
          All blocks
        </Link>
        <p className="text-muted mt-5 text-[10px] font-medium tracking-[0.18em] uppercase">
          {item.category} / BLOCK
        </p>
        <h1 className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {item.name}
        </h1>
        <p className="text-muted mt-2 max-w-2xl text-xs leading-5 sm:text-sm">
          {item.description}
        </p>
      </header>

      <section className="mt-7" aria-label={`${item.name} live preview`}>
        <div className="flex items-center justify-between gap-3">
          <PillTabs
            options={['preview', 'code'] as const}
            value={view}
            onChange={setView}
            layoutId="block-view-pill"
            ariaLabel="Block view"
          />
          <PortfolioButton
            href={`/blocks/${item.slug}/preview`}
            icon={<IconArrowsMaximize size={14} aria-hidden="true" />}
            ariaLabel={`Open ${item.name} full preview`}
          >
            Full preview
          </PortfolioButton>
        </div>
        {view === 'preview' ? (
          <AiChatBlockDemo />
        ) : (
          <CodeBlock label={`${item.name} usage`} expandable>
            {item.usage}
          </CodeBlock>
        )}
      </section>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="overview-title">
        <h2
          id="overview-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Overview
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.overview}</p>
      </PortfolioSectionFrame>

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
          Choose a package manager to add the complete editable block to{' '}
          <code>components/ai-chat-block</code>. The CLI installs its runtime
          dependencies and keeps the helper files inside that folder.
        </p>
        <InstallCommand component={item.commandName} />
        <p className="text-muted mt-3 text-xs leading-5">
          React and Tailwind CSS should already be configured in your app. The
          command installs Motion, Tabler Icons, clsx, and tailwind-merge when
          they are missing.
        </p>
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
                {dependency === 'motion' ? (
                  <TechIcon name="Motion" className="size-4 shrink-0" />
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
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="files-title">
        <h2
          id="files-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Files included
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          The installer creates one self-contained folder. Each file has one
          clear role, so you can customize the block without tracking down
          portfolio-specific imports.
        </p>
        <CodeBlock label="components/ai-chat-block/">
          {`components/ai-chat-block/\n${item.files.map(({ path }) => `├── ${path}`).join('\n')}`}
        </CodeBlock>
        <div className="border-border/70 mt-4 divide-y divide-dotted border-y border-dotted">
          {item.files.map((file) => (
            <div
              key={file.path}
              className="grid gap-1 py-2.5 sm:grid-cols-[minmax(10rem,0.8fr)_2fr] sm:gap-4"
            >
              <code className="text-foreground font-mono text-[11px]">
                {file.path}
              </code>
              <p className="text-muted text-xs leading-5">{file.purpose}</p>
            </div>
          ))}
        </div>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="usage-title">
        <h2
          id="usage-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Connect your chat handler
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Import the component and pass an <code>onSend</code> function. It
          receives the message, selected File objects, and an AbortSignal. Keep
          provider credentials and model calls in your server endpoint.
        </p>
        <div className="mt-3">
          <CodeBlock label="support-chat.tsx" expandable>
            {item.usage}
          </CodeBlock>
        </div>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame className="mt-8" ariaLabelledby="streaming-title">
        <h2
          id="streaming-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Return a live response
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Return an async iterable of text chunks to stream a response. The
          block renders text as it arrives and passes the same abort signal
          through so Stop can cancel your provider request.
        </p>
        <div className="mt-3">
          <CodeBlock label="streaming-handler.ts" expandable>
            {item.streamingUsage}
          </CodeBlock>
        </div>
        <p className="text-muted mt-2 text-xs leading-5">
          Adapt your SDK’s chunk shape to strings or{' '}
          <code>ChatStreamChunk</code> objects before yielding. For a short
          visible activity status, yield a <code>thinking-delta</code> chunk; do
          not forward private model reasoning.
        </p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="attachments-title"
      >
        <h2
          id="attachments-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Configure attachments
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          Use the default image, document, audio, and video options, or pass
          your own list to control accepted file types and selection behavior.
        </p>
        <div className="mt-3">
          <CodeBlock label="attachment-options.tsx">
            {item.attachmentUsage}
          </CodeBlock>
        </div>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="how-it-works-title"
      >
        <h2
          id="how-it-works-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          How it works
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">{item.interaction}</p>
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
          <CodeBlock label="AI Chat block">
            {
              'AiChatBlock\n├── ChatSidebar\n│   ├── Pinned conversations\n│   ├── Recent conversations\n│   └── Account profile\n├── MessageList\n│   └── ChatMessage\n│       ├── ThinkingDisclosure\n│       ├── MessageContent\n│       └── AttachmentPreviews\n└── ChatComposer\n    ├── AttachmentDialog\n    ├── VoiceButton\n    └── SendButton / Stop'
            }
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
              className="grid gap-1 py-3 sm:grid-cols-[minmax(9rem,0.8fr)_minmax(12rem,1fr)_2fr] sm:gap-4"
            >
              <code className="text-foreground font-mono text-xs">
                {prop.name}
              </code>
              <code className="text-muted font-mono text-[11px] break-all">
                {prop.type}
              </code>
              <p className="text-muted text-xs leading-5">{prop.description}</p>
            </div>
          ))}
        </div>
        <p className="text-muted mt-2 text-[10px]">
          The listed props reflect the current block interface.
        </p>
      </PortfolioSectionFrame>

      <PortfolioSectionFrame
        className="mt-8"
        ariaLabelledby="accessibility-title"
      >
        <h2
          id="accessibility-title"
          className="font-display text-lg font-semibold sm:text-xl"
        >
          Accessibility and limitations
        </h2>
        <p className="text-muted mt-2 text-sm leading-6">
          {item.accessibility}
        </p>
        <p className="text-muted mt-3 text-sm leading-6">{item.limitations}</p>
      </PortfolioSectionFrame>
    </div>
  )
}
