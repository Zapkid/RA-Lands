import Link from "next/link";
import {
  BadgeDollarSign,
  ClipboardCheck,
  Compass,
  FileSignature,
  Handshake,
  KeyRound,
  Landmark,
  Layers,
  Map as MapIcon,
  Mountain,
  Search,
  Sprout,
} from "lucide-react";
import type { ReactNode } from "react";
import { ParcelCard } from "./ParcelCard";
import { btnGold, btnOutline, btnOutlineLight, btnSage, container } from "./ui";
import { getPublishedParcels } from "@/lib/parcels-data";
import { SERVICES } from "@/lib/site";

/** Title band used at the top of inner pages. */
export function PageHeader({ title, intro }: { title: string; intro?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-sage-pale">
      <div className={`${container} relative z-10 py-14 text-center sm:py-20`}>
        <h1 className="text-balance text-4xl sm:text-5xl">{title}</h1>
        {intro ? <p className="mx-auto mt-5 max-w-2xl text-lg text-ink/85">{intro}</p> : null}
      </div>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-16 w-full sm:h-24"
      >
        <path d="M0 60 C240 20 480 30 720 60 S1200 90 1440 50 L1440 120 L0 120Z" fill="#e8dcc2" opacity="0.7" />
        <path d="M0 85 C300 55 560 65 820 88 S1240 100 1440 75 L1440 120 L0 120Z" fill="#c98b5a" opacity="0.45" />
        <path d="M0 105 C300 90 600 95 900 108 S1250 112 1440 100 L1440 120 L0 120Z" fill="#fbf7ee" />
      </svg>
    </section>
  );
}

export function SectionHeading({ children, eyebrow }: { children: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance text-3xl sm:text-4xl">{children}</h2>
    </div>
  );
}

/* ---------- Home hero ---------- */

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 520 440"
      className="mx-auto h-auto w-full max-w-[540px] rounded-3xl shadow-xl"
      role="presentation"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1f3c" />
          <stop offset="0.6" stopColor="#1d3a68" />
          <stop offset="1" stopColor="#c98b5a" />
        </linearGradient>
      </defs>
      <rect width="520" height="440" fill="url(#hero-sky)" />
      <circle cx="380" cy="190" r="58" fill="#f3ead8" opacity="0.95" />
      <path d="M0 250 L90 170 L170 240 L260 150 L360 245 L440 190 L520 250 L520 440 L0 440Z" fill="#12294d" opacity="0.75" />
      <path d="M0 300 C90 260 190 270 280 300 S430 310 520 270 L520 440 L0 440Z" fill="#a0602f" />
      <path d="M0 355 C110 320 210 335 300 358 S440 368 520 340 L520 440 L0 440Z" fill="#e8dcc2" />
      <path d="M0 405 C120 385 230 392 330 405 S460 412 520 398 L520 440 L0 440Z" fill="#f6efe0" />
      <path d="M255 440 C262 400 280 380 320 360" stroke="#a0602f" strokeWidth="3" fill="none" strokeDasharray="8 8" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-sage-pale">
      <div className={`${container} grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2`}>
        <div className="order-2" aria-hidden="true">
          <HeroIllustration />
        </div>

        <div className="order-1">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-gold-dark uppercase">
            Land investments &amp; advisory
          </p>
          <h1 className="text-balance text-4xl sm:text-5xl lg:text-[56px]">
            Your Path to Affordable Land Ownership
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/85">
            RA Land Investments offers carefully selected parcels with transparent pricing and financing options,
            backed by independent advice so you know exactly what you can do with the land.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className={btnGold}>
              View properties
            </Link>
            <Link href="/sell-my-land" className={btnOutline}>
              Sell my land
            </Link>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full sm:h-20"
      >
        <path d="M0 70 C240 30 480 40 720 70 S1200 100 1440 60 L1440 120 L0 120Z" fill="#e8dcc2" opacity="0.7" />
        <path d="M0 98 C300 70 600 78 900 96 S1250 108 1440 90 L1440 120 L0 120Z" fill="#fbf7ee" />
      </svg>
    </section>
  );
}

/* ---------- Featured properties ---------- */

