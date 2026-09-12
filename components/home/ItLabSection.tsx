import Image from "next/image";
import Link from "next/link";
import { ArrowRight, GraduationCap, HeartHandshake, Monitor, Palette, Sparkles, Video } from "lucide-react";

const SKILLS = [
  {
    title: "Basic Computer",
    text: "Typing, files, internet, and everyday computer use for study and office work.",
    icon: Monitor,
  },
  {
    title: "Video Editing",
    text: "Students learn to cut, title, and present video for lessons and community work.",
    icon: Video,
  },
  {
    title: "Graphic Designing",
    text: "Posters, logos, and visual design with practical classroom practice.",
    icon: Palette,
  },
  {
    title: "Basic AI",
    text: "Simple, lawful uses of AI tools to help with study, writing, and design.",
    icon: Sparkles,
  },
] as const;

export default function ItLabSection({ variant = "home" }: { variant?: "home" | "page" }) {
  const onPage = variant === "page";

  return (
    <section className={onPage ? "py-16 md:py-20 bg-ivory" : "py-16 md:py-20 bg-white"}>
      <div className="section-container grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="relative">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[540px] rounded-3xl overflow-hidden border border-gold/25 shadow-[var(--shadow-md)]">
            <Image
              src="/images/institutions/it-lab-students.png"
              alt="Islamic students learning computers with a teacher in THS IT Lab"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <div className="absolute bottom-5 left-5 right-5 sm:right-auto max-w-sm rounded-2xl bg-green-deep text-ivory px-4 py-3 shadow-md">
            <p className="text-[0.68rem] font-semibold tracking-[0.18em] uppercase text-gold-soft">Donated by</p>
            <p className="mt-1 font-semibold leading-snug">Taleem o Hunar Society</p>
          </div>
        </div>

        <div>
          <div className="h-px w-12 bg-green-deep mb-3" />
          <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-green-deep">THS IT Lab</p>
          <h2 className="mt-3 text-3xl md:text-[2.15rem] font-bold text-green-deep leading-tight">
            Where students learn computers, design, and useful digital skills
          </h2>
          <p className="mt-4 text-muted">
            This lab was donated by Taleem o Hunar Society. Islamic students sit at computers and learn basic computer use, video editing, graphic designing, basic AI, and more — with teachers who also manage the lab courses.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {SKILLS.map((item) => (
              <article key={item.title} className="flex gap-3 items-start rounded-2xl bg-white border border-[#e5e7eb] p-4 shadow-sm">
                <div className="shrink-0 w-11 h-11 rounded-full bg-gold/35 text-green-deep grid place-items-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-deep">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <article className="mt-3 flex gap-3 items-start rounded-2xl bg-white border border-gold/30 p-4 shadow-sm">
            <div className="shrink-0 w-11 h-11 rounded-full bg-green-deep text-gold-soft grid place-items-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-green-deep">Courses and teachers</h3>
              <p className="mt-1 text-sm text-muted">
                THS IT Lab also manages its own courses and teachers, so students learn in a planned class with a named instructor.
              </p>
            </div>
          </article>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {onPage ? (
              <>
                <Link href="/contact" className="btn btn-green">
                  Ask about a seat
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/courses" className="btn btn-outline">
                  Browse courses
                </Link>
              </>
            ) : (
              <>
                <Link href="/institutions/ths-it-lab" className="btn btn-green">
                  Visit THS IT Lab
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn btn-outline">
                  Ask about a seat
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
            <HeartHandshake className="w-4 h-4 text-green-deep shrink-0" />
            Equipment and setup supported by Taleem o Hunar Society.
          </p>
        </div>
      </div>
    </section>
  );
}
