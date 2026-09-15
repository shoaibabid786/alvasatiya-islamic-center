import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import { getHeadquarters, getServiceInstitutions, getTehfeezBranches } from "@/lib/institutions";
import { pageMeta } from "@/lib/seo";
import CountUp from "@/components/ui/CountUp";

export const revalidate = 3600;

export const metadata = pageMeta(
  "Institutions & Branches | Jamia Umme Ashraf Jamal and Tehfeez-ul-Quran",
  "Explore Alvasatiya's headquarters at Jamia Umme Ashraf Jamal, five Tehfeez-ul-Quran Hifz branches, THS IT Lab, and Science Academy in Lahore.",
  "/institutions"
);

export default function Page() {
  const hq = getHeadquarters();
  const branches = getTehfeezBranches();
  const services = getServiceInstitutions();

  return (
    <>
      <PageHero
        eyebrow="Institutions"
        title="Our Institutions & Branches"
        description="Headquarters, Hifz branches, and educational services of Alvasatiya Islamic Center."
      />
      <section className="section-container py-12 space-y-10">
        <article className="card-surface overflow-hidden grid lg:grid-cols-2">
          <div className="relative min-h-[220px]">
            <Image src={hq.image} alt={hq.title} fill className="object-cover" sizes="50vw" />
          </div>
          <div className="p-6 md:p-8">
            <p className="text-xs uppercase tracking-widest text-gold">Main Headquarters</p>
            <h2 className="text-2xl font-bold text-green-deep mt-1">{hq.title}</h2>
            <p className="mt-2 text-muted">{hq.summary}</p>
            <p className="mt-4 text-3xl font-bold text-gold"><CountUp value={hq.students} /></p>
            <p className="text-xs uppercase tracking-widest text-muted">Students</p>
            <Link href={hq.href} className="btn btn-gold mt-6">Explore Institution</Link>
          </div>
        </article>
        <div>
          <h2 className="text-xl font-bold text-green-deep">Tehfeez-ul-Quran branches</h2>
          <div className="mt-4 grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {branches.map((branch, i) => (
              <Link key={branch.slug} href={branch.href} className="card-surface p-4">
                <p className="text-xs uppercase tracking-widest text-gold">Branch {i + 1}</p>
                <p className="mt-2 text-2xl font-bold text-green-deep"><CountUp value={branch.students} unpublished="—" /></p>
                <p className="text-sm text-muted">Hifz students</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-green-deep">Services & institutions</h2>
          <div className="mt-4 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((item) => (
              <Link key={item.slug} href={item.href} className="card-surface p-5">
                <h3 className="font-semibold text-green-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
