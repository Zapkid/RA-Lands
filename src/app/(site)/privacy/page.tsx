import type { Metadata } from "next";
import { PageHeader } from "@/components/sections";
import { container } from "@/components/ui";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy & Terms",
  description: "How RA Land Investments LLC handles your information and the terms of using this website.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "November 16, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy & Terms" intro={`Last updated ${UPDATED}`} />
      <section className="py-14 sm:py-16">
        <div className={`${container} mx-auto max-w-3xl space-y-6 text-[17px] text-ink/90 [&_h2]:mt-10 [&_h2]:text-2xl [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5`}>
          <h2>Who we are</h2>
          <p>
            This website is operated by {SITE.name}. You can reach us at{" "}
            <a className="font-bold text-sage-deep underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>{" "}
            or {SITE.phone}.
          </p>

          <h2>Information we collect</h2>
          <p>We only collect what you choose to send us through our forms:</p>
          <ul>
            <li>Consultation and property inquiry forms: your name, email, optional phone number, and your message.</li>
            <li>Newsletter signup: your email address.</li>
          </ul>
          <p>
            Form submissions are delivered to us by email. We use them to reply to you and, for the newsletter, to
            tell you when new properties are available. We do not sell your information.
          </p>

          <h2>Cookies and tracking</h2>
          <p>
            The public pages of this site set no cookies of their own and load no analytics, advertising or social
            media scripts. The only cookie is a sign-in session for the site owner on the private admin page.
          </p>

          <h2>Service providers</h2>
          <ul>
            <li>Supabase hosts our listing data and property photos.</li>
            <li>Our email provider delivers form submissions to us.</li>
            <li>Vercel hosts the website.</li>
            <li>Property pages may link to Google Maps; following that link is governed by Google&apos;s policies.</li>
          </ul>

          <h2>Your choices</h2>
          <p>
            You can ask us to see, correct or delete the information you sent us, or to remove you from the
            newsletter, by emailing {SITE.email}. Every newsletter message can also be answered with
            &quot;unsubscribe&quot;.
          </p>

          <h2>Terms of use</h2>
          <ul>
            <li>
              Listings, prices, acreage, availability and financing terms are provided for information and may
              change or contain errors. Nothing on this site is an offer until it is set out in a signed written
              agreement.
            </li>
            <li>
              Advisory information is general in nature and does not replace legal, tax, surveying or engineering
              advice for your situation.
            </li>
            <li>Please do not misuse the site, attempt to disrupt it, or submit information that is not yours.</li>
          </ul>

          <h2>Changes</h2>
          <p>We may update this page. The date at the top shows when it last changed.</p>
        </div>
      </section>
    </>
  );
}
