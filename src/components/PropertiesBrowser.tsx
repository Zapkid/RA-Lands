"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ParcelCard } from "./ParcelCard";
import { btnGold, container } from "./ui";
import {
  ACREAGE_BANDS,
  inBand,
  PRICE_BANDS,
  STATUS_LABEL,
  type ParcelRow,
  type ParcelStatus,
} from "@/lib/parcels";

type Sort = "featured" | "price-asc" | "price-desc" | "acres-desc";

const selectClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[18px] text-ink";

/** Filter bar and grid for the Properties page. The list is small, so it filters in the browser. */
export function PropertiesBrowser({ parcels }: { parcels: ParcelRow[] }) {
  const [state, setState] = useState("");
  const [acreage, setAcreage] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<ParcelStatus | "">("");
  const [sort, setSort] = useState<Sort>("featured");

  const states = useMemo(() => [...new Set(parcels.map((p) => p.state))].sort(), [parcels]);

  const shown = useMemo(() => {
    const acreBand = ACREAGE_BANDS.find((b) => b.id === acreage);
    const priceBand = PRICE_BANDS.find((b) => b.id === price);
    const list = parcels.filter(
      (p) =>
        (!state || p.state === state) &&
        (!status || p.status === status) &&
        inBand(Number(p.acreage), acreBand) &&
        inBand(Number(p.price), priceBand),
    );
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "acres-desc") sorted.sort((a, b) => b.acreage - a.acreage);
    return sorted;
  }, [parcels, state, acreage, price, status, sort]);

  const filtered = Boolean(state || acreage || price || status);

  function reset() {
    setState("");
    setAcreage("");
    setPrice("");
    setStatus("");
    setSort("featured");
  }

  return (
    <div className={`${container} py-10`}>
      <form
        aria-label="Filter properties"
        onSubmit={(e) => e.preventDefault()}
        className="grid gap-4 rounded-xl bg-sage-pale p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <label className="flex flex-col gap-1.5 text-sm font-bold text-sage-deep">
          State
          <select value={state} onChange={(e) => setState(e.target.value)} className={selectClass}>
            <option value="">All states</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-sage-deep">
          Acreage
          <select value={acreage} onChange={(e) => setAcreage(e.target.value)} className={selectClass}>
            <option value="">Any size</option>
            {ACREAGE_BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-sage-deep">
          Price
          <select value={price} onChange={(e) => setPrice(e.target.value)} className={selectClass}>
            <option value="">Any price</option>
            {PRICE_BANDS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-sage-deep">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ParcelStatus | "")}
            className={selectClass}
          >
            <option value="">All</option>
            {(Object.keys(STATUS_LABEL) as ParcelStatus[]).map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-bold text-sage-deep">
          Sort by
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectClass}>
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="acres-desc">Largest first</option>
          </select>
        </label>
      </form>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-[18px] font-semibold text-sage-deep">
          {shown.length} {shown.length === 1 ? "property" : "properties"}
        </p>
        {filtered || sort !== "featured" ? (
          <button type="button" onClick={reset} className="text-sm font-bold text-gold-dark underline">
            Reset filters
          </button>
        ) : null}
      </div>

      {shown.length > 0 ? (
        <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => (
            <li key={p.id} className="flex">
              <ParcelCard parcel={p} index={i} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-sage px-6 py-14 text-center">
          <h2 className="text-2xl">
            {parcels.length === 0 ? "New Listings Are on the Way" : "No properties match those filters"}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink/80">
            {parcels.length === 0
              ? "Tell us what you are searching for and we will keep an eye out, and let you know as soon as new land goes up."
              : "Try widening the filters, or tell us what you are looking for and we will keep an eye out."}
          </p>
          <Link href="/contact" className={`${btnGold} mt-6`}>
            Share What You Are Looking For
          </Link>
        </div>
      )}
    </div>
  );
}
