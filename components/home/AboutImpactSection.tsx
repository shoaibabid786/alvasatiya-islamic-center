import Link from "next/link";
import { ArrowRight, BookOpen, Globe, Handshake, HeartHandshake, Landmark, GraduationCap, Timer, Users } from "lucide-react";
import { aboutIntro } from "@/data/about";
import { courses } from "@/data/courses";
import { departments } from "@/data/departments";
import { SITE } from "@/data/site";

const values = [
  { icon: HeartHandshake, title: "Peaceful", text: "Working for peace and serving humanity with dignity." },
  { icon: BookOpen, title: "Knowledge", text: "Pursuing Quran learning and beneficial Islamic education." },
  { icon: Handshake, title: "Welfare", text: "Carrying out activities to assist families and people in need." },
  { icon: Globe, title: "Global Reach", text: "Sharing Islam’s message of knowledge, faith and service." },
];

const stats = [
  { icon: Timer, value: "30+", label: "Years of Islamic Service" },
  { icon: Users, value: `${courses.length}+`, label: "Islamic Courses Offered" },
  { icon: GraduationCap, value: `${departments.length}`, label: "Active Departments" },
  { icon: Landmark, value: "114", label: "Surahs in the Quran Reader" },
];

export default function AboutImpactSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-ivory">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-green-deep/10 blur-3xl" />

      <div className="section-container relative">
        <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-6 lg:gap-8 items-stretch">
          <div className="rounded-[2rem] bg-white/90 border border-gold/25 shadow-[var(--shadow-md)] backdrop-blur-sm p-7 sm:p-10 lg:p-12">
            <p className="section-eyebrow">About Alvasatiya</p>
            <h2 className="section-title max-w-xl">An Islamic organization on a justly balanced path</h2>
            <div className="geometric-divider !mx-0" />
            <p className="text-muted leading-relaxed">{aboutIntro.paragraphs[0]}</p>

            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {values.map((item) => (
                <article
                  key={item.title}
                  className="group rounded-2xl border border-gold/20 bg-ivory/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-[var(--shadow-sm)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-green-deep text-gold-soft">
                      <item.icon className="w-[18px] h-[18px]" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-green-deep">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted leading-snug">{item.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/about/introduction" className="btn bg-gold hover:text-white hover:bg-[#283618]">
                Read our introductiond
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn btn-outline">
                About the Center
              </Link>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-[2rem] bg-green-deep text-ivory islamic-pattern p-7 sm:p-9 flex flex-col">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
            <p className="text-gold-soft text-[0.7rem] font-semibold tracking-[0.22em] uppercase">Center at a glance</p>
            <p className="font-arabic mt-4 text-2xl sm:text-3xl text-gold-soft leading-relaxed" dir="rtl" lang="ar">
              {SITE.ayahArabic}
            </p>
            <p className="mt-2 text-sm text-ivory/70 italic">{SITE.ayahEnglish}</p>

            <ul className="mt-8 flex-1 divide-y divide-gold/20">
              {stats.map((stat) => (
                <li key={stat.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="shrink-0 grid place-items-center w-11 h-11 rounded-full border border-gold/40 bg-ivory/5">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-3xl sm:text-4xl font-bold tracking-tight text-ivory leading-none">{stat.value}</p>
                    <p className="mt-1.5 text-sm text-ivory/75">{stat.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
