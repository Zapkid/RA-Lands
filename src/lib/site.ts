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
  { href: "/sell-your-land", label: "Sell Your Land" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
] as const;

export const SERVICES = [
  {
    title: "What Can You Build or Do Here?",
    body: "We look into zoning, building rules and access, so you know what is allowed before you commit.",
  },
  {
    title: "Understanding the Ground Beneath You",
    body: "Utilities, water, easements and terrain: the practical details that decide how usable a property really is.",
  },
  {
    title: "Research You Can Rely On",
    body: "Objective due diligence to support your decision, whether you are planning a getaway, a future home or a long-term hold.",
  },
] as const;
