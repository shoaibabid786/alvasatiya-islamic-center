import type { Metadata } from "next";
import { Poppins, Amiri } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/layout/SiteShell";
import JsonLd from "@/components/seo/JsonLd";
import FirebaseAnalytics from "@/components/seo/FirebaseAnalytics";
import { SITE } from "@/data/site";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Quran Learning, Islamic Education & Community Service`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  referrer: "origin-when-cross-origin",
  formatDetection: { telephone: true, email: true },
  icons: {
    icon: SITE.logo,
    apple: SITE.logo,
  },
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
    type: "website",
    images: [{ url: SITE.logo, alt: `${SITE.name} official logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    images: [SITE.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  other: {
    "ai-content-declaration": "This website publishes educational Islamic content for Alvasatiya Islamic Center.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${amiri.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col antialiased">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <FirebaseAnalytics />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
