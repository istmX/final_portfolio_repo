'use client'

import AiChatBlockDemo from './AiChatBlockDemo'

export default function BlockPreviewSurface({ slug }: { slug: string }) {
  if (slug === 'ai-chat') return <AiChatBlockDemo fullBleed />
  return (
    <main className="bg-background flex h-dvh w-full items-center justify-center text-center">
      <p className="text-muted px-6 text-sm">This block preview is empty for now.</p>
    </main>
  )
}
