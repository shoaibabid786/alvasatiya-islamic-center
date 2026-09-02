"use client";

import { useMemo, useState } from "react";
import { mediaItems } from "@/data/media";

export default function MediaLibrary() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const list = useMemo(() => {
    return mediaItems.filter((m) => {
      const ok = type === "All" || (type === "Video" && m.type === "video") || (type === "Audio" && m.type === "audio") || (type === "Photo" && m.type === "photo") || m.category === type;
      return ok && m.title.toLowerCase().includes(query.toLowerCase());
    });
  }, [query, type]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input placeholder="Search media" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="md:w-56" value={type} onChange={(e) => setType(e.target.value)}>
          {["All", "Video", "Audio", "Photo", "Lectures", "Talks", "Quran Recitation", "Gallery"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((item) => (
          <article key={item.id} className="card-surface overflow-hidden">
            <div className="h-40 bg-sage bg-cover bg-center" style={{ backgroundImage: `url(${item.thumbnail})` }} />
            <div className="p-5">
              <p className="text-xs text-gold uppercase">{item.category} {item.duration && `· ${item.duration}`}</p>
              <h3 className="font-semibold text-green-deep mt-1">{item.title}</h3>
              <p className="text-sm text-muted mt-2">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
