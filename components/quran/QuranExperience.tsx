"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bookmark, BookmarkCheck, Copy, Minus, Pause, Play, Plus, Repeat, Search, Share2,
  SkipBack, SkipForward, Volume2,
} from "lucide-react";
import {
  fetchSurah, fetchSurahList, getAudioUrl, searchQuran, RECITERS,
  type SearchHit, type SurahDetail, type SurahMeta,
} from "@/lib/quran";
import { JUZ_MAP } from "@/data/juz";

const STORAGE = "alvasatiya-quran-v2";
type DisplayMode = "both" | "arabic" | "translation";

type Store = {
  surah: number;
  ayah: number;
  juz?: number;
  bookmarks: string[];
};

function loadStore(): Store {
  if (typeof window === "undefined") return { surah: 1, ayah: 1, bookmarks: [] };
  try {
    return { surah: 1, ayah: 1, bookmarks: [], ...JSON.parse(localStorage.getItem(STORAGE) || "{}") };
  } catch {
    return { surah: 1, ayah: 1, bookmarks: [] };
  }
}

function saveStore(partial: Partial<Store>) {
  const next = { ...loadStore(), ...partial };
  localStorage.setItem(STORAGE, JSON.stringify(next));
  return next;
}

export default function QuranExperience() {
  const params = useSearchParams();
  const router = useRouter();
  const [list, setList] = useState<SurahMeta[]>([]);
  const [data, setData] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [results, setResults] = useState<SearchHit[]>([]);
  const [font, setFont] = useState(34);
  const [mode, setMode] = useState<DisplayMode>("both");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [progress, setProgress] = useState({ surah: 1, ayah: 1 });
  const [reciter] = useState(RECITERS[0].identifier);
  const [playing, setPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const surahNum = Number(params.get("surah") || 0);
  const ayahParam = Number(params.get("ayah") || 1);
  const inReader = surahNum >= 1 && surahNum <= 114;

  useEffect(() => {
    fetchSurahList().then(setList).catch(console.error);
    const s = loadStore();
    setBookmarks(s.bookmarks);
    setProgress({ surah: s.surah, ayah: s.ayah });
  }, []);

  useEffect(() => {
    const q = params.get("q")?.trim();
    if (!q) return;
    setQuery(q);
    searchQuran(q).then(setResults).catch(() => setResults([]));
  }, [params]);

  useEffect(() => {
    if (params.get("play") !== "1" || inReader) return;
    const s = loadStore();
    router.replace(`/quran?surah=${s.surah || 1}&ayah=${s.ayah || 1}&autoplay=1`);
  }, [params, inReader, router]);

  useEffect(() => {
    if (!inReader) return;
    setLoading(true);
    fetchSurah(surahNum)
      .then((detail) => {
        setData(detail);
        const ayah = Math.min(Math.max(ayahParam, 1), detail.ayahs.length);
        setCurrentAyah(ayah);
        saveStore({ surah: surahNum, ayah, juz: detail.ayahs[0]?.juz });
        setProgress({ surah: surahNum, ayah });
      })
      .finally(() => setLoading(false));
  }, [inReader, surahNum, ayahParam]);

  const open = useCallback((surah: number, ayah = 1) => {
    router.push(`/quran?surah=${surah}&ayah=${ayah}`, { scroll: false });
  }, [router]);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setResults(await searchQuran(query.trim()));
  }

  function toggleBookmark(surah: number, ayah: number) {
    const key = `${surah}:${ayah}`;
    setBookmarks((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      saveStore({ bookmarks: next });
      return next;
    });
  }

  function stopAudio() {
    audioRef.current?.pause();
    setPlaying(false);
  }

  function playAyah(surah: number, ayah: number) {
    audioRef.current?.pause();
    const global = data?.number === surah ? data.ayahs.find((a) => a.numberInSurah === ayah)?.number : undefined;
    const audio = new Audio(getAudioUrl(global ?? `${surah}:${ayah}`, reciter));
    audio.playbackRate = speed;
    audio.volume = volume;
    audioRef.current = audio;
    setCurrentAyah(ayah);
    setPlaying(true);
    audio.ontimeupdate = () => setAudioTime(audio.currentTime);
    audio.onloadedmetadata = () => setAudioDur(audio.duration || 0);
    audio.onended = () => {
      if (repeat) {
        playAyah(surah, ayah);
        return;
      }
      const next = ayah + 1;
      if (data && next <= data.ayahs.length) playAyah(surah, next);
      else setPlaying(false);
    };
    audio.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    if (!data || !inReader) return;
    if (params.get("autoplay") !== "1") return;
    playAyah(surahNum, currentAyah);
    // Intentionally run once when the requested surah is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, inReader]);

  function togglePlay() {
    if (!inReader) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    playAyah(surahNum, currentAyah);
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      audioRef.current.volume = volume;
    }
  }, [speed, volume]);

  const named = useMemo(() => list.find((s) => s.number === (inReader ? surahNum : progress.surah)), [list, inReader, surahNum, progress.surah]);

  return (
    <div className="bg-ivory">
      <section className="islamic-pattern text-ivory py-10">
        <div className="section-container text-center">
          <p className="section-eyebrow !text-gold-soft">Al Quran</p>
          <h1 className="section-title !text-ivory">Read the Holy Quran</h1>
          <p className="section-desc mx-auto text-ivory/80">114 Surahs · 30 Paras · Arabic, translation and recitation</p>
          <form onSubmit={onSearch} className="mt-6 max-w-2xl mx-auto flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Surah, Ayah or keyword..."
              aria-label="Search Surah, Ayah or keyword"
              className="!text-text"
            />
            <button className="btn btn-gold" type="submit"><Search className="w-4 h-4" /> Search</button>
          </form>
        </div>
      </section>

      {results.length > 0 && (
        <section className="section-container py-8">
          <h2 className="text-xl font-bold text-green-deep mb-4">Search results</h2>
          <div className="space-y-3">
            {results.slice(0, 20).map((r) => (
              <article key={`${r.surah}-${r.ayah}`} className="card-surface p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <p className="text-xs text-gold">Surah {r.surah} · Ayah {r.ayah}</p>
                  {r.arabic && <p className="mt-2 font-arabic text-right text-xl" dir="rtl" lang="ar">{r.arabic}</p>}
                  <p className="mt-1 text-muted">{r.translation || r.text}</p>
                </div>
                <Link href={`/quran?surah=${r.surah}&ayah=${r.ayah}`} className="btn btn-green !py-2">Open</Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="section-container py-8 grid md:grid-cols-2 gap-4">
        <Link href={`/quran?surah=${progress.surah}&ayah=${progress.ayah}`} className="card-surface p-6 text-left block">
          <p className="text-xs uppercase tracking-widest text-gold">Continue Reading</p>
          <p className="mt-2 text-xl font-semibold text-green-deep">
            {named ? `${named.englishName} (${named.number})` : `Surah ${progress.surah}`} · Ayah {progress.ayah}
          </p>
          <p className="text-sm text-muted mt-1">Last read is saved in this browser until an account is connected.</p>
        </Link>
        <div className="card-surface p-6">
          <p className="text-xs uppercase tracking-widest text-gold">Bookmarks</p>
          {bookmarks.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No saved ayahs yet.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {bookmarks.slice(0, 6).map((b) => {
                const [s, a] = b.split(":").map(Number);
                return (
                  <li key={b} className="flex justify-between text-sm">
                    <Link href={`/quran?surah=${s}&ayah=${a}`} className="text-green-deep">Surah {s}:{a}</Link>
                    <button className="text-muted" onClick={() => toggleBookmark(s, a)}>Remove</button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {inReader && (
        <section className="section-container pb-28">
          <div className="flex flex-wrap gap-2 mb-4">
            <Link href="/quran" className="btn btn-outline !py-2">All Surahs</Link>
            {["both", "arabic", "translation"].map((m) => (
              <button key={m} className={`btn !py-2 ${mode === m ? "btn-gold" : "btn-outline"}`} onClick={() => setMode(m as DisplayMode)}>
                {m === "both" ? "Arabic + Translation" : m === "arabic" ? "Arabic Only" : "Translation"}
              </button>
            ))}
            <button className="btn btn-outline !py-2" onClick={() => setFont((f) => Math.max(22, f - 2))} aria-label="Decrease font"><Minus className="w-4 h-4" /></button>
            <button className="btn btn-outline !py-2" onClick={() => setFont((f) => Math.min(52, f + 2))} aria-label="Increase font"><Plus className="w-4 h-4" /></button>
            <Link href={`/quran?surah=${surahNum}&ayah=${Math.max(1, currentAyah - 1)}`} className="btn btn-outline !py-2">Previous Ayah</Link>
            <Link href={`/quran?surah=${surahNum}&ayah=${currentAyah + 1}`} className="btn btn-outline !py-2">Next Ayah</Link>
          </div>
          {loading || !data ? (
            <p className="py-16 text-center">Loading the Quran…</p>
          ) : (
            <article className="card-surface p-6 md:p-10">
              <header className="text-center mb-8">
                <h2 className="font-arabic text-4xl" dir="rtl" lang="ar">{data.name}</h2>
                <p className="text-gold mt-2">{data.englishName} · {data.revelationType} · {data.ayahs.length} ayahs</p>
              </header>
              <div className="space-y-8">
                {data.ayahs.map((ayah) => (
                  <div id={`ayah-${ayah.numberInSurah}`} key={ayah.number} className="border-b border-border/60 pb-6">
                    {mode !== "translation" && (
                      <p className="font-arabic rtl text-right leading-loose" dir="rtl" lang="ar" style={{ fontSize: font }}>
                        {ayah.text}
                        <span className="inline-flex w-8 h-8 mx-2 align-middle rounded-full border border-gold text-sm items-center justify-center">{ayah.numberInSurah}</span>
                      </p>
                    )}
                    {mode !== "arabic" && ayah.translation && <p className="mt-3 text-muted">{ayah.translation}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="btn btn-outline !py-1 !px-3" onClick={() => playAyah(surahNum, ayah.numberInSurah)} aria-label="Play audio"><Play className="w-4 h-4" /></button>
                      <button className="btn btn-outline !py-1 !px-3" onClick={() => toggleBookmark(surahNum, ayah.numberInSurah)} aria-label="Bookmark">
                        {bookmarks.includes(`${surahNum}:${ayah.numberInSurah}`) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button className="btn btn-outline !py-1 !px-3" onClick={() => navigator.clipboard.writeText(`${ayah.text}\n${ayah.translation ?? ""}`)} aria-label="Copy"><Copy className="w-4 h-4" /></button>
                      <button className="btn btn-outline !py-1 !px-3" onClick={() => navigator.share?.({ url: `${location.origin}/quran?surah=${surahNum}&ayah=${ayah.numberInSurah}` }).catch(() => navigator.clipboard.writeText(`${location.origin}/quran?surah=${surahNum}&ayah=${ayah.numberInSurah}`))} aria-label="Share"><Share2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )}
        </section>
      )}

      {!inReader && (
        <>
          <section className="section-container py-8">
            <h2 className="section-title">All Surahs</h2>
            <div className="geometric-divider !mx-0" />
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {list.map((s) => (
                <article key={s.number} className="card-surface p-5">
                  <p className="text-xs text-gold">Surah {s.number}</p>
                  <p className="font-arabic text-xl mt-1" dir="rtl">{s.name}</p>
                  <h3 className="font-semibold text-green-deep">{s.englishName}</h3>
                  <p className="text-xs text-muted">{s.numberOfAyahs} ayahs · {s.revelationType}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/quran?surah=${s.number}`} className="btn btn-green !py-2 flex-1 text-center">Read</Link>
                    <button className="btn btn-gold !py-2 flex-1" onClick={() => { open(s.number); setTimeout(() => playAyah(s.number, 1), 400); }}>Play</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
          <section id="paras" className="section-container py-12">
            <h2 className="section-title">Browse All 30 Paras</h2>
            <div className="geometric-divider !mx-0" />
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {JUZ_MAP.map((j) => (
                <article key={j.number} className="card-surface p-5">
                  <p className="text-gold font-bold">Para {String(j.number).padStart(2, "0")}</p>
                  <p className="text-xs text-muted mt-2">Starts: {j.startName}</p>
                  <p className="text-xs text-muted">Ends: {j.endName}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/quran?surah=${j.startSurah}&ayah=${j.startAyah}`} className="btn btn-green !py-2 flex-1 text-center">Read</Link>
                    <button className="btn btn-outline !py-2 flex-1" onClick={() => { open(j.startSurah, j.startAyah); setTimeout(() => playAyah(j.startSurah, j.startAyah), 400); }}>Audio</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {inReader && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-green-deep text-ivory border-t border-gold/30">
          <div className="section-container py-3 flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={audioDur || 0}
              step={0.1}
              value={audioTime}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (audioRef.current) audioRef.current.currentTime = v;
                setAudioTime(v);
              }}
              aria-label="Audio progress"
            />
            <div className="flex flex-wrap items-center gap-2">
              <button className="btn btn-outline !text-ivory !py-2" onClick={() => playAyah(surahNum, Math.max(1, currentAyah - 1))} aria-label="Previous ayah"><SkipBack className="w-4 h-4" /></button>
              <button className="btn btn-gold !py-2" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="btn btn-outline !text-ivory !py-2" onClick={() => playAyah(surahNum, currentAyah + 1)} aria-label="Next ayah"><SkipForward className="w-4 h-4" /></button>
              <button className={`btn !py-2 ${repeat ? "btn-gold" : "btn-outline !text-ivory"}`} onClick={() => setRepeat((r) => !r)} aria-label="Repeat"><Repeat className="w-4 h-4" /></button>
              <p className="text-xs sm:text-sm">Surah {surahNum} · Ayah {currentAyah}</p>
              <label className="ml-auto flex items-center gap-2 text-xs">
                <Volume2 className="w-4 h-4" />
                <input type="range" min={0} max={1} step={0.05} value={volume} onChange={(e) => setVolume(Number(e.target.value))} aria-label="Volume" />
              </label>
              <select className="!w-auto !py-1 !text-text" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} aria-label="Playback speed">
                {[0.75, 1, 1.25, 1.5].map((s) => <option key={s} value={s}>{s}x</option>)}
              </select>
              <button className="btn btn-outline !text-ivory !py-2" onClick={stopAudio}>Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
