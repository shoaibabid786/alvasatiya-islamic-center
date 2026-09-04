"use client";

import { usePathname } from "next/navigation";
import QuranBanner from "@/components/layout/QuranBanner";
import SloganBar from "@/components/layout/SloganBar";
import BrandBar from "@/components/layout/BrandBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BreadcrumbBar from "@/components/seo/BreadcrumbBar";
import BackToTop from "@/components/home/BackToTop";

function isLmsPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/join")
  );
}

function isAuthPage(pathname: string) {
  return pathname === "/login" || pathname === "/signup" || pathname.startsWith("/forgot-password");
}

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isLmsPath(pathname)) return <>{children}</>;
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <QuranBanner />
      <SloganBar />
      <BrandBar />
      <Navbar />
      {isAuthPage(pathname) ? null : <BreadcrumbBar />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {isAuthPage(pathname) ? null : <Footer />}
      <BackToTop />
    </div>
  );
}
