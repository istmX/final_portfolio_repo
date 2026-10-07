import Navbar from '@/app/portfolio-components/Navbar'
import Contanier from '@/app/portfolio-components/Contanier'
import IntroHero from '@/app/portfolio-components/IntroHero'
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

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aryan',
  url: SITE_URL,
  image: `${SITE_URL}/hero.png`,
  jobTitle: 'AI Developer and Full-Stack Builder',
  description:
    'AI developer and full-stack builder from India creating agent systems, web products, Python backends, and mobile apps.',
  address: { '@type': 'PostalAddress', addressCountry: 'IN' },
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
    'Backend engineering',
    'Mobile app development',
  ],
}
const safePersonSchema = JSON.stringify(personSchema).replace(/</g, '\\u003c')

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safePersonSchema }}
      />
      <main id="top" className="min-h-dvh">
        <Contanier>
          <Navbar />
          <IntroHero />
          <SocialLinks />
          <TechStackSection />
          <GitHubContributions />
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
