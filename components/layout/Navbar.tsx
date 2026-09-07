"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, MessageSquare, X } from "lucide-react";
import { NAV, type NavItem } from "@/data/navigation";
import SiteAccountMenu from "@/components/layout/SiteAccountMenu";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(pathname, item.href);
  if (!item.children) {
    return (
      <Link href={item.href} className="nav-link" aria-current={active ? "page" : undefined}>
        {item.label}
      </Link>
    );
  }
  return (
    <div className="relative group">
      <Link
        href={item.href}
        className="nav-link inline-flex items-center gap-1"
        aria-haspopup="true"
        aria-current={active ? "page" : undefined}
      >
        {item.label}
        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>
      <div className="invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-200 absolute top-full left-0 pt-2 z-50">
        <div
          className={`dropdown-panel py-2 min-w-[260px] ${
            item.label === "Departments" ? "max-h-[70vh] overflow-y-auto" : ""
          }`}
          role="menu"
        >
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="mx-1.5 block rounded-lg px-3 py-2.5 text-sm text-text transition-colors hover:bg-[#e8efd0] hover:text-green-deep"
              role="menuitem"
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 shadow-[0_10px_30px_rgba(40,54,24,0.06)] backdrop-blur-xl">
      <div className="section-container">
        <div className="flex min-h-[3.6rem] items-center gap-1">
          <nav className="hidden min-w-0 flex-1 items-center xl:flex" aria-label="Main navigation">
            {NAV.map((item) => (
              <DesktopItem key={item.label} item={item} pathname={pathname} />
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <SiteAccountMenu />
            <Link
              href="/social-services/donate"
              className="inline-flex items-center gap-1.5 rounded-full bg-ochre px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ivory shadow-[0_6px_16px_rgba(188,108,37,0.28)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#a85d1e] sm:px-4"
            >
              <Heart className="h-3.5 w-3.5" />
              <span>Donate</span>
            </Link>
            <Link
              href="/feedback"
              className="inline-flex items-center gap-1.5 rounded-full border border-ochre/35 bg-white px-3.5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-ochre transition duration-200 hover:-translate-y-0.5 hover:border-ochre hover:bg-ochre hover:text-ivory sm:px-4"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Feedback</span>
            </Link>
            <button
              className="rounded-full p-2 text-green-deep transition-colors hover:bg-[#e8efd0] xl:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="max-h-[80vh] overflow-y-auto border-t border-black/[0.06] bg-ivory text-text xl:hidden">
          <div className="section-container py-3">
            {NAV.map((item) => (
              <div key={item.label} className="border-b border-black/[0.06]">
                {item.children ? (
                  <>
                    <button
                      className="flex w-full items-center justify-between py-3 text-sm font-semibold"
                      aria-expanded={section === item.label}
                      onClick={() => setSection((s) => (s === item.label ? null : item.label))}
                    >
                      {item.label}
                      <ChevronDown className={`h-4 w-4 transition-transform ${section === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {section === item.label && (
                      <div className="pb-3 pl-2">
                        <Link href={item.href} className="block rounded-lg py-2 text-sm text-green-deep">
                          View all
                        </Link>
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href} className="block rounded-lg py-2 text-sm text-muted hover:text-green-deep">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.href} className="block py-3 text-sm font-semibold">
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <SiteAccountMenu variant="mobile" />
          </div>
        </div>
      )}
    </div>
  );
}
