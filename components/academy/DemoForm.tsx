"use client";

import { useState } from "react";
import { COUNTRIES, TIME_ZONES } from "@/data/academy";
import type { Course } from "@/data/courses";

const SUCCESS = "JazakAllahu Khairan! Your demo request has been submitted. Our team will contact you shortly.";

export default function DemoForm({ courses, presetSlug = "" }: { courses: Course[]; presetSlug?: string }) {
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "Pakistan",
    courseSlug: presetSlug || courses[0]?.slug || "",
    preferredDate: "",
    preferredTime: "",
    timeZone: "Asia/Karachi (PKT)",
    message: "",
  });

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <form
      className="card-surface p-6 md:p-8 space-y-4 max-w-2xl"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus("saving");
        setMessage("");
        const response = await fetch("/api/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Could not submit the request.");
          return;
        }
        setStatus("done");
        setMessage(data.message || SUCCESS);
      }}
    >
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm font-semibold text-green-deep">Name
          <input required className="mt-1" value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Email
          <input required type="email" className="mt-1" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Phone
          <input required className="mt-1" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Country
          <select className="mt-1" value={form.country} onChange={(e) => update("country", e.target.value)}>
            {COUNTRIES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-green-deep md:col-span-2">Course
          <select className="mt-1" value={form.courseSlug} onChange={(e) => update("courseSlug", e.target.value)}>
            {courses.map((course) => (
              <option key={course.slug} value={course.slug}>{course.title}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-green-deep">Preferred Date
          <input required type="date" className="mt-1" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Preferred Time
          <input required type="time" className="mt-1" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
        </label>
        <label className="block text-sm font-semibold text-green-deep md:col-span-2">Time Zone
          <select className="mt-1" value={form.timeZone} onChange={(e) => update("timeZone", e.target.value)}>
            {TIME_ZONES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="block text-sm font-semibold text-green-deep md:col-span-2">Message
          <textarea rows={4} className="mt-1" value={form.message} onChange={(e) => update("message", e.target.value)} />
        </label>
      </div>
      {message && (
        <p className={status === "error" ? "text-red-700 text-sm" : "text-green-deep font-medium"}>{message}</p>
      )}
      <button className="btn btn-gold" disabled={status === "saving" || status === "done"}>
        {status === "done" ? "Request sent" : status === "saving" ? "Submitting..." : "Submit demo request"}
      </button>
    </form>
  );
}
