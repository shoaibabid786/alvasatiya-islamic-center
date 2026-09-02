"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BLOG_CATEGORIES, blogs } from "@/data/blogs";

export default function BlogsClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const list = useMemo(() => {
    return blogs.filter((b) => {
      const ok = category === "All" || b.category === category;
      const q = query.toLowerCase();
      return ok && (b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q));
    });
  }, [query, category]);
  const featured = blogs.filter((b) => b.featured);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input placeholder="Search articles" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="md:w-56" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {BLOG_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <h2 className="text-xl font-bold text-green-deep mb-4">Featured articles</h2>
      <div className="grid md:grid-cols-2 gap-5 mb-10">
        {featured.map((post) => (
          <Link key={post.slug} href={`/islamic-services/islamic-blogs/${post.slug}`} className="card-surface p-6 block">
            <p className="text-xs text-gold uppercase">{post.category}</p>
            <h3 className="text-xl font-semibold text-green-deep mt-2">{post.title}</h3>
            <p className="text-sm text-muted mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
      <h2 className="text-xl font-bold text-green-deep mb-4">Latest articles</h2>
      <div className="grid md:grid-cols-3 gap-5">
        {list.map((post) => (
          <Link key={post.slug} href={`/islamic-services/islamic-blogs/${post.slug}`} className="card-surface p-6 block">
            <p className="text-xs text-muted">{post.date} · {post.minutes} min · {post.author}</p>
            <h3 className="font-semibold text-green-deep mt-2">{post.title}</h3>
            <p className="text-sm text-muted mt-2">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
