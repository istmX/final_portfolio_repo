import Image from 'next/image'
import Link from 'next/link'
import { IconArrowLeft } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Contanier from '@/app/portfolio-components/Contanier'
import Navbar from '@/app/portfolio-components/Navbar'
import { BLOG_POSTS, getBlogPost } from '../blogData'
import { SITE_URL } from '@/app/portfolio-components/site'

type BlogPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) return { title: 'Article not found | Aryan' }

  return {
    title: `${post.title} | Aryan`,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/blogs/${post.slug}`,
      siteName: 'Aryan’s Portfolio',
      title: post.title,
      description: post.excerpt,
      locale: 'en_IN',
      ...(post.image ? { images: [post.image] } : {}),
    },
    twitter: {
      card: post.image ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.excerpt,
      ...(post.image ? { images: [post.image] } : {}),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) notFound()

  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/blogs/${post.slug}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Writing',
            item: `${SITE_URL}/blogs`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: `${SITE_URL}/blogs/${post.slug}`,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/blogs/${post.slug}#article`,
        headline: post.title,
        description: post.excerpt,
        articleSection: post.category,
        inLanguage: 'en',
        author: { '@id': `${SITE_URL}/#aryan` },
        publisher: { '@id': `${SITE_URL}/#aryan` },
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blogs/${post.slug}`,
        },
        ...(post.image ? { image: post.image } : {}),
      },
    ],
  }
  const safeArticleSchema = JSON.stringify(articleSchema).replace(
    /</g,
    '\\u003c',
  )

  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <article className="px-6 pt-8 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeArticleSchema }}
          />
          <div className="mx-auto max-w-3xl">
            <nav aria-label="Breadcrumb" className="mb-6">
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
                    href="/blogs"
                    className="hover:text-foreground transition-colors"
                  >
                    Writing
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-foreground" aria-current="page">
                  {post.title}
                </li>
              </ol>
            </nav>

            <header className="mx-auto mt-8 mb-7 max-w-2xl sm:mt-10 sm:mb-9">
              <p className="text-muted text-[10px] font-medium tracking-[0.16em] uppercase">
                {post.category}
              </p>
              <h1 className="font-display mt-3 text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-[2.75rem]">
                {post.title}
              </h1>
              <p className="text-muted mt-4 text-base leading-7 sm:text-lg">
                {post.excerpt}
              </p>
              <div className="text-muted mt-5 flex items-center gap-2 text-[11px]">
                <Link
                  href="/"
                  className="text-foreground hover:text-muted font-medium transition-colors"
                >
                  Aryan <span className="text-muted">(@istmX)</span>
                </Link>
                <span aria-hidden="true">·</span>
                <span>{post.readTime}</span>
              </div>
            </header>

            {post.image && (
              <figure className="mx-auto mb-9 max-w-3xl">
                <div className="border-border/50 bg-surface/25 relative aspect-[16/8] overflow-hidden rounded-[18px] border sm:aspect-[16/7]">
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? ''}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                </div>
              </figure>
            )}

            <div className="mx-auto max-w-2xl">
              {post.sections.map((section, index) => (
                <section
                  key={section.heading}
                  className={index === 0 ? '' : 'mt-8 sm:mt-10'}
                >
                  <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-foreground/80 mt-3 text-sm leading-7 sm:text-base sm:leading-8"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.points && (
                    <ul className="text-foreground/80 marker:text-muted mt-4 space-y-2 pl-5 text-sm leading-7 sm:text-base sm:leading-8">
                      {section.points.map((point) => (
                        <li key={point} className="list-disc">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              <div className="border-border/50 mt-10 border-t pt-5">
                <Link
                  href="/blogs"
                  className="text-muted hover:text-foreground focus-visible:outline-foreground inline-flex items-center gap-2 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-3"
                >
                  <IconArrowLeft size={14} stroke={1.7} aria-hidden="true" />{' '}
                  Back to all articles
                </Link>
              </div>
            </div>
          </div>
        </article>
      </Contanier>
    </main>
  )
}
