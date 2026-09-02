import { Suspense } from "react";
import QuranExperience from "@/components/quran/QuranExperience";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

const quranImage = {
  image: "/images/hero/quran.png",
  imageAlt: "Open Holy Quran in a peaceful mosque interior",
} as const;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ surah?: string; ayah?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const surah = Number(sp.surah);
  if (surah >= 1 && surah <= 114) {
    const ayah = Number(sp.ayah);
    const ayahPart = ayah >= 1 ? `, Ayah ${ayah}` : "";
    const path = ayah >= 1 ? `/quran?surah=${surah}&ayah=${ayah}` : `/quran?surah=${surah}`;
    return pageMeta(
      `Read Surah ${surah}${ayahPart} | Arabic, Translation and Audio`,
      `Read Surah ${surah} of the Holy Quran with Arabic text, English translation, audio recitation, bookmarks and ayah navigation.`,
      path,
      quranImage
    );
  }
  const q = sp.q?.trim().slice(0, 60);
  if (q) {
    return pageMeta(
      `Search the Holy Quran for “${q}”`,
      `Find matching ayahs in the Holy Quran for “${q}”, with Arabic text and English translation.`,
      `/quran?q=${encodeURIComponent(q)}`,
      quranImage
    );
  }
  return pageMeta(
    "Read the Holy Quran Online | 114 Surahs, 30 Paras, Audio Recitation",
    "Read the Holy Quran with Arabic text, English translation, audio recitation, search, bookmarks and last-read progress. Browse all 114 Surahs and 30 Paras.",
    "/quran",
    quranImage
  );
}

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema("Al Quran Reader", "Read and listen to the Holy Quran with Arabic text, translation, audio, search and bookmarks.", "/quran")} />
      <Suspense fallback={<p className="section-container py-16 text-center">Loading the Quran…</p>}>
        <QuranExperience />
      </Suspense>
    </>
  );
}
