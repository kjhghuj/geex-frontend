import type { Metadata } from "next";
import { Inter, Tektur } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import LayoutWrapper from "@/components/LayoutWrapper";
import ExitIntentPopup from "@/components/ExitIntentPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geex-sans",
});

const tektur = Tektur({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-geex-display",
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.geexfans.com";
const socialLinks = (process.env.NEXT_PUBLIC_SOCIAL_LINKS || "")
  .split(",")
  .map((link) => link.trim())
  .filter(Boolean);

export const metadata: Metadata = {
  title: "GEEX | Everyday Electronics for Better Setups",
  description:
    "Shop curated desk setup accessories, office keyboards, gaming peripherals, mobile accessories, and Bluetooth audio at GEEX.",
  keywords: ["electronics", "desk setup", "keyboards", "gaming peripherals", "mobile accessories", "bluetooth earbuds"],
  openGraph: {
    title: "GEEX | Everyday Electronics for Better Setups",
    description:
      "Curated keyboards, peripherals, mobile accessories, and audio gear for cleaner everyday setups.",
    type: "website",
  },
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${tektur.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <div className="flex flex-col min-h-screen font-sans text-near-black bg-cool-white">
            <LayoutWrapper>{children}</LayoutWrapper>
            <ExitIntentPopup />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "GEEX",
                  url: siteUrl,
                  logo: `${siteUrl}/brand/geex-logo-lockup.png`,
                  ...(socialLinks.length ? { sameAs: socialLinks } : {})
                }),
              }}
            />
          </div>
        </Providers>
      </body>
    </html>
  );
}
