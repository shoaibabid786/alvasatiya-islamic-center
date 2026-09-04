"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bookmark, BookmarkCheck, Copy, Minus, Moon, Pause, Play, Plus, Search, Share2, SkipBack, SkipForward, Sun,
} from "lucide-react";
import {
  FALLBACK_SURAHS, fetchSurah, fetchSurahList, getAudioSources, searchQuran, RECITERS, TRANSLATIONS,
  type SurahDetail, type SurahMeta,
} from "@/lib/quran";
import { namesOfAllah } from "@/data/namesOfAllah";
import { prophets } from "@/data/prophets";

const JUZ = Array.from({ length: 30 }, (_, i) => i + 1);

export default function QuranReader() {
  const [list, setList] = useState<SurahMeta[]>(FALLBACK_SURAHS);
  const [surah, setSurah] = useState(1);
  const [data, setData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<{ surah: number; ayah: number; text: string }>>([]);
  const [translationId, setTranslationId] = useState<(typeof TRANSLATIONS)[number]["id"]>("en.sahih");
  const [reciter, setReciter] = useState(RECITERS[0].identifier);
  const [font, setFont] = useState(32);
  const [dark, setDark] = useState(false);
  const [reading, setReading] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [juz, setJuz] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSurahList().then(setList).catch(() => setList(FALLBACK_SURAHS));
    const saved = localStorage.getItem("alvasatiya-quran");
    if (saved) {
      const p = JSON.parse(saved);
      if (p.surah) setSurah(p.surah);
      if (p.bookmarks) setBookmarks(p.bookmarks);
      if (p.dark) setDark(true);
    }
  }, []);

  const load = useCallback(async (num: number) => {
    setLoading(true);
    try {
      const detail = await fetchSurah(num, translationId);
      setData(detail);
      setSurah(num);
      localStorage.setItem(
        "alvasatiya-quran",
        JSON.stringify({ surah: num, bookmarks, dark })
      );
    } finally {
      setLoading(false);
    }
  }, [translationId, bookmarks, dark]);

  useEffect(() => {
    load(surah);
  }, [surah, translationId]); // eslint-disable-line react-hooks/exhaustive-deps

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResults(await searchQuran(query.trim(), translationId));
  }

  function toggleBookmark(ayah: number) {
    const key = `${surah}:${ayah}`;
    setBookmarks((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      return next;
    });
  }

  function playAyah(ayah: number) {
    audioRef.current?.pause();
    const sources = getAudioSources(surah, ayah, reciter);
    const audio = new Audio();
    let index = 0;
    audio.src = sources[index];
    audioRef.current = audio;
    setPlaying(ayah);
    audio.onerror = () => {
      index += 1;
      if (index < sources.length) {
        audio.src = sources[index];
        audio.play().catch(() => setPlaying(null));
        return;
      }
      setPlaying(null);
    };
    audio.play().catch(() => setPlaying(null));
    audio.onended = () => {
      const next = ayah + 1;
      if (data && next <= data.ayahs.length) playAyah(next);
      else setPlaying(null);
    };
  }

  function togglePlay(ayah: number) {
    if (playing === ayah) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    playAyah(ayah);
  }

  async function copyAyah(text: string, translation?: string) {
    await navigator.clipboard.writeText(`${text}\n${translation ?? ""}`.trim());
  }

  async function shareAyah(ayah: number) {
    const url = `${window.location.origin}/quran?surah=${surah}&ayah=${ayah}`;
    if (navigator.share) await navigator.share({ title: "Al Quran", url });
    else await navigator.clipboard.writeText(url);
  }

  const progress = data ? Math.round((surah / 114) * 100) : 0;
  const shell = dark ? "bg-charcoal text-ivory" : "bg-ivory text-text";

  return (
    <div className={shell}>
      <div className="section-container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 card-surface p-4 h-max lg:sticky lg:top-20">
            <form onSubmit={onSearch} className="flex gap-2">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the Quran" aria-label="Search the Quran" />
              <button className="btn btn-gold !px-3" aria-label="Search"><Search className="w-4 h-4" /></button>
            </form>
            {results.length > 0 && (
              <ul className="mt-3 max-h-40 overflow-y-auto text-sm">
                {results.slice(0, 12).map((r) => (
                  <li key={`${r.surah}-${r.ayah}`}>
                    <button className="text-left py-1 text-green-deep" onClick={() => { setSurah(r.surah); setResults([]); }}>
                      {r.surah}:{r.ayah} — {r.text.slice(0, 70)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <label className="block mt-4 text-xs font-semibold uppercase tracking-wide">Surah</label>
            <select value={surah} onChange={(e) => setSurah(Number(e.target.value))} className="mt-1">
              {list.map((s) => (
                <option key={s.number} value={s.number}>{s.number}. {s.englishName}</option>
              ))}
            </select>
            <label className="block mt-4 text-xs font-semibold uppercase tracking-wide">Juz</label>
            <select value={juz} onChange={(e) => setJuz(Number(e.target.value))} className="mt-1">
              <option value={0}>Browse by surah</option>
              {JUZ.map((j) => <option key={j} value={j}>Juz {j}</option>)}
            </select>
            <p className="text-xs text-muted mt-2">Juz browsing highlights the selected juz number for reference while reading by surah.</p>
            <div className="mt-4 flex gap-2">
              <button className="btn btn-outline !py-2 flex-1" onClick={() => setDark((d) => !d)} aria-label="Toggle reading theme">
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="btn btn-outline !py-2 flex-1" onClick={() => setReading((r) => !r)}>
                {reading ? "Page" : "Reading"}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <button className="btn btn-outline !py-2" onClick={() => setFont((f) => Math.max(22, f - 2))} aria-label="Decrease font"><Minus className="w-4 h-4" /></button>
              <span className="text-sm">Font</span>
              <button className="btn btn-outline !py-2" onClick={() => setFont((f) => Math.min(48, f + 2))} aria-label="Increase font"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="mt-4 h-2 rounded-full bg-sage overflow-hidden">
              <div className="h-full bg-gold" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs mt-2">Reading progress: Surah {surah} of 114</p>
          </aside>

          <div className="flex-1">
            <div className="card-surface p-4 mb-4 flex flex-wrap gap-3 items-center">
              <select value={translationId} onChange={(e) => setTranslationId(e.target.value as typeof translationId)} aria-label="Translation language">
                {TRANSLATIONS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <select value={reciter} onChange={(e) => setReciter(e.target.value)} aria-label="Reciter">
                {RECITERS.map((r) => <option key={r.id} value={r.identifier}>{r.name}</option>)}
              </select>
              <button className="btn btn-green !py-2" onClick={() => setSurah((s) => Math.max(1, s - 1))}><SkipBack className="w-4 h-4" /> Prev</button>
              <button className="btn btn-green !py-2" onClick={() => setSurah((s) => Math.min(114, s + 1))}>Next <SkipForward className="w-4 h-4" /></button>
            </div>

            {loading || !data ? (
              <p className="p-10 text-center">Loading the Quran…</p>
            ) : (
              <article className={`card-surface p-6 md:p-10 ${reading ? "max-w-3xl mx-auto" : ""}`}>
                <header className="text-center mb-8">
                  <h1 className="font-arabic text-4xl" dir="rtl" lang="ar">{data.name}</h1>
                  <p className="mt-2 text-gold">{data.englishName} · {data.englishNameTranslation}</p>
                  <p className="text-sm text-muted">{data.revelationType} · {data.ayahs.length} ayahs {juz ? `· Juz filter ${juz}` : ""}</p>
                </header>
                <div className="space-y-8">
                  {data.ayahs.map((ayah) => (
                    <div id={`ayah-${ayah.numberInSurah}`} key={ayah.number} className="border-b border-border/60 pb-6">
                      <p className="font-arabic rtl text-right leading-loose" dir="rtl" lang="ar" style={{ fontSize: font }}>
                        {ayah.text}
                        <span className="inline-flex w-8 h-8 mx-2 align-middle rounded-full border border-gold text-sm items-center justify-center">{ayah.numberInSurah}</span>
                      </p>
                      {!reading && ayah.translation && <p className="mt-3 text-muted">{ayah.translation}</p>}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button className="btn btn-outline !py-1 !px-3" onClick={() => togglePlay(ayah.numberInSurah)} aria-label={playing === ayah.numberInSurah ? "Pause" : "Play"}>
                          {playing === ayah.numberInSurah ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button className="btn btn-outline !py-1 !px-3" onClick={() => toggleBookmark(ayah.numberInSurah)} aria-label="Bookmark">
                          {bookmarks.includes(`${surah}:${ayah.numberInSurah}`) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        <button className="btn btn-outline !py-1 !px-3" onClick={() => copyAyah(ayah.text, ayah.translation)} aria-label="Copy"><Copy className="w-4 h-4" /></button>
                        <button className="btn btn-outline !py-1 !px-3" onClick={() => shareAyah(ayah.numberInSurah)} aria-label="Share"><Share2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )}
          </div>
        </div>

        <section className="mt-16">
          <h2 className="section-title">Names of Allah</h2>
          <div className="geometric-divider !mx-0" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {namesOfAllah.slice(0, 12).map((n) => (
              <article key={n.id} className="card-surface p-5">
                <p className="font-arabic text-2xl" dir="rtl">{n.arabic}</p>
                <p className="font-semibold text-green-deep">{n.transliteration}</p>
                <p className="text-sm text-muted">{n.meaning}</p>
              </article>
            ))}
          </div>
          <p className="text-sm text-muted mt-4">A complete list of the 99 names is included in this resource section for remembrance and study.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {namesOfAllah.slice(12).map((n) => (
              <article key={n.id} className="card-surface p-4">
                <p className="font-arabic text-xl" dir="rtl">{n.arabic}</p>
                <p className="text-sm font-semibold">{n.transliteration} — {n.meaning}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 pb-12">
          <h2 className="section-title">Prophets</h2>
          <div className="geometric-divider !mx-0" />
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {prophets.map((p) => (
              <article key={p.id} className="card-surface p-5">
                <h3 className="font-semibold text-green-deep">{p.name} <span className="font-arabic" dir="rtl">{p.arabic}</span></h3>
                <p className="text-sm text-muted mt-2">{p.description}</p>
                {p.quranReferences && <p className="text-xs text-gold mt-2">Quran: {p.quranReferences.join(", ")}</p>}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
