import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '../app/blogs/blogData'
import PremiumLink from './PremiumLink'

export default function BlogPostCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[18px] border border-border/50 bg-surface/15 transition-colors hover:border-border/80 hover:bg-surface/25">
      <Link href={`/blogs/${post.slug}`} className="focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-foreground">
        {post.image ? (
          <div className="relative aspect-[16/8] overflow-hidden border-b border-border/40 bg-surface/30">
            <Image src={post.image} alt={post.imageAlt ?? ''} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 700px" unoptimized className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
          </div>
        ) : (
          <div aria-hidden="true" className="flex aspect-[16/8] items-end border-b border-border/40 bg-gradient-to-br from-surface to-background p-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Field note {String(index + 1).padStart(2, '0')}</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted">
          <span>{post.category}</span><span aria-hidden="true">·</span><span>{post.readTime}</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          <Link href={`/blogs/${post.slug}`} className="transition-colors hover:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground">{post.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-xs leading-5 text-muted sm:text-sm sm:leading-6">{post.excerpt}</p>
        <PremiumLink href={`/blogs/${post.slug}`} className="mt-4 w-fit">Read article</PremiumLink>
      </div>
    </article>
  )
}
