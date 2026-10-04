import type { Metadata } from 'next'
import { Press_Start_2P } from 'next/font/google'
import Contanier from '../components/Contanier'
import Navbar from '../components/Navbar'
import CatHomeGame from './CatHomeGame'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

export const metadata: Metadata = {
  title: 'Cat Home | istmX',
  description: 'A cozy interactive pixel-art room where your pet cat lives.',
  robots: { index: false },
}

export default function CatHomePage() {
  return (
    <main className={`${pixelFont.variable} min-h-dvh bg-background text-foreground`}>
      <Contanier>
        <Navbar />
        <CatHomeGame />
      </Contanier>
    </main>
  )
}
