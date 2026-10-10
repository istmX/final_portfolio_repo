import type { Metadata } from 'next'
import BlocksCatalog from '@/app/portfolio-components/blocks/BlocksCatalog'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'
import { SITE_URL } from '@/app/portfolio-components/site'

export const metadata: Metadata = {
  title: 'ISTMX Blocks — Ready-to-Preview UI Patterns | Aryan',
  description:
    'Explore ready-to-preview interface blocks built from editable ISTMX components.',
  alternates: { canonical: '/blocks' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blocks`,
    siteName: 'Aryan’s Portfolio and ISTMX',
    title: 'ISTMX Blocks — Ready-to-Preview UI Patterns',
    description:
      'Explore ready-to-preview interface blocks built from editable ISTMX components.',
    locale: 'en_IN',
  },
}

export default function BlocksPage() {
  return (
    <>
      <main className="min-h-dvh">
        <Contanier>
          <Navbar />
          <BlocksCatalog />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ScrollBlur />
    </>
  )
}
