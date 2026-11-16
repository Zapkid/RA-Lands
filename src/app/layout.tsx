import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE } from "@/lib/site";

const sans = localFont({
  variable: "--font-jakarta",
  src: "../assets/fonts/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  display: "swap",
});

const description =
  "RA Land Investments LLC offers carefully selected parcels with transparent pricing and financing options, plus independent land advisory for landowners, builders and investors.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Affordable Land & Land Advisory`,
    template: `%s | ${SITE.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} | Affordable Land & Land Advisory`,
    description,
    siteName: SITE.name,
    url: "/",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo.jpg", width: 1168, height: 784, alt: `${SITE.name} logo` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Affordable Land & Land Advisory`,
    description,
    images: ["/logo.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2c3128",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo.jpg`,
  email: SITE.email,
  telephone: "+1-984-368-5554",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
