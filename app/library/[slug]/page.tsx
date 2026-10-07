import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconArrowLeft } from '@tabler/icons-react'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'
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
          <div className="px-8 pt-8 sm:px-8 sm:pt-10">
            <Link
              href="/library"
              className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex min-h-8 cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <IconArrowLeft size={14} stroke={1.7} aria-hidden="true" />
              <span>All components</span>
            </Link>
          </div>
          <LibraryItemDocumentation item={item} />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ScrollBlur />
    </>
  )
}
