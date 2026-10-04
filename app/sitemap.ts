import type { MetadataRoute } from 'next'
import { BLOG_POSTS } from './blogs/blogData'
import { SITE_URL } from '../lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE_URL}/blogs`, changeFrequency: 'weekly', priority: 0.8 },
    ...BLOG_POSTS.map((post) => ({
      url: `${SITE_URL}/blogs/${post.slug}`,
      changeFrequency: 'monthly' as const,
      priority: post.featuredOnHome ? 0.75 : 0.6,
    })),
  ]
}
