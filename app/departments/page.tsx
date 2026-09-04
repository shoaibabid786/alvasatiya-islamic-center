import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { departments } from "@/data/departments";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Alvasatiya Departments | Jamia, Tehfeez, IT Lab, Science Academy and Welfare",
  "Alvasatiya departments: Jamia Umme Ashraf Jamal, Tehfeez-ul-Quran, IT Lab, Science Academy, welfare, social media and online courses.",
  "/departments"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Departments" title="Departments" description="The real educational and welfare units of Alvasatiya Islamic Center." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((d) => (
          <Link key={d.slug} href={`/departments/${d.slug}`} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{d.name}</h2>
            <p className="text-sm text-muted mt-2">{d.tagline}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
