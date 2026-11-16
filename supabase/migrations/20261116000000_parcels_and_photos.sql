-- RA Lands: listings, admin gate and photo storage.
-- Run this in the Supabase SQL editor (or `supabase db push`) on the new project.

-- Admin gate: only this address, signed in by emailed one-time code, may
-- manage listings. Keep in sync with ADMIN_EMAILS in src/lib/admin.ts.
create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(
    lower(auth.jwt() ->> 'email') = any (array['revital.halevi@gmail.com'])
    and (auth.jwt() -> 'app_metadata' ->> 'provider') = 'email',
    false
  );
$$;

create table public.parcels (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status text not null default 'for_sale'
    check (status in ('for_sale', 'under_contract', 'sold')),
  state text not null,
  county text not null,
  address text,
  apn text,
  acreage numeric(10,2) not null check (acreage > 0),
  price numeric(12,2) not null check (price >= 0),
  description text not null default '',
  badges text[] not null default '{}',
  zoning text,
  utilities text,
  road_access text,
  latitude double precision check (latitude is null or latitude between -90 and 90),
  longitude double precision check (longitude is null or longitude between -180 and 180),
  photos text[] not null default '{}',
  financing_available boolean not null default false,
  down_payment numeric(12,2) check (down_payment is null or down_payment >= 0),
  monthly_payment numeric(10,2) check (monthly_payment is null or monthly_payment >= 0),
  term_months integer check (term_months is null or term_months between 1 and 360),
  interest_rate numeric(5,2) check (interest_rate is null or interest_rate between 0 and 36),
  -- Published: visible on the public site.
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index parcels_active_sort_idx on public.parcels (is_active, sort_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger parcels_set_updated_at
before update on public.parcels
for each row execute function public.set_updated_at();

alter table public.parcels enable row level security;

create policy "Public reads published parcels; admin reads all"
on public.parcels for select
to anon, authenticated
using (is_active or (select public.is_admin()));

create policy "Admin inserts parcels"
on public.parcels for insert
to authenticated
with check ((select public.is_admin()));

create policy "Admin updates parcels"
on public.parcels for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admin deletes parcels"
on public.parcels for delete
to authenticated
using ((select public.is_admin()));

-- Photos: public-read bucket, admin-only writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'parcel-photos', 'parcel-photos', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "Admin lists parcel photos"
on storage.objects for select
to authenticated
using (bucket_id = 'parcel-photos' and (select public.is_admin()));

create policy "Admin uploads parcel photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'parcel-photos' and (select public.is_admin()));

create policy "Admin updates parcel photos"
on storage.objects for update
to authenticated
using (bucket_id = 'parcel-photos' and (select public.is_admin()));

create policy "Admin deletes parcel photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'parcel-photos' and (select public.is_admin()));
