import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlockDocumentation from '@/app/portfolio-components/blocks/BlockDocumentation'
import { BLOCK_ITEMS, getBlockItem } from '@/app/portfolio-components/blocks/block-items'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'

type BlockPageProps = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return BLOCK_ITEMS.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: BlockPageProps): Promise<Metadata> {
  const { slug } = await params
  const item = getBlockItem(slug)
  if (!item) return { title: 'Block not found | ISTMX', robots: { index: false } }
  return {
    title: `${item.name} — AI App Block | ISTMX`,
    description: item.description,
    alternates: { canonical: `/blocks/${item.slug}` },
  }
}

export default async function BlockPage({ params }: BlockPageProps) {
  const { slug } = await params
  const item = getBlockItem(slug)
  if (!item) notFound()

  return (
    <>
      <main className="min-h-dvh">
        <Contanier>
          <Navbar />
          <BlockDocumentation item={item} />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ScrollBlur />
    </>
  )
}
