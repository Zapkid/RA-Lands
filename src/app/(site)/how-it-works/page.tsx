import type { Metadata } from "next";
import { CtaBand, HowSteps, PageHeader } from "@/components/sections";
import { container } from "@/components/ui";

export const metadata: Metadata = {
  title: "How It Works",
  description: "From exploring a parcel to receiving your deed: how buying land from RA Land Investments works.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        title="How It Works"
        intro="A simple, transparent process from your first question to the deed in your name."
      />
      <HowSteps />
      <section className="bg-sand-soft py-14 sm:py-16">
        <div className={`${container} mx-auto max-w-3xl space-y-4 text-center text-lg text-ink/90`}>
          <h2 className="text-3xl">Why buy land, and why RA Lands</h2>
          <p>
            Land is a finite resource. It cannot be manufactured or replaced, which makes it a tangible asset for
            many buyers.
          </p>
          <p>
            We focus on simple, transparent land transactions and organized property information, so buyers can
            evaluate an opportunity against their own goals, whether that is recreation, a long-term investment or
            diversifying a portfolio.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
