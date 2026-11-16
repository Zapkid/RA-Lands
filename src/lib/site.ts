/** Brand and contact details, shared by the header, footer, metadata and forms. */
export const SITE = {
  name: "RA Land Investments LLC",
  shortName: "RA Lands",
  tagline: "Every piece of land has potential. We help you unlock it.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ralands.com").replace(/\/$/, ""),
  phone: "984-368-5554",
  phoneHref: "tel:+19843685554",
  email: "info@ralandinvestments.com",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/properties", label: "Properties" },
  { href: "/faq", label: "FAQ" },
  { href: "/sell-my-land", label: "Sell My Land" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const SERVICES = [
  {
    title: "Land Use & Feasibility Analysis",
    body: "Unsure what can actually be done on a parcel? We review zoning, building codes and access options so you know what is possible before you commit.",
  },
  {
    title: "Navigating Terrain & Infrastructure",
    body: "From power and water availability to easements and terrain, we evaluate the practical details that decide a property's true functionality.",
  },
  {
    title: "Strategic Planning & Due Diligence",
    body: "Clear, objective research to guide your decision, whether you are planning a private retreat, a future build or a long-term hold.",
  },
] as const;
