"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_EMAILS, ADMIN_PATH } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = {
  step: "email" | "code";
  email: string;
  error?: string;
};

const normalize = (value: FormDataEntryValue | null) => String(value ?? "").trim().toLowerCase();

/**
 * Step 1: email a one-time code. Codes are only ever sent to an admin
 * address; any other address gets the same response so the page doesn't
 * reveal which addresses are authorized.
 */
export async function requestCode(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = normalize(formData.get("email"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { step: "email", email, error: "Enter a valid email address." };
  }

  if (ADMIN_EMAILS.includes(email)) {
    const supabase = await createSupabaseServerClient();
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");
    const proto = requestHeaders.get("x-forwarded-proto") ?? "https";
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // The same email also carries a sign-in link, which lands here.
        emailRedirectTo: host ? `${proto}://${host}/auth/callback` : undefined,
      },
    });
    if (error) {
      return {
        step: "email",
        email,
        error:
          error.status === 429
            ? "Too many codes requested. Wait a minute and try again."
            : "Couldn't send the code. Try again shortly.",
      };
    }
  }

  return { step: "code", email };
}

/** Step 2: check the code and start the session. */
export async function verifyCode(_: LoginState, formData: FormData): Promise<LoginState> {
  const email = normalize(formData.get("email"));
  const token = String(formData.get("code") ?? "").replace(/\s/g, "");

  if (!ADMIN_EMAILS.includes(email) || !/^\d{6,10}$/.test(token)) {
    return { step: "code", email, error: "That code isn't valid." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) {
    return { step: "code", email, error: "That code is wrong or has expired." };
  }

  redirect(ADMIN_PATH);
}
