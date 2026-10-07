import type { Metadata } from 'next'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'
import LibraryCatalog from '@/app/portfolio-components/library/LibraryCatalog'
import { LIBRARY_ITEMS } from '@/app/portfolio-components/library/library-items'
import { SITE_URL } from '@/app/portfolio-components/site'

export const metadata: Metadata = {
  title: 'ISTMX Component Library — Editable React Components | Aryan',
  description:
    'Explore ISTMX, Aryan’s source-first React component library. Browse editable components with live previews, installation commands, usage examples, and API references.',
  alternates: { canonical: '/library' },
  authors: [{ name: 'Aryan', url: SITE_URL }],
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/library`,
    siteName: 'Aryan’s Portfolio and ISTMX',
    title: 'ISTMX Component Library — Editable React Components',
    description:
      'Source-first React components by Aryan, with editable code, live previews, installation instructions, and API documentation.',
    locale: 'en_IN',
    images: [{ url: '/hero.png', alt: 'Aryan, creator of ISTMX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ISTMX Component Library — Editable React Components',
    description:
      'Browse editable React components with source code, previews, and documentation by Aryan.',
    images: ['/hero.png'],
  },
}

export default function LibraryPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${SITE_URL}/library#page`,
    name: 'ISTMX Component Library',
    description: metadata.description,
    url: `${SITE_URL}/library`,
    author: { '@id': `${SITE_URL}/#aryan` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: LIBRARY_ITEMS.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}/library/${item.slug}`,
      })),
    },
  }
  const safeCollectionSchema = JSON.stringify(collectionSchema).replace(
    /</g,
    '\\u003c',
  )

  return (
    <>
      <main className="min-h-dvh">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeCollectionSchema }}
        />
        <Contanier>
          <Navbar />
          <LibraryCatalog />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ScrollBlur />
    </>
  )
}
