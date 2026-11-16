"use client";

import { useActionState } from "react";
import { requestCode, verifyCode, type LoginState } from "@/app/ra-admin/login-actions";

const inputClass =
  "w-72 rounded-md border border-line bg-white px-5 py-3 text-center text-base text-ink focus:border-sage-deep focus:outline-none";
const buttonClass =
  "rounded-md bg-sage-deep px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-olive disabled:opacity-60";

export function EmailCodeLogin() {
  const [requested, request, requesting] = useActionState<LoginState, FormData>(requestCode, {
    step: "email",
    email: "",
  });
  const [verified, verify, verifying] = useActionState<LoginState, FormData>(verifyCode, {
    step: "code",
    email: "",
  });

  if (requested.step === "email") {
    return (
      <form action={request} className="flex flex-col items-center gap-3">
        <label htmlFor="admin-email" className="sr-only">
          Email address
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={requested.email}
          placeholder="Email address"
          className={inputClass}
        />
        <button type="submit" disabled={requesting} className={buttonClass}>
          {requesting ? "Sending…" : "Email me a sign-in code"}
        </button>
        {requested.error ? (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {requested.error}
          </p>
        ) : null}
      </form>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <form action={verify} className="flex flex-col items-center gap-3">
        <p className="max-w-sm text-sm text-ink/85">
          If {requested.email} is authorized, a sign-in code is on its way. Enter it below.
        </p>
        <input type="hidden" name="email" value={requested.email} />
        <label htmlFor="admin-code" className="sr-only">
          Sign-in code
        </label>
        <input
          id="admin-code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,12}"
          required
          autoFocus
          placeholder="Sign-in code"
          className={`${inputClass} tracking-[0.4em] placeholder:tracking-normal`}
        />
        <button type="submit" disabled={verifying} className={buttonClass}>
          {verifying ? "Checking…" : "Sign in"}
        </button>
        {verified.error ? (
          <p role="alert" className="text-sm font-semibold text-red-700">
            {verified.error}
          </p>
        ) : null}
      </form>
      <form action={request}>
        <input type="hidden" name="email" value={requested.email} />
        <button type="submit" disabled={requesting} className="text-xs font-bold text-gold-dark hover:underline">
          {requesting ? "Sending…" : "Send a new code"}
        </button>
      </form>
    </div>
  );
}
