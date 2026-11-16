import { NextResponse } from "next/server";
import { ADMIN_PATH } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// The sign-in email also carries a link. It lands here; trade its one-time
// code for a session cookie, then return to the admin page.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${ADMIN_PATH}`);
    }
  }

  return NextResponse.redirect(`${origin}${ADMIN_PATH}?error=signin`);
}
