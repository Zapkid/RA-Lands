import { createClient } from "@supabase/supabase-js";
import type { ParcelRow } from "./parcels";
import { SAMPLE_PARCELS } from "./sample-parcels";
import { isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabase/config";

/** Sample data is only used before Supabase exists, in dev or when opted in. */
const useSamples =
  !isSupabaseConfigured &&
  (process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_USE_SAMPLE_PARCELS === "1");

/**
 * Cookie-less client so public pages stay statically generated; the admin
 * revalidates them after every edit. Row-level security limits it to
 * published parcels.
 */
function publicClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false },
  });
}

/** All published parcels, in the admin's chosen order. */
export async function getPublishedParcels(): Promise<ParcelRow[]> {
  if (!isSupabaseConfigured) return useSamples ? SAMPLE_PARCELS : [];
  const { data, error } = await publicClient()
    .from("parcels")
    .select("*")
    .eq("is_active", true)
    .order("sort_order")
    .order("created_at");
  if (error) {
    console.error("Failed to load parcels", error.message);
    return [];
  }
  return data as ParcelRow[];
}

/** One published parcel by its code (case-insensitive), or null. */
export async function getParcelByCode(code: string): Promise<ParcelRow | null> {
  if (!isSupabaseConfigured) {
    return useSamples ? (SAMPLE_PARCELS.find((p) => p.code.toLowerCase() === code.toLowerCase()) ?? null) : null;
  }
  const escaped = code.replace(/[\\%_]/g, (c) => `\\${c}`);
  const { data, error } = await publicClient()
    .from("parcels")
    .select("*")
    .eq("is_active", true)
    .ilike("code", escaped)
    .maybeSingle();
  if (error) {
    console.error("Failed to load parcel", code, error.message);
    return null;
  }
  return data as ParcelRow | null;
}
