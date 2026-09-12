import Link from "next/link";
import { GraduationCap, Monitor, Users } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import ItLabSection from "@/components/home/ItLabSection";
import JsonLd from "@/components/seo/JsonLd";
import { seedInstitution } from "@/data/institutions";
import { pageMeta } from "@/lib/seo";
import { educationalOrgSchema, faqSchema } from "@/lib/schema";
import { SITE } from "@/data/site";

const PATH = "/institutions/ths-it-lab";

export const metadata = pageMeta(
  "THS IT Lab",
  "THS IT Lab, donated by Taleem o Hunar Society. Students learn basic computer, video editing, graphic designing, basic AI, and more.",
  PATH,
  { image: "/images/institutions/it-lab-students.png", imageAlt: "Students learning computers in THS IT Lab" }
);

const MANAGED = [
  {
    title: "Lab courses",
    text: "Basic computer, video editing, graphic designing, basic AI, and further modules announced by the office.",
    icon: Monitor,
  },
  {
    title: "Lab teachers",
    text: "Appointed instructors run each class. Names are published when the office confirms them.",
    icon: Users,
  },
  {
    title: "Student groups",
    text: "Islamic students join planned batches so computer skills sit beside Quran and Islamic studies.",
    icon: GraduationCap,
  },
] as const;

export default function ThsItLabPage() {
  const item = seedInstitution("alvasatiya-it-lab");

  return (
    <>
      <JsonLd
        data={[
          educationalOrgSchema(
            "THS IT Lab",
            item?.summary ?? "Computer and digital-skills classroom donated by Taleem o Hunar Society.",
            PATH,
            item?.location ?? "Lahore",
            item?.students
          ),
          faqSchema([
            {
              q: "Who donated THS IT Lab?",
              a: "The lab was donated by Taleem o Hunar Society.",
            },
            {
              q: "What do students learn?",
              a: "Basic computer, video editing, graphic designing, basic AI, and more.",
            },
            {
              q: "How do I apply?",
              a: item?.admissions ?? "Ask the office about current THS IT Lab groups and whether a seat is available.",
            },
          ]),
        ]}
      />
      <PageHero
        eyebrow="Technology Education"
        title="THS IT Lab"
        description="Donated by Taleem o Hunar Society — a computer classroom for Islamic students."
      />
      <ItLabSection variant="page" />

      <section className="py-14 md:py-16 bg-white">
        <div className="section-container">
          <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-green-deep">How the lab is run</p>
          <div className="mt-2 h-px w-14 bg-green-deep" />
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-green-deep max-w-2xl">
            THS IT Lab manages its own courses and teachers
          </h2>
          <p className="mt-3 text-muted max-w-2xl">
            The lab is not only a room of computers. It keeps a course list and appointed teachers so students learn in a planned class.
          </p>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {MANAGED.map((card) => (
              <article key={card.title} className="rounded-2xl border border-[#e5e7eb] bg-ivory p-6">
                <div className="w-11 h-11 rounded-full bg-gold/35 text-green-deep grid place-items-center">
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-semibold text-green-deep">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/contact" className="btn btn-gold">
              Enquire now
            </Link>
            <Link href="/social-services/donate" className="btn btn-green">
              Support students
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted">
            {SITE.phone} · {SITE.email} · Mention THS IT Lab when you write.
          </p>
        </div>
      </section>
    </>
  );
}
