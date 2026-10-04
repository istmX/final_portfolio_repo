import Navbar from "./components/Navbar";
import Contanier from "./components/Contanier";
import IntroHero from "./components/IntroHero";
import SocialLinks from "./components/SocialLinks";
import ClickSparks from "./components/ClickSparks";
import ScrollBlur from "./components/ScrollBlur";
import ProjectsSection from "./components/ProjectsSection";
import TechStackSection from "./components/TechStackSection";
import GitHubContributions from "./components/GitHubContributions";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <IntroHero />
        <SocialLinks />
        <TechStackSection />
        <GitHubContributions />
        <ProjectsSection />
      </Contanier>
      <ClickSparks />
      <ScrollBlur />
    </main>
  );
}
