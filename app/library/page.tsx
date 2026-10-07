import type { Metadata } from 'next'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import LibraryCatalog from '@/app/portfolio-components/library/LibraryCatalog'

export const metadata: Metadata = {
  title: 'Components | ISTMX Library',
  description: 'Small, editable interface components from the ISTMX Library.',
}

export default function LibraryPage() {
  return (
    <>
      <main className="min-h-dvh">
        <Contanier>
          <Navbar />
          <LibraryCatalog />
        </Contanier>
      </main>
      <PortfolioFooter />
    </>
  )
}
