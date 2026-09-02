export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  translation?: string;
  surah?: number;
  juz?: number;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
}

export const RECITERS = [
  { id: "mishary", name: "Mishary Rashid Alafasy", identifier: "ar.alafasy" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais", identifier: "ar.abdurrahmaansudais" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary", identifier: "ar.husary" },
  { id: "minshawi", name: "Mohamed Siddiq Al-Minshawi", identifier: "ar.minshawi" },
];

export const TRANSLATIONS = [
  { id: "en.sahih", label: "English" },
  { id: "ur.jalandhry", label: "Urdu" },
] as const;

const API_BASE = "https://api.alquran.cloud/v1";

export async function fetchSurahList(): Promise<SurahMeta[]> {
  const res = await fetch(`${API_BASE}/surah`);
  if (!res.ok) throw new Error("Failed to fetch surah list");
  const json = await res.json();
  return json.data;
}

export async function fetchSurah(
  number: number,
  translationId = "en.sahih"
): Promise<SurahDetail> {
  const res = await fetch(
    `${API_BASE}/surah/${number}/editions/quran-unicode,${translationId}`
  );
  if (!res.ok) throw new Error(`Failed to fetch surah ${number}`);
  const json = await res.json();
  const [arabic, translation] = json.data;
  return {
    number: arabic.number,
    name: arabic.name,
    englishName: arabic.englishName,
    englishNameTranslation: arabic.englishNameTranslation,
    revelationType: arabic.revelationType,
    ayahs: arabic.ayahs.map(
      (ayah: { number: number; numberInSurah: number; text: string; juz?: number }, i: number) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: translation.ayahs[i]?.text,
        surah: number,
        juz: ayah.juz,
      })
    ),
  };
}

export function getAudioUrl(ayahKey: number | string, reciterId: string) {
  return `https://cdn.alquran.cloud/media/audio/ayah/${reciterId}/${ayahKey}`;
}

export type SearchHit = {
  surah: number;
  ayah: number;
  arabic?: string;
  translation?: string;
  text: string;
};

export async function searchQuran(query: string, translationId = "en.sahih"): Promise<SearchHit[]> {
  const encoded = encodeURIComponent(query);
  const [enRes, arRes] = await Promise.all([
    fetch(`${API_BASE}/search/${encoded}/all/${translationId}`),
    fetch(`${API_BASE}/search/${encoded}/all/quran-unicode`),
  ]);
  const merged = new Map<string, SearchHit>();
  const ingest = async (res: Response, field: "translation" | "arabic") => {
    if (!res.ok) return;
    const json = await res.json();
    for (const m of json.data?.matches ?? []) {
      const surah = m.surah.number as number;
      const ayah = m.numberInSurah as number;
      const key = `${surah}:${ayah}`;
      const prev = merged.get(key) ?? { surah, ayah, text: m.text as string };
      prev[field] = m.text as string;
      prev.text = prev.translation || prev.arabic || prev.text;
      merged.set(key, prev);
    }
  };
  await Promise.all([ingest(enRes, "translation"), ingest(arRes, "arabic")]);
  return [...merged.values()];
}

export async function fetchJuz(juz: number, translationId = "en.sahih") {
  const res = await fetch(`${API_BASE}/juz/${juz}/editions/quran-unicode,${translationId}`);
  if (!res.ok) throw new Error("Failed to fetch juz");
  const json = await res.json();
  const [arabic, translation] = json.data;
  return arabic.ayahs.map(
    (ayah: { number: number; numberInSurah: number; text: string; surah: { number: number } }, i: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translation.ayahs[i]?.text,
      surah: ayah.surah.number,
    })
  );
}
