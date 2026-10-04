import type { MetadataRoute } from 'next'
import { SITE_URL } from '../lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    // Explicitly permit search and retrieval crawlers that honor per-agent groups.
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Claude-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
