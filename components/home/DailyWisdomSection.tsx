import type { ReactNode } from "react";
import DailyWisdomCard from "@/components/home/DailyWisdomCard";
import { getAyatOfTheDay, getHadeesOfTheDay } from "@/data/dailyWisdom";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-center text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-gold">Daily Wisdom</p>
      <div className="mx-auto mt-2 mb-3 h-px w-16 bg-green-mid" />
      <h2 className="text-center text-3xl md:text-4xl font-bold text-green-deep">{title}</h2>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export default function DailyWisdomSection() {
  const hadees = getHadeesOfTheDay();
  const ayat = getAyatOfTheDay();

  return (
    <section className="plus-pattern py-16 md:py-20">
      <div className="section-container space-y-16">
        <Block title="Hadees of the Day">
          <DailyWisdomCard item={hadees} />
        </Block>
        <Block title="Ayat of the Day">
          <DailyWisdomCard item={ayat} />
        </Block>
      </div>
    </section>
  );
}
