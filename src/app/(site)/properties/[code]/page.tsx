import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { clsx } from "clsx";
import { ContactForm } from "@/components/ContactForm";
import { LandscapeArt } from "@/components/LandscapeArt";
import { container } from "@/components/ui";
import { getParcelByCode, getPublishedParcels } from "@/lib/parcels-data";
import {
  formatAcreage,
  formatPrice,
  hasFinancing,
  parcelPath,
  photoUrl,
  STATUS_LABEL,
  type ParcelRow,
} from "@/lib/parcels";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

type Props = { params: Promise<{ code: string }> };

export async function generateStaticParams() {
  const parcels = await getPublishedParcels();
  return parcels.map((p) => ({ code: p.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const parcel = await getParcelByCode(decodeURIComponent(code));
  if (!parcel) return { title: "Property not found", robots: { index: false } };
  const description = `${formatAcreage(parcel.acreage)} in ${parcel.county}, ${parcel.state} for ${formatPrice(parcel.price)}. ${parcel.description}`.slice(0, 200);
  return {
    title: parcel.name,
    description,
    alternates: { canonical: parcelPath(parcel.code) },
    openGraph: {
      title: parcel.name,
      description,
      url: parcelPath(parcel.code),
      images: parcel.photos[0] ? [{ url: photoUrl(parcel.photos[0]) }] : undefined,
    },
  };
}

const PILL: Record<ParcelRow["status"], string> = {
  for_sale: "bg-sand text-olive",
  under_contract: "bg-white text-olive border border-line",
  sold: "bg-copper text-white",
};

export default async function ParcelPage({ params }: Props) {
  const { code } = await params;
  const parcel = await getParcelByCode(decodeURIComponent(code));
  if (!parcel) notFound();

  const [cover, ...rest] = parcel.photos;
  const sold = parcel.status === "sold";
  const facts: [string, string | null][] = [
    ["Listing code", parcel.code],
    ["Acreage", formatAcreage(parcel.acreage)],
    ["Location", `${parcel.county}, ${parcel.state}`],
    ["Address / road", parcel.address],
    ["APN / parcel ID", parcel.apn],
    ["Zoning", parcel.zoning],
    ["Utilities", parcel.utilities],
    ["Road access", parcel.road_access],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: parcel.name,
    description: parcel.description || `${formatAcreage(parcel.acreage)} in ${parcel.county}, ${parcel.state}`,
    sku: parcel.code,
    image: parcel.photos.map(photoUrl),
    offers: {
      "@type": "Offer",
      price: parcel.price,
      priceCurrency: "USD",
      availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url: `${SITE.url}${parcelPath(parcel.code)}`,
    },
  };

  return (
    <div className={`${container} py-8 sm:py-12`}>
      <Link href="/properties" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-sage-deep hover:text-gold-dark">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All properties
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand-soft">
            {cover ? (
              <Image
                src={photoUrl(cover)}
                alt={`${parcel.name}: main photo`}
                fill
                priority
                sizes="(min-width: 1024px) 700px, 100vw"
                className="object-cover"
              />
            ) : (
              <LandscapeArt variant={0} className="h-full w-full" />
            )}
          </div>
          {rest.length > 0 ? (
            <ul className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {rest.map((path, i) => (
                <li key={path} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand-soft">
                  <Image
                    src={photoUrl(path)}
                    alt={`${parcel.name}: photo ${i + 2}`}
                    fill
                    sizes="(min-width: 640px) 170px, 33vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          ) : null}

          {parcel.description ? (
            <section className="mt-10" aria-labelledby="about-heading">
              <h2 id="about-heading" className="mb-3 text-2xl">
                About this property
              </h2>
              <p className="whitespace-pre-line text-ink/90">{parcel.description}</p>
            </section>
          ) : null}

          <section className="mt-10" aria-labelledby="facts-heading">
            <h2 id="facts-heading" className="mb-3 text-2xl">
              Property details
            </h2>
            <dl className="divide-y divide-line rounded-xl border border-line">
              {facts
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 px-4 py-3 text-[16px] sm:grid-cols-[12rem_1fr]">
                    <dt className="font-bold text-sage-deep">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            {parcel.latitude != null && parcel.longitude != null ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${parcel.latitude},${parcel.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sage-deep underline hover:text-gold-dark"
              >
                View location on Google Maps
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl bg-sage-pale p-6">
            <span
              className={clsx(
                "inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase",
                PILL[parcel.status],
              )}
            >
              {STATUS_LABEL[parcel.status]}
            </span>
            <h1 className="mt-3 text-2xl leading-snug sm:text-3xl">{parcel.name}</h1>
            <p className={clsx("mt-3 text-4xl font-bold", sold ? "text-olive/50 line-through" : "text-sage-deep")}>
              {formatPrice(parcel.price)}
            </p>
            {parcel.badges.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {parcel.badges.map((b) => (
                  <li key={b} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-sage-deep">
                    {b}
                  </li>
                ))}
              </ul>
            ) : null}

            {hasFinancing(parcel) ? (
              <div className="mt-5 rounded-lg bg-white p-4">
                <h2 className="mb-2 text-base">Financing available</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[15px]">
                  {parcel.down_payment != null ? (
                    <>
                      <dt className="text-ink/70">Down payment</dt>
                      <dd className="text-right font-bold">{formatPrice(parcel.down_payment)}</dd>
                    </>
                  ) : null}
                  {parcel.monthly_payment != null ? (
                    <>
                      <dt className="text-ink/70">Monthly payment</dt>
                      <dd className="text-right font-bold">{formatPrice(parcel.monthly_payment)}</dd>
                    </>
                  ) : null}
                  {parcel.term_months != null ? (
                    <>
                      <dt className="text-ink/70">Term</dt>
                      <dd className="text-right font-bold">{parcel.term_months} months</dd>
                    </>
                  ) : null}
                  {parcel.interest_rate != null ? (
                    <>
                      <dt className="text-ink/70">Interest rate (APR)</dt>
                      <dd className="text-right font-bold">{parcel.interest_rate}%</dd>
                    </>
                  ) : null}
                </dl>
                <p className="mt-3 text-xs text-ink/70">
                  Terms are shown for illustration. Final terms are set out in the written purchase agreement.
                </p>
              </div>
            ) : null}
          </div>

          <div className="rounded-xl border border-line p-6">
            <h2 className="mb-1 text-xl">{sold ? "Looking for something similar?" : "Interested in this property?"}</h2>
            <p className="mb-5 text-[15px] text-ink/80">
              {sold
                ? "This one is sold, but we may have similar land. Send us a note."
                : "Send us your questions, or call "}
              {!sold ? (
                <a href={SITE.phoneHref} className="font-bold text-sage-deep underline">
                  {SITE.phone}
                </a>
              ) : null}
              {!sold ? "." : null}
            </p>
            <ContactForm variant="parcel" parcel={{ code: parcel.code, name: parcel.name }} />
          </div>
        </aside>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
