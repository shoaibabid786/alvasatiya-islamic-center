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
          {dept.objectives.length ? (
            <>
              <h2>Objectives</h2>
              <ul>{dept.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          ) : null}
          {dept.services.length ? (
            <>
              <h2>Services</h2>
              <ul>{dept.services.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          ) : null}
          {dept.programs.length ? (
            <>
              <h2>Programs</h2>
              <ul>{dept.programs.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          ) : null}
          {dept.activities.length ? (
            <>
              <h2>Activities</h2>
              <ul>{dept.activities.map((o) => <li key={o}>{o}</li>)}</ul>
            </>
          ) : null}
          {dept.slug === "social-media" ? (
            <div className="card-surface p-6 mt-6">
              <h2 className="!mt-0">Official platforms</h2>
              <ul>
                <li><a href={SITE.social.facebook}>Facebook</a></li>
                <li><a href={SITE.social.youtube}>YouTube</a></li>
                <li><a href={SITE.social.instagram}>Instagram</a></li>
                <li><a href={SITE.social.twitter}>X / Twitter</a></li>
              </ul>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {dept.cta ? <Link href={dept.cta.href} className="btn btn-gold">{dept.cta.label}</Link> : null}
            <Link href="/contact" className="btn btn-green">Contact</Link>
          </div>
        </div>
      </section>
    </>
  );
}
