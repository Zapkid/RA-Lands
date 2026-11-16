import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { btnGold, btnOutline, container } from "@/components/ui";

// Lives outside the (site) group, so it renders the site chrome itself.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1">
        <section className={`${container} py-24 text-center`}>
          <p className="text-sm font-bold tracking-[0.2em] text-gold-dark uppercase">404</p>
          <h1 className="mt-3 text-4xl">That page could not be found</h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink/80">
            The link may be old, or the property may no longer be listed.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/properties" className={btnGold}>
              View properties
            </Link>
            <Link href="/" className={btnOutline}>
              Go home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
