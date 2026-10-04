import Navbar from "../components/Navbar";
import Contanier from "../components/Contanier";
import IntroHero from "../components/IntroHero";
import SocialLinks from "../components/SocialLinks";
import ClickSparks from "../components/ClickSparks";
import ScrollBlur from "../components/ScrollBlur";
import PixelCat from "../components/PixelCat";
import ProjectsSection from "../components/ProjectsSection";
import TechStackSection from "../components/TechStackSection";
import GitHubContributions from "../components/GitHubContributions";
import BlogsSection from "../components/BlogsSection";
import ClosingNote from "../components/ClosingNote";
import PortfolioFooter from "../components/PortfolioFooter";
import { SITE_URL } from "../lib/site";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aryan",
  url: SITE_URL,
  image: `${SITE_URL}/hero.png`,
  jobTitle: "AI Developer and Full-Stack Builder",
  description: "AI developer and full-stack builder from India creating agent systems, web products, Python backends, and mobile apps.",
  address: { "@type": "PostalAddress", addressCountry: "IN" },
  sameAs: [
    "https://github.com/istmX",
    "https://www.linkedin.com/in/aryan-xf/",
    "https://x.com/Istm_x",
  ],
  knowsAbout: ["Artificial intelligence", "AI agents", "Python", "FastAPI", "TypeScript", "React", "Next.js", "React Native", "Backend engineering", "Mobile app development"],
};
const safePersonSchema = JSON.stringify(personSchema).replace(/</g, "\\u003c");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safePersonSchema }} />
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
  );
}
