import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";
import { departments } from "@/data/departments";
import { courses } from "@/data/courses";
import { blogs } from "@/data/blogs";
import { institutions } from "@/data/institutions";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const staticPaths: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/quran", priority: 0.95, changeFrequency: "monthly" },
    { path: "/courses", priority: 0.9, changeFrequency: "weekly" },
    { path: "/demo", priority: 0.7, changeFrequency: "monthly" },
    { path: "/education", priority: 0.85, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about/introduction", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about/mission", priority: 0.7, changeFrequency: "yearly" },
    { path: "/about/where-we-are", priority: 0.7, changeFrequency: "monthly" },
    { path: "/about/founder", priority: 0.75, changeFrequency: "yearly" },
    { path: "/about/achievements", priority: 0.6, changeFrequency: "yearly" },
    { path: "/islamic-services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/islamic-services/books-library", priority: 0.7, changeFrequency: "weekly" },
    { path: "/islamic-services/zakat-calculator", priority: 0.7, changeFrequency: "yearly" },
    { path: "/islamic-services/islamic-education", priority: 0.7, changeFrequency: "monthly" },
    { path: "/islamic-services/islamic-media", priority: 0.65, changeFrequency: "weekly" },
    { path: "/islamic-services/new-muslims", priority: 0.75, changeFrequency: "monthly" },
    { path: "/islamic-services/islamic-courses", priority: 0.7, changeFrequency: "weekly" },
    { path: "/islamic-services/islamic-events", priority: 0.7, changeFrequency: "weekly" },
    { path: "/islamic-services/islamic-blogs", priority: 0.7, changeFrequency: "weekly" },
    { path: "/social-services", priority: 0.8, changeFrequency: "monthly" },
    { path: "/social-services/fatwa-qa", priority: 0.75, changeFrequency: "weekly" },
    { path: "/social-services/welfare-services", priority: 0.7, changeFrequency: "monthly" },
    { path: "/social-services/what-to-donate", priority: 0.65, changeFrequency: "monthly" },
    { path: "/social-services/donate", priority: 0.8, changeFrequency: "monthly" },
    { path: "/social-services/hajj-umrah", priority: 0.8, changeFrequency: "yearly" },
    { path: "/social-services/prayer-times", priority: 0.85, changeFrequency: "daily" },
    { path: "/departments", priority: 0.7, changeFrequency: "monthly" },
    { path: "/services", priority: 0.75, changeFrequency: "monthly" },
    { path: "/media", priority: 0.65, changeFrequency: "weekly" },
    { path: "/news", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/institutions", priority: 0.85, changeFrequency: "monthly" },
    { path: "/what-we-provide", priority: 0.8, changeFrequency: "monthly" },
    { path: "/feedback", priority: 0.4, changeFrequency: "yearly" },
  ];
  const extra = [
    ...departments.map((d) => ({ path: `/departments/${d.slug}`, priority: 0.55, changeFrequency: "monthly" as const })),
    ...courses.map((c) => ({ path: `/courses/${c.slug}`, priority: 0.7, changeFrequency: "monthly" as const })),
    ...blogs.map((b) => ({ path: `/islamic-services/islamic-blogs/${b.slug}`, priority: 0.6, changeFrequency: "monthly" as const })),
    ...institutions.map((item) => ({ path: item.href, priority: 0.7, changeFrequency: "monthly" as const })),
    ...Array.from({ length: 114 }, (_, i) => ({
      path: `/quran?surah=${i + 1}`,
      priority: 0.45,
      changeFrequency: "yearly" as const,
    })),
  ];
  return [...staticPaths, ...extra].map((item) => ({
    url: `${SITE.url}${item.path}`,
    lastModified,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
