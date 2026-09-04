import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import type { Institution } from "@/data/institutions";
import { formatStudentCount } from "@/data/institutions";
import CountUp from "@/components/ui/CountUp";
import SuccessStoriesCarousel from "@/components/home/SuccessStoriesCarousel";
import { SITE } from "@/data/site";
import { getTehfeezBranches } from "@/lib/institutions";

export default function InstitutionDetail({
  institution,
  related,
}: {
  institution: Institution;
  related?: Institution[];
}) {
  const branches = institution.kind === "branch-network" ? getTehfeezBranches() : related ?? [];
  const mapQuery = institution.location.includes("to be published") ? SITE.address : institution.location;

  return (
    <>
    <article>
      <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden bg-green-deep islamic-pattern">
        <Image src={institution.image} alt={institution.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/85 via-green-deep/50 to-transparent" />
        <div className="absolute inset-0 section-container flex items-end pb-8">
          <div className="text-ivory max-w-3xl">
            <p className="text-gold-soft text-xs tracking-[0.2em] uppercase">{institution.eyebrow}</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-bold">{institution.title}</h1>
            <p className="mt-3 text-ivory/90">{institution.summary}</p>
          </div>
        </div>
      </div>

      <div className="section-container py-10 md:py-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        <div className="space-y-10 prose-islamic max-w-none">
          <section>
            <h2>Introduction</h2>
            {institution.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
          <section>
            <h2>Location</h2>
            <p className="inline-flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-gold shrink-0" />
              <span>{institution.location}</span>
            </p>
          </section>
          <section>
            <h2>Educational Programs</h2>
            <div className="grid gap-4 not-prose">
              {institution.educationalPrograms.map((program) => (
                <article key={program.title} className="card-surface p-5">
                  <h3 className="font-semibold text-green-deep">{program.title}</h3>
                  <p className="mt-2 text-sm text-muted">{program.text}</p>
                </article>
              ))}
            </div>
          </section>
          <section>
            <h2>Student Statistics</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <article className="rounded-2xl bg-green-deep text-ivory p-5 islamic-pattern">
                <Users className="w-6 h-6 text-gold" />
                <p className="mt-3 text-4xl font-bold text-gold">
                  <CountUp value={institution.students} />
                </p>
                <p className="text-sm text-ivory/80">Students</p>
              </article>
              {institution.programs.map((program) => (
                <article key={program.id} className="card-surface p-5">
                  <p className="text-3xl font-bold text-green-deep">
                    <CountUp value={program.students} />
                  </p>
                  <p className="text-sm text-muted mt-1">{program.label}</p>
                </article>
              ))}
            </div>
            {institution.students == null && (
              <p className="text-sm text-muted mt-3">This figure is published when Admin confirms it.</p>
            )}
          </section>
          {institution.kind === "branch-network" && (
            <section>
              <h2>Branches</h2>
              <div className="grid sm:grid-cols-2 gap-4 not-prose">
                {branches.map((branch, index) => (
                  <Link key={branch.slug} href={branch.href} className="card-surface p-5 block">
                    <p className="text-xs uppercase tracking-widest text-gold">Branch {index + 1}</p>
                    <h3 className="mt-1 font-semibold text-green-deep">{branch.title}</h3>
                    <p className="mt-2 text-sm text-muted">
                      {branch.students == null
                        ? "Student count to be published · Hifz-ul-Quran"
                        : `${formatStudentCount(branch.students)} students · Hifz-ul-Quran`}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2>Facilities</h2>
            <ul>
              {institution.facilities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Teachers</h2>
            <p>{institution.teachers}</p>
          </section>
          <section>
            <h2>Activities</h2>
            <ul>
              {institution.activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <h2>Gallery</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              {institution.gallery.map((item) => (
                <div key={item.src} className="relative h-44 rounded-2xl overflow-hidden">
                  <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" />
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2>Admissions</h2>
            <p>{institution.admissions}</p>
          </section>
          <section>
            <h2>Contact</h2>
            <p>{institution.contactNote}</p>
            <p className="mt-2">
              {SITE.phone} · {SITE.email}
            </p>
          </section>
        </div>

        <aside className="space-y-5 h-max lg:sticky lg:top-24">
          <div className="card-surface p-6">
            <p className="text-xs uppercase tracking-widest text-gold">{institution.eyebrow}</p>
            <h2 className="text-xl font-bold text-green-deep mt-1">{institution.title}</h2>
            <p className="mt-3 text-sm text-muted inline-flex gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
              {institution.location}
            </p>
            <p className="mt-4 text-3xl font-bold text-gold">
              <CountUp value={institution.students} />
            </p>
            <p className="text-xs uppercase tracking-widest text-muted">Students</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/contact" className="btn btn-gold w-full">Enquire Now</Link>
              <Link href="/social-services/donate" className="btn btn-green w-full">Support Students</Link>
              <Link href="/courses" className="btn btn-outline w-full">View Courses</Link>
            </div>
          </div>
          <div className="h-56 rounded-2xl overflow-hidden border border-border">
            <iframe
              title={`Map for ${institution.title}`}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </article>
    <SuccessStoriesCarousel showDonate />
    </>
  );
}
