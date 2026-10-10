'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconArrowLeft,
} from '@tabler/icons-react'

const viewports = [
  { id: 'desktop', label: 'Desktop', width: 1440, icon: IconDeviceDesktop },
  { id: 'tablet', label: 'Tablet', width: 768, icon: IconDeviceTablet },
  { id: 'mobile', label: 'Mobile', width: 390, icon: IconDeviceMobile },
] as const

type ViewportId = (typeof viewports)[number]['id']

export default function BlockPreviewWorkspace({ slug }: { slug: string }) {
  const [viewportId, setViewportId] = useState<ViewportId>('desktop')
  const viewport = viewports.find((item) => item.id === viewportId) ?? viewports[0]
  return (
    <main className="bg-background fixed inset-0 z-[100] h-dvh w-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex items-center justify-center gap-2 px-3">
        <div role="group" aria-label="Preview screen size" className="border-border/60 bg-background/85 pointer-events-auto flex items-center rounded-2xl border p-1 shadow-xl backdrop-blur-xl">
            {viewports.map((item) => {
              const Icon = item.icon
              const selected = item.id === viewportId
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`${item.label} preview, ${item.width} pixels wide`}
                  aria-pressed={selected}
                  onClick={() => setViewportId(item.id)}
                  className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl px-2 text-[10px] transition-colors sm:px-2.5 sm:text-[11px] ${selected ? 'bg-surface text-foreground shadow-sm' : 'text-muted hover:text-foreground'}`}
                >
                  <Icon size={15} stroke={1.7} aria-hidden="true" />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              )
            })}
        </div>
        <Link
            href={`/blocks/${slug}`}
            aria-label="Back to block details"
            title="Back to block details"
            className="border-border/60 bg-background/85 text-foreground pointer-events-auto flex h-10 cursor-pointer items-center gap-1.5 rounded-2xl border px-3 text-xs shadow-xl backdrop-blur-xl transition-colors hover:bg-surface"
          >
            <IconArrowLeft size={16} stroke={1.7} aria-hidden="true" />
            <span className="hidden text-xs sm:inline">Back</span>
        </Link>
      </div>

      <div className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden absolute inset-0 flex justify-center overflow-auto">
        <div
          className="h-dvh max-w-full shrink-0 transition-[width] duration-300 ease-out"
          style={{ width: `min(${viewport.width}px, 100%)` }}
        >
          <iframe
            key={slug}
            src={`/blocks/${slug}/preview?embed=1`}
            title={`${slug} responsive live preview`}
            className="bg-background block h-full min-h-0 w-full border-0"
          />
        </div>
      </div>
    </main>
  )
}
