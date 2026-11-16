import type { User } from "@supabase/supabase-js";

/**
 * Email addresses allowed to manage listings (sign-in by emailed code). The
 * database enforces the same list in public.is_admin() (supabase/migrations);
 * keep both in sync.
 */
export const ADMIN_EMAILS = ["revital.halevi@gmail.com"];

/** Unlisted path of the listings admin page. */
export const ADMIN_PATH = "/ra-admin";

export function isAdminUser(user: User | null): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase()) && user.app_metadata?.provider === "email";
}
