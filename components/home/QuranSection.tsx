import Link from "next/link";
import Image from "next/image";
import { Check } from "lucide-react";

const features = [
  "114 Surahs",
  "30 Paras / Juz",
  "Arabic Quran",
  "English Translation",
  "Audio Recitation",
  "Search",
  "Bookmarks",
  "Last Read",
  "Reading Progress",
];

export default function QuranSection() {
  return (
    <section className="py-16 md:py-20 bg-white islamic-pattern-light">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="section-eyebrow">Al Quran</p>
          <h2 className="section-title">Explore the Holy Quran</h2>
          <div className="geometric-divider" />
          <p className="section-desc mx-auto">Read, listen and reflect upon the words of Allah.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-[280px] sm:h-[380px] lg:h-[460px] rounded-3xl overflow-hidden border border-gold/30 shadow-[var(--shadow-md)]">
            <Image
              src="/images/hero/quran.png"
              alt="Open Quran with Arabic calligraphy in a peaceful mosque setting"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-green-deep">Read the Quran Your Way</h3>
            <p className="mt-4 text-muted">
              Explore all Surahs and Paras, read Arabic text with translation, listen to recitations and continue your Quran journey from where you left off.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-2">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-green-deep">
                  <Check className="w-4 h-4 text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/quran" className="btn btn-gold">Read Quran</Link>
              <Link href="/quran#paras" className="btn btn-green">Explore All Paras</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
