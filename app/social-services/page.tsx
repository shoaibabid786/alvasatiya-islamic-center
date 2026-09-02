import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { NAV } from "@/data/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Social Services | Fatwa Q&A, Welfare, Donate, Hajj and Prayer Times",
  "Alvasatiya social services: educational Fatwa Q&A, welfare programs, donations, Hajj and Umrah guidance, and daily prayer times.",
  "/social-services"
);

const links = NAV.find((n) => n.label === "Social Services")?.children ?? [];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Social Services" title="Social Services" description="Questions, welfare, giving, pilgrimage education, and prayer times." />
      <section className="section-container py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{item.label}</h2>
          </Link>
        ))}
      </section>
    </>
  );
}
