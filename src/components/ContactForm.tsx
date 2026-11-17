"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { btnGold } from "./ui";
import { SITE } from "@/lib/site";

export const FORM_ROLES = ["Landowner", "Future builder", "Investor", "Other"] as const;
export const FORM_SERVICES = ["Buyer", "Seller", "Want to find out more", "Other"] as const;

type Props = {
  /** "parcel" is the short "I'm interested in this property" form. */
  variant?: "consultation" | "parcel";
  parcel?: { code: string; name: string };
};

type State = { kind: "idle" | "sending" | "ok" | "error"; text: string };

const field =
  "w-full rounded-md border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-ink/55";

export function ContactForm({ variant = "consultation", parcel }: Props) {
  const uid = useId();
  const [state, setState] = useState<State>({ kind: "idle", text: "" });
  const isParcel = variant === "parcel";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setState({ kind: "sending", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: isParcel ? "parcel" : "consultation",
          name: d.get("name"),
          email: d.get("email"),
          phone: d.get("phone"),
          role: d.get("role"),
          service: d.get("service"),
          location: d.get("location"),
          message: d.get("message"),
          parcelCode: parcel?.code,
          parcelName: parcel?.name,
          mailingList: d.get("mailingList") === "on",
          website: d.get("website"),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Request failed");
      form.reset();
      setState({ kind: "ok", text: "Thank you! Your message was sent. We will be in touch shortly." });
    } catch {
      setState({
        kind: "error",
        text: `Sorry, something went wrong. Please call ${SITE.phone} or email ${SITE.email}.`,
      });
    }
  }

  const id = (n: string) => `${uid}-${n}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2" aria-label={isParcel ? "Property inquiry" : "Consultation request"}>
      <div>
        <label htmlFor={id("name")} className="mb-1.5 block text-sm font-bold text-olive">
          Full name <span aria-hidden="true">*</span>
        </label>
        <input id={id("name")} name="name" required autoComplete="name" maxLength={120} className={field} />
      </div>
      <div>
        <label htmlFor={id("email")} className="mb-1.5 block text-sm font-bold text-olive">
          Email <span aria-hidden="true">*</span>
        </label>
        <input id={id("email")} name="email" type="email" required autoComplete="email" maxLength={200} className={field} />
      </div>
      <div>
        <label htmlFor={id("phone")} className="mb-1.5 block text-sm font-bold text-olive">
          Phone
        </label>
        <input id={id("phone")} name="phone" type="tel" autoComplete="tel" maxLength={40} className={field} />
      </div>

      {!isParcel ? (
        <>
          <div>
            <label htmlFor={id("role")} className="mb-1.5 block text-sm font-bold text-olive">
              I am a
            </label>
            <select id={id("role")} name="role" className={field} defaultValue="Future builder">
              {FORM_ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={id("service")} className="mb-1.5 block text-sm font-bold text-olive">
              What can we help with?
            </label>
            <select id={id("service")} name="service" className={field} defaultValue="Buyer">
              {FORM_SERVICES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor={id("location")} className="mb-1.5 block text-sm font-bold text-olive">
              Property location
            </label>
            <input
              id={id("location")}
              name="location"
              maxLength={200}
              placeholder="County, state, acreage or parcel ID"
              className={field}
            />
          </div>
        </>
      ) : null}

      <div className="sm:col-span-2">
        <label htmlFor={id("message")} className="mb-1.5 block text-sm font-bold text-olive">
          {isParcel ? "Your questions" : "Tell us about your plans"} <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={id("message")}
          name="message"
          required
          rows={5}
          maxLength={5000}
          defaultValue={isParcel && parcel ? `I'm interested in ${parcel.name} (${parcel.code}).` : undefined}
          className={`${field} resize-y`}
        />
      </div>

      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-3 sm:col-span-2">
        <label className="flex items-start gap-3 text-base">
          <input type="checkbox" name="mailingList" className="mt-1.5 h-5 w-5 shrink-0 accent-[#a0602f]" />
          <span>Add me to the mailing list for new property alerts.</span>
        </label>
        <p className="text-sm text-ink/75">
          By sending this form you agree to our{" "}
          <Link href="/privacy" className="font-semibold text-sage-deep underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div>
          <button type="submit" disabled={state.kind === "sending"} className={btnGold}>
            {state.kind === "sending" ? "Sending…" : isParcel ? "Ask about this property" : "Request consultation"}
          </button>
        </div>
        <p
          role="status"
          aria-live="polite"
          className={state.kind === "error" ? "min-h-6 font-semibold text-red-700" : "min-h-6 font-semibold text-sage-deep"}
        >
          {state.text}
        </p>
      </div>
    </form>
  );
}
