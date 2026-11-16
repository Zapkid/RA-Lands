import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

/** Public site chrome. The admin lives outside this group and has its own. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-olive"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
