"use server";

import { revalidatePath } from "next/cache";
import { isAdminUser } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Rebuild the public pages so listing edits show up right away. */
export async function revalidateListings() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!isAdminUser(user)) {
    throw new Error("Not authorized");
  }
  revalidatePath("/");
  revalidatePath("/properties");
  revalidatePath("/properties/[code]", "page");
  revalidatePath("/sitemap.xml");
}
