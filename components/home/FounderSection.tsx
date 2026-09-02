import Link from "next/link";
import FounderPhoto from "@/components/home/FounderPhoto";
import { BookOpen, GraduationCap, HeartHandshake, Timer } from "lucide-react";
import { founder } from "@/data/about";

const stats = [
  { icon: Timer, value: "30+", label: "Years of Service" },
  { icon: HeartHandshake, value: "700+", label: "Reported Converts" },
  { icon: GraduationCap, value: "Many", label: "Scholars & Students Taught" },
  { icon: BookOpen, value: "30 Years", label: "Islamic Education & Service" },
];

export default function FounderSection() {
  return (
    <section className="py-16 md:py-20 bg-ivory islamic-pattern-light">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow">Leadership</p>
          <h2 className="section-title">Meet Our Founder</h2>
          <div className="geometric-divider" />
          <p className="text-xl font-semibold text-green-deep">{founder.name}</p>
        </div>
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
          <div className="relative max-w-md mx-auto lg:mx-0">
            <div className="absolute -inset-3 border border-gold/50 rounded-[1.6rem]" />
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-green-deep border-4 border-gold/40">
              <FounderPhoto />
            </div>
          </div>
          <div>
            <p className="text-muted leading-relaxed">{founder.biography[0]}</p>
            <ul className="mt-6 space-y-2 text-green-deep">
              {founder.highlights.map((item) => (
                <li key={item} className="pl-4 border-l-2 border-gold">{item}</li>
              ))}
            </ul>
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {stats.map((stat) => (
                <article key={stat.label} className="card-surface p-5">
                  <stat.icon className="w-5 h-5 text-gold" />
                  <p className="mt-2 text-2xl font-bold text-green-deep">{stat.value}</p>
                  <p className="text-sm text-muted">{stat.label}</p>
                </article>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted">
              The 700+ figure is an organization-provided claim and should be independently verified before public publication.
            </p>
            <blockquote className="mt-8 card-surface p-6 border-l-4 border-gold">
              <p className="text-xs uppercase tracking-[0.2em] text-gold">Founder’s Message</p>
              <p className="mt-3 text-muted italic">{founder.message}</p>
            </blockquote>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about/founder" className="btn btn-gold">Read Full Biography</Link>
              <Link href="/about/mission" className="btn btn-green">Our Mission</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
