/**
 * Supabase connection settings. Both values are public by design: the
 * publishable key is safe in the browser because access is enforced by
 * row-level security (see supabase/migrations). Set them in Vercel or in
 * .env.local; see .env.example.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

/** Public storage bucket that holds parcel photos. */
export const PARCEL_PHOTO_BUCKET = "parcel-photos";
