import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand, PageHeader, Services } from "@/components/sections";
import { btnGold, container } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "RA Land Investments offers carefully selected land and independent advisory for landowners, future builders and investors.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About RA Land Investments"
        intro="Every piece of land has potential. We help you unlock it with clear information and honest advice."
      />
      <section className="py-14 sm:py-16">
        <div className={`${container} grid gap-10 lg:grid-cols-[1.3fr_1fr]`}>
          <div className="space-y-5 text-lg text-ink/90">
            <h2 className="text-3xl">Land ownership shouldn&apos;t be complicated</h2>
            <p>
              RA Land Investments LLC is a land company with two sides. We offer a focused selection of
              properties, and we provide independent land advisory and consulting to landowners, future builders
              and investors who want to understand a parcel before they commit.
            </p>
            <p>
              Because we evaluate land every day, we know the questions worth asking: what can be built, how the
              terrain and access work, where power and water come from, and what the long-term plan should be. We
              share those answers up front so you can decide with confidence.
            </p>
            <p>
              Our goal is clarity. We give you organized property information, straight pricing and a
              pressure-free process, whether you are looking for a private retreat, a future build or a long-term
              hold.
            </p>
            <div className="pt-2">
              <Link href="/properties" className={btnGold}>
                View properties
              </Link>
            </div>
          </div>
          <aside className="rounded-xl bg-sage-pale p-7">
            <h2 className="mb-4 text-2xl">What you can expect</h2>
            <ul className="space-y-3 text-[16px] text-ink/90">
              {[
                "Clear listings with the details that matter",
                "Transparent pricing and financing terms shown upfront",
                "Direct communication with our team",
                "Independent advice on what a parcel can become",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
      <Services />
      <CtaBand />
    </>
  );
}
