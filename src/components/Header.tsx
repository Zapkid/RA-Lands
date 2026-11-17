"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { clsx } from "clsx";
import { Logo } from "./Logo";
import { NewsletterButton } from "./NewsletterButton";
import { btnGold, container } from "./ui";
import { NAV, SITE } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  // The menu is "open" only for the page it was opened on, so it closes by
  // itself after navigating (no effect needed).
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className={`${container} flex items-center justify-between gap-4 py-2.5`}>
        <Link href="/" aria-label={`${SITE.name} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "whitespace-nowrap px-2.5 py-2 text-[17px] font-semibold transition-colors hover:text-gold-dark",
                    isActive(item.href) ? "text-gold-dark" : "text-sage-deep",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 xl:flex">
          <a href={SITE.phoneHref} className="hidden items-center whitespace-nowrap 2xl:flex gap-2.5 text-sage-deep hover:text-gold-dark">
            <Phone className="h-6 w-6" aria-hidden="true" />
            <span className="leading-tight">
              <span className="block text-[14px] font-bold tracking-wider uppercase">Call us now</span>
              <span className="block text-base font-bold text-navy">{SITE.phone}</span>
            </span>
          </a>
          <Link href="/properties" className={`${btnGold} whitespace-nowrap !px-4 !py-2.5 !text-[14px]`}>
            View Available Land
          </Link>
          <NewsletterButton />
        </div>

        <button
          type="button"
          className="rounded-md p-2 text-olive hover:bg-sage-pale xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpenAt(open ? null : pathname)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-line bg-white xl:hidden">
          <ul className={`${container} flex flex-col py-2`}>
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={clsx(
                    "block border-b border-line/70 py-3 text-base font-semibold",
                    isActive(item.href) ? "text-gold-dark" : "text-olive",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex flex-col gap-1 py-3 text-sm">
              <a href={SITE.phoneHref} className="font-bold text-navy">
                Call {SITE.phone}
              </a>
              <Link href="/properties" className="font-bold text-gold-dark">
                View Available Land
              </Link>
              <NewsletterButton className="font-bold" />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
