import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { NAV } from "@/data/navigation";

export const metadata = pageMeta(
  "About Alvasatiya Islamic Center | Mission, Founder and Locations",
  "Learn who Alvasatiya Islamic Center is, our mission of knowledge, faith and service, founder biography, locations in Lahore, and educational achievements.",
  "/about",
  { keywords: ["Alvasatiya Islamic Center", "about Alvasatiya", "Islamic organization Lahore"] }
);

const links = NAV.find((n) => n.label === "About Us")?.children ?? [];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About Us" title="About Alvasatiya Islamic Center" description="A peaceful institution for Quran, Islamic education, character, and community service." />
      <section className="section-container py-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{item.label}</h2>
            <p className="text-sm text-muted mt-2">Open this landing page.</p>
          </Link>
        ))}
      </section>
    </>
  );
}
