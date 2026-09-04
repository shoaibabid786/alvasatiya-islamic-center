import { BookOpen, GraduationCap, Laptop, Utensils } from "lucide-react";

const CARDS = [
  {
    title: "Quran Education",
    text: "Support children learning the Quran with qualified teachers and resources.",
    icon: BookOpen,
  },
  {
    title: "Islamic Education",
    text: "Help students gain authentic Islamic knowledge and spiritual guidance.",
    icon: GraduationCap,
  },
  {
    title: "Food & Accommodation",
    text: "Support students who need meals and accommodation during their studies.",
    icon: Utensils,
  },
  {
    title: "Education & Skills",
    text: "Help provide educational and IT opportunities for a brighter future.",
    icon: Laptop,
  },
] as const;

export default function SupportUsSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-ivory to-[#e8efd0]">
      <div className="section-container text-center">
        <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-green-deep">Support Us</p>
        <div className="mx-auto mt-2 h-px w-14 bg-green-deep" />
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-green-deep max-w-3xl mx-auto leading-tight">
          Your Support Can Become Someone&apos;s Hope
        </h2>
        <p className="mt-4 text-muted max-w-2xl mx-auto">
          Your generosity can help provide Islamic education, Quran learning, meals, accommodation, schooling and opportunities for those who need them.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 text-center">
          {CARDS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-[#e5e7eb] bg-white p-7 shadow-sm">
              <div className="mx-auto w-14 h-14 rounded-full bg-[#f3f4f6] text-green-deep grid place-items-center">
                <item.icon className="w-6 h-6" strokeWidth={1.6} />
              </div>
              <h3 className="mt-5 font-semibold text-green-deep">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
