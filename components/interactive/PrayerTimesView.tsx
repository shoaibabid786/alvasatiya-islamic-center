"use client";

import { useEffect, useMemo, useState } from "react";
import { CITIES, fetchMonthlyTimes, fetchPrayerTimes, METHODS, type DayTimes, type PrayerTimes } from "@/lib/prayer";

const NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

function toMinutes(t: string) {
  const [h, m] = t.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

export default function PrayerTimesView() {
  const [city, setCity] = useState(CITIES[0].city);
  const [country, setCountry] = useState(CITIES[0].country);
  const [method, setMethod] = useState("1");
  const [school, setSchool] = useState("1");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [search, setSearch] = useState("Lahore");
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [monthRows, setMonthRows] = useState<DayTimes[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetchPrayerTimes({ city, country, method, school, date }).then(setTimes);
    const d = new Date(date);
    fetchMonthlyTimes({ city, country, method, school, month: d.getMonth() + 1, year: d.getFullYear() }).then(setMonthRows);
  }, [city, country, method, school, date]);

  const status = useMemo(() => {
    if (!times) return { current: "—", next: "Fajr", countdown: "—" };
    const minutes = now.getHours() * 60 + now.getMinutes();
    const list = NAMES.map((n) => ({ name: n, min: toMinutes(times[n]) }));
    let current = list[list.length - 1].name;
    let next = list[0];
    for (let i = 0; i < list.length; i++) {
      if (minutes < list[i].min) {
        current = i === 0 ? "Isha" : list[i - 1].name;
        next = list[i];
        break;
      }
      if (i === list.length - 1) {
        current = list[i].name;
        next = list[0];
      }
    }
    const nextMin = next.min + (next.name === "Fajr" && minutes > list[0].min ? 24 * 60 : 0);
    const diff = Math.max(0, nextMin - minutes);
    const hh = String(Math.floor(diff / 60)).padStart(2, "0");
    const mm = String(diff % 60).padStart(2, "0");
    return { current, next: next.name, countdown: `${hh}:${mm}` };
  }, [times, now]);

  const filtered = CITIES.filter((c) =>
    `${c.city} ${c.country}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="grid lg:grid-cols-4 gap-4 mb-8">
        <label className="text-sm">City search
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="mt-1" />
        </label>
        <label className="text-sm">Location
          <select
            className="mt-1"
            value={`${city}|${country}`}
            onChange={(e) => {
              const [c, co] = e.target.value.split("|");
              setCity(c);
              setCountry(co);
            }}
          >
            {filtered.map((c) => (
              <option key={c.label} value={`${c.city}|${c.country}`}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">Calculation method
          <select className="mt-1" value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </label>
        <label className="text-sm">Asr / Madhhab
          <select className="mt-1" value={school} onChange={(e) => setSchool(e.target.value)}>
            <option value="0">Shafi'i / standard</option>
            <option value="1">Hanafi</option>
          </select>
        </label>
      </div>
      <div className="flex flex-wrap gap-3 mb-8 items-end">
        <label className="text-sm">Date
          <input type="date" className="mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <button type="button" className="btn btn-outline" onClick={() => setDate(shift(date, -1))}>Previous day</button>
        <button type="button" className="btn btn-outline" onClick={() => setDate(shift(date, 1))}>Next day</button>
      </div>

      {times && (
        <>
          <div className="card-surface p-6 mb-8 grid md:grid-cols-4 gap-4 text-sm">
            <p><strong>Location:</strong> {times.locationLabel}</p>
            <p><strong>Gregorian:</strong> {times.date}</p>
            <p><strong>Islamic date:</strong> {times.hijri}</p>
            <p><strong>Source:</strong> {times.source === "live" ? "Live timetable" : "Sample timetable until the API responds"}</p>
            <p><strong>Current prayer:</strong> {status.current}</p>
            <p><strong>Next prayer:</strong> {status.next}</p>
            <p><strong>Countdown:</strong> {status.countdown}</p>
            <p><strong>Method:</strong> {times.method} · {times.school}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NAMES.map((name) => (
              <article key={name} className={`card-surface p-6 text-center ${status.next === name ? "border-gold" : ""}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{name}</p>
                <p className="mt-3 text-3xl font-bold text-green-deep">{times[name].slice(0, 5)}</p>
              </article>
            ))}
          </div>
          {monthRows.length > 0 && (
            <div className="mt-10 overflow-x-auto card-surface">
              <h2 className="p-4 font-semibold text-green-deep">Monthly timetable</h2>
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-sage">
                  <tr>
                    {["Date", "Hijri", ...NAMES].map((h) => (
                      <th key={h} className="p-3 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthRows.map((row) => (
                    <tr key={row.date} className="border-t border-border">
                      <td className="p-3">{row.date}</td>
                      <td className="p-3">{row.hijri}</td>
                      {NAMES.map((n) => <td key={n} className="p-3">{row[n]}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function shift(date: string, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
