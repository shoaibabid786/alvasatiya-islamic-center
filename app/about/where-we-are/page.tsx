import PageHero from "@/components/layout/PageHero";
import { locations } from "@/data/about";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Where We Are | Headquarters in Lahore and Online Presence",
  "Visit Jamia Umme Ashraf Jamal in Lahore, view branch information, maps, office hours, phone and email for Alvasatiya Islamic Center.",
  "/about/where-we-are"
);

export default function Page() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  return (
    <>
      <PageHero eyebrow="About Us" title="Where We Are" description="Headquarters, branches, and a global digital doorway." />
      <section className="section-container py-12 grid md:grid-cols-2 gap-5">
        {locations.map((loc) => (
          <article key={loc.name} className="card-surface p-6">
            <p className="text-xs uppercase tracking-widest text-gold">{loc.role}</p>
            <h2 className="font-semibold text-green-deep mt-1">{loc.name}</h2>
            <p className="mt-2 text-muted">{loc.address}</p>
            <p className="mt-2 text-sm text-muted">{loc.note}</p>
          </article>
        ))}
      </section>
      <section className="section-container pb-12">
        <h2 className="section-title">Map</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-border h-80">
          <iframe title="Alvasatiya headquarters map" src={mapSrc} className="w-full h-full" loading="lazy" />
        </div>
        <p className="mt-4 text-sm text-muted">Phone: {SITE.phone} · Email: {SITE.email} · Hours: {SITE.officeHours}</p>
      </section>
    </>
  );
}
