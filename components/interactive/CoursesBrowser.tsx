"use client";

import { useMemo, useState } from "react";
import CourseCard from "@/components/ui/CourseCard";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  DURATION_FILTERS,
  type Course,
  type CourseLevel,
  type DurationBand,
} from "@/data/courses";

export default function CoursesBrowser({
  courses,
  heading = "All courses",
}: {
  courses: Course[];
  heading?: string;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState<"All" | CourseLevel>("All");
  const [language, setLanguage] = useState("All");
  const [duration, setDuration] = useState<DurationBand | "all">("all");

  const languages = useMemo(() => [...new Set(courses.map((course) => course.language))], [courses]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesQuery =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);
      const matchesCategory =
        category === "All" ||
        course.category === category ||
        (category === "Online Courses" && course.mode.includes("Online"));
      const matchesLevel = level === "All" || course.level === level;
      const matchesLanguage = language === "All" || course.language === language;
      const matchesDuration = duration === "all" || course.durationBand === duration;
      return matchesQuery && matchesCategory && matchesLevel && matchesLanguage && matchesDuration;
    });
  }, [courses, query, category, level, language, duration]);

  return (
    <div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        <input
          type="search"
          placeholder="Search courses"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search courses"
        />
        <select value={level} onChange={(e) => setLevel(e.target.value as "All" | CourseLevel)} aria-label="Filter by level">
          <option value="All">All levels</option>
          {COURSE_LEVELS.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="Filter by language">
          <option value="All">All languages</option>
          {languages.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select value={duration} onChange={(e) => setDuration(e.target.value as DurationBand | "all")} aria-label="Filter by duration">
          {DURATION_FILTERS.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button className={`btn ${category === "All" ? "btn-gold" : "btn-outline"}`} onClick={() => setCategory("All")}>All</button>
        {COURSE_CATEGORIES.map((item) => (
          <button key={item} className={`btn ${category === item ? "btn-gold" : "btn-outline"}`} onClick={() => setCategory(item)}>
            {item}
          </button>
        ))}
      </div>
      <h2 className="sr-only">{heading}</h2>
      {list.length === 0 ? (
        <p className="text-muted">No courses match these filters. Try a wider search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {list.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
