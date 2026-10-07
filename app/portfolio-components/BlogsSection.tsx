import Link from 'next/link'
import Image from 'next/image'
import { BLOG_POSTS } from '../blogs/blogData'
import PremiumLink from './PremiumLink'

export default function BlogsSection() {
  const featuredPosts = BLOG_POSTS.filter((post) => post.featuredOnHome).slice(
    0,
    3,
  )

  return (
    <section
      id="blogs"
      aria-labelledby="blogs-heading"
      className="border-border/50 border-b border-dotted px-8 pt-8 pb-14 sm:px-8 sm:pb-16"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-muted text-[10px] font-medium tracking-[0.18em] uppercase">
            Writing &amp; ideas
          </p>
          <h2
            id="blogs-heading"
            className="font-display mt-1 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Notes from the workbench
          </h2>
          <p className="text-muted mt-2 text-xs leading-5 sm:text-sm">
            What I&apos;m learning while building AI agents, products, and tools
            for developers.
          </p>
        </div>
        <PremiumLink href="/blogs">All articles</PremiumLink>
      </div>

      <div className="flex flex-col gap-3">
        {featuredPosts.map((post) => (
          <article
            key={post.slug}
            className="group border-border/55 from-surface/35 via-background/80 to-surface/15 shadow-foreground/[0.04] hover:border-border grid grid-cols-[96px_minmax(0,1fr)] items-center gap-3 rounded-[18px] border bg-gradient-to-br p-2 shadow-sm transition duration-200 hover:-translate-y-px sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-5 sm:p-3"
          >
            <Link
              href={`/blogs/${post.slug}`}
              aria-label={`Read ${post.title}`}
              className="border-border/60 bg-background focus-visible:outline-foreground rounded-[13px] border p-[2px] focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <div className="bg-surface/40 relative aspect-[4/3] overflow-hidden rounded-[10px]">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={post.imageAlt ?? ''}
                    fill
                    sizes="(max-width: 640px) 96px, 190px"
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
            </Link>
            <div className="min-w-0 py-1 pr-1 sm:py-2 sm:pr-3">
              <h3 className="font-display text-sm leading-snug font-semibold tracking-tight sm:text-lg">
                {post.title}
              </h3>
              <p className="text-muted mt-1.5 line-clamp-2 text-[11px] leading-4 sm:mt-2 sm:text-sm sm:leading-6">
                {post.excerpt}
              </p>
              <PremiumLink
                href={`/blogs/${post.slug}`}
                className="mt-2.5 sm:mt-3"
              >
                Read article
              </PremiumLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
