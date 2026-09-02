import {
  Baby,
  BookOpen,
  CalendarClock,
  Clapperboard,
  GraduationCap,
  Languages,
  MonitorSmartphone,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import { WHY_CHOOSE } from "@/data/academy";

const ICONS = [CalendarClock, BookOpen, GraduationCap, Users, Sparkles, Clapperboard, Languages, Baby, MonitorSmartphone, UsersRound];

export default function WhyChoose() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="section-container">
        <p className="section-eyebrow">Why Alvasatiya</p>
        <h2 className="section-title">Why Choose Alvasatiya</h2>
        <div className="geometric-divider !mx-0" />
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
          {WHY_CHOOSE.map((item, index) => {
            const Icon = ICONS[index] ?? BookOpen;
            return (
              <article key={item.title} className="card-surface p-5">
                <div className="w-11 h-11 rounded-full bg-sage text-green-deep grid place-items-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-3 font-semibold text-green-deep">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
