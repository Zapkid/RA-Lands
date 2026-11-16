"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import {
  ArrowDown,
  ArrowUp,
  Calculator,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { revalidateListings } from "@/app/ra-admin/actions";
import { Logo } from "@/components/Logo";
import {
  estimateMonthly,
  formatAcreage,
  formatPrice,
  parcelPath,
  photoUrl,
  STATUS_LABEL,
  type ParcelRow,
  type ParcelStatus,
} from "@/lib/parcels";
import { PARCEL_PHOTO_BUCKET } from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Draft = {
  id: string;
  isNew: boolean;
  code: string;
  name: string;
  status: ParcelStatus;
  is_active: boolean;
  acreage: string;
  price: string;
  state: string;
  county: string;
  address: string;
  apn: string;
  description: string;
  badges: string;
  zoning: string;
  utilities: string;
  road_access: string;
  latitude: string;
  longitude: string;
  financing_available: boolean;
  down_payment: string;
  monthly_payment: string;
  term_months: string;
  interest_rate: string;
  photos: string[];
  sort_order: number;
};

const MAX_PHOTO_EDGE = 2000;

const str = (v: number | null | undefined) => (v == null ? "" : String(v));

function toDraft(p: ParcelRow): Draft {
  return {
    id: p.id,
    isNew: false,
    code: p.code,
    name: p.name,
    status: p.status,
    is_active: p.is_active,
    acreage: String(p.acreage),
    price: String(p.price),
    state: p.state,
    county: p.county,
    address: p.address ?? "",
    apn: p.apn ?? "",
    description: p.description,
    badges: p.badges.join("\n"),
    zoning: p.zoning ?? "",
    utilities: p.utilities ?? "",
    road_access: p.road_access ?? "",
    latitude: str(p.latitude),
    longitude: str(p.longitude),
    financing_available: p.financing_available,
    down_payment: str(p.down_payment),
    monthly_payment: str(p.monthly_payment),
    term_months: str(p.term_months),
    interest_rate: str(p.interest_rate),
    photos: p.photos,
    sort_order: p.sort_order,
  };
}

function emptyDraft(sortOrder: number): Draft {
  return {
    id: crypto.randomUUID(),
    isNew: true,
    code: "",
    name: "",
    status: "for_sale",
    is_active: false,
    acreage: "",
    price: "",
    state: "",
    county: "",
    address: "",
    apn: "",
    description: "",
    badges: "No HOA",
    zoning: "",
    utilities: "",
    road_access: "",
    latitude: "",
    longitude: "",
    financing_available: false,
    down_payment: "",
    monthly_payment: "",
    term_months: "",
    interest_rate: "",
    photos: [],
    sort_order: sortOrder,
  };
}

const optional = (s: string) => (s.trim() === "" ? null : s.trim());
const optionalNumber = (s: string) => (s.trim() === "" ? null : Number(s));

/** Accepts "30.12, -98.45" or a Google Maps link containing @lat,lng or ?q=lat,lng. */
function parseCoordinates(input: string): [number, number] | null {
  const match = input.match(/(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)/);
  if (!match) return null;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return [lat, lng];
}

/** Downscale large phone photos before upload so the site stays fast. */
async function preparePhoto(file: File): Promise<{ blob: Blob; ext: string }> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_PHOTO_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.85));
    if (blob) return { blob, ext: "webp" };
  } catch {
    // Fall through and upload the original file.
  }
  return { blob: file, ext: file.name.split(".").pop()?.toLowerCase() || "jpg" };
}

const STATUS_BADGE: Record<ParcelStatus, string> = {
  for_sale: "bg-sand text-olive",
  under_contract: "bg-white text-olive ring-1 ring-line",
  sold: "bg-copper text-white",
};

