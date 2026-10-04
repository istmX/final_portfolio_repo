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

export default function Home() {
  return (
    <>
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
