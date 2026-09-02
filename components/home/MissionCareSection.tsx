import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Heart, Home, School, Utensils } from "lucide-react";

const ITEMS = [
  {
    title: "Free Islamic Education",
    text: "Islamic education for eligible children, so knowledge is not closed by lack of means.",
    icon: GraduationCap,
  },
  {
    title: "Three Free Meals",
    text: "Meal support for eligible boarding and deserving students, offered with dignity.",
    icon: Utensils,
  },
  {
    title: "Free Schooling",
    text: "General schooling support for eligible children, arranged through the Center's campuses.",
    icon: School,
  },
  {
    title: "Free Accommodation",
    text: "Boarding support for eligible students who travel to study, as approved by the office.",
    icon: Home,
  },
] as const;

export default function MissionCareSection() {
  return (
    <section className="py-16 md:py-20 bg-ivory">
      <div className="section-container grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className="relative">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[520px] rounded-3xl overflow-hidden">
            <Image
              src="/images/hero/education.png"
              alt="Students and teachers in an Islamic educational setting"
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          <Link
            href="/social-services/donate"
            className="absolute bottom-5 left-5 w-12 h-12 rounded-lg bg-green-deep text-ivory grid place-items-center shadow-md"
            aria-label="Support our mission"
          >
            <Heart className="w-5 h-5" />
          </Link>
        </div>
        <div>
          <div className="h-px w-12 bg-green-deep mb-3" />
          <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-green-deep">Our Mission</p>
          <h2 className="mt-3 text-3xl md:text-[2.15rem] font-bold text-green-deep leading-tight">
            Serving Humanity Through Education &amp; Care
          </h2>
          <p className="mt-4 text-muted">
            Alvasatiya works to provide opportunities and support to children and communities who need them most. Eligible poor and orphan students may receive education, and where the office approves it, accommodation and meals, free of cost.
          </p>
          <div className="mt-6 space-y-3">
            {ITEMS.map((item) => (
              <article key={item.title} className="flex gap-4 items-start rounded-2xl bg-white border border-[#e5e7eb] p-4 shadow-sm">
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
        </div>
      </div>
    </section>
  );
}
