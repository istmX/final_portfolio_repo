import Navbar from "./components/Navbar";
import Contanier from "./components/Contanier";
import IntroHero from "./components/IntroHero";
import SocialLinks from "./components/SocialLinks";
import ClickSparks from "./components/ClickSparks";
import ScrollBlur from "./components/ScrollBlur";
import PixelCat from "./components/PixelCat";
import ProjectsSection from "./components/ProjectsSection";
import TechStackSection from "./components/TechStackSection";
import GitHubContributions from "./components/GitHubContributions";
import BlogsSection from "./components/BlogsSection";
import ClosingNote from "./components/ClosingNote";

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
      <footer className="mx-auto w-full max-w-3xl border-t border-border/40 bg-surface/10 px-8 py-5 text-[10px] text-muted">
        <div className="flex items-center justify-between">
          <span className="font-medium tracking-[0.14em]">istmX</span>
          <a href="#top" className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-foreground">Back to top ↑</a>
        </div>
      </footer>
      <ClickSparks />
      <ScrollBlur />
      <PixelCat />
    </>
  );
}