export async function FeaturedProperties() {
  const parcels = await getPublishedParcels();
  const open = parcels.filter((p) => p.status !== "sold");
  const featured = (open.length >= 3 ? open : parcels).slice(0, 3);

  return (
    <section className="py-16 sm:py-20" aria-labelledby="featured-heading">
      <div className={container}>
        <SectionHeading eyebrow="Available now">
          <span id="featured-heading">Featured Properties</span>
        </SectionHeading>
        {featured.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <li key={p.id} className="flex">
                <ParcelCard parcel={p} index={i} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mx-auto max-w-xl text-center text-ink/80">
            New properties are coming soon. Tell us what you are looking for and we will let you know as soon as land is listed.
          </p>
        )}
        <div className="mt-10 text-center">
          <Link href="/properties" className={btnSage}>
            View more properties
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Advisory services ---------- */

const SERVICE_ICONS = [Layers, Mountain, ClipboardCheck];

export function Services() {
  return (
    <section className="bg-sand-soft py-16 sm:py-20" aria-labelledby="services-heading">
      <div className={container}>
        <SectionHeading eyebrow="Independent land advisory">
          <span id="services-heading">Here Is How We Support Your Vision</span>
        </SectionHeading>
        <p className="mx-auto -mt-4 mb-10 max-w-3xl text-center text-lg text-ink/85">
          Land is more than property. It is a blank canvas, and understanding how to use a parcel takes vision,
          expertise and proper research. Our advisory service is open to landowners, future builders and
          investors, whether or not you buy from us.
        </p>
        <ol className="grid gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <li key={s.title} className="rounded-xl bg-white p-7 text-center shadow-sm">
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-olive">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <h3 className="mb-3 text-xl">
                  {i + 1}. {s.title}
                </h3>
                <p className="text-[19px] text-ink/85">{s.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- Why choose ---------- */

const REASONS = [
  {
    icon: BadgeDollarSign,
    title: "Financing Options",
    body: "Selected parcels offer simple monthly payments. The terms are shown on each listing before you ask a question.",
  },
  {
    icon: Search,
    title: "Transparent Pricing",
    body: "The price on the listing is the price we discuss. Details such as acreage, access and zoning are laid out up front.",
  },
  {
    icon: Compass,
    title: "Independent Advice",
    body: "We evaluate land for a living, so we can explain what a parcel is realistically good for, not just what it costs.",
  },
  {
    icon: Handshake,
    title: "Direct, Personal Service",
    body: "You deal with our team directly. Call, email or send a message and a person answers.",
  },
  {
    icon: Sprout,
    title: "Curated Properties",
    body: "A focused selection of land worth your attention rather than an endless list.",
  },
] as const;

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="why-heading">
      <div className={container}>
        <SectionHeading eyebrow="Why choose us">
          <span id="why-heading">Why Choose RA Lands</span>
        </SectionHeading>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <li key={r.title} className="flex gap-4 rounded-xl border border-line bg-white p-6">
              <span className="text-4xl leading-none font-bold text-gold" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mb-1.5 text-lg">{r.title}</h3>
                <p className="text-[19px] text-ink/85">{r.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- How it works ---------- */

const STEPS = [
  {
    icon: MapIcon,
    title: "Explore the Land",
    body: "Browse the available properties and contact us with any questions about location, access, zoning or possible uses.",
  },
  {
    icon: Landmark,
    title: "Choose Your Purchase Option",
    body: "Pay in full or, where a listing offers it, use monthly financing. Terms vary by property and are explained upfront.",
  },
  {
    icon: FileSignature,
    title: "Review & Sign the Agreement",
    body: "We send a clear purchase agreement that sets out the price, payment terms and property details for you to review and sign.",
  },
  {
    icon: ClipboardCheck,
    title: "Paperwork & Payment",
    body: "We handle the required paperwork according to the agreed structure.",
  },
  {
    icon: KeyRound,
    title: "Deed Transfer",
    body: "Once the balance is paid in full, the deed is recorded in your name and delivered for your records.",
  },
] as const;

export function HowSteps({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? "bg-sage-pale py-16 sm:py-20" : "py-16 sm:py-20"} aria-labelledby="how-heading">
      <div className={container}>
        <SectionHeading eyebrow="Simple and clear">
          <span id="how-heading">How It Works</span>
        </SectionHeading>
        <p className="mx-auto -mt-4 mb-10 max-w-2xl text-center text-lg text-ink/85">
          Buying land should be straightforward. Our process keeps every step simple and transparent.
        </p>
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
                  <p className="mt-1 text-[19px] text-ink/85">{s.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        {compact ? (
          <div className="mt-10 text-center">
            <Link href="/how-it-works" className={btnOutline}>
              Learn more
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Closing call to action ---------- */

export function CtaBand() {
  return (
    <section className="bg-olive py-16 text-center text-white sm:py-20">
      <div className={container}>
        <h2 className="text-balance text-3xl !text-white sm:text-4xl">Own Land With Confidence</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Clear listings, fair pricing and a pressure-free process.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/properties" className={btnGold}>
            View available land
          </Link>
          <Link href="/contact" className={btnOutlineLight}>
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
