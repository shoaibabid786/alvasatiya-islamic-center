"use client";

import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/data/courses";
import FaqAccordion from "@/components/ui/FaqAccordion";
import { CourseIcon } from "@/components/academy/CourseIcon";

export default function CourseDetail({ course }: { course: Course }) {
  return (
    <article>
      <div className="relative h-56 sm:h-72 md:h-96 overflow-hidden bg-green-deep">
        <Image src={course.banner || course.image} alt={course.title} fill className="object-cover" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/80 via-green-deep/45 to-transparent" />
        <div className="absolute inset-0 section-container flex items-end pb-8">
          <div className="text-ivory max-w-3xl">
            <p className="text-gold-soft text-xs tracking-[0.2em] uppercase">{course.category}</p>
            <h1 className="mt-2 text-3xl md:text-5xl font-bold">{course.title}</h1>
            <p className="mt-3 text-ivory/90">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="section-container py-10 md:py-14 grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        <div className="space-y-10">
          <Section title="About Course"><p>{course.about}</p></Section>
          <Section title="What You Will Learn"><Bullets items={course.learn} /></Section>
          <Section title="Course Topics"><Bullets items={course.topics} /></Section>
          <Section title="What You Will Achieve"><Bullets items={course.achieve} /></Section>
          <Section title="Course Curriculum">
            <div className="space-y-4">
              {course.curriculum.map((block) => (
                <div key={block.title} className="card-surface p-5">
                  <h3 className="font-semibold text-green-deep">{block.title}</h3>
                  <ul className="mt-2 space-y-1 text-muted list-disc pl-5">
                    {block.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Who Is This Course For?"><Bullets items={course.whoFor} /></Section>
          <Section title="Course Features"><Bullets items={course.features} /></Section>
          <Section title="Teacher">
            <p className="font-semibold text-green-deep">{course.instructor}</p>
            <p className="mt-2">{course.teacherBio}</p>
          </Section>
          <Section title="FAQs">
            <FaqAccordion items={course.faqs} />
          </Section>
        </div>

        <aside className="card-surface p-6 h-max lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-sage text-green-deep grid place-items-center">
              <CourseIcon name={course.icon} className="w-6 h-6" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-widest text-gold">{course.category}</p>
              <h2 className="text-xl font-bold text-green-deep">{course.title}</h2>
            </div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <Row label="Duration" value={course.duration} />
            <Row label="Class Duration" value={course.classDuration} />
            <Row label="Languages" value={course.language} />
            <Row label="Level" value={course.level} />
            <Row label="Live/Online Format" value={course.liveFormat} />
            <Row label="Mode" value={course.mode} />
          </dl>
          <div className="mt-6 flex flex-col gap-3">
            <Link href={`/demo?course=${course.slug}`} className="btn btn-gold w-full">Book Free Demo</Link>
            <Link href={`/courses/${course.slug}/enroll`} className="btn btn-green w-full">Enroll Now</Link>
          </div>
          <p className="text-xs text-muted mt-4">
            Enrollment becomes active only after secure server-side payment verification. The student portal then unlocks for this course.
          </p>
        </aside>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-deep">{title}</h2>
      <div className="mt-3 text-muted">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 list-disc pl-5">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-semibold text-green-deep">{label}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}
