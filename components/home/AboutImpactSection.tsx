import Link from "next/link";
import { BookOpen, Globe, Handshake, HeartHandshake, Landmark, GraduationCap, Timer, Users } from "lucide-react";
import { aboutIntro } from "@/data/about";
import { courses } from "@/data/courses";
import { departments } from "@/data/departments";

const values = [
  { icon: HeartHandshake, title: "Peaceful", text: "Working for peace and serving humanity with dignity." },
  { icon: BookOpen, title: "Knowledge", text: "Pursuing Quran learning and beneficial Islamic education." },
  { icon: Handshake, title: "Welfare", text: "Carrying out activities to assist families and people in need." },
  { icon: Globe, title: "Global Reach", text: "Sharing Islam’s message of knowledge, faith and service." },
];

const stats = [
  { icon: Timer, value: "30+", label: "Years of Islamic Service", tone: "dark" as const },
  { icon: Users, value: `${courses.length}+`, label: "Islamic Courses Offered", tone: "light" as const },
  { icon: GraduationCap, value: `${departments.length}`, label: "Active Departments", tone: "light" as const },
  { icon: Landmark, value: "114", label: "Surahs in the Quran Reader", tone: "dark" as const },
];

export default function AboutImpactSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="section-container grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide uppercase text-green-deep">
            About Alvasatiya — An Islamic Organization
          </h2>
          <div className="mt-3 mb-6 h-px w-40 bg-gold relative">
            <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 rotate-45 bg-gold" />
          </div>
          <blockquote className="border-l-2 border-gold pl-4 italic text-muted">
            {aboutIntro.paragraphs[0]}
          </blockquote>
          <div className="mt-8 grid sm:grid-cols-2 gap-6">
            {values.map((item) => (
              <article key={item.title} className="flex gap-3">
                <div className="shrink-0 w-11 h-11 rounded-full bg-sage text-green-deep grid place-items-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-deep">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/about/introduction" className="btn btn-green mt-8">Read our introduction</Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className={`rounded-2xl p-5 min-h-[150px] flex flex-col justify-between ${
                stat.tone === "dark"
                  ? "bg-green-deep text-ivory islamic-pattern"
                  : "bg-sage text-green-deep"
              }`}
            >
              <stat.icon className={`w-7 h-7 ${stat.tone === "dark" ? "text-gold" : "text-teal"}`} />
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className={`mt-1 text-sm ${stat.tone === "dark" ? "text-ivory/80" : "text-muted"}`}>{stat.label}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
