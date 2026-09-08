"use client";

import { useMemo, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import { events } from "@/data/events";
import { submitInquiry } from "@/lib/forms";

export default function EventsClient() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const list = useMemo(() => events.filter((e) => e.status === tab), [tab]);

  async function register(title: string) {
    setError("");
    try {
      await submitInquiry("event", { title });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your registration.");
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-8">
        <button className={`btn ${tab === "upcoming" ? "btn-gold" : "btn-outline"}`} onClick={() => setTab("upcoming")}>Upcoming</button>
        <button className={`btn ${tab === "past" ? "btn-gold" : "btn-outline"}`} onClick={() => setTab("past")}>Past</button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {list.map((event) => (
          <article key={event.slug} className="card-surface p-6">
            <p className="text-xs uppercase tracking-widest text-gold">{event.date} · {event.time}</p>
            <h3 className="mt-2 text-xl font-semibold text-green-deep">{event.title}</h3>
            <p className="text-sm text-muted mt-1">{event.location}</p>
            <p className="mt-3 text-muted">{event.description}</p>
            {event.status === "upcoming" && (
              <button className="btn btn-green mt-4" onClick={() => register(event.title)}>Register</button>
            )}
          </article>
        ))}
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <div className="card-surface p-6 mt-10">
        <h2 className="font-semibold text-green-deep">Event calendar</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {events.map((e) => (
            <li key={e.slug}><strong>{e.date}</strong> — {e.title} ({e.status})</li>
          ))}
        </ul>
      </div>
      <SuccessDialog open={success} onClose={() => setSuccess(false)} title="Registration received" message="JazakAllahu Khairan. Your interest has been recorded. Official confirmation will follow when event registration is connected." />
    </div>
  );
}
