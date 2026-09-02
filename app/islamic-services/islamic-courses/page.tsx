import PageHero from "@/components/layout/PageHero";
import CoursesBrowser from "@/components/interactive/CoursesBrowser";
import { getPublishedCourses } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Islamic Courses Hub | Quran, Tajweed, Hifz, Fiqh and Arabic Pathways",
  "Explore Alvasatiya's Islamic learning pathways in Quran, Tajweed, Hifz, Fiqh, Hadith, Seerah, Arabic and children's education. This hub sits under Islamic Services; enrollment details are on each course page.",
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
