import PageHero from "@/components/layout/PageHero";
import ContactForm from "@/components/interactive/ContactForm";
import { SITE } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Contact Alvasatiya Islamic Center | Address, Phone, Email and Message Form",
  "Visit Jamia Umme Ashraf Jamal in Lahore, call +92 300 4840308, or send a message to Alvasatiya Islamic Center.",
  "/contact"
);

export default function Page() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  return (
    <>
      <PageHero eyebrow="Contact Us" title="Contact Us" description="A message, a visit, or a call — we welcome sincere questions and service." />
      <section className="section-container py-12 grid lg:grid-cols-2 gap-8">
        <ContactForm />
        <div className="space-y-4">
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Address</h2>
            <p className="text-muted mt-2">{SITE.headquarters}<br />{SITE.address}</p>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Phone & email</h2>
            <p className="text-muted mt-2">{SITE.phone}<br />{SITE.email}</p>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Office hours</h2>
            <p className="text-muted mt-2">{SITE.officeHours}</p>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Social</h2>
            <p className="mt-2"><a className="text-green-deep underline" href={SITE.social.facebook}>Facebook</a></p>
            <p><a className="text-green-deep underline" href={SITE.social.twitter}>X / Twitter</a></p>
            <p className="text-sm text-muted mt-2">YouTube, Instagram, and TikTok will appear when official URLs are provided.</p>
          </article>
        </div>
      </section>
      <section className="section-container pb-12 h-80">
        <iframe title="Map" src={mapSrc} className="w-full h-full rounded-2xl border border-border" loading="lazy" />
      </section>
    </>
  );
}
