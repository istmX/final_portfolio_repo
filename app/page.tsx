import Navbar from "./components/Navbar";
import Contanier from "./components/Contanier";
import IntroHero from "./components/IntroHero";
import SocialLinks from "./components/SocialLinks";
import ClickSparks from "./components/ClickSparks";
import ScrollBlur from "./components/ScrollBlur";
import ProjectsSection from "./components/ProjectsSection";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <div aria-hidden="true" className="section-divider mx-4 sm:mx-6" />
        <IntroHero />
        <div aria-hidden="true" className="section-divider mx-4 sm:mx-6" />
        <SocialLinks />
        <div aria-hidden="true" className="section-divider mx-4 sm:mx-6" />
        <ProjectsSection />
      </Contanier>
      <ClickSparks />
      <ScrollBlur />
    </main>
  );
}
