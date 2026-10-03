import type { Metadata } from "next";
import Script from "next/script";
import { Schibsted_Grotesk, Inter } from "next/font/google";
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
  title: "Aryan | AI Developer & Full-Stack Builder",
  description:
    "I’m Aryan, an AI developer from India building full-stack products and agent systems that can reason, use tools, and get real work done.",
  applicationName: "Aryan’s Portfolio",
  keywords: [
    "Aryan",
    "AI developer",
    "full-stack developer",
    "AI agents",
    "multi-agent systems",
    "Crew",
    "CodeCat",
    "Noiseless",
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
        {children}
        <Script id="theme-init" strategy="beforeInteractive">
          {`try { var savedTheme = localStorage.getItem('istmx-theme'); if (savedTheme === 'light' || savedTheme === 'dark') document.documentElement.dataset.theme = savedTheme; } catch (_) {}`}
        </Script>
      </body>
    </html>
  );
}
