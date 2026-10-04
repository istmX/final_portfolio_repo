import type { Metadata } from 'next'
import CatHomeGame from './CatHomeGame'

export const metadata: Metadata = {
  title: 'Cat Home | istmX',
  description: 'A cozy interactive pixel-art room where your pet cat lives.',
  robots: { index: false },
}

export default function CatHomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <CatHomeGame />
    </main>
  )
}
