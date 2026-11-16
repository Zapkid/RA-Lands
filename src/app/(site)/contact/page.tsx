import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/sections";
import { container } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, email or send a message to ask about a property or request a land advisory consultation.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="Contact Us"
        intro="Ask about a property or request a consultation. With the right advice, you can plan and build with confidence."
      />
      <section className="py-14 sm:py-16">
        <div className={`${container} grid gap-10 lg:grid-cols-[1fr_1.6fr]`}>
          <div className="space-y-6">
            <h2 className="text-3xl">Get in touch</h2>
            <p className="text-ink/85">
              Call or email to explore your options, or send the form and we will get back to you.
            </p>
            <ul className="space-y-4 text-lg">
              <li>
                <a href={SITE.phoneHref} className="flex items-center gap-3 font-bold text-navy hover:text-gold-dark">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage-pale text-sage-deep">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-3 font-bold break-all text-navy hover:text-gold-dark"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-pale text-sage-deep">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>
          <div className="rounded-xl bg-sage-pale p-6 sm:p-8">
            <h2 className="mb-5 text-2xl">Request a consultation</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
