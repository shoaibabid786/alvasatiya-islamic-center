export type PrayerName = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerTimes = Record<PrayerName, string> & {
  date: string;
  hijri: string;
  timezone: string;
  locationLabel: string;
  method: string;
  school: string;
  source: "live" | "mock";
};

export const METHODS = [
  { id: "1", label: "University of Islamic Sciences, Karachi" },
  { id: "2", label: "Islamic Society of North America (ISNA)" },
  { id: "3", label: "Muslim World League" },
  { id: "4", label: "Umm Al-Qura, Makkah" },
  { id: "5", label: "Egyptian General Authority of Survey" },
];

export const CITIES = [
  { label: "Lahore, Pakistan", city: "Lahore", country: "Pakistan", lat: 31.5204, lon: 74.3587 },
  { label: "Makkah, Saudi Arabia", city: "Makkah", country: "Saudi Arabia", lat: 21.3891, lon: 39.8579 },
  { label: "Madinah, Saudi Arabia", city: "Madinah", country: "Saudi Arabia", lat: 24.5247, lon: 39.5692 },
  { label: "Istanbul, Türkiye", city: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784 },
  { label: "London, United Kingdom", city: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { label: "New York, USA", city: "New York", country: "USA", lat: 40.7128, lon: -74.006 },
];

const MOCK: PrayerTimes = {
  Fajr: "04:52",
  Sunrise: "06:18",
  Dhuhr: "12:08",
  Asr: "15:41",
  Maghrib: "18:00",
  Isha: "19:28",
  date: "Wednesday 2 September 2026",
  hijri: "10 Rabi' al-Awwal 1448",
  timezone: "Asia/Karachi",
  locationLabel: "Lahore, Pakistan (sample timetable)",
  method: "Karachi",
  school: "Hanafi",
  source: "mock",
};

export type DayTimes = { date: string; hijri: string; Fajr: string; Sunrise: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string };

export async function fetchMonthlyTimes(opts: {
  city: string;
  country: string;
  method: string;
  school: string;
  month: number;
  year: number;
}): Promise<DayTimes[]> {
  try {
    const url = `https://api.aladhan.com/v1/calendarByCity/${opts.year}/${opts.month}?city=${encodeURIComponent(opts.city)}&country=${encodeURIComponent(opts.country)}&method=${opts.method}&school=${opts.school}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data ?? []).map((d: { date: { gregorian: { date: string }; hijri: { date: string } }; timings: Record<string, string> }) => ({
      date: d.date.gregorian.date,
      hijri: d.date.hijri.date,
      Fajr: d.timings.Fajr.slice(0, 5),
      Sunrise: d.timings.Sunrise.slice(0, 5),
      Dhuhr: d.timings.Dhuhr.slice(0, 5),
      Asr: d.timings.Asr.slice(0, 5),
      Maghrib: d.timings.Maghrib.slice(0, 5),
      Isha: d.timings.Isha.slice(0, 5),
    }));
  } catch {
    return [];
  }
}

export async function fetchPrayerTimes(opts: {
  city: string;
  country: string;
  method: string;
  school: string;
  date?: string;
}): Promise<PrayerTimes> {
  try {
    const date = opts.date ?? new Date().toISOString().slice(0, 10);
    const [yyyy, mm, dd] = date.split("-");
    const url = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(opts.city)}&country=${encodeURIComponent(opts.country)}&method=${opts.method}&school=${opts.school}`;
    const res = await fetch(url);
    if (!res.ok) return { ...MOCK, locationLabel: `${opts.city}, ${opts.country} (sample timetable)` };
    const json = await res.json();
    const t = json.data.timings;
    const g = json.data.date.gregorian;
    const h = json.data.date.hijri;
    return {
      Fajr: t.Fajr,
      Sunrise: t.Sunrise,
      Dhuhr: t.Dhuhr,
      Asr: t.Asr,
      Maghrib: t.Maghrib,
      Isha: t.Isha,
      date: `${g.weekday.en} ${g.day} ${g.month.en} ${g.year}`,
      hijri: `${h.day} ${h.month.en} ${h.year}`,
      timezone: json.data.meta.timezone,
      locationLabel: `${opts.city}, ${opts.country}`,
      method: json.data.meta.method.name,
      school: opts.school === "1" ? "Hanafi" : "Shafi'i / standard",
      source: "live",
    };
  } catch {
    return { ...MOCK, locationLabel: `${opts.city}, ${opts.country} (sample timetable)` };
  }
}
