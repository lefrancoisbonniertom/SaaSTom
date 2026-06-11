import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/session-provider";
import { LoadingScreen } from "@/components/loading-screen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = "https://orfeo.digitaleweb.fr";
const title = "Orfeo | Copilote IA pour freelances et independants";
const description =
  "Orfeo centralise tes clients, genere tes documents (devis, relances, propositions) avec l'IA et garde ton pipeline a jour.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "CRM freelance",
    "copilote IA",
    "gestion clients indépendant",
    "génération de devis IA",
    "relances automatiques",
  ],
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Orfeo",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <LoadingScreen />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
