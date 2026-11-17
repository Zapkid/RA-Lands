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
  Receipt,
  Search,
  ShieldCheck,
  Sprout,
  BadgeCheck,
  CalendarClock,
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
            Land you can understand. Support you can trust.
          </p>
          <h1 className="text-balance text-4xl sm:text-5xl lg:text-[56px]">
            Land Ownership, Made Simple and Within Reach
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/85">
            We offer hand-picked parcels at honest prices, with flexible payment options. Every property we list
            is owned directly by us and has passed due diligence. And because we study land for a living, we will
            tell you what a parcel can realistically be used for before you decide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/properties" className={btnGold}>
              Browse Land
            </Link>
            <Link href="/contact" className={btnOutline}>
              Book a Free Consultation
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
          <span id="featured-heading">Land Available Now</span>
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
            Our next listings are on the way. Tell us what you are looking for and we will email you the moment a new parcel goes live.
          </p>
        )}
        <div className="mt-10 text-center">
          <Link href="/properties" className={btnSage}>
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Advisory services ---------- */

const SERVICE_ICONS = [Layers, Mountain, ClipboardCheck];

const PROTECTIONS = [
  {
    icon: ShieldCheck,
    title: "Verified and Owned by Us",
    body: "Every property we show is owned directly by us and has passed full due diligence.",
  },
  {
    icon: CalendarClock,
    title: "Payment Terms That Work for You",
    body: "Choose what suits you best: pay over time, spread across the number of months you want; pay in cash; or use owner financing (a loan directly from us).",
  },
  {
    icon: BadgeCheck,
    title: "A Guarantee on Every Offer",
    body: "Purchases made on a payment plan are backed by a guarantee. If it is not right for you, your money comes back, excluding the documentation fees already paid. Guarantee terms are stated in each offer.",
  },
  {
    icon: Receipt,
    title: "Low, Transparent Documentation Fees",
    body: "Our documentation fee is kept low and is always shared with you before you sign. The amount depends on the property.",
  },
] as const;

export function Vetted() {
  return (
    <section className="bg-sand-soft py-16 sm:py-20" aria-labelledby="vetted-heading">
      <div className={container}>
        <SectionHeading eyebrow="Peace of mind">
          <span id="vetted-heading">Every Parcel Vetted. Every Purchase Protected.</span>
        </SectionHeading>
        <ul className="grid gap-6 sm:grid-cols-2">
          {PROTECTIONS.map((x) => {
            const Icon = x.icon;
            return (
              <li key={x.title} className="flex gap-5 rounded-xl bg-white p-7 shadow-sm">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold text-olive">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="mb-2 text-xl">{x.title}</h3>
                  <p className="text-ink/85">{x.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mx-auto mt-10 max-w-3xl text-center text-lg font-semibold text-navy">
          Plus, independent land advisory for owners, builders and investors, even if you do not buy from us.
        </p>
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="services-heading">
      <div className={container}>
        <SectionHeading eyebrow="Independent land advisory">
          <span id="services-heading">Helping You See What Your Land Can Become</span>
        </SectionHeading>
        <ol className="grid gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = SERVICE_ICONS[i];
            return (
              <li key={s.title} className="rounded-xl border border-line bg-white p-7 text-center shadow-sm">
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-olive">
                  <Icon className="h-8 w-8" aria-hidden="true" />
                </span>
                <h3 className="mb-3 text-xl">{s.title}</h3>
                <p className="text-ink/85">{s.body}</p>
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
    title: "Pay Over Time",
    body: "Spread your payments over the number of months you choose, pay in cash, or use owner financing. The terms are shown before you sign.",
  },
  {
    icon: Search,
    title: "Honest Numbers",
    body: "The listed price is the price we discuss. Size, access and zoning are spelled out before you ever reach out.",
  },
  {
    icon: Compass,
    title: "Expertise You Can Lean On",
    body: "Evaluating land is our daily work. We will tell you what a parcel is realistically suited for, not just what it costs.",
  },
  {
    icon: Handshake,
    title: "A Real Person, Every Time",
    body: "Call, email or message us and you will hear back from our own team, with no call centers and no runaround.",
  },
  {
    icon: Sprout,
    title: "Fewer Listings, Better Land",
    body: "We would rather show you a handful of parcels worth your time than hundreds you have to sort through.",
  },
] as const;

export function WhyChoose() {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="why-heading">
      <div className={container}>
        <SectionHeading eyebrow="Why choose us">
          <span id="why-heading">Why Choose Us</span>
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
    title: "Find Your Parcel",
    body: "Browse our listings and ask us anything about location, access, zoning or intended use.",
  },
  {
    icon: Landmark,
    title: "Choose How You Would Like to Pay",
    body: "Pay in cash, spread your payments over the number of months you prefer, or use owner financing. All terms are explained before you sign.",
  },
  {
    icon: FileSignature,
    title: "Sign Your Agreement",
    body: "You will receive a plain-language agreement with the price, payment terms and property details to read through and sign.",
  },
  {
    icon: ClipboardCheck,
    title: "We Handle the Paperwork",
    body: "Our team takes care of the documents according to the structure you chose.",
  },
  {
    icon: KeyRound,
    title: "The Deed Is Yours",
    body: "Once your final payment is made, the deed is recorded in your name and sent to you.",
  },
] as const;

export function HowSteps({ compact = false }: { compact?: boolean }) {
  return (
    <section className={"py-16 sm:py-20"} aria-labelledby="how-heading">
      <div className={container}>
        <SectionHeading eyebrow="Simple and clear">
          <span id="how-heading">How It Works</span>
        </SectionHeading>
        <p className="mx-auto -mt-4 mb-10 max-w-2xl text-center text-lg text-ink/85">
          Buying land should be simple. Here is how it goes, step by step.
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
              Learn More
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ---------- Sell your land teaser ---------- */

export function SellTeaser() {
  return (
    <section className="bg-sage-pale py-16 text-center sm:py-20" aria-labelledby="sell-teaser-heading">
      <div className={container}>
        <h2 id="sell-teaser-heading" className="text-balance text-3xl sm:text-4xl">
          Own Land You Would Like to Sell? Let&apos;s Talk.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink/85">
          We buy land directly from owners. No agents, no listing fees, and no waiting around for a buyer.
        </p>
        <div className="mt-8">
          <Link href="/sell-your-land" className={btnGold}>
            Sell Us Your Land
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Closing call to action ---------- */

export function CtaBand() {
  return (
    <section className="bg-olive py-16 text-center text-white sm:py-20">
      <div className={container}>
        <h2 className="text-balance text-3xl !text-white sm:text-4xl">Buy Land With Peace of Mind</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Straightforward listings, fair prices, and zero pressure.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/properties" className={btnGold}>
            See Available Land
          </Link>
          <Link href="/contact" className={btnOutlineLight}>
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
}
