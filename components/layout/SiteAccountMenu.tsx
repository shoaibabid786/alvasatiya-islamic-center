"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, LogOut, UserRound } from "lucide-react";
import { endClientSession } from "@/lib/lms/end-session";
import { dashboardPath, type PublicUser } from "@/lib/lms/types";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "U";
}

function AccountAvatar({ user, size = "sm" }: { user: PublicUser; size?: "sm" | "md" }) {
  const dim = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  if (user.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt=""
        className={`${dim} rounded-full object-cover border border-[rgba(221,161,94,0.45)]`}
      />
    );
  }
  return (
    <span className={`${dim} inline-flex items-center justify-center rounded-full bg-green-deep text-white font-semibold`}>
      {initials(user.name)}
    </span>
  );
}

export default function SiteAccountMenu({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const pathname = usePathname();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/profile", { method: "POST", credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, [pathname]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  if (!user) {
    if (variant === "mobile") {
      return (
        <Link href="/login" className="block py-3 font-semibold text-sm">
          Login
        </Link>
      );
    }
    return (
      <Link
        href="/login"
        className="hidden rounded-full px-3 py-2 text-[0.72rem] font-semibold text-green-deep/80 transition-colors hover:bg-[#e8efd0] hover:text-green-deep sm:inline"
      >
        Login
      </Link>
    );
  }

  const dashboard = user.role === "USER" ? "/social-services/donate" : dashboardPath(user.role);

  const menu = (
    <div className="py-2 min-w-[220px]" role="menu">
      <div className="px-4 py-2 border-b border-border/70">
        <p className="text-sm font-semibold text-green-deep truncate">{user.name}</p>
        <p className="text-xs text-muted truncate">{user.email}</p>
      </div>
      {user.role !== "USER" ? (
        <Link href={dashboard} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-sage hover:text-green-deep" role="menuitem">
          <UserRound className="w-4 h-4" />
          Dashboard
        </Link>
      ) : (
        <Link href="/social-services/donate" className="flex items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-sage hover:text-green-deep" role="menuitem">
          <Heart className="w-4 h-4" />
          Donate
        </Link>
      )}
      <button
        type="button"
        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-text hover:bg-sage hover:text-green-deep"
        onClick={() => endClientSession("/")}
      >
        <LogOut className="w-4 h-4" />
        Sign out
      </button>
    </div>
  );

  if (variant === "mobile") {
    return (
      <div className="py-3">
        <div className="flex items-center gap-3">
          <AccountAvatar user={user} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-green-deep truncate">{user.name}</p>
            <p className="text-xs text-muted truncate">{user.email}</p>
          </div>
        </div>
        <div className="mt-2">{menu}</div>
      </div>
    );
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-[rgba(221,161,94,0.4)] bg-white pl-1 pr-2 py-1 text-left sm:pr-2.5"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <AccountAvatar user={user} />
        <span className="hidden min-w-0 sm:flex sm:flex-col">
          <span className="max-w-[9rem] truncate text-xs font-semibold text-green-deep leading-tight">{user.name}</span>
          <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ochre leading-tight">Logged in</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-green-deep transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <div className="absolute right-0 top-full mt-2 z-50 dropdown-panel">{menu}</div>
      ) : null}
    </div>
  );
}
