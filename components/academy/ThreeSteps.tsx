import { BookOpen, CalendarCheck, GraduationCap } from "lucide-react";
import { LEARNING_STEPS } from "@/data/academy";

const ICONS = [BookOpen, CalendarCheck, GraduationCap];

export default function ThreeSteps() {
  return (
    <section className="py-16 md:py-20 bg-sage">
      <div className="section-container">
        <p className="section-eyebrow">Simple path</p>
        <h2 className="section-title">3 Simple Steps</h2>
        <div className="geometric-divider !mx-0" />
        <ol className="mt-12 grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gold/60" aria-hidden />
          {LEARNING_STEPS.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <li key={item.title} className="relative card-surface p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-green-deep text-gold grid place-items-center">
                  <Icon className="w-6 h-6" />
                </div>
                <p className="mt-4 text-xs tracking-[0.2em] text-gold font-semibold">{item.step}</p>
                <h3 className="mt-2 font-semibold text-green-deep uppercase tracking-wide">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
