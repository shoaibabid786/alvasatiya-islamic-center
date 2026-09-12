import CoursesHeroSlider from "@/components/academy/CoursesHeroSlider";
import WhatWeTeach from "@/components/academy/WhatWeTeach";
import WhyChoose from "@/components/academy/WhyChoose";
import ThreeSteps from "@/components/academy/ThreeSteps";
import CoursesBrowser from "@/components/interactive/CoursesBrowser";
import CourseTestimonials from "@/components/academy/CourseTestimonials";
import { getPublishedCourses } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = pageMeta(
  "Islamic Courses | Quran, Dars e Nizami, Fiqh and Hajj",
  "Browse Alvasatiya courses including Dars e Nizami, Khatam e Nabuwat, Taharat, Hajj Course, Quran, Hadith, and Fiqh.",
  "/courses"
);

export default function Page() {
  const catalog = getPublishedCourses();
  return (
    <>
      <CoursesHeroSlider />
      <WhatWeTeach />
      <section id="course-catalog" className="section-container py-12">
        <p className="section-eyebrow">Catalog</p>
        <h2 className="section-title">Our Courses</h2>
        <div className="geometric-divider !mx-0" />
        <p className="section-desc mt-2 mb-8">
          Quran, Namaz, Seerah, Noorani Qaida, children, youth, Hajj, Umrah, Hadith, and Fiqh.
        </p>
        <CoursesBrowser courses={catalog} />
      </section>
      <CourseTestimonials />
      <WhyChoose />
      <ThreeSteps />
    </>
  );
}
