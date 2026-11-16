"use client";

import { useId, useState } from "react";
import { btnGold } from "./ui";
import { SITE } from "@/lib/site";

const OWNERSHIP = ["Sole owner", "Co-owner / family", "Company or trust", "Heir / estate", "Agent for the owner"];
const TYPES = ["Vacant land", "Wooded / recreational", "Farm / agricultural", "Residential lot", "Commercial lot", "Other"];
const ACCESS = ["Paved road", "Gravel / dirt road", "Easement only", "No legal access", "Not sure"];
const UTILITIES = ["Electric", "Water / well", "Septic / sewer", "Internet", "None"];
const YESNO = ["Yes", "No", "Not sure"];
const TIMELINE = ["As soon as possible", "Within 3 months", "3 to 6 months", "Just exploring"];
const CONTACT = ["Email", "Phone call", "Text message"];
const SOURCES = ["Google search", "Friend or family", "Mailer / letter", "Social media", "Other"];

type State = { kind: "idle" | "sending" | "ok" | "error"; text: string };

const field = "w-full rounded-md border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-ink/55";
const label = "mb-1.5 block text-sm font-bold text-navy";

export function SellLandForm() {
  const uid = useId();
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const id = (n: string) => `${uid}-${n}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    const get = (k: string) => d.get(k);
    setState({ kind: "sending", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "sell",
          name: get("name"),
          email: get("email"),
          phone: get("phone"),
          contactMethod: get("contactMethod"),
          ownership: get("ownership"),
          address: get("address"),
          county: get("county"),
          state: get("state"),
          apn: get("apn"),
          acreage: get("acreage"),
          askingPrice: get("askingPrice"),
          propertyType: get("propertyType"),
          access: get("access"),
          utilities: d.getAll("utilities").join(", "),
          taxes: get("taxes"),
          liens: get("liens"),
          timeline: get("timeline"),
          source: get("source"),
          notes: get("notes"),
          consent: get("consent") === "on",
          website: get("website"),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Request failed");
      form.reset();
      setState({ kind: "ok", text: "Thank you! We received your land details and will be in touch shortly." });
    } catch {
      setState({
        kind: "error",
        text: `Sorry, something went wrong. Please call ${SITE.phone} or email ${SITE.email}.`,
      });
    }
  }

  const select = (name: string, text: string, options: string[], required = false) => (
    <div>
      <label htmlFor={id(name)} className={label}>
        {text}
        {required ? " *" : ""}
      </label>
      <select id={id(name)} name={name} required={required} defaultValue="" className={field}>
        <option value="" disabled={required}>
          {required ? "Select…" : "Select (optional)"}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  const input = (name: string, text: string, opts: { type?: string; required?: boolean; placeholder?: string; wide?: boolean } = {}) => (
    <div className={opts.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={id(name)} className={label}>
        {text}
        {opts.required ? " *" : ""}
      </label>
      <input
        id={id(name)}
        name={name}
        type={opts.type ?? "text"}
        required={opts.required}
        placeholder={opts.placeholder}
        className={field}
      />
    </div>
  );

  const legend = "mb-4 border-b border-line pb-2 text-xl font-bold text-navy";

  return (
    <form onSubmit={onSubmit} className="grid gap-10" aria-label="Sell my land">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className={`${legend} col-span-full w-full`}>1. About you</legend>
        {input("name", "Full name", { required: true })}
        {input("email", "Email", { type: "email", required: true })}
        {input("phone", "Phone", { type: "tel" })}
        {select("contactMethod", "Best way to reach you", CONTACT)}
        {select("ownership", "Your ownership", OWNERSHIP, true)}
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className={`${legend} col-span-full w-full`}>2. The property</legend>
        {input("address", "Property address or nearest road / city", { required: true, wide: true })}
        {input("county", "County", { required: true })}
        {input("state", "State", { required: true })}
        {input("apn", "Parcel number (APN)", { placeholder: "Found on your tax bill" })}
        {input("acreage", "Acreage", { required: true, placeholder: "e.g. 5.2" })}
        {select("propertyType", "Property type", TYPES, true)}
        {select("access", "Road access", ACCESS)}
        <fieldset className="sm:col-span-2">
          <legend className={label}>Utilities available</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {UTILITIES.map((u) => (
              <label key={u} className="flex items-center gap-2 text-base">
                <input type="checkbox" name="utilities" value={u} className="h-5 w-5 accent-[#a0602f]" />
                {u}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className={`${legend} col-span-full w-full`}>3. Price and timing</legend>
        {input("askingPrice", "Asking price (USD)", { placeholder: "Leave blank if unsure" })}
        {select("timeline", "When do you want to sell?", TIMELINE)}
        {select("taxes", "Property taxes up to date?", YESNO)}
        {select("liens", "Any mortgage or liens?", YESNO)}
        {select("source", "How did you hear about us?", SOURCES)}
        <div className="sm:col-span-2">
          <label htmlFor={id("notes")} className={label}>
            Anything else we should know
          </label>
          <textarea id={id("notes")} name="notes" rows={5} maxLength={5000} className={field} />
        </div>
      </fieldset>

      {/* Honeypot: hidden from people, filled by bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4">
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="consent" required className="mt-1.5 h-5 w-5 shrink-0 accent-[#a0602f]" />
          <span>I am the owner of this land, or authorized to sell it, and agree to be contacted about it. *</span>
        </label>
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={state.kind === "sending"} className={btnGold}>
            {state.kind === "sending" ? "Sending…" : "Send my land details"}
          </button>
          <p
            role="status"
            aria-live="polite"
            className={state.kind === "error" ? "font-semibold text-red-700" : "font-semibold text-navy"}
          >
            {state.text}
          </p>
        </div>
      </div>
    </form>
  );
}