export function ParcelAdmin({ initialParcels, email }: { initialParcels: ParcelRow[]; email: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [parcels, setParcels] = useState(initialParcels);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ParcelStatus | "">("");

  const filtering = query.trim() !== "" || statusFilter !== "";
  const visible = parcels.filter((p) => {
    if (statusFilter && p.status !== statusFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.code, p.name, p.county, p.state, p.apn ?? ""].some((v) => v.toLowerCase().includes(q));
  });

  async function refresh() {
    const { data, error } = await supabase.from("parcels").select("*").order("sort_order").order("created_at");
    if (!error && data) setParcels(data as ParcelRow[]);
    await revalidateListings();
  }

  function fail(text: string) {
    setMessage({ kind: "error", text });
    setBusy(null);
  }

  function edit(next: Draft | null) {
    setDraft(next);
    setRemovedPhotos([]);
    setMessage(null);
  }

  async function save() {
    if (!draft) return;
    const acreage = Number(draft.acreage);
    const price = Number(draft.price);
    if (!draft.code.trim() || !draft.name.trim() || !draft.county.trim() || !draft.state.trim()) {
      return fail("Listing code, name, state and county are required.");
    }
    if (!(acreage > 0) || draft.price.trim() === "" || !(price >= 0)) {
      return fail("Enter a valid acreage and price.");
    }
    const lat = optionalNumber(draft.latitude);
    const lng = optionalNumber(draft.longitude);
    if ((lat === null) !== (lng === null) || Number.isNaN(lat) || Number.isNaN(lng)) {
      return fail("Enter both latitude and longitude, or leave both empty.");
    }
    const down = optionalNumber(draft.down_payment);
    const monthly = optionalNumber(draft.monthly_payment);
    const term = optionalNumber(draft.term_months);
    const apr = optionalNumber(draft.interest_rate);
    if ([down, monthly, term, apr].some((n) => n !== null && Number.isNaN(n))) {
      return fail("Financing fields must be numbers.");
    }
    if (term !== null && !(Number.isInteger(term) && term >= 1 && term <= 360)) {
      return fail("Term must be a whole number of months between 1 and 360.");
    }
    if (apr !== null && !(apr >= 0 && apr <= 36)) {
      return fail("Interest rate must be between 0 and 36%.");
    }

    setBusy("save");
    const row = {
      id: draft.id,
      code: draft.code.trim(),
      name: draft.name.trim(),
      status: draft.status,
      is_active: draft.is_active,
      acreage,
      price,
      state: draft.state.trim().toUpperCase(),
      county: draft.county.trim(),
      address: optional(draft.address),
      apn: optional(draft.apn),
      description: draft.description.trim(),
      badges: draft.badges
        .split(/[\n,]/)
        .map((b) => b.trim())
        .filter(Boolean),
      zoning: optional(draft.zoning),
      utilities: optional(draft.utilities),
      road_access: optional(draft.road_access),
      latitude: lat,
      longitude: lng,
      financing_available: draft.financing_available,
      down_payment: down,
      monthly_payment: monthly,
      term_months: term,
      interest_rate: apr,
      photos: draft.photos,
      sort_order: draft.sort_order,
    };

    const { error } = draft.isNew
      ? await supabase.from("parcels").insert(row)
      : await supabase.from("parcels").update(row).eq("id", draft.id);
    if (error) {
      return fail(error.code === "23505" ? "Another listing already uses that code." : error.message);
    }
    if (removedPhotos.length) {
      await supabase.storage.from(PARCEL_PHOTO_BUCKET).remove(removedPhotos);
    }
    await refresh();
    setBusy(null);
    edit(null);
    setMessage({ kind: "ok", text: `Saved ${row.name}.` });
  }

  async function uploadPhotos(files: FileList | null) {
    if (!draft || !files?.length) return;
    setBusy("upload");
    const added: string[] = [];
    for (const file of Array.from(files)) {
      const { blob, ext } = await preparePhoto(file);
      const path = `${draft.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from(PARCEL_PHOTO_BUCKET)
        .upload(path, blob, { contentType: blob.type || file.type, cacheControl: "31536000" });
      if (error) {
        setDraft((d) => (d ? { ...d, photos: [...d.photos, ...added] } : d));
        return fail(`Couldn't upload ${file.name}: ${error.message}`);
      }
      added.push(path);
    }
    setDraft((d) => (d ? { ...d, photos: [...d.photos, ...added] } : d));
    setBusy(null);
  }

  function removePhoto(path: string) {
    setDraft((d) => (d ? { ...d, photos: d.photos.filter((p) => p !== path) } : d));
    setRemovedPhotos((r) => [...r, path]);
  }

  function makeCover(path: string) {
    setDraft((d) => (d ? { ...d, photos: [path, ...d.photos.filter((p) => p !== path)] } : d));
  }

  async function toggleActive(p: ParcelRow) {
    setBusy(p.id);
    const { error } = await supabase.from("parcels").update({ is_active: !p.is_active }).eq("id", p.id);
    if (error) return fail(error.message);
    await refresh();
    setBusy(null);
  }

  async function move(p: ParcelRow, delta: -1 | 1) {
    const index = parcels.findIndex((x) => x.id === p.id);
    const other = index + delta;
    if (index < 0 || other < 0 || other >= parcels.length) return;
    setBusy(p.id);
    // Renumber the whole list so ties from equal sort_order values resolve.
    const reordered = [...parcels];
    [reordered[index], reordered[other]] = [reordered[other], reordered[index]];
    for (const [i, row] of reordered.entries()) {
      if (row.sort_order !== i + 1) {
        const { error } = await supabase.from("parcels").update({ sort_order: i + 1 }).eq("id", row.id);
        if (error) return fail(error.message);
      }
    }
    await refresh();
    setBusy(null);
  }

  async function remove(p: ParcelRow) {
    if (!window.confirm(`Delete ${p.name} (${p.code})? This also deletes its photos.`)) return;
    setBusy(p.id);
    const { error } = await supabase.from("parcels").delete().eq("id", p.id);
    if (error) return fail(error.message);
    if (p.photos.length) await supabase.storage.from(PARCEL_PHOTO_BUCKET).remove(p.photos);
    await refresh();
    setBusy(null);
    setMessage({ kind: "ok", text: `Deleted ${p.name}.` });
  }

  function calculateMonthly() {
    if (!draft) return;
    const value = estimateMonthly(
      Number(draft.price),
      Number(draft.down_payment || 0),
      Number(draft.interest_rate || 0),
      Number(draft.term_months),
    );
    if (value === null) {
      return fail("Enter a price, a down payment below it, a term and an interest rate first.");
    }
    setMessage(null);
    setDraft({ ...draft, monthly_payment: String(value) });
  }

  const field = (key: keyof Draft) => ({
    value: draft ? String(draft[key]) : "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setDraft((d) => (d ? { ...d, [key]: e.target.value } : d)),
  });

  const published = parcels.filter((p) => p.is_active).length;

  return (
    <div className="min-h-screen bg-sage-pale">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-4">
            <Logo className="w-[110px]" />
            <div>
              <h1 className="text-xl leading-none">Listings Admin</h1>
              <p className="mt-1 text-xs text-ink/70">Signed in as {email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <a href="/properties" target="_blank" rel="noopener noreferrer" className="font-bold text-gold-dark hover:underline">
              View site
            </a>
            <form action="/auth/signout" method="post">
              <button className="rounded-md border border-olive/40 px-4 py-2 font-bold text-olive hover:bg-olive hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-6 py-8">
        {message ? (
          <p
            role={message.kind === "error" ? "alert" : "status"}
            className={clsx(
              "rounded-lg px-4 py-3 text-sm font-semibold",
              message.kind === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800",
            )}
          >
            {message.text}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/80">
            {published} of {parcels.length} listings are published. Changes go live as soon as you save.
          </p>
          <button
            type="button"
            onClick={() => edit(emptyDraft(parcels.length + 1))}
            className="flex items-center gap-2 rounded-md bg-sage-deep px-5 py-2.5 text-sm font-bold text-white hover:bg-olive"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add parcel
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="relative min-w-60 flex-1">
            <span className="sr-only">Search listings</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink/50" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code, name, county, state or APN"
              className="w-full rounded-md border border-line bg-white py-2.5 pr-3 pl-9 text-sm"
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ParcelStatus | "")}
              className="rounded-md border border-line bg-white px-3 py-2.5 text-sm"
            >
              <option value="">All statuses</option>
              {(Object.keys(STATUS_LABEL) as ParcelStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="flex flex-col gap-3">
          {visible.map((p) => {
            const index = parcels.findIndex((x) => x.id === p.id);
            return (
              <li
                key={p.id}
                className={clsx(
                  "flex flex-wrap items-center gap-4 rounded-xl border bg-white p-3 pr-4",
                  p.is_active ? "border-line" : "border-dashed border-sage opacity-80",
                )}
              >
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-sand-soft">
                  {p.photos[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl(p.photos[0])} alt="" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  {p.is_active ? (
                    <a
                      href={parcelPath(p.code)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate font-bold text-navy hover:underline"
                    >
                      {p.name}
                    </a>
                  ) : (
                    <p className="truncate font-bold text-navy">{p.name}</p>
                  )}
                  <p className="text-xs text-ink/70">
                    {p.code} · {p.county}, {p.state} · {formatAcreage(p.acreage)} · {formatPrice(p.price)}
                  </p>
                </div>
                <span className={clsx("rounded-full px-2.5 py-1 text-[14px] font-bold uppercase", STATUS_BADGE[p.status])}>
                  {STATUS_LABEL[p.status]}
                </span>
                <span
                  className={clsx(
                    "rounded-full px-2.5 py-1 text-[14px] font-bold uppercase",
                    p.is_active ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700",
                  )}
                >
                  {p.is_active ? "Published" : "Hidden"}
                </span>
                <div className="flex items-center gap-1">
                  <IconButton label="Move up" onClick={() => move(p, -1)} disabled={index <= 0 || !!busy || filtering}>
                    <ArrowUp className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label="Move down"
                    onClick={() => move(p, 1)}
                    disabled={index === parcels.length - 1 || !!busy || filtering}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={p.is_active ? "Hide from the site" : "Publish on the site"}
                    onClick={() => toggleActive(p)}
                    disabled={!!busy}
                  >
                    {busy === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : p.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </IconButton>
                  <IconButton label="Edit" onClick={() => edit(toDraft(p))} disabled={!!busy}>
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton label="Delete" onClick={() => remove(p)} disabled={!!busy} danger>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </li>
            );
          })}
          {visible.length === 0 ? (
            <li className="rounded-xl border border-dashed border-sage p-8 text-center text-ink/80">
              {parcels.length === 0 ? "No listings yet. Add your first parcel." : "No listings match."}
            </li>
          ) : null}
        </ul>
        {filtering ? <p className="text-xs text-ink/60">Reordering is available when no filter is applied.</p> : null}
      </main>

      {draft ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" role="dialog" aria-modal="true" aria-label={draft.isNew ? "Add parcel" : `Edit ${draft.name}`}>
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="text-2xl">{draft.isNew ? "Add parcel" : `Edit ${draft.name}`}</h2>
              <IconButton label="Close" onClick={() => edit(null)} disabled={busy === "save"}>
                <X className="h-5 w-5" />
              </IconButton>
            </div>

            <form
              className="min-h-0 flex-1 overflow-y-auto px-6 py-5"
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <Section title="Listing">
                <Input label="Listing code *" placeholder="RA-1001" {...field("code")} />
                <Input label="Title *" placeholder="0.25 Acre Lot in North Las Vegas, NV" {...field("name")} />
                <Input label="Acreage *" type="number" step="0.01" min="0" {...field("acreage")} />
                <Input label="Price (USD) *" type="number" step="1" min="0" {...field("price")} />
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-navy">Status</span>
                  <select
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as ParcelStatus })}
                    className="rounded-md border border-line bg-white px-3 py-2 text-sm"
                  >
                    {(Object.keys(STATUS_LABEL) as ParcelStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2 self-end pb-2 text-sm font-bold text-navy">
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(e) => setDraft({ ...draft, is_active: e.target.checked })}
                    className="h-4 w-4 accent-[#55654a]"
                  />
                  Published on the site
                </label>
              </Section>

              <Section title="Financing (optional)">
                <label className="flex items-center gap-2 text-sm font-bold text-navy sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={draft.financing_available}
                    onChange={(e) => setDraft({ ...draft, financing_available: e.target.checked })}
                    className="h-4 w-4 accent-[#55654a]"
                  />
                  Financing is available for this parcel
                </label>
                {draft.financing_available ? (
                  <>
                    <Input label="Down payment (USD)" type="number" step="1" min="0" {...field("down_payment")} />
                    <Input label="Term (months)" type="number" step="1" min="1" max="360" {...field("term_months")} />
                    <Input
                      label="Interest rate (APR %)"
                      type="number"
                      step="0.1"
                      min="0"
                      max="36"
                      {...field("interest_rate")}
                    />
                    <div className="flex flex-col gap-1.5">
                      <Input label="Monthly payment (USD)" type="number" step="0.01" min="0" {...field("monthly_payment")} />
                      <button
                        type="button"
                        onClick={calculateMonthly}
                        className="flex items-center gap-1.5 self-start text-xs font-bold text-gold-dark hover:underline"
                      >
                        <Calculator className="h-3.5 w-3.5" aria-hidden="true" />
                        Calculate from price, down payment, rate and term
                      </button>
                    </div>
                  </>
                ) : null}
              </Section>

              <Section title="Location">
                <Input label="State *" placeholder="NV" maxLength={2} {...field("state")} />
                <Input label="County *" placeholder="Clark County" {...field("county")} />
                <Input label="Address or road" wide {...field("address")} />
                <Input label="APN / parcel ID" {...field("apn")} />
                <div />
                <Input
                  label="Paste coordinates or a Google Maps link"
                  wide
                  hint="Right-click the spot in Google Maps and click the numbers to copy them"
                  onChange={(e) => {
                    const coords = parseCoordinates(e.target.value);
                    if (coords) {
                      setDraft({ ...draft, latitude: String(coords[0]), longitude: String(coords[1]) });
                    }
                  }}
                />
                <Input label="Latitude" type="number" step="any" {...field("latitude")} />
                <Input label="Longitude" type="number" step="any" {...field("longitude")} />
              </Section>

              <Section title="Details">
                <TextArea label="Description" rows={4} {...field("description")} />
                <TextArea
                  label="Highlights (one per line)"
                  rows={3}
                  hint="Shown as tags on the property page, e.g. No HOA"
                  {...field("badges")}
                />
                <Input label="Zoning / restrictions" {...field("zoning")} />
                <Input label="Utilities" placeholder="Power at the road, well needed" {...field("utilities")} />
                <Input label="Road access" placeholder="County-maintained gravel road" wide {...field("road_access")} />
              </Section>

              <Section title="Photos">
                <div className="col-span-full flex flex-col gap-3">
                  <div className="grid grid-cols-3 gap-3">
                    {draft.photos.map((path, idx) => (
                      <div key={path} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-sand-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={photoUrl(path)} alt="" className="h-full w-full object-cover" />
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 rounded-full bg-sage-deep px-2 py-0.5 text-[13px] font-bold text-white uppercase">
                            Cover
                          </span>
                        ) : null}
                        <div className="absolute inset-x-1.5 bottom-1.5 flex justify-end gap-1">
                          {idx !== 0 ? (
                            <IconButton label="Make cover photo" onClick={() => makeCover(path)} small>
                              <Star className="h-3.5 w-3.5" />
                            </IconButton>
                          ) : null}
                          <IconButton label="Remove photo" onClick={() => removePhoto(path)} small danger>
                            <Trash2 className="h-3.5 w-3.5" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                    <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-sage text-xs font-bold text-sage-deep hover:bg-sage-pale">
                      {busy === "upload" ? (
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                      ) : (
                        <ImagePlus className="h-5 w-5" aria-hidden="true" />
                      )}
                      {busy === "upload" ? "Uploading…" : "Add photos"}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        multiple
                        className="sr-only"
                        disabled={busy === "upload"}
                        onChange={(e) => {
                          uploadPhotos(e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-ink/70">
                    The first photo is the cover. Large photos are resized automatically. Removed photos are deleted
                    when you save.
                  </p>
                </div>
              </Section>

              {message?.kind === "error" ? (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {message.text}
                </p>
              ) : null}

              <div className="sticky bottom-0 -mx-6 flex justify-end gap-3 border-t border-line bg-white px-6 py-4">
                <button
                  type="button"
                  onClick={() => edit(null)}
                  className="rounded-md px-5 py-2.5 text-sm font-bold text-ink/80 hover:bg-sage-pale"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!!busy}
                  className="flex items-center gap-2 rounded-md bg-sage-deep px-6 py-2.5 text-sm font-bold text-white hover:bg-olive disabled:opacity-60"
                >
                  {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-7">
      <legend className="mb-3 text-xs font-bold tracking-[0.18em] text-gold-dark uppercase">{title}</legend>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function Input({
  label,
  hint,
  wide,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; wide?: boolean }) {
  return (
    <label className={clsx("flex flex-col gap-1.5", wide && "sm:col-span-2")}>
      <span className="text-sm font-bold text-navy">{label}</span>
      <input {...props} className="rounded-md border border-line px-3 py-2 text-sm text-ink" />
      {hint ? <span className="text-xs text-ink/70">{hint}</span> : null}
    </label>
  );
}

function TextArea({
  label,
  hint,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5 sm:col-span-2">
      <span className="text-sm font-bold text-navy">{label}</span>
      <textarea {...props} className="rounded-md border border-line px-3 py-2 text-sm text-ink" />
      {hint ? <span className="text-xs text-ink/70">{hint}</span> : null}
    </label>
  );
}

function IconButton({
  label,
  onClick,
  disabled,
  danger,
  small,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center rounded-full transition-colors disabled:opacity-40",
        small ? "h-7 w-7 bg-white/90 shadow" : "h-9 w-9",
        danger ? "text-red-700 hover:bg-red-50" : "text-sage-deep hover:bg-sage-pale",
      )}
    >
      {children}
    </button>
  );
}
