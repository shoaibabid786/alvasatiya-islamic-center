import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import type { Department } from "@/data/departments";
import { SITE } from "@/data/site";

export default function DepartmentView({ dept }: { dept: Department }) {
  return (
    <>
      <PageHero eyebrow="Departments" title={dept.name} description={dept.tagline} />
      <section className="py-12">
        <div className="section-container prose-islamic max-w-4xl">
          <h2>Introduction</h2>
          <p>{dept.intro}</p>
          <h2>Purpose</h2>
          <p>{dept.purpose}</p>
          <h2>Objectives</h2>
          <ul>{dept.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
          <h2>Services</h2>
          <ul>{dept.services.map((o) => <li key={o}>{o}</li>)}</ul>
          <h2>Programs</h2>
          <ul>{dept.programs.map((o) => <li key={o}>{o}</li>)}</ul>
          <h2>Activities</h2>
          <ul>{dept.activities.map((o) => <li key={o}>{o}</li>)}</ul>
          {dept.notes && (
            <>
              <h2>Notes</h2>
              <ul>{dept.notes.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          )}
          {dept.slug === "social-media" && (
            <div className="card-surface p-6 mt-6">
              <h2 className="!mt-0">Official platforms</h2>
              <ul>
                <li><a href={SITE.social.facebook}>Facebook</a></li>
                <li><a href={SITE.social.twitter}>X / Twitter</a></li>
                <li>YouTube — official URL to be added</li>
                <li>Instagram — official URL to be added</li>
                <li>TikTok — official URL to be added</li>
              </ul>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            <article className="card-surface p-5"><h3 className="font-semibold">Gallery</h3><p className="text-sm text-muted mt-2">Official photos will appear here when provided.</p></article>
            <article className="card-surface p-5"><h3 className="font-semibold">Videos / media</h3><p className="text-sm text-muted mt-2">Department media can be linked from the media library.</p></article>
            <article className="card-surface p-5"><h3 className="font-semibold">Latest updates</h3><p className="text-sm text-muted mt-2">Updates will be published as they are confirmed.</p></article>
            <article className="card-surface p-5"><h3 className="font-semibold">Events</h3><p className="text-sm text-muted mt-2">Related events are listed on the Islamic Events page.</p></article>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {dept.cta && <Link href={dept.cta.href} className="btn btn-gold">{dept.cta.label}</Link>}
            <Link href="/contact" className="btn btn-green">Contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
