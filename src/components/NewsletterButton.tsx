"use client";

import { useId, useRef, useState } from "react";
import { Mail, X } from "lucide-react";
import { btnGold } from "./ui";
import { SITE } from "@/lib/site";

type State = { kind: "idle" | "sending" | "ok" | "error"; text: string };

/** Header button that opens a small "join the mailing list" dialog. */
export function NewsletterButton({ className = "" }: { className?: string }) {
  const uid = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<State>({ kind: "idle", text: "" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setState({ kind: "sending", text: "Sending…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "newsletter", email: d.get("email"), website: d.get("website") }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Request failed");
      form.reset();
      setState({ kind: "ok", text: "Thank you! You are on the list." });
    } catch {
      setState({ kind: "error", text: `Sorry, something went wrong. Please email ${SITE.email}.` });
    }
  }

  return (
    <>
      <button
        type="button"
        className={`flex items-center gap-2.5 text-left text-sage-deep hover:text-gold-dark ${className}`}
        onClick={() => {
          setState({ kind: "idle", text: "" });
          ref.current?.showModal();
        }}
      >
        <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="leading-tight whitespace-nowrap">
          <span className="block text-[13px] font-bold tracking-wider uppercase">Join now</span>
          <span className="block text-[16px] font-bold text-navy">Mailing list</span>
        </span>
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`${uid}-title`}
        className="m-auto w-[min(92vw,30rem)] rounded-2xl bg-sage-pale p-8 text-center backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute top-3 right-3 rounded-md p-2 text-olive hover:bg-white"
          onClick={() => ref.current?.close()}
        >
          <X className="h-6 w-6" />
        </button>
        <h2 id={`${uid}-title`} className="text-3xl">
          Join Our Mailing List
        </h2>
        <p className="mt-3 text-ink/85">Join the RA Lands deal alert list to receive notifications when new properties become available.</p>
        <form onSubmit={onSubmit} className="mt-6 grid gap-3">
          <label htmlFor={`${uid}-email`} className="sr-only">
            Your email address
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Your Email Address"
            className="w-full rounded-md border border-line bg-white px-3.5 py-3 text-base text-ink placeholder:text-ink/55"
          />
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <button type="submit" disabled={state.kind === "sending"} className={`${btnGold} w-full`}>
            {state.kind === "sending" ? "Sending…" : "Subscribe"}
          </button>
          <p
            role="status"
            aria-live="polite"
            className={state.kind === "error" ? "min-h-6 font-semibold text-red-700" : "min-h-6 font-semibold text-sage-deep"}
          >
            {state.text}
          </p>
        </form>
      </dialog>
    </>
  );
}
