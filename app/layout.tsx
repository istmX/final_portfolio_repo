import type { Metadata } from 'next'
import { Geist_Mono, Schibsted_Grotesk, Inter } from 'next/font/google'
import ScrollToHome from '@/app/portfolio-components/ScrollToHome'
import ThemeInit from '@/app/portfolio-components/ThemeInit'
import { SITE_URL } from '@/app/portfolio-components/site'
import './globals.css'

const Grotesk = Schibsted_Grotesk({
  variable: '--font-schibsted-grotesk',
  subsets: ['latin'],
})

const InterFont = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const GeistMonoFont = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
    template: '%s',
  },
  description:
    'Aryan, also known as istmX, is a developer and student in India building AI agents, full-stack products, and ISTMX, a source-first React component library.',
  applicationName: 'Aryan’s portfolio and ISTMX component library',
  authors: [{ name: 'Aryan', url: SITE_URL }],
  creator: 'Aryan',
  category: 'technology',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Aryan’s Portfolio',
    title: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
    description:
      'Aryan builds AI agents, full-stack products, and ISTMX, a source-first React component library.',
    locale: 'en_IN',
    images: [
      {
        url: '/hero.png',
        width: 1536,
        height: 1536,
        alt: 'Illustrated portrait of Aryan, also known as aryanonai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
    description:
      'Aryan builds AI agents, full-stack products, and ISTMX, a source-first React component library.',
    images: ['/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${Grotesk.variable} ${InterFont.variable} ${GeistMonoFont.variable} h-full scroll-smooth antialiased motion-reduce:scroll-auto`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-secondary flex min-h-full flex-col overflow-x-clip">
        <ThemeInit />
        <ScrollToHome />
        {children}
      </body>
    </html>
  )
}
