import CoursesHeroSlider from "@/components/academy/CoursesHeroSlider";
import WhatWeTeach from "@/components/academy/WhatWeTeach";
import WhyChoose from "@/components/academy/WhyChoose";
import ThreeSteps from "@/components/academy/ThreeSteps";
import CoursesBrowser from "@/components/interactive/CoursesBrowser";
import { getPublishedCourses } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Islamic Courses | Quran, Tajweed, Hifz, Hadith, Arabic and Dars-e-Nizami",
  "Browse 25+ Alvasatiya Islamic courses. Search by category, level, language and duration. Book a free demo or enroll after secure payment verification.",
  "/courses"
);

export default function Page() {
  const catalog = getPublishedCourses();
  return (
    <>
      <CoursesHeroSlider />
      <WhatWeTeach />
      <section className="section-container py-12">
        <p className="section-eyebrow">Catalog</p>
        <h2 className="section-title">All Islamic Courses</h2>
        <div className="geometric-divider !mx-0" />
        <p className="section-desc mt-2 mb-8">
          {catalog.length}+ published pathways. Course cards are reusable and can be updated from the Admin portal.
        </p>
        <CoursesBrowser courses={catalog} />
      </section>
      <WhyChoose />
      <ThreeSteps />
    </>
  );
}
