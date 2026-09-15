import { headers } from "next/headers";
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

export default async function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") || "";
  if (isLmsPath(pathname)) return <>{children}</>;
  const hideChrome = isAuthPage(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <QuranBanner />
      <SloganBar />
      <BrandBar />
      <Navbar />
      {hideChrome ? null : <BreadcrumbBar />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {hideChrome ? null : <Footer />}
      <BackToTop />
    </div>
  );
}
