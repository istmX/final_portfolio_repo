import type { Metadata } from 'next'
import BlockPreviewSurface from '@/app/portfolio-components/blocks/BlockPreviewSurface'
import BlockPreviewWorkspace from '@/app/portfolio-components/blocks/BlockPreviewWorkspace'

type BlockPreviewPageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: BlockPreviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const name = slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return {
    title: `${name} preview | ISTMX Blocks`,
    robots: { index: false, follow: true },
  }
}

export default async function BlockPreviewPage({
  params,
  searchParams,
}: BlockPreviewPageProps & { searchParams: Promise<{ embed?: string }> }) {
  const { slug } = await params
  const query = await searchParams
  if (query.embed === '1') return <BlockPreviewSurface slug={slug} />
  return <BlockPreviewWorkspace slug={slug} />
}
