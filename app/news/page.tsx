import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { newsItems } from "@/data/media";
import { events } from "@/data/events";
import { blogs } from "@/data/blogs";
import { mediaItems } from "@/data/media";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "News & Announcements | Alvasatiya Stories, Events and Media",
  "Latest Alvasatiya news, announcements, articles, events, videos and featured stories from the Islamic Center in Lahore.",
  "/news"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="News & Media" title="News & Media" description="Announcements, stories, events, and media from Alvasatiya." />
      <section className="section-container py-12 space-y-12">
        <div>
          <h2 className="section-title">Latest news & announcements</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {newsItems.map((n) => (
              <article key={n.slug} className="card-surface p-6">
                <p className="text-xs text-gold uppercase">{n.category} · {n.date}</p>
                <h3 className="font-semibold text-green-deep mt-2">{n.title}</h3>
                <p className="text-sm text-muted mt-2">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <h2 className="section-title">Islamic articles</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {blogs.slice(0, 3).map((b) => (
              <Link key={b.slug} href={`/islamic-services/islamic-blogs/${b.slug}`} className="card-surface p-6 block">
                <h3 className="font-semibold text-green-deep">{b.title}</h3>
                <p className="text-sm text-muted mt-2">{b.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="section-title">Events</h2>
          <ul className="mt-4 space-y-2">
            {events.map((e) => (
              <li key={e.slug} className="card-surface p-4">{e.date} — {e.title}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="section-title">Videos & photo gallery</h2>
          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mediaItems.map((m) => (
              <article key={m.id} className="card-surface p-5">
                <p className="text-xs text-gold uppercase">{m.type}</p>
                <h3 className="font-semibold mt-1">{m.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
