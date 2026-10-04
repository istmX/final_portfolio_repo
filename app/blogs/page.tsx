import type { Metadata } from 'next'
import Contanier from '../../components/Contanier'
import Navbar from '../../components/Navbar'
import BlogPostCard from '../../components/BlogPostCard'
import { BLOG_POSTS } from './blogData'

export const metadata: Metadata = {
  title: 'Writing | Aryan',
  description: 'Articles and notes on AI agents, developer tools, and building useful software.',
}

export default function BlogsPage() {
  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <section aria-labelledby="all-blogs-heading" className="px-8 pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="mb-7 max-w-2xl sm:mb-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">Writing &amp; ideas · {String(BLOG_POSTS.length).padStart(2, '0')} articles</p>
            <h1 id="all-blogs-heading" className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Notes from the workbench</h1>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">
              Field notes on building AI agents that get useful work done, the products around them, and the developer tools I make along the way.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {BLOG_POSTS.map((post, index) => <BlogPostCard key={post.slug} post={post} index={index} />)}
          </div>
        </section>
      </Contanier>
    </main>
  )
}
