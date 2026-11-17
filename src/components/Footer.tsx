import Link from "next/link";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { container } from "./ui";
import { SITE } from "@/lib/site";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/properties", label: "Properties" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/sell-your-land", label: "Sell Your Land" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-sage-pale">
      <div className={`${container} grid gap-10 py-16 lg:grid-cols-[1fr_2.4fr]`}>
        <div className="flex flex-col items-start gap-5">
          <span className="rounded-xl bg-white p-3 shadow-sm">
            <Logo className="w-[180px]" />
          </span>
          <p className="max-w-xs text-[18px] text-olive/90">
            Simple land ownership, with expert guidance and no pressure.
          </p>
        </div>

        <div className="grid gap-8">
          <div className="grid gap-8 rounded-2xl bg-olive p-8 text-white sm:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="mb-4 text-lg font-bold !text-white">Useful Links</h2>
              <ul className="flex flex-col gap-2.5 text-[18px]">
                {LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex items-center gap-2 hover:text-sand">
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-lg font-bold !text-white">Get In Touch</h2>
              <ul className="flex flex-col gap-2.5 text-[18px]">
                <li>
                  <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 text-[17px] break-words hover:text-sand">
                    <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {SITE.email}
                  </a>
                </li>
                <li>
                  <a href={SITE.phoneHref} className="inline-flex items-center gap-2 hover:text-sand">
                    <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {SITE.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-olive text-[17px] text-white">
        <div className={`${container} flex flex-col items-center justify-between gap-2 py-4 sm:flex-row`}>
          <p>
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {SITE.name}. All Rights Reserved.
          </p>
          <ul className="flex gap-5 font-semibold">
            <li>
              <Link href="/privacy" className="hover:text-sand">
                Privacy Policy &amp; Terms
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-sand">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
