import type { Metadata } from 'next'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import BlogPostCard from '@/app/portfolio-components/BlogPostCard'
import { BLOG_POSTS } from './blogData'
import { SITE_URL } from '@/app/portfolio-components/site'

export const metadata: Metadata = {
  title: 'Writing | Aryan',
  description:
    'Practical articles by Aryan on AI agents, Python, FastAPI, backend engineering, full-stack development, and mobile apps.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blogs`,
    title: 'Writing on AI and software engineering | Aryan',
    description:
      'Practical notes on AI agents, Python, FastAPI, backend systems, and product development.',
    siteName: 'Aryan’s Portfolio',
    locale: 'en_IN',
    images: ['/hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing on AI and software engineering | Aryan',
    description:
      'Practical notes on AI agents, Python, FastAPI, backend systems, and product development.',
    images: ['/hero.png'],
  },
}

export default function BlogsPage() {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Writing on AI and software engineering | Aryan',
    description:
      'Practical articles on AI agents, Python, FastAPI, backend systems, full-stack development, and mobile apps.',
    url: `${SITE_URL}/blogs`,
    inLanguage: 'en',
    author: { '@id': `${SITE_URL}/#aryan` },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: BLOG_POSTS.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: post.title,
        url: `${SITE_URL}/blogs/${post.slug}`,
      })),
    },
  }
  const safeCollectionSchema = JSON.stringify(collectionSchema).replace(
    /</g,
    '\\u003c',
  )

  return (
    <main className="min-h-dvh">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeCollectionSchema }}
      />
      <Contanier>
        <Navbar />
        <section
          aria-labelledby="all-blogs-heading"
          className="px-8 pt-10 pb-16 sm:pt-14 sm:pb-20"
        >
          <div className="mb-7 max-w-2xl sm:mb-9">
            <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
              Writing &amp; ideas · {String(BLOG_POSTS.length).padStart(2, '0')}{' '}
              articles
            </p>
            <h1
              id="all-blogs-heading"
              className="font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              Notes from the workbench
            </h1>
            <p className="text-muted mt-3 text-sm leading-6 sm:text-base">
              Field notes on building AI agents that get useful work done, the
              products around them, and the developer tools I make along the
              way.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {BLOG_POSTS.map((post, index) => (
              <BlogPostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </section>
      </Contanier>
    </main>
  )
}
