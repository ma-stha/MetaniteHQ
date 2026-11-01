import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

// next/font downloads these at build time and serves them from our own
// domain. No request ever goes to Google from a visitor's browser.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: "variable",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: "variable",
});

export const metadata: Metadata = {
  title: { default: "Metanite HQ", template: "%s | Metanite HQ" },
  description: "Internal operating system for Metanite Marketing.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${bricolage.variable} ${manrope.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
