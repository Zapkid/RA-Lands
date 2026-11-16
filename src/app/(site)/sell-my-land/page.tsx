import type { Metadata } from "next";
import { PageHeader } from "@/components/sections";
import { SellLandForm } from "@/components/SellLandForm";
import { container } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sell My Land",
  description: "Tell us about your land and we will get back to you with a fair, no-pressure offer.",
};

export default function SellMyLandPage() {
  return (
    <>
      <PageHeader
        title="Sell My Land"
        intro="Tell us about your property. The more detail you share, the faster we can come back with a fair, no-pressure offer."
      />
      <section className="py-12 sm:py-16">
        <div className={`${container} max-w-3xl`}>
          <SellLandForm />
          <p className="mt-10 text-base text-ink/80">
            Prefer to talk? Call {SITE.phone} or email{" "}
            <a className="font-semibold text-gold-dark underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
