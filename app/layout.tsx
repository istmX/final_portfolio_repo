import type { Metadata } from "next";
import Script from "next/script";
import { Schibsted_Grotesk, Inter } from "next/font/google";
import PortfolioPreloader from "../components/PortfolioPreloader";
import { SITE_URL } from "../lib/site";
import "./globals.css";

const Grotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const InterFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Aryan | AI Developer & Full-Stack Builder",
  description:
    "Aryan is an AI developer and full-stack builder from India creating AI agents, Python and FastAPI backends, web products, and mobile apps.",
  applicationName: "Aryan’s Portfolio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Aryan’s Portfolio",
    title: "Aryan | AI Developer & Full-Stack Builder",
    description: "AI developer and full-stack builder from India working across agents, Python backends, web, and mobile.",
    locale: "en_IN",
    images: [{ url: "/hero.png", width: 1536, height: 1536, alt: "Aryan, AI developer and full-stack builder" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aryan | AI Developer & Full-Stack Builder",
    description: "AI developer and full-stack builder from India working across agents, Python backends, web, and mobile.",
    images: ["/hero.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  keywords: [
    "Aryan",
    "AI developer",
    "full-stack developer",
    "AI agents",
    "multi-agent systems",
    "Crew",
    "CodeCat",
    "Noiseless",
    "Python developer",
    "FastAPI developer",
    "React Native developer",
    "mobile app development",
    "India",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${Grotesk.variable} ${InterFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <PortfolioPreloader />
        {children}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try { var savedTheme = localStorage.getItem('istmx-theme'); if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme; } catch (_) {}`}
        </Script>
      </body>
    </html>
  );
}
