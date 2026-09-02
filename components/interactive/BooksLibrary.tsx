"use client";

import { useMemo, useState } from "react";
import { BOOK_CATEGORIES, books } from "@/data/books";

export default function BooksLibrary() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [active, setActive] = useState(books[0].slug);

  const list = useMemo(() => {
    return books.filter((b) => {
      const ok = category === "All" || b.category === category;
      const q = query.toLowerCase();
      return ok && (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.description.toLowerCase().includes(q));
    });
  }, [query, category]);

  const book = books.find((b) => b.slug === active) ?? list[0];
  const featured = books.filter((b) => b.featured);
  const recent = [...books].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input placeholder="Search books, authors, topics" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="md:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {BOOK_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <h2 className="text-xl font-bold text-green-deep mb-4">Featured books</h2>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {featured.map((b) => (
          <button key={b.slug} className="card-surface p-5 text-left" onClick={() => setActive(b.slug)}>
            <p className="text-xs text-gold uppercase">{b.category}</p>
            <p className="font-semibold mt-1">{b.title}</p>
            <p className="text-sm text-muted">{b.author}</p>
          </button>
        ))}
      </div>
      <div className="grid lg:grid-cols-[1fr_0.9fr] gap-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((b) => (
            <button key={b.slug} className="card-surface p-5 text-left" onClick={() => setActive(b.slug)}>
              <p className="text-xs text-gold uppercase">{b.category}</p>
              <h3 className="font-semibold text-green-deep mt-1">{b.title}</h3>
              <p className="text-sm text-muted">{b.author}</p>
            </button>
          ))}
        </div>
        {book && (
          <article className="card-surface p-6 h-max">
            <p className="text-xs text-gold uppercase">{book.category}</p>
            <h3 className="text-2xl font-bold text-green-deep mt-1">{book.title}</h3>
            <p className="text-sm mt-1">Author: {book.author}</p>
            <p className="mt-4 text-muted">{book.description}</p>
            <div className="mt-6 flex gap-2">
              <a href={book.slug === "holy-quran" ? "/quran" : "#"} className="btn btn-green">Read</a>
              <button className="btn btn-outline" type="button" disabled>
                Download where legally available
              </button>
            </div>
            <p className="text-xs text-muted mt-3">Downloads are enabled only for titles with lawful permission. A request pathway can be connected to the future library API.</p>
          </article>
        )}
      </div>
      <h2 className="text-xl font-bold text-green-deep mt-12 mb-4">Recently added</h2>
      <div className="grid md:grid-cols-4 gap-4">
        {recent.map((b) => (
          <article key={b.slug} className="card-surface p-4">
            <p className="text-xs text-muted">{b.added}</p>
            <p className="font-semibold text-green-deep">{b.title}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
