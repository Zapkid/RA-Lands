import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL(ADMIN_PATH, request.url), { status: 303 });
}
