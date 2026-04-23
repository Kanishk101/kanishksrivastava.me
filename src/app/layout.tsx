import type { Metadata } from "next";
import { Cormorant_Garamond, Syne, Outfit } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

/* ─── Font Configuration ─── */

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-outfit",
  display: "swap",
});

/* ─── Metadata ─── */

export const metadata: Metadata = {
  title: "Kanishk Srivastava — Full-Stack & iOS Engineer",
  description:
    "Portfolio of Kanishk Srivastava, a creative technologist building at the intersection of engineering and design.",
  metadataBase: new URL("https://kanishksrivastava.me"),
  openGraph: {
    title: "Kanishk Srivastava — Full-Stack & iOS Engineer",
    description:
      "Portfolio of Kanishk Srivastava, a creative technologist building at the intersection of engineering and design.",
    url: "https://kanishksrivastava.me",
    siteName: "Kanishk Srivastava",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kanishk Srivastava — Full-Stack & iOS Engineer",
    description:
      "Portfolio of Kanishk Srivastava, a creative technologist building at the intersection of engineering and design.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ─── Root Layout ─── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${syne.variable} ${outfit.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
