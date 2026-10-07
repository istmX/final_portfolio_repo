import Navbar from '@/app/portfolio-components/Navbar'
import Contanier from '@/app/portfolio-components/Contanier'
import IntroHero from '@/app/portfolio-components/IntroHero'
import ComponentsSpotlight from '@/app/portfolio-components/ComponentsSpotlight'
import SocialLinks from '@/app/portfolio-components/SocialLinks'
import ClickSparks from '@/app/portfolio-components/ClickSparks'
import ScrollBlur from '@/app/portfolio-components/ScrollBlur'
import PixelCat from '@/app/portfolio-components/PixelCat'
import ProjectsSection from '@/app/portfolio-components/ProjectsSection'
import TechStackSection from '@/app/portfolio-components/TechStackSection'
import GitHubContributions from '@/app/portfolio-components/GitHubContributions'
import BlogsSection from '@/app/portfolio-components/BlogsSection'
import ClosingNote from '@/app/portfolio-components/ClosingNote'
import PortfolioFooter from '@/app/portfolio-components/PortfolioFooter'
import { SITE_URL } from '@/app/portfolio-components/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
  description:
    'Aryan, also known as aryanonai, is a developer and student in India building AI agents, full-stack products, and ISTMX, a source-first React component library.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    siteName: 'Aryan’s Portfolio',
    title: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
    description:
      'Meet Aryan, also known as aryanonai: a developer and student building AI agents, software products, and the ISTMX component library.',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aryan (@aryanonai) | AI Developer & ISTMX Creator',
    description:
      'Aryan builds AI agents, full-stack products, and the source-first ISTMX component library.',
  },
}

const personId = `${SITE_URL}/#aryan`
const websiteId = `${SITE_URL}/#website`
const istmxId = `${SITE_URL}/#istmx`
const homeSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profile`,
      url: SITE_URL,
      name: 'Aryan (@aryanonai) — AI developer and ISTMX creator',
      mainEntity: { '@id': personId },
      isPartOf: { '@id': websiteId },
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: 'Aryan',
      alternateName: ['aryanonai', 'istmX'],
      identifier: {
        '@type': 'PropertyValue',
        name: 'Developer handle',
        value: 'istmX',
      },
      url: SITE_URL,
      image: `${SITE_URL}/hero.png`,
      jobTitle: 'AI Engineer and Developer',
      description:
        'Aryan, also known as aryanonai, is a developer and student in India building AI agents, full-stack products, and open-source software.',
      sameAs: [
        'https://github.com/istmX',
        'https://www.linkedin.com/in/aryan-xf/',
        'https://x.com/Istm_x',
      ],
      knowsAbout: [
        'Artificial intelligence',
        'AI agents',
        'Python',
        'FastAPI',
        'TypeScript',
        'React',
        'Next.js',
        'React Native',
      ],
      creator: { '@id': istmxId },
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: SITE_URL,
      name: 'Aryan’s Portfolio and ISTMX',
      alternateName: 'aryanonai portfolio',
      inLanguage: 'en',
      about: { '@id': personId },
      publisher: { '@id': personId },
    },
    {
      '@type': 'CreativeWork',
      '@id': istmxId,
      name: 'ISTMX',
      description:
        'ISTMX is a developer ecosystem created by Aryan, known online as aryanonai and using the developer handle istmX. Its projects include ISTMX Skills, ISTMX UI, and the ISTMX component library.',
      url: `${SITE_URL}/library`,
      author: { '@id': personId },
      isPartOf: { '@id': websiteId },
      hasPart: [
        {
          '@type': 'SoftwareSourceCode',
          name: 'ISTMX Skills',
          url: 'https://istmx.dpdns.org/',
          codeRepository: 'https://github.com/istmX/skills',
          author: { '@id': personId },
        },
        {
          '@type': 'SoftwareSourceCode',
          name: 'ISTMX UI',
          url: 'https://www.npmjs.com/package/@istmx/ui',
          codeRepository: 'https://github.com/istmX/final_portfolio_repo',
          author: { '@id': personId },
        },
        {
          '@type': 'CollectionPage',
          name: 'ISTMX Library',
          url: `${SITE_URL}/library`,
          creator: { '@id': personId },
        },
      ],
    },
  ],
}
const safeHomeSchema = JSON.stringify(homeSchema).replace(/</g, '\\u003c')

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeHomeSchema }}
      />
      <main id="top" className="min-h-dvh">
        <Contanier>
          <Navbar />
          <IntroHero />
          <SocialLinks />
          <TechStackSection />
          <GitHubContributions />
          <ComponentsSpotlight />
          <ProjectsSection />
          <BlogsSection />
          <ClosingNote />
        </Contanier>
      </main>
      <PortfolioFooter />
      <ClickSparks />
      <ScrollBlur />
      <PixelCat />
    </>
  )
}
