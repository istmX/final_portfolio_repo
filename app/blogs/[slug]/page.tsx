import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Contanier from '../../../components/Contanier'
import Navbar from '../../../components/Navbar'
import { BLOG_POSTS, getBlogPost } from '../blogData'
import { SITE_URL } from '../../../lib/site'

type BlogPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) return { title: 'Article not found | Aryan' }

  return {
    title: `${post.title} | Aryan`,
    description: post.excerpt,
    alternates: { canonical: `/blogs/${post.slug}` },
    keywords: [post.category, 'Aryan', 'AI developer', 'software engineering', 'India'],
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
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    keywords: [post.category, ...post.title.split(' '), 'Aryan', 'AI developer'],
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'Aryan', url: SITE_URL },
    publisher: { '@type': 'Person', name: 'Aryan', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/blogs/${post.slug}`,
    ...(post.image ? { image: post.image } : {}),
  }
  const safeArticleSchema = JSON.stringify(articleSchema).replace(/</g, '\\u003c')

  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <article className="px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeArticleSchema }} />
          <div className="mx-auto max-w-3xl">
            <Link href="/blogs" className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.13em] text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">
              <span aria-hidden="true">←</span> All articles
            </Link>

            <header className="mx-auto mb-7 mt-8 max-w-2xl sm:mb-9 sm:mt-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">{post.category}</p>
              <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">{post.title}</h1>
              <p className="mt-4 text-base leading-7 text-muted sm:text-lg">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-2 text-[11px] text-muted">
                <span className="font-medium text-foreground">Aryan</span><span aria-hidden="true">·</span><span>{post.readTime}</span>
              </div>
            </header>

            {post.image && (
              <figure className="mx-auto mb-9 max-w-3xl">
                <div className="relative aspect-[16/8] overflow-hidden rounded-[18px] border border-border/50 bg-surface/25 sm:aspect-[16/7]">
                  <Image src={post.image} alt={post.imageAlt ?? ''} fill priority sizes="(max-width: 768px) 100vw, 768px" unoptimized className="object-cover" />
                </div>
              </figure>
            )}

            <div className="mx-auto max-w-2xl">
              {post.sections.map((section, index) => (
                <section key={section.heading} className={index === 0 ? '' : 'mt-8 sm:mt-10'}>
                  <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">{section.heading}</h2>
                  {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">{paragraph}</p>)}
                  {section.points && (
                    <ul className="mt-4 space-y-2 pl-5 text-sm leading-7 text-foreground/80 marker:text-muted sm:text-base sm:leading-8">
                      {section.points.map((point) => <li key={point} className="list-disc">{point}</li>)}
                    </ul>
                  )}
                </section>
              ))}
              <div className="mt-10 border-t border-border/50 pt-5">
                <Link href="/blogs" className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">
                  <span aria-hidden="true">←</span> Back to all articles
                </Link>
              </div>
            </div>
          </div>
        </article>
      </Contanier>
    </main>
  )
}
