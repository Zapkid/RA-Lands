import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { ParcelAdmin } from "@/components/admin/ParcelAdmin";
import { EmailCodeLogin } from "@/components/admin/EmailCodeLogin";
import { isAdminUser } from "@/lib/admin";
import type { ParcelRow } from "@/lib/parcels";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Listings Admin",
  robots: { index: false, follow: false },
};

// Always rendered per request: it reads the signed-in session.
export const dynamic = "force-dynamic";

const shell = "flex min-h-screen flex-col items-center justify-center gap-6 bg-sage-pale px-6 text-center";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isSupabaseConfigured) {
    return (
      <div className={shell}>
        <Logo className="w-[200px]" />
        <h1 className="text-3xl">Listings Admin</h1>
        <p className="max-w-lg text-ink/85">
          The database is not connected yet. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> in the hosting environment, run the migration in{" "}
          <code>supabase/migrations</code>, then reload this page. The README has the full steps.
        </p>
      </div>
    );
  }

  const { error } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    return (
      <div className={shell}>
        <Logo className="w-[200px]" />
        <h1 className="text-3xl">Listings Admin</h1>
        {user ? (
          <>
            <p className="max-w-sm text-ink/85">{user.email} doesn&apos;t have access to this page.</p>
            <form action="/auth/signout" method="post">
              <button className="rounded-md border-2 border-olive px-6 py-2.5 text-sm font-bold text-olive hover:bg-olive hover:text-white">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="max-w-sm text-ink/85">Sign in with a one-time code sent to your email.</p>
            {error ? (
              <p role="alert" className="text-sm font-semibold text-red-700">
                Sign-in didn&apos;t complete. Please try again.
              </p>
            ) : null}
            <EmailCodeLogin />
          </>
        )}
      </div>
    );
  }

  const { data } = await supabase.from("parcels").select("*").order("sort_order").order("created_at");

  return <ParcelAdmin initialParcels={(data ?? []) as ParcelRow[]} email={user!.email!} />;
}
