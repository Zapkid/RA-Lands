import { PARCEL_PHOTO_BUCKET, SUPABASE_URL } from "./supabase/config";

export type ParcelStatus = "for_sale" | "under_contract" | "sold";

export const STATUS_LABEL: Record<ParcelStatus, string> = {
  for_sale: "For Sale",
  under_contract: "Under Contract",
  sold: "Sold",
};

/** Row shape of public.parcels. */
export type ParcelRow = {
  id: string;
  code: string;
  name: string;
  status: ParcelStatus;
  state: string;
  county: string;
  address: string | null;
  apn: string | null;
  acreage: number;
  price: number;
  description: string;
  /** Short highlight tags shown on the listing, e.g. "No HOA". */
  badges: string[];
  zoning: string | null;
  utilities: string | null;
  road_access: string | null;
  latitude: number | null;
  longitude: number | null;
  /** Storage paths inside the parcel-photos bucket; the first is the cover. */
  photos: string[];
  financing_available: boolean;
  down_payment: number | null;
  monthly_payment: number | null;
  term_months: number | null;
  interest_rate: number | null;
  /** Published: visible on the public site. */
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

/** Public URL of a parcel's page; codes like "RA-1001" become /properties/ra-1001. */
export function parcelPath(code: string): string {
  return `/properties/${encodeURIComponent(code.toLowerCase())}`;
}

export function photoUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${PARCEL_PHOTO_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return usd.format(Number(value));
}

export function formatAcreage(value: number): string {
  const n = Number(value);
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${n === 1 ? "acre" : "acres"}`;
}

/** True when a parcel shows financing terms to visitors. */
export function hasFinancing(p: ParcelRow): boolean {
  return p.financing_available && p.status !== "sold";
}

/** Standard amortized payment; returns null when the inputs do not allow one. */
export function estimateMonthly(
  price: number,
  down: number,
  aprPercent: number,
  months: number,
): number | null {
  const principal = price - down;
  if (!(principal > 0) || !(months > 0) || aprPercent < 0) return null;
  const r = aprPercent / 100 / 12;
  const payment = r === 0 ? principal / months : (principal * r) / (1 - Math.pow(1 + r, -months));
  return Math.round(payment * 100) / 100;
}

/* ---------- Filter bands (as on the property grid) ---------- */

export type Band = { id: string; label: string; min: number; max: number };

export const ACREAGE_BANDS: Band[] = [
  { id: "0-5", label: "Under 5 acres", min: 0, max: 5 },
  { id: "5-10", label: "5 – 10 acres", min: 5, max: 10 },
  { id: "10-20", label: "10 – 20 acres", min: 10, max: 20 },
  { id: "20+", label: "20+ acres", min: 20, max: Infinity },
];

export const PRICE_BANDS: Band[] = [
  { id: "0-5k", label: "Under $5,000", min: 0, max: 5000 },
  { id: "5k-10k", label: "$5,000 – $10,000", min: 5000, max: 10000 },
  { id: "10k-25k", label: "$10,000 – $25,000", min: 10000, max: 25000 },
  { id: "25k+", label: "$25,000+", min: 25000, max: Infinity },
];

export function inBand(value: number, band: Band | undefined): boolean {
  if (!band) return true;
  return value >= band.min && value < band.max;
}
