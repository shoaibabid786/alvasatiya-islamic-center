import Link from "next/link";
import { Landmark, MoonStar, Scale, Sparkles, Sun } from "lucide-react";

const pillars = [
  {
    n: "01",
    arabic: "الشهادة",
    title: "Shahadah",
    name: "Faith",
    text: "The testimony that there is none worthy of worship except Allah, and that Muhammad ﷺ is His Messenger.",
    icon: Sparkles,
  },
  {
    n: "02",
    arabic: "الصلاة",
    title: "Salah",
    name: "Prayer",
    text: "The five daily prayers, a regular act of worship that keeps the heart connected to Allah.",
    icon: Sun,
  },
  {
    n: "03",
    arabic: "الزكاة",
    title: "Zakat",
    name: "Charity",
    text: "An obligatory share of wealth given to those in need, when the conditions of Zakat are met.",
    icon: Scale,
  },
  {
    n: "04",
    arabic: "الصوم",
    title: "Sawm",
    name: "Fasting",
    text: "Fasting in Ramadan, a month of patience, gratitude, and spiritual discipline.",
    icon: MoonStar,
  },
  {
    n: "05",
    arabic: "الحج",
    title: "Hajj",
    name: "Pilgrimage",
    text: "The pilgrimage to the Sacred House in Makkah, required once in a lifetime for those who are able.",
    icon: Landmark,
  },
];

export default function PillarsSection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 bg-green-deep islamic-pattern text-ivory">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="section-container relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow !text-gold-soft">Arkan al-Islam</p>
          <h2 className="section-title !text-ivory">The Five Pillars of Islam</h2>
          <p className="font-arabic text-3xl md:text-4xl mt-3 text-gold-soft" dir="rtl" lang="ar">أركان الإسلام الخمسة</p>
          <div className="geometric-divider" />
          <p className="section-desc mx-auto !text-ivory/80">
            The foundation of Muslim life — taught with care, clarity, and respect.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group relative rounded-3xl border border-gold/30 bg-ivory/8 p-5 text-center hover:bg-ivory/14 hover:border-gold/60 transition-colors"
            >
              <span className="text-[0.65rem] tracking-[0.28em] text-gold">{pillar.n}</span>
              <div className="mt-3 mx-auto w-12 h-12 rounded-full border border-gold/50 grid place-items-center text-gold">
                <pillar.icon className="w-5 h-5" />
              </div>
              <p className="font-arabic text-2xl mt-4 text-gold-soft" dir="rtl" lang="ar">{pillar.arabic}</p>
              <h3 className="mt-2 text-lg font-bold">{pillar.title}</h3>
              <p className="text-xs uppercase tracking-[0.18em] text-gold mt-1">{pillar.name}</p>
              <p className="mt-3 text-sm text-ivory/80 leading-relaxed">{pillar.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/islamic-services/islamic-education" className="btn btn-gold">Learn more</Link>
        </div>
      </div>
    </section>
  );
}
