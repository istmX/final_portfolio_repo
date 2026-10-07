import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '../blogs/blogData'
import PremiumLink from './PremiumLink'
import ScrollReveal from './ScrollReveal'

export default function BlogPostCard({
  post,
  index = 0,
}: {
  post: BlogPost
  index?: number
}) {
  return (
    <ScrollReveal delay={Math.min(index * 0.045, 0.22)} className="h-full">
      <article className="group border-border/50 bg-surface/15 hover:border-border/80 hover:bg-surface/25 flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border transition-colors">
        <Link
          href={`/blogs/${post.slug}`}
          className="focus-visible:outline-foreground focus-visible:outline-2 focus-visible:outline-offset-[-3px]"
        >
          {post.image ? (
            <div className="border-border/40 bg-surface/30 relative aspect-[16/8] overflow-hidden border-b">
              <Image
                src={post.image}
                alt={post.imageAlt ?? ''}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 700px"
                unoptimized
                className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              />
            </div>
          ) : (
            <div
              aria-hidden="true"
              className="border-border/40 from-surface to-background flex aspect-[16/8] items-end border-b bg-gradient-to-br p-5"
            >
              <span className="text-muted font-mono text-[10px] tracking-[0.16em] uppercase">
                Field note {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium tracking-[0.12em] uppercase">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="font-display mt-2 text-lg leading-snug font-semibold tracking-tight sm:text-xl">
            <Link
              href={`/blogs/${post.slug}`}
              className="hover:text-muted focus-visible:outline-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {post.title}
            </Link>
          </h3>
          <p className="text-muted mt-2 flex-1 text-xs leading-5 sm:text-sm sm:leading-6">
            {post.excerpt}
          </p>
          <PremiumLink href={`/blogs/${post.slug}`} className="mt-4 w-fit">
            Read article
          </PremiumLink>
        </div>
      </article>
    </ScrollReveal>
  )
}
