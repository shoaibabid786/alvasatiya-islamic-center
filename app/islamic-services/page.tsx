import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { NAV } from "@/data/navigation";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Services | Library, Education, Media, Courses and New Muslims",
  "Explore Alvasatiya Islamic services: books library, Zakat calculator, Islamic education, media, new Muslims guidance, courses, events and blogs.",
  "/islamic-services"
);

const links = NAV.find((n) => n.label === "Islamic Services")?.children ?? [];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Services" description="Educational tools and resources for a living, learning community." />
      <section className="section-container py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{item.label}</h2>
          </Link>
        ))}
      </section>
    </>
  );
}
