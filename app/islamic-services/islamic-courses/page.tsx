import PageHero from "@/components/layout/PageHero";
import CoursesBrowser from "@/components/interactive/CoursesBrowser";
import { getPublishedCourses } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Islamic Courses Hub | Quran, Hadith, Fiqh, Usul and Fraiz",
  "Explore Alvasatiya's Quran and Islamic sciences courses, including Ilm ul Hadees, Ilm ul Fiqh, Usul, and Ilm ul Fraiz.",
  "/islamic-services/islamic-courses"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Courses Hub" description="A service-section view of published courses, with instructor, duration, level, mode and enrollment on each course page." />
      <p className="section-container pt-8 text-muted max-w-3xl">This page introduces courses from the Islamic Services menu. The full Courses platform at /courses lists the same published catalog for enrollment.</p>
      <section className="section-container py-12"><CoursesBrowser courses={getPublishedCourses()} /></section>
    </>
  );
}
