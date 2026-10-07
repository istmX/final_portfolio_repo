import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconArrowLeft } from '@tabler/icons-react'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import { getLibraryItem } from '@/app/portfolio-components/library/library-items'
import LibraryItemDocumentation from '@/app/portfolio-components/library/LibraryItemDocumentation'

type LibraryDetailProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: LibraryDetailProps): Promise<Metadata> {
  const { slug } = await params
  const item = getLibraryItem(slug)

  return item
    ? { title: `${item.name} | ISTMX Library` }
    : { title: 'Component | ISTMX Library' }
}

export default async function LibraryItemPage({ params }: LibraryDetailProps) {
  const { slug } = await params
  const item = getLibraryItem(slug)
  if (!item) notFound()

  return (
    <>
      <main className="min-h-dvh">
        <Contanier>
          <Navbar />
          <div className="px-8 pt-6 sm:px-10">
            <Link
              href="/library"
              className="text-muted hover:text-foreground text-xs transition-colors"
            >
              <IconArrowLeft size={14} stroke={1.7} aria-hidden="true" />
              All components
            </Link>
          </div>
          <LibraryItemDocumentation item={item} />
        </Contanier>
      </main>
      <PortfolioFooter />
    </>
  )
}
