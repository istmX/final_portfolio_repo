import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from './blogs/blogData'
import { SITE_URL } from '@/app/portfolio-components/site'
import { LIBRARY_ITEMS } from '@/app/portfolio-components/library/library-items'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/library`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/blocks`, changeFrequency: 'monthly', priority: 0.85 },
    ...LIBRARY_ITEMS.map((item) => ({
      url: `${SITE_URL}/library/${item.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/blogs`, changeFrequency: 'weekly', priority: 0.8 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: post.featuredOnHome ? 0.75 : 0.6,
    })),
  ]
}
