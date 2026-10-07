import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'
import { SITE_URL } from '@/app/portfolio-components/site'
import {
  getLibraryItem,
  LIBRARY_ITEMS,
} from '@/app/portfolio-components/library/library-items'
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
    ? {
        title: item.seoTitle,
        description: item.seoDescription,
        authors: [{ name: 'Aryan', url: SITE_URL }],
        creator: 'Aryan',
        alternates: { canonical: `/library/${item.slug}` },
        openGraph: {
          type: 'website',
          url: `${SITE_URL}/library/${item.slug}`,
          siteName: 'Aryan’s Portfolio and ISTMX',
          title: item.seoTitle,
          description: item.seoDescription,
          locale: 'en_IN',
        },
        twitter: {
          card: 'summary_large_image',
          title: item.seoTitle,
          description: item.seoDescription,
          images: [`/library/${item.slug}/opengraph-image`],
        },
        robots: { index: true, follow: true },
      }
    : {
        title: 'Component not found | ISTMX',
        robots: { index: false, follow: true },
      }
}

export function generateStaticParams() {
  return LIBRARY_ITEMS.map((item) => ({ slug: item.slug }))
}

export default async function LibraryItemPage({ params }: LibraryDetailProps) {
  const { slug } = await params
  const item = getLibraryItem(slug)
  if (!item) notFound()
  const itemIndex = LIBRARY_ITEMS.findIndex((entry) => entry.slug === slug)
  const previousItem =
    LIBRARY_ITEMS.length > 1
      ? LIBRARY_ITEMS[
          (itemIndex - 1 + LIBRARY_ITEMS.length) % LIBRARY_ITEMS.length
        ]
      : undefined
  const nextItem =
    LIBRARY_ITEMS.length > 1
      ? LIBRARY_ITEMS[(itemIndex + 1) % LIBRARY_ITEMS.length]
      : undefined
  const pageUrl = `${SITE_URL}/library/${item.slug}`
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Components',
            item: `${SITE_URL}/library`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: item.name,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: item.seoTitle,
        description: item.seoDescription,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
        mainEntity: { '@id': `${pageUrl}#source` },
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': `${pageUrl}#source`,
        name: item.name,
        description: item.seoDescription,
        url: pageUrl,
        codeRepository: `https://github.com/istmX/final_portfolio_repo/tree/main/components/ui/${item.slug}.tsx`,
        programmingLanguage: 'TypeScript',
        author: { '@id': `${SITE_URL}/#aryan` },
        keywords: item.keywords,
        isPartOf: { '@id': `${SITE_URL}/#istmx` },
        creator: { '@id': `${SITE_URL}/#aryan` },
        mainEntityOfPage: pageUrl,
      },
    ],
  }
  const safeStructuredData = JSON.stringify(structuredData).replace(
    /</g,
    '\\u003c',
  )

  return (
    <>
      <main className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeStructuredData }}
        />
        <Contanier>
          <Navbar />
          <div className="flex flex-wrap items-center justify-between gap-3 px-8 pt-8 sm:px-8 sm:pt-10">
            <nav aria-label="Breadcrumb">
              <ol className="text-muted flex flex-wrap items-center gap-2 text-xs">
                <li>
                  <Link
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/library"
                    className="hover:text-foreground transition-colors"
                  >
                    Components
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {item.name}
                </li>
              </ol>
            </nav>
            <nav
              aria-label="Component pages"
              className="flex items-center gap-1"
            >
              {previousItem ? (
                <Link
                  href={`/library/${previousItem.slug}`}
                  aria-label={`Previous component: ${previousItem.name}`}
                  title={`Previous: ${previousItem.name}`}
                  className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex min-h-8 cursor-pointer items-center gap-1 rounded px-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <IconChevronLeft size={15} stroke={1.7} aria-hidden="true" />
                  <span className="hidden sm:inline">{previousItem.name}</span>
                </Link>
              ) : null}
              {nextItem ? (
                <Link
                  href={`/library/${nextItem.slug}`}
                  aria-label={`Next component: ${nextItem.name}`}
                  title={`Next: ${nextItem.name}`}
                  className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex min-h-8 cursor-pointer items-center gap-1 rounded px-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <span className="hidden sm:inline">{nextItem.name}</span>
                  <IconChevronRight size={15} stroke={1.7} aria-hidden="true" />
                </Link>
              ) : null}
            </nav>
          </div>
          <LibraryItemDocumentation item={item} />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ScrollBlur />
    </>
  )
}
