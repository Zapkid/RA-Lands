import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import { Maximize2, MapPin, MapPinned } from "lucide-react";
import { LandscapeArt } from "./LandscapeArt";
import {
  formatAcreage,
  formatPrice,
  hasFinancing,
  parcelPath,
  photoUrl,
  STATUS_LABEL,
  type ParcelRow,
} from "@/lib/parcels";

const PILL: Record<ParcelRow["status"], string> = {
  for_sale: "bg-sand text-olive",
  under_contract: "bg-white text-olive",
  sold: "bg-copper text-white",
};

/** One listing in the grid. The whole card is a single link via the title. */
export function ParcelCard({ parcel, index = 0 }: { parcel: ParcelRow; index?: number }) {
  const cover = parcel.photos[0];
  const sold = parcel.status === "sold";

  return (
    <article className="group relative flex w-full flex-col rounded-[10px] bg-sage-pale p-2.5 shadow-[0_0_10px_rgba(85,101,74,0.25)] transition-transform duration-200 focus-within:-translate-y-1 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand-soft">
        {cover ? (
          <Image
            src={photoUrl(cover)}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className={clsx("object-cover", sold && "grayscale-[40%]")}
          />
        ) : (
          <LandscapeArt variant={index} className="h-full w-full" />
        )}
        <span
          className={clsx(
            "absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide shadow",
            PILL[parcel.status],
          )}
        >
          {STATUS_LABEL[parcel.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 pt-4">
        <h3 className="border-b border-sage-deep pb-2.5 text-[17px] leading-snug font-bold !text-sage-deep">
          <Link
            href={parcelPath(parcel.code)}
            className="after:absolute after:inset-0 after:rounded-[10px] focus-visible:after:outline-3 focus-visible:after:outline-gold"
          >
            {parcel.name}
          </Link>
        </h3>

        <ul className="flex flex-col gap-1.5 text-[15px] font-semibold text-sage-deep">
          <li className="flex items-center gap-2.5">
            <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {formatAcreage(parcel.acreage)}
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {parcel.state}
          </li>
          <li className="flex items-center gap-2.5">
            <MapPinned className="h-4 w-4 shrink-0" aria-hidden="true" />
            {parcel.county}
          </li>
        </ul>

        <div className="mt-auto pt-2">
          <span
            className={clsx(
              "block rounded-md py-3 text-center text-lg font-bold transition-colors",
              sold
                ? "bg-line text-olive/70 line-through"
                : "bg-sage-deep text-white group-hover:bg-gold group-hover:text-olive",
            )}
          >
            {formatPrice(parcel.price)}
          </span>
          {hasFinancing(parcel) && parcel.monthly_payment ? (
            <p className="mt-2 text-center text-sm font-semibold text-olive/80">
              Financing from {formatPrice(parcel.monthly_payment)}/mo
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
