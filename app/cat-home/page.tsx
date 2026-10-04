import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import CatHomeGame from "./CatHomeGame";

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Cat Home | istmX",
  description: "A tiny pixel room where a tiny pixel cat lives.",
  robots: { index: false },
};

export default function CatHomePage() {
  return (
    <div className={`${pixelFont.variable} fixed inset-0 z-[200] bg-[#0a0a0a]`}>
      <CatHomeGame />
    </div>
  );
}
