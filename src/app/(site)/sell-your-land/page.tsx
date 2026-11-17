import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, HandCoins, Handshake, Mountain, PenLine, Search, Send, UserCheck } from "lucide-react";
import { SectionHeading } from "@/components/sections";
import { SellLandForm } from "@/components/SellLandForm";
import { btnGold, container } from "@/components/ui";

export const metadata: Metadata = {
  title: { absolute: "We Buy Land Across the US – Get an Offer for Your Vacant Land" },
  description:
    "Own land you would like to sell? We buy directly from owners with no agents and no listing fees. We handle due diligence and the ownership transfer.",
  alternates: { canonical: "/sell-your-land" },
};

const WHY = [
  { icon: UserCheck, title: "Direct Buyer", body: "You deal with us, not a middleman." },
  {
    icon: FileCheck2,
    title: "We Handle the Entire Process",
    body: "Due diligence, paperwork and transfer of ownership are all taken care of by us, at our expense. The only exception is a notary, if the seller needs one.",
  },
  {
    icon: Mountain,
    title: "Any Type of Land",
    body: "Vacant, rural, inherited or hard to reach: send it over and we will take a look.",
  },
  {
    icon: Handshake,
    title: "A Fair Offer, No Pressure",
    body: "Share your property details and, if the property passes our review, receive an offer with no obligation. You decide if it works for you.",
  },
] as const;

const STEPS = [
  { icon: Send, title: "Tell Us About Your Land", body: "Send the location, parcel number (APN) and anything we should know." },
  { icon: Search, title: "We Review Your Property", body: "We go over the details and complete our due diligence." },
  {
    icon: HandCoins,
    title: "Receive Your Offer",
    body: "If the property passes our due diligence, we send you an offer. Payment is made either in installments or in cash.",
  },
  { icon: PenLine, title: "Agree and Sign", body: "If you are happy with the offer, we send a simple purchase agreement." },
  {
    icon: FileCheck2,
    title: "We Do the Rest",
    body: "We complete the paperwork and the ownership transfer. You receive your payment.",
  },
] as const;

const FAQ = [
  {
    q: "Do I pay any fees to sell to you?",
    a: "No agent commissions or listing fees. We cover due diligence and the ownership transfer. A notary is the only possible cost, if you need one.",
  },
  {
    q: "Will I always get an offer?",
    a: "We review each property first. We send an offer only if the property passes our due diligence.",
  },
  {
    q: "How do I get paid?",
    a: "Payment is made immediately, as soon as ownership of the land has been transferred to us. We never pay before the transfer is complete.",
  },
] as const;

export default function SellYourLandPage() {
  return (
    <>
      <section className="bg-sage-pale">
        <div className={`${container} py-14 text-center sm:py-20`}>
          <h1 className="text-balance text-4xl sm:text-5xl">Own Land You Would Like to Sell? Let&apos;s Talk.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/85">
            We buy land directly from owners. No agents, no listing fees, and no waiting around for a buyer. Tell
            us about your property and we will get back to you.
          </p>
          <div className="mt-8">
            <a href="#offer-form" className={btnGold}>
              Request My Offer
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20" aria-labelledby="why-sell-heading">
        <div className={container}>
          <SectionHeading>
            <span id="why-sell-heading">Why Sell to Us</span>
          </SectionHeading>
          <ul className="grid gap-6 sm:grid-cols-2">
            {WHY.map((w) => {
              const Icon = w.icon;
              return (
                <li key={w.title} className="flex gap-5 rounded-xl border border-line bg-white p-7">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-olive">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="mb-2 text-xl">{w.title}</h3>
                    <p className="text-ink/85">{w.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-sand-soft py-16 sm:py-20" aria-labelledby="sell-how-heading">
        <div className={container}>
          <SectionHeading>
            <span id="sell-how-heading">How It Works</span>
          </SectionHeading>
          <ol className="mx-auto grid max-w-4xl gap-5">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="flex gap-5 rounded-xl bg-white p-5 shadow-sm sm:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sage-deep text-white">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-lg">
                      <span className="text-gold-dark">{i + 1}.</span> {s.title}
                    </h3>
                    <p className="mt-1 text-ink/85">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="offer-form" className="scroll-mt-24 py-16 sm:py-20" aria-labelledby="offer-heading">
        <div className={`${container} max-w-3xl`}>
          <SectionHeading>
            <span id="offer-heading">Request My Offer</span>
          </SectionHeading>
          <SellLandForm />
        </div>
      </section>

      <section className="bg-sage-pale py-16 sm:py-20" aria-labelledby="seller-faq-heading">
        <div className={`${container} max-w-3xl`}>
          <SectionHeading>
            <span id="seller-faq-heading">Questions From Sellers</span>
          </SectionHeading>
          <dl className="grid gap-6">
            {FAQ.map((f) => (
              <div key={f.q} className="rounded-xl bg-white p-6">
                <dt className="text-lg font-bold text-navy">{f.q}</dt>
                <dd className="mt-2 text-ink/85">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 text-center">
            <Link href="/contact" className="font-semibold text-gold-dark underline">
              Have another question? Contact us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
