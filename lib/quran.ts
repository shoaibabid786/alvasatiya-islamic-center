import { SURAH_LIST } from "@/data/surahs";

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
  { id: "mishary", name: "Mishary Rashid Alafasy", identifier: "ar.alafasy", everyayah: "Alafasy_128kbps" },
  { id: "basit", name: "Abdul Basit Abdus-Samad", identifier: "ar.abdulsamad", everyayah: "Abdul_Basit_Mujawwad_128kbps" },
  { id: "basit-murattal", name: "Abdul Basit Abdus-Samad (Murattal)", identifier: "ar.abdulbasitmurattal", everyayah: "Abdul_Basit_Murattal_192kbps" },
  { id: "sudais", name: "Abdur-Rahman As-Sudais", identifier: "ar.abdurrahmaansudais", everyayah: "Abdurrahmaan_As-Sudais_192kbps" },
  { id: "husary", name: "Mahmoud Khalil Al-Husary", identifier: "ar.husary", everyayah: "Husary_128kbps" },
  { id: "minshawi", name: "Mohamed Siddiq Al-Minshawi", identifier: "ar.minshawi", everyayah: "Minshawy_Murattal_128kbps" },
] as const;

export const TRANSLATIONS = [
  { id: "en.sahih", label: "English" },
  { id: "ur.jalandhry", label: "Urdu" },
] as const;

export const FALLBACK_SURAHS: SurahMeta[] = SURAH_LIST;

const API_BASE = "https://api.alquran.cloud/v1";
const ARABIC_EDITION = "quran-uthmani";

export function globalAyahNumber(surah: number, ayah: number) {
  const s = Math.min(114, Math.max(1, surah));
  const count = FALLBACK_SURAHS[s - 1]?.numberOfAyahs ?? 1;
  const a = Math.min(count, Math.max(1, ayah));
  let total = 0;
  for (let i = 0; i < s - 1; i++) total += FALLBACK_SURAHS[i].numberOfAyahs;
  return total + a;
}

function reciterMeta(reciterId: string) {
  return RECITERS.find((r) => r.identifier === reciterId) ?? RECITERS[0];
}

export function getAudioSources(surah: number, ayah: number, reciterId: string) {
  const reciter = reciterMeta(reciterId);
  const global = globalAyahNumber(surah, ayah);
  const pad = `${String(surah).padStart(3, "0")}${String(ayah).padStart(3, "0")}`;
  const sources = [
    `https://cdn.islamic.network/quran/audio/128/${reciter.identifier}/${global}.mp3`,
    `https://everyayah.com/data/${reciter.everyayah}/${pad}.mp3`,
  ];
  if (
    reciter.identifier === "ar.abdurrahmaansudais" ||
    reciter.identifier === "ar.abdulsamad" ||
    reciter.identifier === "ar.abdulbasitmurattal"
  ) {
    sources.reverse();
  }
  return sources;
}

export function getAudioUrl(surah: number, ayah: number, reciterId: string) {
  return getAudioSources(surah, ayah, reciterId)[0];
}

export function nextAyahPosition(surah: number, ayah: number) {
  const count = FALLBACK_SURAHS[surah - 1]?.numberOfAyahs ?? 1;
  if (ayah < count) return { surah, ayah: ayah + 1 };
  if (surah < 114) return { surah: surah + 1, ayah: 1 };
  return null;
}

function proxyUrl(path: string) {
  return `/api/quran?path=${encodeURIComponent(path)}`;
}

async function quranFetch(path: string) {
  const remote = `${API_BASE}${path}`;
  const urls = typeof window === "undefined" ? [remote] : [proxyUrl(path), remote];
  let lastError: Error | null = null;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Quran request failed (${res.status})`);
      return await res.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Quran request failed");
    }
  }
  throw lastError ?? new Error("Quran request failed");
}

export async function fetchSurahList(): Promise<SurahMeta[]> {
  try {
    const json = await quranFetch("/surah");
    if (Array.isArray(json.data) && json.data.length === 114) return json.data;
  } catch {
    /* use the local 114-surah list */
  }
  return FALLBACK_SURAHS;
}

export async function fetchSurah(
  number: number,
  translationId = "en.sahih"
): Promise<SurahDetail> {
  const json = await quranFetch(`/surah/${number}/editions/${ARABIC_EDITION},${translationId}`);
  const editions = Array.isArray(json.data) ? json.data : [json.data];
  const arabic = editions[0];
  const translation = editions[1];
  if (!arabic?.ayahs) throw new Error(`Failed to fetch surah ${number}`);
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
        translation: translation?.ayahs?.[i]?.text,
        surah: number,
        juz: ayah.juz,
      })
    ),
  };
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
  const [enJson, arJson] = await Promise.all([
    quranFetch(`/search/${encoded}/all/${translationId}`).catch(() => null),
    quranFetch(`/search/${encoded}/all/${ARABIC_EDITION}`).catch(() => null),
  ]);
  const merged = new Map<string, SearchHit>();
  const ingest = (json: { data?: { matches?: Array<{ surah: { number: number }; numberInSurah: number; text: string }> } } | null, field: "translation" | "arabic") => {
    for (const m of json?.data?.matches ?? []) {
      const surah = m.surah.number;
      const ayah = m.numberInSurah;
      const key = `${surah}:${ayah}`;
      const prev = merged.get(key) ?? { surah, ayah, text: m.text };
      prev[field] = m.text;
      prev.text = prev.translation || prev.arabic || prev.text;
      merged.set(key, prev);
    }
  };
  ingest(enJson, "translation");
  ingest(arJson, "arabic");
  return [...merged.values()];
}

export async function fetchJuz(juz: number, translationId = "en.sahih") {
  const json = await quranFetch(`/juz/${juz}/editions/${ARABIC_EDITION},${translationId}`);
  const editions = Array.isArray(json.data) ? json.data : [json.data];
  const arabic = editions[0];
  const translation = editions[1];
  return arabic.ayahs.map(
    (ayah: { number: number; numberInSurah: number; text: string; surah: { number: number } }, i: number) => ({
      number: ayah.number,
      numberInSurah: ayah.numberInSurah,
      text: ayah.text,
      translation: translation?.ayahs?.[i]?.text,
      surah: ayah.surah.number,
    })
  );
}
