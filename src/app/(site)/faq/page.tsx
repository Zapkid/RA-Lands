import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CtaBand, PageHeader } from "@/components/sections";
import { container } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about buying land and our advisory service.",
  alternates: { canonical: "/faq" },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "How do I buy a property?",
    a: "Browse the properties, send us your questions from the listing, and we will walk you through the purchase options. You then review and sign a purchase agreement, and the deed is recorded in your name once the balance is paid.",
  },
  {
    q: "Do you offer financing?",
    a: "Selected properties offer monthly payments. When a listing does, its down payment, monthly payment and term are shown on the listing page. Final terms are set out in the written purchase agreement.",
  },
  {
    q: "What information is on each listing?",
    a: "Price, acreage, state and county, and where available the parcel number, zoning, utilities, road access and a map link. If something you need is missing, ask us.",
  },
  {
    q: "Can I get advice on land I already own, or land I'm buying elsewhere?",
    a: "Yes. Our advisory service covers land use and feasibility, terrain and infrastructure, and planning and due diligence for landowners, future builders and investors.",
  },
  {
    q: "How do I get a deal alert when new land is listed?",
    a: "Join the newsletter from the form in the footer of any page. We will email you when new properties become available.",
  },
  {
    q: "How do I contact you?",
    a: `Call ${SITE.phone}, email ${SITE.email}, or use the form on the contact page.`,
  },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <PageHeader title="Frequently Asked Questions" intro="Quick answers about buying land and working with us." />
      <section className="py-14 sm:py-16">
        <div className={`${container} mx-auto max-w-3xl`}>
          <div className="divide-y divide-line rounded-xl border border-line">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold text-navy [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-sage-deep transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 text-[16px] text-ink/90">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-ink/85">
            Still have a question?{" "}
            <Link href="/contact" className="font-bold text-sage-deep underline">
              Contact us
            </Link>
            .
          </p>
        </div>
      </section>
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
