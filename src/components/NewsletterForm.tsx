"use client";

import { useState } from "react";
import { btnGold } from "./ui";

type State = { kind: "idle" | "sending" | "ok" | "error"; text: string };

/** Deal-alert signup. Posts to /api/contact, which emails the site owner. */
export function NewsletterForm() {
  const [state, setState] = useState<State>({ kind: "idle", text: "" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState({ kind: "sending", text: "Subscribing…" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "newsletter",
          email: data.get("email"),
          website: data.get("website"),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.error || "Request failed");
      form.reset();
      setState({ kind: "ok", text: "Thank you! You are on the deal-alert list." });
    } catch {
      setState({ kind: "error", text: "Sorry, that didn't go through. Please try again shortly." });
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate={false}>
      <label htmlFor="newsletter-email" className="sr-only">
        Your email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Your email address"
        className="w-full rounded-md border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-ink/60"
      />
      {/* Honeypot: hidden from people, filled in by bots. */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <button type="submit" disabled={state.kind === "sending"} className={btnGold}>
        Subscribe
      </button>
      <p
        role="status"
        aria-live="polite"
        className={state.kind === "error" ? "min-h-6 text-sm font-semibold text-red-700" : "min-h-6 text-sm text-sage-deep"}
      >
        {state.text}
      </p>
    </form>
  );
}
