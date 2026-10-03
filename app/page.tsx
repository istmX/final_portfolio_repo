import Navbar from "./components/Navbar";
import Contanier from "./components/Contanier";
import PortfolioBanner from "./components/PortfolioBanner";
import ClickFlowers from "./components/ClickFlowers";

export default function Home() {
  return (
    <main className="min-h-dvh">
      <Contanier>
        <Navbar />
        <PortfolioBanner />
      </Contanier>
      <ClickFlowers />
    </main>
  );
}
